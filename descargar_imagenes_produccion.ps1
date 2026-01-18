# Script para descargar las imágenes del servidor de producción
# Ejecutar este script para sincronizar las imágenes

# OPCIÓN 1: Descarga manual desde el servidor
# ================================================
# 1. Accede a tu hosting (brkoon.uy) vía FTP o cPanel File Manager
# 2. Ve a la carpeta: /public_html/sours/img/articulos/
# 3. Descarga todos los archivos que empiezan con "producto_"
# 4. Copia esos archivos a tu carpeta local: sours/img/articulos/

# OPCIÓN 2: Usando FTP desde PowerShell (si tienes credenciales FTP)
# ================================================
Write-Host "Para descargar imágenes del servidor de producción:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Abre FileZilla o tu cliente FTP favorito"
Write-Host "2. Conéctate a: ftp.brkoon.uy (o tu servidor FTP)"
Write-Host "3. Navega a: /public_html/sours/img/articulos/"
Write-Host "4. Descarga todos los archivos producto_*.jpg"
Write-Host "5. Guárdalos en: D:\trabajo\naty\pruebaweb_chatgpt\sours\img\articulos\"
Write-Host ""

# Lista de imágenes que necesitas descargar según tu base de datos:
Write-Host "Archivos necesarios según tu base de datos:" -ForegroundColor Green
Write-Host "  - producto_695afd6b40ba23.40749591.jpg"
Write-Host "  - producto_695afd5c668040.88754875.jpg"
Write-Host "  - producto_695afd4dd8f5b7.33716491.jpg"
Write-Host "  - producto_695a66f90fa381.44802827.jpg"
Write-Host "  - producto_695a669a5d16b1.55145907.jpg"
Write-Host "  - producto_695a667460aa92.63762951.jpg"
Write-Host "  - producto_696bf25be509a1.43243322.jpg"
Write-Host "  - producto_696bff9fcb8dc8.94273456.jpg"
Write-Host ""
Write-Host "IMPORTANTE: Estas imágenes están en tu servidor de producción (brkoon.uy)"
Write-Host "            pero NO en tu servidor local de desarrollo."
Write-Host ""
