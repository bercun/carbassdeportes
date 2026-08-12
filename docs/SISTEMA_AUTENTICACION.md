# 🔒 Sistema de Autenticación y Permisos - CarbassDeportes

## 📋 Resumen del Sistema

### Roles de Usuario

1. **Administrador (`admin`)**
   - Acceso completo al panel de administración
   - Puede crear, editar y eliminar productos
   - Puede gestionar categorías
   - Ver estadísticas

2. **Usuario/Cliente (`user`)**
   - Puede ver productos
   - Puede agregar productos al carrito
   - Puede realizar compras
   - NO puede modificar productos ni acceder al panel admin

---

## 🛡️ Protecciones Implementadas

### 1. Backend (PHP)

#### Verificación en APIs:
- `api/admin_productos.php` - **PROTEGIDO**: Solo admin puede crear/editar/eliminar
- `api/productos.php` - **PÚBLICO**: Cualquiera puede leer (GET)
- `api/check_auth.php` - **PÚBLICO**: Verifica sesión actual
- `api/login.php` - **PÚBLICO**: Permite login
- `api/register.php` - **PÚBLICO**: Crea usuarios con rol 'user'
- `api/create_admin.php` - **ESPECIAL**: Crea usuarios con rol 'admin'

Ejemplo de protección en PHP:
```php
session_start();
if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['error' => 'Acceso denegado']);
    exit;
}
```

### 2. Frontend (JavaScript)

#### admin.html:
- Verifica autenticación al cargar
- Verifica rol de administrador
- Redirige a login si no está autenticado
- Muestra mensaje de acceso denegado si no es admin

#### index.html / catalogo.html:
- Los usuarios normales solo ven productos
- El botón de admin solo aparece para administradores
- Todos pueden ver el catálogo

---

## 🚀 Flujo de Autenticación

### Para Usuarios Regulares:
1. Acceder a `login.html`
2. Opción "Registrarse" crea cuenta con rol `user`
3. Puede navegar y ver productos
4. NO ve el botón de administración

### Para Administradores:
1. Crear admin usando `crear_admin.html`
2. Login con credenciales de admin
3. Ve botón "🛠️" en la barra de usuario
4. Accede a `admin.html`
5. Panel completo de administración

---

## 📁 Archivos del Sistema

### Autenticación:
- `login.html` - Página de login/registro
- `crear_admin.html` - Crear administradores
- `api/login.php` - Procesa login
- `api/register.php` - Registra usuarios (rol: user)
- `api/create_admin.php` - Crea administradores (rol: admin)
- `api/check_auth.php` - Verifica sesión
- `api/logout.php` - Cierra sesión
- `auth-check-php.js` - Verifica auth en frontend

### Administración:
- `admin.html` - Panel de administración
- `admin.js` - Lógica del panel
- `api/admin_productos.php` - CRUD protegido de productos

### Productos (Público):
- `index.html` - Página principal
- `catalogo.html` - Catálogo completo
- `script.js` - Carga y muestra productos
- `api/productos.php` - API de productos (GET público, POST/PUT/DELETE protegido)

---

## ✅ Cómo Usar el Sistema

### Paso 1: Crear el Primer Administrador
1. Acceder a: `https://carbass.brkoon.uy/crear_admin.html`
2. Llenar el formulario:
   - Nombre: Tu nombre
   - Email: tu@email.com
   - Contraseña: (mínimo 6 caracteres)
3. Click en "Crear Administrador"

### Paso 2: Iniciar Sesión como Admin
1. Ir a `login.html`
2. Ingresar credenciales del admin creado
3. Se mostrará botón "🛠️" en la barra superior
4. Click en "🛠️" para acceder al panel

### Paso 3: Gestionar Productos
- En el panel admin: Crear, editar, eliminar productos
- Los cambios se reflejan inmediatamente en el sitio

### Paso 4: Usuarios Regulares
- Los visitantes pueden registrarse en `login.html`
- Se crean automáticamente con rol `user`
- Solo pueden ver y comprar productos

---

## 🔧 Configuración de Seguridad

### Variables de Sesión:
```php
$_SESSION['user_id']   // ID del usuario
$_SESSION['email']      // Email del usuario
$_SESSION['nombre']     // Nombre del usuario
$_SESSION['rol']        // 'admin' o 'user'
```

### Verificación de Rol:
```javascript
if (userSession.rol === 'admin') {
    // Mostrar opciones de admin
} else {
    // Usuario regular
}
```

---

## ⚠️ Notas de Seguridad

1. **ELIMINAR** o **PROTEGER** con contraseña el archivo `crear_admin.html` después de crear los administradores necesarios
2. Las contraseñas se almacenan hasheadas con `password_hash()`
3. Todas las operaciones de modificación requieren autenticación
4. Las sesiones se manejan con PHP sessions
5. CORS está habilitado para desarrollo, considerar restringir en producción

---

## 📞 Testing del Sistema

### Probar como Usuario Regular:
1. Registrarse en `login.html`
2. Intentar acceder a `admin.html`
3. Debe mostrar "Acceso Denegado"

### Probar como Admin:
1. Crear admin en `crear_admin.html`
2. Login con credenciales de admin
3. Acceder a `admin.html`
4. Debe mostrar el panel completo
5. Crear/editar/eliminar productos

---

## 🎯 Funcionalidades Implementadas

✅ Registro de usuarios (rol: user)
✅ Registro de administradores (rol: admin)
✅ Login con verificación de contraseña
✅ Logout con destrucción de sesión
✅ Verificación de sesión en cada carga
✅ Protección de rutas admin en backend
✅ Protección de UI en frontend
✅ CRUD completo de productos (solo admin)
✅ Vista pública de productos (todos)
✅ Mensajes claros de acceso denegado

---

## 🔄 Actualizar a Producción

1. Subir todos los archivos PHP al servidor
2. Subir archivos HTML y JS
3. Acceder a `crear_admin.html` y crear el primer admin
4. **IMPORTANTE**: Eliminar o renombrar `crear_admin.html` después
5. Probar login y funcionalidades

---

**Última actualización**: Enero 2026
**Estado**: Sistema completo y funcional
