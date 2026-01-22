# PREPARACIÓN PARA PRODUCCIÓN - CarbassDeportes

## ✅ Archivos Eliminados (Obsoletos de Firebase):
- `includes/firebase-scripts.php` 
- `backups/firebase-config.js` (contenía credenciales expuestas)
- `auth-check.js` (versión Firebase)
- Carpeta `deploy/` completa

## ⚠️ ACCIÓN REQUERIDA ANTES DE DESPLEGAR:

### 1. Seguridad de Credenciales
Las credenciales de MySQL están actualmente en texto plano en `api/db.php`.

**Para producción:**
```bash
# Renombra db.php a db.config.php
mv api/db.php api/db.config.php

# Actualiza las credenciales con las de producción en db.config.php
# Luego crea un nuevo db.php que cargue el config:
```

Contenido sugerido para el nuevo `api/db.php`:
```php
<?php
// Cargar configuración
if (file_exists(__DIR__ . '/db.config.php')) {
    require_once __DIR__ . '/db.config.php';
} else {
    die(json_encode(['error' => 'Archivo de configuración no encontrado']));
}
?>
```

### 2. Actualizar .gitignore
Asegúrate de que el archivo `.gitignore` incluya:
```
api/db.config.php
.env
```

### 3. Verificar Archivos HTML
Los archivos HTML tienen las referencias a Firebase comentadas. Están listos para producción.

## 📋 Checklist Pre-Producción:
- [x] Eliminar archivos obsoletos de Firebase
- [ ] Mover credenciales a archivo de configuración separado
- [ ] Actualizar .gitignore
- [ ] Verificar que no haya credenciales en el repositorio
- [ ] Configurar variables de entorno en el servidor
- [ ] Probar todas las funcionalidades con PHP/MySQL
- [ ] Verificar conexión a base de datos en servidor de producción

## 🔒 Seguridad:
- NUNCA subir `db.config.php` al repositorio
- Usar HTTPS en producción
- Activar modo de producción en PHP (display_errors = Off)
- Configurar permisos adecuados en archivos (644 para archivos, 755 para directorios)
