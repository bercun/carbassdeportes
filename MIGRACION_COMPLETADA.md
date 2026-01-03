# Migración Completada: Firebase → PHP/MySQL

## ✅ Archivos Actualizados

### Backend (API PHP)
- ✅ `api/db.php` - Conexión a MySQL
- ✅ `api/login.php` - Autenticación de usuarios
- ✅ `api/register.php` - Registro de nuevos usuarios
- ✅ `api/logout.php` - Cerrar sesión
- ✅ `api/check_auth.php` - Verificar estado de sesión
- ✅ `api/productos.php` - Obtener productos (público)
- ✅ `api/admin_productos.php` - CRUD de productos (admin)
- ✅ `api/categorias.php` - Gestión de categorías
- ✅ `api/upload_imagen.php` - Subir imágenes
- ✅ `uploads/` - Carpeta para imágenes

### Frontend (JavaScript)
- ✅ `auth.js` - Login/registro usando API PHP
- ✅ `auth-check-php.js` - Verificación de sesión con PHP
- ✅ `script.js` - Carga de productos desde API PHP
- ✅ `admin.js` - Panel admin usando API PHP

### HTML
- ✅ `index.html` - Referencias a Firebase comentadas
- ✅ `login.html` - Referencias a Firebase comentadas
- ✅ `catalogo.html` - Referencias a Firebase comentadas
- ✅ `admin.html` - Referencias a Firebase comentadas

## 📋 Pasos Finales para Deployment

### 1. Configurar Credenciales de Base de Datos

Edita `api/db.php` con tus datos reales:
```php
$host = 'localhost';
$db   = 'brkoonuy_carbass_db';  // ← Tu nombre de BD
$user = 'brkoonuy_carbass_user'; // ← Tu usuario
$pass = 'TuContraseñaSegura';    // ← Tu contraseña
```

### 2. Crear Usuario Administrador

Ejecuta esto en phpMyAdmin para crear tu primer admin:
```sql
INSERT INTO usuarios (email, password, nombre, rol) 
VALUES (
  'admin@carbass.com', 
  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
  'Administrador', 
  'admin'
);
```

**Credenciales del admin:**
- Email: `admin@carbass.com`
- Password: `password` (cámbiala después del primer login)

### 3. Insertar Categorías

```sql
INSERT INTO categorias (nombre, slug) VALUES
('Fútbol', 'futbol'),
('Basket', 'basket'),
('Gym/Running', 'gym'),
('Coleccionables', 'coleccionables');
```

### 4. Configurar Permisos de la Carpeta uploads/

En cPanel o por FTP, configura permisos de escritura:
```bash
chmod 755 uploads/
```

### 5. Subir Archivos al Servidor

**Usando cPanel File Manager:**
1. Ve a "Administrador de Archivos"
2. Navega a `public_html` (o la carpeta de tu dominio)
3. Sube todos los archivos del proyecto
4. Asegúrate de subir la carpeta `api/` completa
5. Crea la carpeta `uploads/` si no existe

**Usando FTP (FileZilla):**
1. Conecta con las credenciales de tu hosting
2. Sube todos los archivos a `public_html`
3. Verifica que la estructura sea correcta

### 6. Probar la Aplicación

1. **Registro de usuario:**
   - Ve a `tudominio.com/login.html`
   - Crea una cuenta nueva
   - Verifica que te redirija a index.html

2. **Login:**
   - Inicia sesión con el usuario que creaste
   - Verifica que aparezca tu nombre en la barra superior

3. **Panel Admin:**
   - Inicia sesión con `admin@carbass.com` / `password`
   - Ve a `tudominio.com/admin.html`
   - Prueba crear un producto

4. **Subir Imágenes:**
   - En el panel admin, al crear un producto
   - Usa el campo de imagen para subir archivos

## 🔧 Troubleshooting

### Error "No se puede conectar a la base de datos"
- Verifica las credenciales en `api/db.php`
- Asegúrate de que el usuario tenga permisos sobre la BD

### Error "Access denied"
- Verifica que el usuario de MySQL tenga los permisos correctos
- En cPanel → MySQL Databases → Add User To Database

### Las imágenes no se suben
- Verifica permisos de la carpeta `uploads/`: `chmod 755 uploads/`
- Verifica que el servidor permita `file_uploads` en PHP

### Sesiones no funcionan
- Verifica que `session.save_path` esté configurado en PHP
- En algunos hostings necesitas configurar esto en `.htaccess`:
  ```apache
  php_value session.save_path "/tmp"
  ```

### CORS errors
- Si tu API está en un subdominio diferente, necesitarás ajustar los headers CORS
- Verifica que los archivos PHP tengan los headers correctos

## 📊 Próximas Mejoras Sugeridas

1. **Crear endpoint de usuarios** (`api/usuarios.php`) para gestión completa
2. **Implementar carrito de compras** funcional
3. **Agregar paginación** a la lista de productos
4. **Mejorar búsqueda** con filtros por categoría, precio, etc.
5. **Implementar sistema de órdenes** de compra
6. **Agregar recuperación de contraseña**
7. **Implementar sistema de roles** más complejo

## 📝 Notas Importantes

- Las referencias a Firebase están comentadas en los HTML, no eliminadas
- Puedes descomentar Firebase si necesitas volver atrás
- El archivo `auth-check-php.js` reemplaza a `auth-check.js`
- Los productos necesitan tener una categoría válida
- Por defecto, nuevos usuarios tienen rol `user`, no `admin`

## 🔐 Seguridad

- ✅ Contraseñas hasheadas con `password_hash()`
- ✅ Preparación de consultas SQL (protección contra SQL injection)
- ✅ Validación de sesiones en endpoints sensibles
- ✅ Verificación de rol admin en operaciones CRUD
- ⚠️ Considera usar HTTPS en producción
- ⚠️ Implementa rate limiting para login/registro
- ⚠️ Agrega validación de CSRF tokens

---

¡Migración completada con éxito! 🎉
