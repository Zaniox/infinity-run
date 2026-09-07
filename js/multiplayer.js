/**
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
    this.opponentData = {
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

    // Stockage local des salons publics
    this.publicRoomsKey = 'soundrise_public_rooms_cache';

    // Initialisation de l'avatar 3D de l'adversaire
    this.initRivalAvatar();

    // Écouteur de découverte de salons
    this.roomsChannel.onmessage = (e) => this.handleRoomsMessage(e.data);

    // Callbacks UI
    this.onRoomUpdate = null;
    this.onDuelStart = null;
    this.onDuelEnd = null;
    this.onRivalTelemetry = null;
    this.onRivalLaserFire = null;

    // Horloge pour interpolation
    this.telemetryInterval = null;
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

  // --- GESTION DES SALONS (ROOMS) ---
  getPublicRooms() {
    try {
      const data = localStorage.getItem(this.publicRoomsKey);
      if (data) {
        const rooms = JSON.parse(data);
        const now = Date.now();
        // Filtrer les salons expirés (> 60 secondes sans heartbeat)
        return rooms.filter(r => (now - (r.updatedAt || 0)) < 60000);
      }
    } catch (e) {
      console.warn(e);
    }
    return [];
  }

  savePublicRooms(rooms) {
    try {
      localStorage.setItem(this.publicRoomsKey, JSON.stringify(rooms));
      this.roomsChannel.postMessage({ type: 'rooms_updated', rooms });
    } catch (e) {
      console.warn(e);
    }
  }

  createRoom(roomName, isPrivate, startCycleIndex = 0) {
    const user = this.auth.getUser();
    if (!user) throw new Error('Connexion Google requise.');

    const roomId = 'INFI-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    const newRoom = {
      roomId,
      name: roomName || `Duel de ${user.pseudo}`,
      isPrivate: !!isPrivate,
      startCycleIndex: startCycleIndex || 0,
      host: {
        googleUid: user.googleUid,
        pseudo: user.pseudo,
        name: user.name,
        picture: user.picture
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

    // Enregistrement public si non privé
    if (!isPrivate) {
      const rooms = this.getPublicRooms().filter(r => r.roomId !== roomId);
      rooms.unshift(newRoom);
      this.savePublicRooms(rooms);
    }

    this.connectDuelChannel(roomId);
    if (this.onRoomUpdate) this.onRoomUpdate(this.currentRoom);
    return newRoom;
  }

  joinRoom(roomId) {
    const user = this.auth.getUser();
    if (!user) throw new Error('Connexion Google requise.');

    this.connectDuelChannel(roomId);

    // Annonce de tentative de connexion
    this.duelChannel.postMessage({
      type: 'guest_join_request',
      guest: {
        googleUid: user.googleUid,
        pseudo: user.pseudo,
        name: user.name,
        picture: user.picture
      }
    });

    this.isHost = false;
    this.isInRoom = true;
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
    if (this.duelChannel && this.currentRoom) {
      this.duelChannel.postMessage({
        type: 'ready_changed',
        isHost: this.isHost,
        ready: this.isReady
      });
    }

    if (this.currentRoom) {
      if (this.isHost) this.currentRoom.hostReady = this.isReady;
      else this.currentRoom.guestReady = this.isReady;
      if (this.onRoomUpdate) this.onRoomUpdate(this.currentRoom);
    }
    return this.isReady;
  }

  startCountdownAndRace() {
    if (!this.isHost || !this.currentRoom || !this.currentRoom.guest) return;
    this.duelChannel.postMessage({
      type: 'start_race_countdown',
      startCycleIndex: this.currentRoom.startCycleIndex || 0
    });
    this.triggerRaceStart(this.currentRoom.startCycleIndex || 0);
  }

  triggerRaceStart(startCycleIndex) {
    this.isDuelActive = true;
    this.rivalGroup.visible = true;
    this.opponentData.isDead = false;

    // Démarrage de l'envoi de télémétrie à 25 Hz
    if (this.telemetryInterval) clearInterval(this.telemetryInterval);
    this.telemetryInterval = setInterval(() => this.sendTelemetry(), 40);

    if (this.onDuelStart) {
      this.onDuelStart(startCycleIndex);
    }
  }

  leaveRoom() {
    if (this.duelChannel && this.currentRoom) {
      this.duelChannel.postMessage({
        type: 'player_left',
        isHost: this.isHost
      });
    }

    if (this.currentRoom && !this.currentRoom.isPrivate) {
      const rooms = this.getPublicRooms().filter(r => r.roomId !== this.currentRoom.roomId);
      this.savePublicRooms(rooms);
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
    if (!this.isDuelActive || !this.duelChannel || !window.gameApp) return;
    const p = window.gameApp.player;
    if (!p) return;

    this.duelChannel.postMessage({
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
    if (!this.isDuelActive || !this.duelChannel) return;
    this.duelChannel.postMessage({
      type: 'laser_fired',
      x, y, z
    });
  }

  sendDeath(distance, cycleIndex, reason) {
    if (!this.isDuelActive || !this.duelChannel) return;
    this.duelChannel.postMessage({
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

          // Réponse d'acceptation envoyée au guest
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
        if (!this.isHost) {
          this.currentRoom = data.room;
          this.opponentUser = data.room.host;
          if (this.onRoomUpdate) this.onRoomUpdate(this.currentRoom);
        }
        break;

      case 'ready_changed':
        if (this.currentRoom) {
          if (data.isHost) this.currentRoom.hostReady = data.ready;
          else this.currentRoom.guestReady = data.ready;
          this.opponentReady = data.ready;
          if (this.onRoomUpdate) this.onRoomUpdate(this.currentRoom);
        }
        break;

      case 'start_race_countdown':
        if (!this.isHost) {
          this.triggerRaceStart(data.startCycleIndex || 0);
        }
        break;

      case 'telemetry':
        this.opponentData = data;
        if (this.onRivalTelemetry) this.onRivalTelemetry(data);
        break;

      case 'laser_fired':
        if (this.onRivalLaserFire) this.onRivalLaserFire(data.x, data.y, data.z);
        break;

      case 'player_eliminated':
        // L'adversaire s'est écrasé ou n'a plus d'énergie : VICTOIRE POUR NOUS !
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
    if (data && data.type === 'rooms_updated' && this.onRoomsListChanged) {
      this.onRoomsListChanged(data.rooms);
    }
  }

  // --- MISE À JOUR VISUELLE DE L'AVATAR ADVERSAIRE EN JEU (60 FPS) ---
  update(dt, myDistance) {
    if (!this.isDuelActive || !this.rivalGroup.visible) return;

    // Interpolation douce vers la position de l'adversaire
    const deltaZ = (this.opponentData.distance - myDistance); // Écart relatif de distance
    const targetX = this.opponentData.x || 0;
    const targetY = Math.max(1.2, this.opponentData.y || 3.5);
    const targetZ = -deltaZ; // Si l'adversaire est devant, deltaZ > 0 donc targetZ est en avant (< 0)

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
