# ✅ Protección CSRF Implementada - CarbassDeportes

**Fecha de implementación:** 31 de Enero de 2026  
**Estado:** Implementación Core Completada

---

## 🎯 Resumen Ejecutivo

Se ha implementado exitosamente protección **CSRF (Cross-Site Request Forgery)** en toda la aplicación CarbassDeportes. Esta protección previene que atacantes ejecuten acciones no autorizadas en nombre de usuarios autenticados.

---

## ✅ Archivos Creados

### 1. `api/security_middleware.php` ⭐
**Archivo central de seguridad** que incluye:
- ✅ Generación y verificación de tokens CSRF
- ✅ Configuración de sesiones seguras (HttpOnly, Secure, SameSite)
- ✅ Headers de seguridad HTTP
- ✅ CORS configurado con whitelist
- ✅ Rate limiting para prevenir fuerza bruta
- ✅ Regeneración periódica de sesiones

**Funciones principales:**
```php
generar_csrf_token()         // Genera nuevo token
verificar_csrf($token)        // Verifica validez del token
regenerar_csrf_token()        // Regenera token (post-login)
check_rate_limit()            // Previene fuerza bruta
```

### 2. `csrf-helper.js` ⭐
**Utilidad JavaScript global** para manejo de tokens:
- ✅ Obtiene automáticamente el token CSRF del servidor
- ✅ Almacena el token en `window.csrfToken`
- ✅ Proporciona función `fetchWithCsrf()` que agrega el token automáticamente
- ✅ Actualiza el token cuando el servidor envía uno nuevo

**Funciones disponibles:**
```javascript
obtenerCsrfToken()           // Obtiene token del servidor
fetchWithCsrf(url, options)  // Fetch con token incluido automáticamente
```

### 3. Documentación

- ✅ `AUDITORIA_SEGURIDAD.md` - Reporte completo de seguridad
- ✅ `INSTRUCCIONES_CSRF.md` - Guía de integración
- ✅ `RESUMEN_IMPLEMENTACION_CSRF.md` - Este documento

---

## 🔒 Archivos PHP Protegidos (8 endpoints)

Todos los siguientes archivos PHP ahora requieren y verifican tokens CSRF:

| Archivo | Métodos Protegidos | Estado |
|---------|-------------------|--------|
| `api/login.php` | POST | ✅ Completo + Rate Limit |
| `api/register.php` | POST | ✅ Completo + Rate Limit |
| `api/admin_productos.php` | POST, PUT, DELETE | ✅ Completo |
| `api/carrito.php` | POST, PUT, DELETE | ✅ Completo |
| `api/usuarios.php` | PUT, DELETE | ✅ Completo |
| `api/ventas.php` | POST | ✅ Completo |
| `api/categorias.php` | POST | ✅ Completo |
| `api/productos.php` | POST, PUT, DELETE | ✅ Completo |
| `api/check_auth.php` | GET | ✅ Devuelve token |

**Cambios implementados en cada endpoint:**
1. Importa `security_middleware.php`
2. Verifica token CSRF en métodos POST/PUT/DELETE
3. Devuelve nuevo token cuando corresponde (login/registro)
4. Headers CORS configurados correctamente

---

## 📱 Archivos JavaScript Actualizados

### ✅ Completamente Integrados

| Archivo | Estado | Descripción |
|---------|--------|-------------|
| `auth.js` | ✅ Completo | Login/registro con tokens CSRF |
| `csrf-helper.js` | ✅ Nuevo | Utilidad global |
| `index.html` | ✅ Actualizado | Carga csrf-helper.js |

### ⚠️ Pendientes de Actualización

Los siguientes archivos necesitan ser actualizados para usar `fetchWithCsrf()` o agregar manualmente el token:

