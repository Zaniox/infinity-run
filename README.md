# // SOUNDRISE : INFINITY RUN

Jeu vidéo 3D de type "Infinite Runner" (course sans fin) inspiré de *Race the Sun*, dédié à l'artiste **OodaïSound**.

## 🎨 Direction Artistique
- Esthétique Cyber-Baroque / Néon, sombre et futuriste.
- Palette violet / magenta / cyan inspirée des visuels officiels d'OodaïSound.
- Avatar : Sphère métallique violette brillante.

## 🚀 Lancer le jeu en local

Le projet est conçu en **Vanilla ES Modules** (Web standard sans étape de compilation obligatoire).

### Option 1 : Avec Python
```bash
python -m http.server 8080
```
Puis ouvrez dans votre navigateur : `http://localhost:8080`

### Option 2 : Avec Node.js (npx)
```bash
npx serve .
```

### Option 3 : Déploiement direct sur GitHub Pages
1. Créez un dépôt sur GitHub nommé `soundrise-infinity-run`.
2. Poussez les fichiers :
   ```bash
   git init
   git add .
   git commit -m "Phase 1: 3D Engine Skeleton & Infinite Grid"
   git branch -M main
   git remote add origin https://github.com/<votre-pseudo>/soundrise-infinity-run.git
   git push -u origin main
   ```
3. Dans les paramètres de votre dépôt GitHub, activez **GitHub Pages** (Source : `Deploy from a branch` -> `main` / `/ (root)`).
4. Le jeu sera instantanément jouable en ligne !

## 🕹️ Contrôles (Phase 1)
- **Clavier** : `◄` / `►` (Flèches) ou `Q` / `D` (AZERTY) ou `A` / `D` (QWERTY).
- **Souris** : Déplacez le curseur horizontalement ou cliquez-glissez.
- **Mobile / Tactile** : Glissez le doigt vers la gauche ou la droite.
