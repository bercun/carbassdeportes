# Instrucciones para Integración de Protección CSRF

## ✅ Archivos ya Protegidos (Backend)

Los siguientes endpoints PHP ya tienen protección CSRF implementada:

- ✅ `api/login.php`
- ✅ `api/register.php`  
- ✅ `api/admin_productos.php`
- ✅ `api/carrito.php`
- ✅ `api/usuarios.php`
- ✅ `api/ventas.php`
- ✅ `api/categorias.php`
- ✅ `api/productos.php`
- ✅ `api/check_auth.php` (devuelve el token)

## ✅ Archivos JavaScript Actualizados

- ✅ `auth.js` - Protección completa para login/registro
- ✅ `csrf-helper.js` - Utilidad global creada

## 📋 Archivos JavaScript que Necesitan Actualización

Los siguientes archivos necesitan ser modificados para incluir `csrf_token` en sus peticiones:

### 1. admin.js

**Funciones a modificar:**
- `saveProduct()` - POST/PUT a `admin_productos.php`
- `deleteProduct()` - DELETE a `admin_productos.php`
- `changeUserRole()` - PUT a `usuarios.php`
- `deleteUser()` - DELETE a `usuarios.php`
- Cualquier otra función que haga POST/PUT/DELETE

**Ejemplo de cambio:**

```javascript
// ANTES:
const response = await fetch('api/admin_productos.php', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(productData)
});

// DESPUÉS (Opción 1 - Usar fetchWithCsrf):
const response = await fetchWithCsrf('api/admin_productos.php', {
  method: 'POST',
  body: productData  // fetchWithCsrf agrega el token automáticamente
});

// DESPUÉS (Opción 2 - Manual):
const response = await fetch('api/admin_productos.php', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ...productData,
    csrf_token: window.csrfToken || await obtenerCsrfToken()
  })
});
```

### 2. carrito.js

**Funciones a modificar:**
- `agregarAlCarrito()` - POST
- `actualizarCantidad()` - PUT
- `eliminarDelCarrito()` - DELETE
- `finalizarCompra()` - POST (a ventas.php)

### 3. Otros archivos JS

Buscar en todos los archivos `.js` por:
- `fetch(` con method `POST`, `PUT` o `DELETE`
- Actualizar para incluir `csrf_token`

## 🔧 Pasos para Actualizar archivos HTML

Agregar el script `csrf-helper.js` **ANTES** de otros scripts en todas las páginas HTML:

```html
<!-- Agregar ANTES de otros scripts -->
<script src="csrf-helper.js"></script>
<script src="auth-check-php.js"></script>
<script src="script.js"></script>
```

**Páginas a actualizar:**
- `index.html` ✓ (agregar después)
- `admin.html` (agregar)
- `carrito.html` (agregar)
- `catalogo.html` (agregar)
- `login.html` (agregar)

## 📝 Ejemplo Completo de Uso

### En archivos JavaScript que ya cargan:

```javascript
// Al inicio del archivo, esperar a que el token esté disponible
document.addEventListener('DOMContentLoaded', async () => {
  // El token ya se habrá obtenido por csrf-helper.js
  await obtenerCsrfToken(); // Asegurar que está cargado
  
  // Ahora puedes usar window.csrfToken en tus funciones
});

// En funciones que hacen peticiones:
async function guardarDatos(datos) {
  try {
    // Opción 1: Usar la función helper (recomendado)
    const response = await fetchWithCsrf('api/endpoint.php', {
      method: 'POST',
      body: datos
    });
    
    // Opción 2: Agregar manualmente
    const response = await fetch('api/endpoint.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...datos,
        csrf_token: window.csrfToken
      })
    });
    
    const result = await response.json();
    
    // Si el servidor devuelve un nuevo token, se actualiza automáticamente
    if (result.csrf_token) {
      window.csrfToken = result.csrf_token;
    }
    
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## 🚨 Importante

1. **Orden de carga de scripts**: `csrf-helper.js` debe cargarse PRIMERO
2. **Credenciales**: Las peticiones fetch deben incluir `credentials: 'include'` (ya está en fetchWithCsrf)
3. **GET requests**: NO necesitan token CSRF, solo POST/PUT/DELETE/PATCH
4. **Token actualizado**: Después de login/logout, el token se regenera - usar el nuevo token devuelto

## ✅ Testing

Después de implementar, probar:

1. Login/Registro funciona
2. Crear producto funciona
3. Editar producto funciona
4. Eliminar producto funciona
5. Gestión de usuarios funciona
6. Carrito funciona (agregar, modificar, eliminar)
7. Finalizar compra funciona

Si alguna operación falla con error 403 "Token CSRF inválido":
- Verificar que csrf-helper.js se carga primero
- Verificar que window.csrfToken tiene valor
- Verificar que el token se está enviando en el body de la petición
- Verificar en DevTools > Network > Request Payload que incluye "csrf_token"

## 🔐 Seguridad Adicional Implementada

Además del CSRF, también se implementó:
- ✅ Rate limiting en login/register
- ✅ CORS configurado con whitelist
- ✅ Sesiones seguras (HttpOnly, Secure, SameSite)
- ✅ Regeneración de sesión periódica
- ✅ Regeneración de token CSRF post-login

## 📞 Próximos Pasos

1. Actualizar admin.js para incluir tokens CSRF
2. Actualizar carrito.js para incluir tokens CSRF
3. Agregar csrf-helper.js a todos los HTML
4. Probar todas las funcionalidades
5. Verificar en consola del navegador que no hay errores
6. Considerar implementar las otras mejoras de seguridad del reporte de auditoría