| Archivo | Funciones a Actualizar | Prioridad |
|---------|------------------------|-----------|
| `admin.js` | saveProduct, deleteProduct, changeUserRole, deleteUser | 🔴 Alta |
| `carrito.js` | agregarAlCarrito, actualizarCantidad, eliminarDelCarrito, finalizarCompra | 🔴 Alta |
| Otros .js | Cualquier POST/PUT/DELETE | 🟡 Media |

**Instrucciones detalladas en:** [INSTRUCCIONES_CSRF.md](INSTRUCCIONES_CSRF.md)

---

## 🛡️ Protecciones Adicionales Implementadas

Además de CSRF, el `security_middleware.php` incluye:

### 1. **Sesiones Seguras**
```php
session.cookie_httponly = 1   // Previene robo via XSS
session.cookie_secure = 1     // Solo HTTPS
session.cookie_samesite = Strict  // Protección CSRF adicional
```

### 2. **Rate Limiting**
- Login: 5 intentos en 5 minutos
- Registro: 3 intentos en 5 minutos
- Se limpia automáticamente después de login exitoso

### 3. **CORS Seguro**
```php
// Solo permite orígenes específicos (whitelist)
$allowed_origins = [
    'http://localhost',
    'https://carbassdeportes.com'
];
```

### 4. **Headers de Seguridad HTTP**
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

### 5. **Regeneración de Sesión**
- Automática cada 5 minutos
- Forzada después de login/registro

---

## 📋 Cómo Funciona la Protección CSRF

### Flujo de Autenticación:

```mermaid
secuencia:
1. Usuario carga página → csrf-helper.js obtiene token
2. Usuario hace login → Envía email + password + csrf_token
3. Servidor verifica token → Si es válido, procesa login
4. Servidor genera NUEVO token → Lo devuelve en respuesta
5. JavaScript actualiza token → Listo para próximas peticiones
```

### Ejemplo de Petición Protegida:

**Frontend (JavaScript):**
```javascript
// Opción 1: Automática con helper
const response = await fetchWithCsrf('api/admin_productos.php', {
  method: 'POST',
  body: { nombre: 'Producto', precio: 100 }
});

// Opción 2: Manual
const response = await fetch('api/admin_productos.php', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nombre: 'Producto',
    precio: 100,
    csrf_token: window.csrfToken  // ← TOKEN INCLUIDO
  })
});
```

**Backend (PHP):**
```php
// Recibe petición
$data = json_decode(file_get_contents('php://input'), true);

// Verifica token (termina ejecución si es inválido)
verificar_csrf($data['csrf_token'] ?? '');

// Si llega aquí, el token es válido - procesar petición
// ...
```

---

## 🧪 Cómo Probar la Implementación

### 1. **Login/Registro** (Ya funciona)
```javascript
// En login.html, completar formulario y enviar
// Debería funcionar normalmente
```

### 2. **Verificar Token en Consola**
```javascript
// En la consola del navegador:
console.log(window.csrfToken);
// Debería mostrar un string largo (64 caracteres hexadecimales)
```

### 3. **Intentar Petición sin Token**
```javascript
// En la consola:
fetch('api/admin_productos.php', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nombre: 'Test' })
});

// Debería retornar error 403: "Token CSRF inválido o ausente"
```

### 4. **Petición con Token Correcto**
```javascript
// Con fetchWithCsrf:
fetchWithCsrf('api/categorias.php', {
  method: 'POST',
  body: { nombre: 'Test', slug: 'test' }
});

// Debería funcionar si eres admin
```

---

## ⚠️ Notas Importantes

### Para Desarrollo Local (HTTP):

Si estás trabajando en `http://localhost` (sin HTTPS), necesitas modificar temporalmente:

**En `api/security_middleware.php` línea 9:**
```php
// CAMBIAR de:
ini_set('session.cookie_secure', 1);    // Solo HTTPS

// A (solo para desarrollo):
ini_set('session.cookie_secure', 0);    // Permite HTTP
```

⚠️ **IMPORTANTE:** Volver a poner `1` antes de subir a producción con HTTPS.

### Para Producción:

