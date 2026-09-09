/**\n * // SOUNDRISE : INFINITY RUN - by zanioxx_off
 * // SOUNDRISE : INFINITY RUN - MOTEUR MULTIJOUEUR 1V1 EN TEMPS RÉEL
 * Salons Publics & Privés, Synchronisation P2P (WebRTC / PeerJS + BroadcastChannel),
 * Rendu 3D de l'Adversaire dans la course et Arbitrage de Victoire/Défaite.
 */
import * as THREE from 'three';
import {
  getShieldHexTexture,
  getSaiyanAuraTexture
} from './particles.js';

export class MultiplayerManager {
  constructor(scene, authManager) {
    this.scene = scene;
    this.auth = authManager;

    // État du multijoueur
    this.isInRoom = false;
    this.isHost = false;
    this.currentRoom = null;
    this.isDuelActive = false;
    this.isReady = false;
    this.opponentReady = false;

    // Télémétrie de l'adversaire
    this.opponentUser = null;
    this.lives = 3;
    this.maxLives = 3;
    this.onRivalLifeLost = null;
    this.onRoomDiscovered = null;
    this.opponentData = {
      lives: 3,
      x: 0, y: 3.5, z: 0,
      pitch: 0, roll: 0,
      hasShield: false,
      isSaiyan: false,
      energy: 100,
      distance: 0,
      cycleIndex: 0,
      isDead: false
    };

    // Canal de communication local (BroadcastChannel pour tests multi-onglets instantanés)
    this.localChannelName = 'soundrise_rooms_channel';
    this.roomsChannel = new BroadcastChannel(this.localChannelName);
    this.duelChannel = null;

    // Hub de salons mondial en direct (ntfy.sh pub/sub + EventSource SSE)
    this.cloudEndpoint = 'https://ntfy.sh/soundrise_infinity_lobby_rooms';
    this.publicRoomsKey = 'soundrise_public_rooms_cache';

    // Connexion P2P WebRTC réelle (PeerJS) pour interconnexion cross-sessions et cross-devices
    this.peer = null;
    this.p2pConn = null;
    this.heartbeatInterval = null;

    // Initialisation de l'avatar 3D de l'adversaire
    this.initRivalAvatar();

    // Écouteur de découverte de salons local
    this.roomsChannel.onmessage = (e) => this.handleRoomsMessage(e.data);

    // Initialisation de l'écouteur SSE mondial
    this.initRoomsSSE();

    // Callbacks UI
    this.onRoomUpdate = null;
    this.onRoomsListChanged = null;
    this.onDuelStart = null;
    this.onDuelEnd = null;
    this.onRivalTelemetry = null;
    this.onRivalLaserFire = null;

    // Horloges et intervalles
    this.telemetryInterval = null;
    this.joinRetryInterval = null;

    // Écouteur de synchronisation cross-onglets via StorageEvent
    window.addEventListener('storage', (e) => this.handleStorageEvent(e));
  }

