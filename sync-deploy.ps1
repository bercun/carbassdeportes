# Script para sincronizar archivos con la carpeta deploy
# Uso: .\sync-deploy.ps1

Write-Host "Sincronizando archivos con carpeta deploy..." -ForegroundColor Green

# Crear carpeta deploy si no existe
if (!(Test-Path "deploy")) {
    New-Item -ItemType Directory -Path "deploy" | Out-Null
    Write-Host "Carpeta deploy creada" -ForegroundColor Cyan
}

# Lista de archivos a copiar
$archivos = @(
    "index.html",
    "catalogo.html",
    "login.html",
    "admin.html",
    "styles.css",
    "script.js",
    "auth.js",
    "auth-check.js",
    "admin.js",
    "firebase-config.js"
)

# Copiar archivos
foreach ($archivo in $archivos) {
    if (Test-Path $archivo) {
        Copy-Item $archivo -Destination "deploy\" -Force
        Write-Host "Copiado: $archivo" -ForegroundColor Green
    } else {
        Write-Host "No encontrado: $archivo" -ForegroundColor Yellow
    }
}

# Copiar carpeta sours (imagenes y recursos)
if (Test-Path "sours") {
    Copy-Item "sours" -Destination "deploy\" -Recurse -Force
    Write-Host "Copiada carpeta: sours" -ForegroundColor Green
}

Write-Host ""
Write-Host "Sincronizacion completada!" -ForegroundColor Cyan
Write-Host "Los archivos estan listos en la carpeta deploy para subir al servidor." -ForegroundColor White
