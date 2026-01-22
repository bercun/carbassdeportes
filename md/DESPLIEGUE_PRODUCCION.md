# Guía de Despliegue a Producción - CarbassDeportes

## ✅ Pasos Completados (Desarrollo Local)

1. ✅ Migración completa de Firebase a PHP/MySQL
2. ✅ Eliminación de archivos obsoletos de Firebase
3. ✅ Credenciales separadas en archivo de configuración
4. ✅ .gitignore actualizado

## 📦 Estructura de Archivos de Configuración

```
api/
├── db.php                    ➜ Carga la configuración (SE SUBE al repo)
├── db.config.php            ➜ Credenciales actuales (NO SUBIR - está en .gitignore)
└── db.config.example.php    ➜ Plantilla de ejemplo (SE SUBE al repo)
```

## 🚀 Pasos para Subir a Producción

### 1. Preparar Repositorio Local

```bash
# Verificar que db.config.php NO esté en el repositorio
git status

# Si aparece db.config.php, asegúrate de que esté en .gitignore
# Ya está configurado en: .gitignore
```

### 2. Subir Código al Repositorio

```bash
# Agregar cambios
git add .

# Verificar que db.config.php NO esté incluido
git status

# Commit
git commit -m "Migración a PHP/MySQL - Listo para producción"

# Push al repositorio
git push origin main
```

### 3. En el Servidor de Producción

#### A. Clonar o actualizar el repositorio
```bash
cd /ruta/del/servidor/web
git pull origin main
```

#### B. Crear archivo de configuración de producción
```bash
cd api
cp db.config.example.php db.config.php
nano db.config.php  # o usa el editor de tu servidor
```

#### C. Configurar credenciales de producción en `db.config.php`
```php
<?php
$host = 'localhost';  // o la IP de tu servidor MySQL
$db   = 'nombre_db_produccion';
$user = 'usuario_produccion';
$pass = 'contraseña_segura_produccion';
$charset = 'utf8mb4';
?>
```

### 4. Configurar Permisos en el Servidor

```bash
# Permisos correctos para archivos
chmod 644 api/*.php
chmod 600 api/db.config.php  # Solo lectura por el propietario

# Permisos para directorios
chmod 755 api/
```

### 5. Configuración PHP en Producción

Edita el archivo `php.ini` o `.htaccess`:

```ini
# php.ini o .htaccess
display_errors = Off
log_errors = On
error_log = /ruta/logs/php_errors.log
```

### 6. Verificar Base de Datos

Asegúrate de que:
- [ ] La base de datos existe en el servidor
- [ ] Las tablas están creadas (usuarios, productos, categorias, carrito, ventas, detalle_ventas)
- [ ] El usuario MySQL tiene permisos correctos
- [ ] Puedes conectarte desde el servidor

```bash
# Probar conexión MySQL
mysql -u usuario_produccion -p nombre_db_produccion
```

### 7. Probar la Aplicación

1. Accede a tu sitio: `https://tudominio.com`
2. Prueba el login
3. Prueba agregar productos al carrito
4. Verifica el panel de administración

## 🔒 Checklist de Seguridad

- [x] db.config.php está en .gitignore
- [x] Credenciales NO están en el repositorio
- [ ] HTTPS configurado en producción
- [ ] display_errors = Off en producción
- [ ] Permisos de archivos correctos (644/755)
- [ ] db.config.php con permisos 600
- [ ] Contraseñas de base de datos son seguras
- [ ] Backup de la base de datos configurado

## 📝 Comandos Rápidos

### Verificar que db.config.php NO esté en git:
```bash
git ls-files | grep db.config.php
# No debe mostrar nada
```

### Ver archivos que se van a subir:
```bash
git status
git diff --cached
```

### Subir a producción:
```bash
git add .
git commit -m "Preparado para producción"
git push origin main
```

## ⚠️ IMPORTANTE

**NUNCA hacer:**
- ❌ Subir `db.config.php` al repositorio
- ❌ Hacer commit de credenciales en texto plano
- ❌ Usar `display_errors = On` en producción
- ❌ Dejar archivos con permisos 777

**SIEMPRE hacer:**
- ✅ Verificar .gitignore antes de cada commit
- ✅ Usar HTTPS en producción
- ✅ Hacer backups regulares de la base de datos
- ✅ Revisar logs de errores periódicamente

## 🆘 Solución de Problemas

### Error: "Archivo de configuración no encontrado"
```bash
# Verifica que existe db.config.php en el servidor
ls -la api/db.config.php

# Si no existe, créalo desde el ejemplo
cp api/db.config.example.php api/db.config.php
# Luego edita con las credenciales correctas
```

### Error: "Error de conexión a la base de datos"
```bash
# Verifica credenciales en db.config.php
# Verifica que MySQL esté corriendo
systemctl status mysql

# Verifica permisos del usuario
mysql -u root -p
SHOW GRANTS FOR 'usuario_produccion'@'localhost';
```

---

**Proyecto listo para producción** ✅