  // Souscription Server-Sent Events pour la découverte mondiale en direct des salons
  initRoomsSSE() {
    if (typeof EventSource === 'undefined') return;
    try {
      this.roomsSSE = new EventSource(`${this.cloudEndpoint}/sse`);
      this.roomsSSE.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload && payload.message) {
            const data = typeof payload.message === 'string' ? JSON.parse(payload.message) : payload.message;
            this.handleRoomsMessage(data);
          }
        } catch (_) {}
      };
    } catch (e) {
      console.warn('[Multiplayer] Erreur connexion SSE salons :', e);
    }
  }

  // --- CRÉATION DE L'AVATAR 3D DE L'ADVERSAIRE (RIVAL) ---
  initRivalAvatar() {
    this.rivalGroup = new THREE.Group();
    this.rivalGroup.visible = false;
    this.scene.add(this.rivalGroup);

    // Coque du vaisseau rival (Fuselage Cyber-Intercepteur d'Élite)
    const bodyGeo = new THREE.ConeGeometry(0.85, 3.4, 4);
    bodyGeo.scale(1.2, 0.45, 1.0);
    bodyGeo.rotateX(Math.PI / 2);

    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x101a14,
      emissive: 0x22c55e, // Vert néon émeraude contrastant avec Infi (Cyan/Rose)
      emissiveIntensity: 0.85,
      roughness: 0.35,
      metalness: 0.75
    });
    this.rivalMesh = new THREE.Mesh(bodyGeo, bodyMat);
    this.rivalGroup.add(this.rivalMesh);

    // Ailes latérales inclinées
    const wingGeo = new THREE.BoxGeometry(3.6, 0.08, 1.2);
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0x15221b,
      roughness: 0.25,
      metalness: 0.85
    });
    const wings = new THREE.Mesh(wingGeo, wingMat);
    wings.position.set(0, 0, -0.2);
    this.rivalMesh.add(wings);

    // Réacteurs néon émissifs jumeaux
    const engineMat = new THREE.MeshBasicMaterial({ color: 0x4ade80 });
    const engL = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 0.6, 8), engineMat);
    engL.rotation.x = Math.PI / 2;
    engL.position.set(-0.7, 0, 1.4);
    this.rivalMesh.add(engL);

    const engR = engL.clone();
    engR.position.x = 0.7;
    this.rivalMesh.add(engR);

    // Lueur des propulseurs
    const engineLight = new THREE.PointLight(0x22c55e, 1.8, 6.0);
    engineLight.position.set(0, 0, 1.6);
    this.rivalMesh.add(engineLight);

    // Bouclier holographique de l'adversaire (vert / turquoise)
    const shieldGeo = new THREE.SphereGeometry(2.2, 24, 24);
    this.rivalShieldMat = new THREE.MeshBasicMaterial({
      map: getShieldHexTexture(),
      color: 0x22c55e,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    this.rivalShield = new THREE.Mesh(shieldGeo, this.rivalShieldMat);
    this.rivalShield.visible = false;
    this.rivalGroup.add(this.rivalShield);

    // Aura Super Saiyan de l'adversaire
    const saiyanGeo = new THREE.CylinderGeometry(0.8, 2.8, 5.8, 16, 4, true);
    this.rivalSaiyanMat = new THREE.MeshBasicMaterial({
      map: getSaiyanAuraTexture(),
      color: 0xffea00,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    this.rivalSaiyan = new THREE.Mesh(saiyanGeo, this.rivalSaiyanMat);
    this.rivalSaiyan.position.y = 0.6;
    this.rivalSaiyan.visible = false;
    this.rivalGroup.add(this.rivalSaiyan);

    // Étiquette 3D Canvas Billboard au-dessus de l'adversaire
    this.rivalTag = this.createNameplateTag('@ADVERSAIRE');
    this.rivalTag.position.set(0, 2.4, 0);
    this.rivalGroup.add(this.rivalTag);
  }

  createNameplateTag(nameText) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    this.renderTagCanvas(ctx, nameText, '+0M');

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(3.8, 0.95, 1.0);
    sprite.userData = { canvas, ctx, texture: tex };
    return sprite;
  }

  renderTagCanvas(ctx, pseudo, deltaText) {
    ctx.clearRect(0, 0, 512, 128);

    // Fond style verre dépoli vert/cyan
    ctx.fillStyle = 'rgba(2, 24, 16, 0.85)';
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(10, 10, 492, 108, 16);
    ctx.fill();
    ctx.stroke();

    // Badge Rival
    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 24px "Segoe UI", sans-serif';
    ctx.fillText('⚔️ RIVAL 1V1', 30, 44);

    // Pseudo
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Segoe UI", sans-serif';
    ctx.fillText(pseudo || '@PILOTE', 30, 88);

    // Écart distance
    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 32px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(deltaText || '+0 M', 480, 72);
    ctx.textAlign = 'left';
  }

  updateTag(pseudo, deltaDistance) {
    if (!this.rivalTag || !this.rivalTag.userData) return;
    const { ctx, texture } = this.rivalTag.userData;
    const deltaStr = (deltaDistance >= 0 ? `+${Math.round(deltaDistance)} M` : `${Math.round(deltaDistance)} M`);
    this.renderTagCanvas(ctx, pseudo, deltaStr);
    texture.needsUpdate = true;
  }

  // --- GESTION DES SALONS CLOUD ET LOCAUX (ROOMS) ---
  async getPublicRooms() {
    const roomsMap = new Map();
    const now = Date.now();

    // 1. Scan direct de toutes les clés de salon locales
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('soundrise_room_')) {
          try {
            const r = JSON.parse(localStorage.getItem(k));
            if (r && r.roomId && !r.isPrivate && (now - (r.updatedAt || 0) < 120000)) {
              roomsMap.set(r.roomId, r);
            }
          } catch (e) {}
        }
      }
    } catch (e) {}

    // 2. Cache local unifié
    try {
      const cached = localStorage.getItem(this.publicRoomsKey);
      if (cached) {
        const arr = JSON.parse(cached);
        if (Array.isArray(arr)) {
          arr.forEach(r => {
            if (r && r.roomId && !r.isPrivate && (now - (r.updatedAt || 0) < 120000)) {
              if (!roomsMap.has(r.roomId)) roomsMap.set(r.roomId, r);
            }
          });
        }
      }
    } catch (e) {}

    // 3. Ping d'autres onglets ouverts localement
    try {
      this.roomsChannel.postMessage({ type: 'request_active_rooms' });
    } catch (e) {}

    // 4. Appel Cloud ntfy.sh (timeout 1.2s strict, zéro blocage)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(`${this.cloudEndpoint}/json?poll=1&since=5m`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const text = await res.text();
        const lines = text.trim().split('\n');
        lines.forEach(line => {
          try {
            if (!line.trim()) return;
            const item = JSON.parse(line);
            if (item && item.message) {
              const msg = typeof item.message === 'string' ? JSON.parse(item.message) : item.message;
              if ((msg.type === 'room_created' || msg.type === 'room_heartbeat' || msg.type === 'report_active_room') && msg.room && !msg.room.isPrivate) {
                if (now - (msg.room.updatedAt || 0) < 120000) {
                  roomsMap.set(msg.room.roomId, msg.room);
                }
              } else if ((msg.type === 'room_closed' || msg.type === 'room_started') && msg.roomId) {
                roomsMap.delete(msg.roomId);
              }
            }
          } catch (_) {}
        });
      }
    } catch (e) {}

    // 5. Si aucun salon réel n'est trouvé, fournir un salon d'entraînement IA prêt à être rejoint
    if (roomsMap.size === 0) {
      const dummyBotRoom = {
        roomId: 'INFI-PVE1',
        name: 'Arène Défi IA : Pilote Fantôme',
        isPrivate: false,
        startCycleIndex: 0,
        host: {
          googleUid: 'ghost_pilot_ai',
          pseudo: 'GhostRider_IA',
          name: 'GhostRider IA',
          picture: 'https://api.dicebear.com/7.x/bottts/svg?seed=GhostRider&backgroundColor=020617'
        },
        guest: null,
        status: 'waiting',
        hostReady: true,
        guestReady: false,
        updatedAt: now
      };
      roomsMap.set(dummyBotRoom.roomId, dummyBotRoom);
    }

    const result = Array.from(roomsMap.values()).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    try {
      localStorage.setItem(this.publicRoomsKey, JSON.stringify(result));
    } catch (e) {}
    return result;
  }

  getRoomById(roomId) {
    if (!roomId) return null;
    const cleanId = roomId.trim().toUpperCase();
    try {
      const single = localStorage.getItem(`soundrise_room_${cleanId}`);
      if (single) return JSON.parse(single);
      const cached = localStorage.getItem(this.publicRoomsKey);
      if (cached) {
        const rooms = JSON.parse(cached);
        return rooms.find(r => r.roomId === cleanId) || null;
      }
    } catch (e) {
      return null;
    }
  }

  async savePublicRooms(rooms) {
    try {
      localStorage.setItem(this.publicRoomsKey, JSON.stringify(rooms));
      this.roomsChannel.postMessage({ type: 'rooms_updated', rooms });
    } catch (e) {
      console.warn('[Multiplayer] Erreur sauvegarde locale salons:', e);
    }
  }

  async addPublicRoomToCloud(newRoom) {
    try {
      // 1. Sauvegarde locale synchrone
      const current = localStorage.getItem(this.publicRoomsKey);
      let arr = current ? JSON.parse(current) : [];
      arr = arr.filter(r => r.roomId !== newRoom.roomId);
      arr.unshift(newRoom);
      localStorage.setItem(this.publicRoomsKey, JSON.stringify(arr));

      // 2. Diffusion locale immédiate
      this.roomsChannel.postMessage({ type: 'room_created', room: newRoom });

      // 3. Diffusion Cloud mondiale (ntfy.sh)
      fetch(`${this.cloudEndpoint}/publish`, {
        method: 'POST',
        headers: { 'Title': 'Soundrise Room Created' },
        body: JSON.stringify({ type: 'room_created', room: newRoom })
      }).catch(() => {});
    } catch (e) {
      console.warn('[Multiplayer] Erreur publication salon cloud:', e);
    }
  }

  async removePublicRoomFromCloud(roomId) {
    try {
      const current = localStorage.getItem(this.publicRoomsKey);
      if (current) {
        let arr = JSON.parse(current).filter(r => r.roomId !== roomId);
        localStorage.setItem(this.publicRoomsKey, JSON.stringify(arr));
      }
      localStorage.removeItem(`soundrise_room_${roomId}`);

      this.roomsChannel.postMessage({ type: 'room_closed', roomId });

      fetch(`${this.cloudEndpoint}/publish`, {
        method: 'POST',
        headers: { 'Title': 'Soundrise Room Closed' },
        body: JSON.stringify({ type: 'room_closed', roomId })
      }).catch(() => {});
    } catch (e) {}
  }

  handleStorageEvent(e) {
    if (!this.currentRoom) return;
    if (e.key === `soundrise_room_${this.currentRoom.roomId}` && e.newValue) {
      try {
        const updated = JSON.parse(e.newValue);
        if (updated && updated.roomId === this.currentRoom.roomId) {
          this.currentRoom = updated;
          if (this.isHost) {
            if (updated.guest) this.opponentUser = updated.guest;
            this.opponentReady = !!updated.guestReady;
          } else {
            if (updated.host) this.opponentUser = updated.host;
            this.opponentReady = !!updated.hostReady;
          }
          if (this.onRoomUpdate) this.onRoomUpdate(this.currentRoom);
        }
      } catch (err) {}
    }
  }

  createRoom(roomName, isPrivate, startCycleIndex = 0) {
    const user = this.auth ? this.auth.getUser() : null;
    const pseudo = (user && user.pseudo) ? user.pseudo : 'Pilote';

    const roomId = 'INFI-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    const newRoom = {
      roomId,
      name: roomName || `Duel de ${pseudo}`,
      isPrivate: !!isPrivate,
      startCycleIndex: startCycleIndex || 0,
      host: {
        googleUid: user ? (user.googleUid || user.email || user.id) : 'guest_host_' + Date.now(),
        pseudo: pseudo,
        name: user ? user.name : pseudo,
        picture: user ? user.picture : ''
      },
      guest: null,
      status: 'waiting',
      hostReady: false,
      guestReady: false,
      updatedAt: Date.now()
    };

    this.currentRoom = newRoom;
    this.isHost = true;
    this.isInRoom = true;
    this.isReady = false;
    this.opponentReady = false;

    // Enregistrement direct local et publication mondiale sur le Cloud
    localStorage.setItem(`soundrise_room_${roomId}`, JSON.stringify(newRoom));
    if (!isPrivate) {
      this.addPublicRoomToCloud(newRoom);
    }

    // Heartbeat régulier pour maintenir le salon actif dans le Cloud
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    this.heartbeatInterval = setInterval(() => {
      if (this.isHost && this.isInRoom && this.currentRoom && !this.currentRoom.isPrivate) {
        this.currentRoom.updatedAt = Date.now();
        localStorage.setItem(`soundrise_room_${this.currentRoom.roomId}`, JSON.stringify(this.currentRoom));
        this.addPublicRoomToCloud(this.currentRoom);
      }
    }, 15000);

    // Initialisation du serveur P2P WebRTC PeerJS
    this.initHostPeer(roomId);

    this.connectDuelChannel(roomId);
    this.startRoomSync();
    if (this.onRoomUpdate) this.onRoomUpdate(this.currentRoom);
    return newRoom;
  }

  startRoomSync() {
    this.stopRoomSync();
    this.roomSyncInterval = setInterval(() => {
      if (!this.isInRoom || !this.currentRoom) {
        this.stopRoomSync();
        return;
      }
      const fresh = this.getRoomById(this.currentRoom.roomId);
      if (!fresh) return;

      let changed = false;
      if (this.isHost) {
        if (fresh.guest && (!this.currentRoom.guest || this.currentRoom.guest.pseudo !== fresh.guest.pseudo)) {
          this.currentRoom.guest = fresh.guest;
          this.opponentUser = fresh.guest;
          changed = true;
        }
        if (fresh.guestReady !== this.currentRoom.guestReady) {
          this.currentRoom.guestReady = fresh.guestReady;
          this.opponentReady = !!fresh.guestReady;
          changed = true;
        }
      } else {
        if (fresh.host && (!this.currentRoom.host || this.currentRoom.host.pseudo !== fresh.host.pseudo)) {
          this.currentRoom.host = fresh.host;
          this.opponentUser = fresh.host;
          changed = true;
        }
        if (fresh.hostReady !== this.currentRoom.hostReady) {
          this.currentRoom.hostReady = fresh.hostReady;
          this.opponentReady = !!fresh.hostReady;
          changed = true;
        }
        if (fresh.status === 'racing' && !this.isDuelActive) {
          this.triggerRaceStart(fresh.startCycleIndex || 0);
        }
      }

      if (changed && this.onRoomUpdate) {
        this.onRoomUpdate(this.currentRoom);
      }
    }, 200);
  }

  stopRoomSync() {
    if (this.roomSyncInterval) {
      clearInterval(this.roomSyncInterval);
      this.roomSyncInterval = null;
    }
  }

  joinRoom(roomId) {
    const user = this.auth.getUser();
    if (!user) throw new Error('Connexion au compte pilote requise.');
    if (!roomId) throw new Error('Code de salon invalide.');

    const cleanCode = roomId.trim().toUpperCase();

    // 1. Chercher la room dans le cache local
    let room = this.getRoomById(cleanCode);

    if (!room) {
      // Si la room n'est pas encore propagée, créer un conteneur d'attente
      room = {
        roomId: cleanCode,
        name: `Duel ${cleanCode}`,
        isPrivate: false,
        startCycleIndex: 0,
        host: { pseudo: 'Hôte' },
        guest: null,
        status: 'waiting',
        hostReady: false,
        guestReady: false,
        updatedAt: Date.now()
      };
    }

    room.guest = {
      googleUid: user.googleUid || user.email || user.id,
      pseudo: user.pseudo,
      name: user.name,
      picture: user.picture
    };
    room.updatedAt = Date.now();

    this.currentRoom = room;
    this.opponentUser = room.host || null;
    this.isHost = false;
    this.isInRoom = true;
    this.isReady = false;
    this.opponentReady = !!room.hostReady;

    localStorage.setItem(`soundrise_room_${cleanCode}`, JSON.stringify(room));
    this.connectDuelChannel(cleanCode);
    this.initGuestPeer(cleanCode);
    this.startRoomSync();

    // Annonce immédiate à l'UI
    if (this.onRoomUpdate) {
      this.onRoomUpdate(this.currentRoom);
    }

    // Boucle de requête de join avec retry
    if (this.joinRetryInterval) clearInterval(this.joinRetryInterval);
    let attempts = 0;
    const sendJoin = () => {
      if (!this.isInRoom || this.isHost) {
        if (this.joinRetryInterval) clearInterval(this.joinRetryInterval);
        return;
      }
      this.sendDuelMessage({
        type: 'guest_join_request',
        roomId: cleanCode,
        guest: {
          googleUid: user ? (user.googleUid || user.email || user.id) : 'guest_' + Date.now(),
          pseudo: user ? user.pseudo : 'Pilote',
          name: user ? user.name : 'Pilote',
          picture: user ? user.picture : ''
        }
      });
    };

    sendJoin();
    this.joinRetryInterval = setInterval(() => {
      attempts++;
      if (attempts >= 15 || (this.currentRoom && this.currentRoom.host && (this.currentRoom.host.googleUid || this.currentRoom.host.pseudo))) {
        clearInterval(this.joinRetryInterval);
        this.joinRetryInterval = null;
        return;
      }
      sendJoin();
    }, 320);

    return this.currentRoom;
  }

  // --- GESTION DU RÉSEAU P2P WEBRTC (PEERJS) ---
  initHostPeer(roomId) {
    if (typeof Peer === 'undefined') return;
    try {
      const cleanPeerId = 'soundrise-' + roomId.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (this.peer) {
        try { this.peer.destroy(); } catch (e) {}
      }
      this.peer = new Peer(cleanPeerId);
      this.peer.on('connection', (conn) => {
        this.p2pConn = conn;
        this.setupP2PConnection(conn);
      });
      this.peer.on('error', (err) => {
        console.warn('[Multiplayer P2P Host]', err);
      });
    } catch (e) {
      console.warn('[Multiplayer P2P]', e);
    }
  }

  initGuestPeer(roomId) {
    if (typeof Peer === 'undefined') return;
    try {
      const targetPeerId = 'soundrise-' + roomId.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (this.peer) {
        try { this.peer.destroy(); } catch (e) {}
      }
      this.peer = new Peer();
      this.peer.on('open', () => {
        const conn = this.peer.connect(targetPeerId);
        this.p2pConn = conn;
        this.setupP2PConnection(conn);
      });
      this.peer.on('error', (err) => {
        console.warn('[Multiplayer P2P Guest]', err);
      });
    } catch (e) {
      console.warn('[Multiplayer P2P]', e);
    }
  }

  setupP2PConnection(conn) {
    conn.on('open', () => {
      console.log('[Multiplayer P2P] Canal de données WebRTC établi');
      if (!this.isHost && this.auth) {
        const user = this.auth.getUser();
        conn.send({
          type: 'guest_join_request',
          roomId: this.currentRoom ? this.currentRoom.roomId : '',
          guest: {
            googleUid: user ? (user.googleUid || user.email || user.id) : 'guest_' + Date.now(),
            pseudo: user ? user.pseudo : 'Pilote',
            name: user ? user.name : 'Pilote',
            picture: user ? user.picture : ''
          }
        });
      }
    });

    conn.on('data', (data) => {
      this.handleDuelMessage(data);
    });
  }

  sendDuelMessage(msg) {
    if (this.duelChannel) {
      try { this.duelChannel.postMessage(msg); } catch (e) {}
    }
    if (this.p2pConn && this.p2pConn.open) {
      try { this.p2pConn.send(msg); } catch (e) {}
    }
  }

  connectDuelChannel(roomId) {
    if (this.duelChannel) {
      this.duelChannel.close();
    }
    this.duelChannel = new BroadcastChannel('soundrise_duel_' + roomId);
    this.duelChannel.onmessage = (e) => this.handleDuelMessage(e.data);
  }

  toggleReady() {
    this.isReady = !this.isReady;
    if (this.currentRoom && this.currentRoom.roomId) {
      const fresh = this.getRoomById(this.currentRoom.roomId);
      if (fresh) this.currentRoom = fresh;
    }
    if (this.currentRoom) {
      if (this.isHost) this.currentRoom.hostReady = this.isReady;
      else this.currentRoom.guestReady = this.isReady;
      this.currentRoom.updatedAt = Date.now();
      localStorage.setItem(`soundrise_room_${this.currentRoom.roomId}`, JSON.stringify(this.currentRoom));
    }

    this.sendDuelMessage({
      type: 'ready_changed',
      isHost: this.isHost,
      ready: this.isReady
    });

    if (this.onRoomUpdate && this.currentRoom) {
      this.onRoomUpdate(this.currentRoom);
    }
    return this.isReady;
  }

  startCountdownAndRace() {
    if (this.currentRoom && this.currentRoom.roomId) {
      const fresh = this.getRoomById(this.currentRoom.roomId);
      if (fresh) this.currentRoom = fresh;
    }
    if (!this.isHost || !this.currentRoom || !this.currentRoom.guest) return;
    const startCycle = this.currentRoom.startCycleIndex || 0;

    this.currentRoom.status = 'racing';
    this.currentRoom.updatedAt = Date.now();
    localStorage.setItem(`soundrise_room_${this.currentRoom.roomId}`, JSON.stringify(this.currentRoom));

    const countdownMs = 3200;
    const startTimestamp = Date.now() + countdownMs;

    this.sendDuelMessage({
      type: 'start_race_countdown',
      startCycleIndex: startCycle,
      startTimestamp
    });

    this.triggerRaceStart(startCycle, startTimestamp);
  }

  triggerRaceStart(startCycleIndex, startTimestamp = null) {
    this.stopRoomSync();
    if (this.joinRetryInterval) {
      clearInterval(this.joinRetryInterval);
      this.joinRetryInterval = null;
    }

    this.isDuelActive = true;
    this.lives = 3;
    this.opponentData.lives = 3;
    this.rivalGroup.visible = true;
    this.opponentData.isDead = false;
    this.opponentData.distance = 0;
    this.opponentData.x = 0;
    this.opponentData.y = 3.5;
    this.opponentData.z = -5.0;
    this.rivalGroup.position.set(0, 3.5, -5.0);

    // Envoi de télémétrie fluide à 30 Hz
    if (this.telemetryInterval) clearInterval(this.telemetryInterval);
    this.telemetryInterval = setInterval(() => this.sendTelemetry(), 33);

    if (this.onDuelStart) {
      this.onDuelStart(startCycleIndex, startTimestamp);
    }
  }

  leaveRoom() {
    this.stopRoomSync();
    if (this.joinRetryInterval) {
      clearInterval(this.joinRetryInterval);
      this.joinRetryInterval = null;
    }
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    this.sendDuelMessage({
      type: 'player_left',
      isHost: this.isHost
    });

    if (this.currentRoom) {
      localStorage.removeItem(`soundrise_room_${this.currentRoom.roomId}`);
      if (!this.currentRoom.isPrivate && this.isHost) {
        this.removePublicRoomFromCloud(this.currentRoom.roomId);
      }
    }

    if (this.peer) {
      try { this.peer.destroy(); } catch (e) {}
      this.peer = null;
      this.p2pConn = null;
    }

    if (this.telemetryInterval) {
      clearInterval(this.telemetryInterval);
      this.telemetryInterval = null;
    }

    if (this.duelChannel) {
      this.duelChannel.close();
      this.duelChannel = null;
    }

    this.isInRoom = false;
    this.isHost = false;
    this.currentRoom = null;
    this.isDuelActive = false;
    this.rivalGroup.visible = false;
    this.isReady = false;
    this.opponentReady = false;
  }

  // --- ÉMISSIONS MULTIJOUEUR ---
  sendTelemetry() {
    if (!this.isDuelActive || !window.gameApp) return;
    const p = window.gameApp.player;
    if (!p) return;

    this.sendDuelMessage({
      type: 'telemetry',
      x: p.group.position.x,
      y: p.group.position.y,
      z: p.group.position.z,
      pitch: p.avatar.rotation.x,
      roll: p.avatar.rotation.z,
      hasShield: p.hasShield,
      armorCount: p.armorCount,
      isSaiyan: p.isSayanfinityActive(),
      energy: p.energy,
      distance: window.gameApp.distance,
      currentSpeed: window.gameApp.currentSpeed,
      cycleIndex: window.gameApp.audio ? window.gameApp.audio.currentTrackIndex : 0,
      isDead: p.isDead
    });
  }

  sendLaserFire(x, y, z) {
    if (!this.isDuelActive) return;
    this.sendDuelMessage({
      type: 'laser_fired',
      x, y, z
    });
  }

  
  recordLifeLost(distance, cycleIndex) {
    if (!this.isDuelActive) return { lives: 0, isEliminated: false };
    this.lives = Math.max(0, this.lives - 1);
    if (this.lives > 0) {
      this.sendDuelMessage({
        type: 'life_lost',
        livesRemaining: this.lives,
        distance,
        cycleIndex
      });
      return { lives: this.lives, isEliminated: false };
    } else {
      this.sendDeath(distance, cycleIndex, 'all_lives_lost');
      return { lives: 0, isEliminated: true };
    }
  }

  sendDeath(distance, cycleIndex, reason) {
    if (!this.isDuelActive) return;
    this.sendDuelMessage({
      type: 'player_eliminated',
      distance,
      cycleIndex,
      reason
    });
  }

  // --- GESTION DES MESSAGES DUELS & SALONS ---
  handleDuelMessage(data) {
    if (!data || !data.type) return;

    switch (data.type) {
      case 'guest_join_request':
        if (this.isHost && this.currentRoom) {
          this.currentRoom.guest = data.guest;
          this.currentRoom.status = 'ready';
          this.opponentUser = data.guest;
          this.currentRoom.updatedAt = Date.now();

          localStorage.setItem(`soundrise_room_${this.currentRoom.roomId}`, JSON.stringify(this.currentRoom));

          // Réponse d'acceptation immédiate
          this.duelChannel.postMessage({
            type: 'guest_accepted',
            room: this.currentRoom
          });

          if (!this.currentRoom.isPrivate) {
            const rooms = this.getPublicRooms().map(r => r.roomId === this.currentRoom.roomId ? this.currentRoom : r);
            this.savePublicRooms(rooms);
          }

          if (this.onRoomUpdate) this.onRoomUpdate(this.currentRoom);
        }
        break;

      case 'guest_accepted':
        if (!this.isHost && data.room) {
          if (this.joinRetryInterval) {
            clearInterval(this.joinRetryInterval);
            this.joinRetryInterval = null;
          }
          this.currentRoom = data.room;
          this.opponentUser = data.room.host;
          this.opponentReady = !!data.room.hostReady;
          localStorage.setItem(`soundrise_room_${data.room.roomId}`, JSON.stringify(data.room));
          if (this.onRoomUpdate) this.onRoomUpdate(this.currentRoom);
        }
        break;

      case 'ready_changed':
        if (this.currentRoom) {
          if (data.isHost) this.currentRoom.hostReady = data.ready;
          else this.currentRoom.guestReady = data.ready;

          if (data.isHost !== this.isHost) {
            this.opponentReady = data.ready;
          }

          this.currentRoom.updatedAt = Date.now();
          localStorage.setItem(`soundrise_room_${this.currentRoom.roomId}`, JSON.stringify(this.currentRoom));
          if (this.onRoomUpdate) this.onRoomUpdate(this.currentRoom);
        }
        break;

      case 'start_race_countdown':
        if (!this.isHost) {
          this.triggerRaceStart(data.startCycleIndex || 0, data.startTimestamp || (Date.now() + 3000));
        }
        break;

      case 'telemetry':
        this.opponentData = data;
        if (this.onRivalTelemetry) this.onRivalTelemetry(data);
        break;

      case 'laser_fired':
        if (this.onRivalLaserFire) this.onRivalLaserFire(data.x, data.y, data.z);
        break;

      case 'life_lost':
        this.opponentData.lives = data.livesRemaining;
        if (this.onRivalLifeLost) {
          this.onRivalLifeLost(data.livesRemaining, data.distance);
        }
        break;

      case 'player_eliminated':
        // L'adversaire a été éliminé : VICTOIRE POUR NOUS !
        this.opponentData.isDead = true;
        if (this.onDuelEnd) {
          this.onDuelEnd({
            isWinner: true,
            reason: 'L\'adversaire a été éliminé !',
            rivalDistance: data.distance,
            rivalCycle: data.cycleIndex
          });
        }
        break;

      case 'player_left':
        if (this.isDuelActive && this.onDuelEnd) {
          this.onDuelEnd({
            isWinner: true,
            reason: 'L\'adversaire a quitté la partie.',
            rivalDistance: this.opponentData.distance,
            rivalCycle: this.opponentData.cycleIndex
          });
        }
        this.leaveRoom();
        break;
    }
  }

  handleRoomsMessage(data) {
    if (!data) return;
    if (data.type === 'request_active_rooms' && this.isHost && this.isInRoom && this.currentRoom && !this.currentRoom.isPrivate) {
      this.roomsChannel.postMessage({ type: 'report_active_room', room: this.currentRoom });
    } else if (data.type === 'report_active_room' && data.room) {
      try {
        localStorage.setItem(`soundrise_room_${data.room.roomId}`, JSON.stringify(data.room));
      } catch (e) {}
      if (this.onRoomDiscovered) this.onRoomDiscovered(data.room);
    } else if (data.type === 'rooms_updated' && this.onRoomsListChanged) {
      this.onRoomsListChanged(data.rooms);
    } else if (data.type === 'room_created' && data.room) {
      try {
        localStorage.setItem(`soundrise_room_${data.room.roomId}`, JSON.stringify(data.room));
      } catch (_) {}
      if (this.onRoomDiscovered) this.onRoomDiscovered(data.room);
      if (this.onRoomsListChanged) this.onRoomsListChanged();
    } else if (data.type === 'room_closed' && data.roomId) {
      try {
        localStorage.removeItem(`soundrise_room_${data.roomId}`);
      } catch (_) {}
      if (this.onRoomsListChanged) this.onRoomsListChanged();
    }
  }

  // --- MISE À JOUR VISUELLE DE L'AVATAR ADVERSAIRE EN JEU (60 FPS) ---
  update(dt, myDistance) {
    if (!this.isDuelActive || !this.rivalGroup.visible) return;

    // Interpolation douce vers la position de l'adversaire (même vitesse, écart relatif clamped)
    const deltaZ = ((this.opponentData.distance || 0) - myDistance); // Écart relatif de distance
    const targetX = this.opponentData.x || 0;
    const targetY = Math.max(1.2, this.opponentData.y || 3.5);
    const clampedDeltaZ = Math.max(-45.0, Math.min(60.0, deltaZ));
    const targetZ = -clampedDeltaZ; // Si l'adversaire est devant, deltaZ > 0 donc targetZ est en avant (< 0)

    this.rivalGroup.position.x += (targetX - this.rivalGroup.position.x) * 12.0 * dt;
    this.rivalGroup.position.y += (targetY - this.rivalGroup.position.y) * 10.0 * dt;
    this.rivalGroup.position.z += (targetZ - this.rivalGroup.position.z) * 10.0 * dt;

    // Rotations de roulis et tangage
    this.rivalMesh.rotation.z += ((this.opponentData.roll || 0) - this.rivalMesh.rotation.z) * 10.0 * dt;
    this.rivalMesh.rotation.x = (Math.PI / 2) + (this.opponentData.pitch || 0);

    // Affichage des effets de l'adversaire (Bouclier & Saiyan)
    if (this.rivalShield) {
      this.rivalShield.visible = !!this.opponentData.hasShield;
      if (this.rivalShield.visible) {
        this.rivalShield.rotation.y += 1.8 * dt;
      }
    }
    if (this.rivalSaiyan) {
      this.rivalSaiyan.visible = !!this.opponentData.isSaiyan;
      if (this.rivalSaiyan.visible) {
        this.rivalSaiyan.rotation.y += 4.5 * dt;
      }
    }

    // Mise à jour de l'étiquette holographique
    const rivalName = this.opponentUser ? `@${this.opponentUser.pseudo}` : '@RIVAL';
    this.updateTag(rivalName, deltaZ);
  }
}
