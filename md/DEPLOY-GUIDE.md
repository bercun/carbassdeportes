# Guía de Deploy - CarbassDeportes

## 📋 Proceso de Actualización

### 1. Realizar cambios en tu código
Trabaja normalmente en los archivos del proyecto (HTML, CSS, JS).

### 2. Sincronizar con la carpeta deploy
Ejecuta el script de sincronización:

```powershell
powershell -ExecutionPolicy Bypass -File sync-deploy.ps1
```

Este comando:
- ✅ Copia todos los archivos necesarios a la carpeta `deploy`
- ✅ Incluye HTML, CSS, JavaScript y Firebase config
- ✅ Copia la carpeta `sours` con todas las imágenes y recursos

### 3. Verificar los cambios
Revisa que los archivos en la carpeta `deploy` estén actualizados.

### 4. Subir al servidor
Sube el contenido de la carpeta `deploy` a tu servidor web.

## 🔧 Archivos sincronizados automáticamente

- `index.html`
- `catalogo.html`
- `login.html`
- `admin.html`
- `styles.css`
- `script.js`
- `auth.js`
- `auth-check.js`
- `admin.js`
- `firebase-config.js`
- Carpeta `sours/` (imágenes y videos)

## ✅ Correcciones Aplicadas

### Catálogo.html
- ✅ Eliminado código duplicado del header
- ✅ Corregida estructura del navbar
- ✅ Icono del carrito unificado (🛒)
- ✅ Layout consistente con index.html

## 🚀 Comandos Git Útiles

```bash
# Ver estado de los archivos
git status

# Agregar cambios
git add .

# Hacer commit
git commit -m "Actualización del catálogo y deploy"

# Subir a la rama deploy
git push origin deploy

# Cambiar a otra rama
git checkout nombre-rama

# Ver todas las ramas
git branch -a
```

## 📌 Notas Importantes

- La carpeta `deploy` contiene una copia lista para producción
- No edites directamente los archivos en `deploy`, siempre trabaja en la raíz del proyecto
- Ejecuta `sync-deploy.ps1` cada vez que hagas cambios antes de subir al servidor
