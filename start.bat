@echo off
title // SOUNDRISE : INFINITY RUN - Launcher
echo ===================================================================
echo     // SOUNDRISE : INFINITY RUN - DEMARRAGE DU JEU
echo ===================================================================
echo.
echo Verification du moteur d'execution...

where node >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Node.js detecte. Lancement du serveur local sur le port 8080...
    start http://localhost:8080
    node -e "const http=require('http'),fs=require('fs'),path=require('path');const mime={'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.fbx':'application/octet-stream','.mp3':'audio/mpeg','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'};http.createServer((req,res)=>{let u=req.url.split('?')[0];if(u==='/')u='/index.html';let f=path.join(process.cwd(),u);if(!fs.existsSync(f)){res.writeHead(404);res.end('Not Found');return;}let ext=path.extname(f).toLowerCase();res.writeHead(200,{'Content-Type':mime[ext]||'application/octet-stream','Access-Control-Allow-Origin':'*'});fs.createReadStream(f).pipe(res);}).listen(8080,()=>console.log('\n>>> SERVEUR ACTIF sur http://localhost:8080 <<<\n(Ne fermez pas cette fenetre pendant votre partie)'));"
    exit /b
)

where python >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Python detecte. Lancement du serveur local sur le port 8080...
    start http://localhost:8080
    python -m http.server 8080
    exit /b
)

echo [INFO] Ouverture directe dans le navigateur...
start http://localhost:8080
pause