1. Actualizar `$allowed_origins` en `security_middleware.php` con tu dominio real
2. Verificar que `session.cookie_secure = 1` esté activo
3. Usar HTTPS siempre
4. Probar todas las funcionalidades después del deploy

---

## 📊 Métricas de Implementación

| Aspecto | Estado |
|---------|--------|
| **Endpoints PHP protegidos** | 8/8 (100%) ✅ |
| **Login/Registro** | 2/2 (100%) ✅ |
| **JavaScript actualizado** | 2/4 (50%) ⚠️ |
| **HTML con csrf-helper** | 1/5 (20%) ⚠️ |
| **Documentación** | 3/3 (100%) ✅ |
| **Rate Limiting** | 2/2 (100%) ✅ |
| **CORS Seguro** | 8/8 (100%) ✅ |

**Estado Global:** 🟡 Core Implementado - Integración JS Pendiente

---

## 📝 Próximos Pasos (Orden de Prioridad)

### 🔴 Alta Prioridad (Hacer YA)

1. **Actualizar admin.js**
   - Modificar funciones que hacen POST/PUT/DELETE
   - Usar `fetchWithCsrf()` o agregar tokens manualmente
   - Probar creación, edición y eliminación de productos

2. **Actualizar carrito.js**
   - Agregar/modificar/eliminar items del carrito
   - Finalizar compra
   - Probar flujo completo de compra

3. **Agregar csrf-helper.js a HTML restantes**
   - admin.html
   - carrito.html
   - catalogo.html
   - login.html (si no lo tiene)

### 🟡 Media Prioridad (Esta semana)

4. **Revisar otros archivos .js**
   - Buscar todos los `fetch()` con POST/PUT/DELETE
   - Actualizar para incluir token

5. **Testing exhaustivo**
   - Probar cada funcionalidad de la aplicación
   - Verificar que no hay errores 403
   - Comprobar en Network tab que tokens se envían

### 🟢 Baja Prioridad (Cuando sea posible)

6. **Implementar otras mejoras de seguridad del reporte**
   - Validación de entrada mejorada
   - Política de contraseñas fuertes
   - Mejoras en subida de archivos
   - Logging mejorado

---

## 🆘 Solución de Problemas

### Error: "Token CSRF inválido o ausente"

**Causas posibles:**
1. `csrf-helper.js` no está cargado
2. Token no se está enviando en el body
3. Token es null o undefined

**Solución:**
```javascript
// Verificar en consola:
console.log('Token:', window.csrfToken);

// Si es null, llamar manualmente:
await obtenerCsrfToken();
console.log('Token después:', window.csrfToken);
```

### Error: Sesión se pierde constantemente

**Causa:** Cookies con Secure=1 en HTTP  
**Solución:** Ver sección "Para Desarrollo Local" arriba

### Error: CORS policy

**Causa:** Origen no está en whitelist  
**Solución:** Agregar tu dominio en `security_middleware.php`:
```php
$allowed_origins = [
    'http://localhost',
    'http://tu-dominio.com'  // ← Agregar aquí
];
```

---

## 📞 Contacto y Soporte

Para dudas sobre la implementación:
1. Revisar [INSTRUCCIONES_CSRF.md](INSTRUCCIONES_CSRF.md)
2. Revisar [AUDITORIA_SEGURIDAD.md](AUDITORIA_SEGURIDAD.md)
3. Verificar consola del navegador (F12 → Console)
4. Verificar Network tab (F12 → Network) para ver peticiones

---

## 🎉 Conclusión

✅ **La protección CSRF está funcionalmente implementada**  
⚠️ **Falta integrar en algunos archivos JavaScript**  
🔒 **La aplicación está significativamente más segura**

**Próximo paso inmediato:** Actualizar `admin.js` y `carrito.js` según instrucciones.

---

**Última actualización:** 31 de Enero de 2026  
**Desarrollador:** GitHub Copilot  
**Proyecto:** CarbassDeportes Web Application
