# 🔒 AUDITORÍA DE SEGURIDAD - CarbassDeportes Web

**Fecha:** 31 de Enero de 2026  
**Analista:** GitHub Copilot  
**Aplicación:** CarbassDeportes Web (PHP + JavaScript)

---

## 📋 RESUMEN EJECUTIVO

Se han identificado **MÚLTIPLES vulnerabilidades de seguridad** en diferentes categorías de severidad. La aplicación presenta buenas prácticas en algunas áreas (uso de PDO preparado para SQL Injection), pero tiene **vulnerabilidades críticas** que deben ser atendidas inmediatamente.

### Severidad de Vulnerabilidades Encontradas:
- 🔴 **CRÍTICAS:** 3
- 🟠 **ALTAS:** 5
- 🟡 **MEDIAS:** 4
- 🟢 **BAJAS:** 2

---

## ✅ BUENAS PRÁCTICAS IMPLEMENTADAS

### 1. Protección contra SQL Injection ✓
**Estado:** **PROTEGIDO CORRECTAMENTE**

La aplicación usa **PDO con prepared statements** en todas las consultas, lo cual previene SQL Injection:

```php
// Ejemplo correcto en login.php
$stmt = $pdo->prepare('SELECT id, email, password, nombre, rol FROM usuarios WHERE email = ?');
$stmt->execute([$email]);

// Ejemplo correcto en productos.php
$stmt = $pdo->prepare('SELECT * FROM productos WHERE id = ?');
$stmt->execute([$id]);
```

**✓ Buenas prácticas:**
- Uso consistente de placeholders `?`
- No concatenación directa de variables en SQL
- PDO con `ATTR_EMULATE_PREPARES => false`

---

## 🔴 VULNERABILIDADES CRÍTICAS

### 1. CSRF (Cross-Site Request Forgery) - CRÍTICO
**Archivos afectados:** Todos los endpoints PHP  
**Severidad:** 🔴 CRÍTICA  
**CVE Relacionado:** CWE-352

**Descripción:**  
Ningún endpoint verifica tokens CSRF, permitiendo que un atacante ejecute acciones en nombre del usuario autenticado.

**Impacto:**
- Cambio de roles de usuarios
- Creación/eliminación de productos
- Modificación de datos sin consentimiento
- Registro de ventas fraudulentas

**Código vulnerable:**
```php
// admin_productos.php - SIN VERIFICACIÓN CSRF
if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    // Directamente inserta sin verificar token
    $stmt->execute([$nombre, $descripcion, $precio, ...]);
}
```

**Solución:**
```php
// 1. Generar token en check_auth.php
session_start();
if (!isset($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// 2. Verificar en cada POST/PUT/DELETE
function verificar_csrf($token) {
    if (!isset($_SESSION['csrf_token']) || $token !== $_SESSION['csrf_token']) {
        http_response_code(403);
        die(json_encode(['error' => 'Token CSRF inválido']));
    }
}

// 3. En cada endpoint
$data = json_decode(file_get_contents('php://input'), true);
verificar_csrf($data['csrf_token'] ?? '');
```

---

### 2. CORS Mal Configurado - CRÍTICO
**Archivos:** Todos los archivos PHP  
**Severidad:** 🔴 CRÍTICA  
**CVE Relacionado:** CWE-942

**Código vulnerable:**
```php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
```

**Problema:**  
Permite que CUALQUIER sitio web haga peticiones a la API con credenciales del usuario.

**Impacto:**
- Robo de sesiones
- Acceso no autorizado desde sitios maliciosos
- Ejecución de acciones en nombre del usuario

**Solución:**
```php
// Configuración correcta de CORS
$allowed_origins = [
    'https://carbassdeportes.com',
    'https://www.carbassdeportes.com'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
} else {
    http_response_code(403);
    die(json_encode(['error' => 'Origen no permitido']));
}

// Manejar preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
```

---

### 3. Sin Rate Limiting - CRÍTICO
**Archivos:** login.php, register.php  
**Severidad:** 🔴 CRÍTICA  
**CVE Relacionado:** CWE-307

**Problema:**  
No hay límites en intentos de login/registro, permitiendo ataques de fuerza bruta.

**Impacto:**
- Descifrado de contraseñas por fuerza bruta
- Ataques de denegación de servicio (DoS)
- Spam de registros

**Solución:**
```php
// Implementar rate limiting con Redis o archivo
function check_rate_limit($identifier, $max_attempts = 5, $window = 300) {
    $cache_file = sys_get_temp_dir() . '/rate_limit_' . md5($identifier);
    
    if (file_exists($cache_file)) {
        $data = json_decode(file_get_contents($cache_file), true);
        
        if (time() - $data['timestamp'] < $window) {
            if ($data['attempts'] >= $max_attempts) {
                http_response_code(429);
                die(json_encode([
                    'error' => 'Demasiados intentos. Intenta en ' . 
                              ($window - (time() - $data['timestamp'])) . ' segundos'
                ]));
            }
            $data['attempts']++;
        } else {
            $data = ['attempts' => 1, 'timestamp' => time()];
        }
    } else {
        $data = ['attempts' => 1, 'timestamp' => time()];
    }
    
    file_put_contents($cache_file, json_encode($data));
}

// En login.php
$ip = $_SERVER['REMOTE_ADDR'];
check_rate_limit("login_$ip", 5, 300); // 5 intentos en 5 minutos
```

---

## 🟠 VULNERABILIDADES ALTAS

### 4. Sesiones No Seguras - ALTA
**Archivos:** Todos los archivos con `session_start()`  
**Severidad:** 🟠 ALTA  
**CVE Relacionado:** CWE-614

**Problema:**  
No hay configuración segura de cookies de sesión.

**Solución:**
```php
// Crear archivo api/session_config.php
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', 1); // Solo HTTPS
ini_set('session.cookie_samesite', 'Strict');
ini_set('session.use_strict_mode', 1);
ini_set('session.cookie_lifetime', 3600); // 1 hora

session_name('CARBASS_SESSION');
session_start();

// Regenerar ID de sesión periódicamente
if (!isset($_SESSION['last_regeneration'])) {
    $_SESSION['last_regeneration'] = time();
} elseif (time() - $_SESSION['last_regeneration'] > 300) { // 5 minutos
    session_regenerate_id(true);
    $_SESSION['last_regeneration'] = time();
}
```

---

### 5. Subida de Archivos Sin Validación Completa - ALTA
**Archivo:** upload_image.php (líneas 1-50)  
**Severidad:** 🟠 ALTA  
**CVE Relacionado:** CWE-434

**Código vulnerable:**
```php
// Valida MIME type pero no valida contenido real
$allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
$fileType = finfo_file($finfo, $file['tmp_name']);

if (!in_array($fileType, $allowedTypes)) {
    die(json_encode(['error' => 'Tipo de archivo no permitido']));
}
```

**Problemas:**
- MIME type puede ser falsificado
- No valida contenido de imagen
- No restringe extensiones de archivo
- Directorio accesible directamente

**Solución mejorada:**
```php
// Validación estricta de imágenes
function validar_imagen_segura($file) {
    // 1. Verificar MIME type
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $fileType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    if (!in_array($fileType, $allowedTypes)) {
        return false;
    }
    
    // 2. Verificar extensión
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $allowedExts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    
    if (!in_array($ext, $allowedExts)) {
        return false;
    }
    
    // 3. Validar que sea una imagen real con getimagesize
    $imageInfo = @getimagesize($file['tmp_name']);
    if ($imageInfo === false) {
        return false;
    }
    
    // 4. Re-encodear la imagen para eliminar metadatos maliciosos
    switch ($imageInfo[2]) {
        case IMAGETYPE_JPEG:
            $img = imagecreatefromjpeg($file['tmp_name']);
            break;
        case IMAGETYPE_PNG:
            $img = imagecreatefrompng($file['tmp_name']);
            break;
        case IMAGETYPE_GIF:
            $img = imagecreatefromgif($file['tmp_name']);
            break;
        default:
            return false;
    }
    
    if (!$img) {
        return false;
    }
    
    // 5. Guardar imagen re-procesada
    return $img;
}

// Uso
$img = validar_imagen_segura($_FILES['imagen']);
if (!$img) {
    http_response_code(400);
    die(json_encode(['error' => 'Imagen inválida o corrupta']));
}

// Generar nombre seguro
$filename = bin2hex(random_bytes(16)) . '.jpg';
$targetPath = $uploadDir . $filename;

// Guardar imagen limpia
imagejpeg($img, $targetPath, 85);
imagedestroy($img);

// Proteger directorio con .htaccess
// sours/img/articulos/.htaccess:
// <FilesMatch "\.(php|phtml|php3|php4|php5|php7|phps|cgi)$">
//   deny from all
// </FilesMatch>
```

---

### 6. Exposición de Información Sensible - ALTA
**Archivo:** db.php  
**Severidad:** 🟠 ALTA

**Código problemático:**
```php
} catch (\PDOException $e) {
    // En producción, NO mostrar detalles del error
    http_response_code(500);
    die(json_encode(['error' => 'Error de conexión a la base de datos']));
}
```

**Problema:**  
El comentario indica que NO se deben mostrar detalles, pero no hay diferenciación entre desarrollo y producción.

**Solución:**
```php
// Archivo api/config.php
define('ENVIRONMENT', getenv('APP_ENV') ?: 'production');
define('DEBUG_MODE', ENVIRONMENT === 'development');

// En db.php
} catch (\PDOException $e) {
    error_log('DB Connection Error: ' . $e->getMessage());
    
    http_response_code(500);
    
    if (DEBUG_MODE) {
        die(json_encode([
            'error' => 'Error de conexión',
            'details' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]));
    } else {
        die(json_encode(['error' => 'Error de conexión a la base de datos']));
    }
}
```

---

### 7. Falta de Validación de Entrada - ALTA
**Archivos:** admin_productos.php, carrito.php, ventas.php  
**Severidad:** 🟠 ALTA

**Código vulnerable:**
```php
// admin_productos.php
$nombre = trim($data['nombre'] ?? '');
$precio = $data['precio'] ?? 0;

if (empty($nombre) || $precio <= 0) {
    // Validación mínima
}
```

**Problemas:**
- No valida longitud máxima de strings
- No valida rangos de números
- No sanitiza HTML
- No valida formato de datos

**Solución:**
```php
function validar_producto($data) {
    $errors = [];
    
    // Nombre
    $nombre = trim($data['nombre'] ?? '');
    if (empty($nombre)) {
        $errors[] = 'El nombre es obligatorio';
    } elseif (strlen($nombre) < 3) {
        $errors[] = 'El nombre debe tener al menos 3 caracteres';
    } elseif (strlen($nombre) > 200) {
        $errors[] = 'El nombre no puede exceder 200 caracteres';
    }
    
    // Descripción
    $descripcion = trim($data['descripcion'] ?? '');
    if (strlen($descripcion) > 1000) {
        $errors[] = 'La descripción no puede exceder 1000 caracteres';
    }
    
    // Precio
    $precio = filter_var($data['precio'] ?? 0, FILTER_VALIDATE_FLOAT);
    if ($precio === false || $precio <= 0) {
        $errors[] = 'El precio debe ser un número mayor a 0';
    } elseif ($precio > 999999.99) {
        $errors[] = 'El precio excede el máximo permitido';
    }
    
    // Stock
    $stock = filter_var($data['stock'] ?? 0, FILTER_VALIDATE_INT);
    if ($stock === false || $stock < 0) {
        $errors[] = 'El stock debe ser un número entero positivo';
    } elseif ($stock > 99999) {
        $errors[] = 'El stock excede el máximo permitido';
    }
    
    // Categoría
    $categoria_id = filter_var($data['categoria_id'] ?? null, FILTER_VALIDATE_INT);
    if ($categoria_id !== null && $categoria_id <= 0) {
        $errors[] = 'Categoría inválida';
    }
    
    if (!empty($errors)) {
        http_response_code(400);
        die(json_encode(['error' => 'Datos inválidos', 'details' => $errors]));
    }
    
    return [
        'nombre' => htmlspecialchars($nombre, ENT_QUOTES, 'UTF-8'),
        'descripcion' => htmlspecialchars($descripcion, ENT_QUOTES, 'UTF-8'),
        'precio' => round($precio, 2),
        'stock' => $stock,
        'categoria_id' => $categoria_id
    ];
}

// Uso
$datosValidados = validar_producto($data);
```

---

### 8. Autorización Débil - ALTA
**Archivos:** productos.php, carrito.php  
**Severidad:** 🟠 ALTA

**Código vulnerable:**
```php
// productos.php - DELETE
if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'admin') {
    http_response_code(403);
    exit;
}

parse_str(file_get_contents('php://input'), $data);
$id = $data['id'] ?? 0;
// NO verifica que el ID sea válido ni que el producto exista
```

**Problema:**  
No verifica que el recurso exista antes de operarlo.

**Solución:**
```php
// Verificar rol
if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['error' => 'Acceso denegado']);
    exit;
}

parse_str(file_get_contents('php://input'), $data);
$id = filter_var($data['id'] ?? 0, FILTER_VALIDATE_INT);

if (!$id) {
    http_response_code(400);
    echo json_encode(['error' => 'ID inválido']);
    exit;
}

// Verificar que el producto existe
$stmt = $pdo->prepare('SELECT id FROM productos WHERE id = ?');
$stmt->execute([$id]);

if (!$stmt->fetch()) {
    http_response_code(404);
    echo json_encode(['error' => 'Producto no encontrado']);
    exit;
}

// Ahora sí eliminar
$stmt = $pdo->prepare('UPDATE productos SET activo = 0 WHERE id = ?');
$stmt->execute([$id]);
```

---

## 🟡 VULNERABILIDADES MEDIAS

### 9. XSS (Cross-Site Scripting) Reflejado - MEDIA
**Archivos:** Varios archivos JS  
**Severidad:** 🟡 MEDIA  
**CVE Relacionado:** CWE-79

**Problema:**  
Al mostrar datos del usuario/productos en JavaScript, no se sanitiza HTML.

**Código potencialmente vulnerable:**
```javascript
// admin.js - Si se muestra nombre de producto
element.innerHTML = producto.nombre; // ❌ VULNERABLE
```

**Solución:**
```javascript
// Función para escapar HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Uso correcto
element.textContent = producto.nombre; // ✓ SEGURO
// o
element.innerHTML = escapeHtml(producto.nombre); // ✓ SEGURO
```

---

### 10. Contraseñas Débiles Permitidas - MEDIA
**Archivo:** register.php  
**Severidad:** 🟡 MEDIA

**Código:**
```php
if (strlen($password) < 6) {
    http_response_code(400);
    echo json_encode(['error' => 'La contraseña debe tener al menos 6 caracteres']);
    exit;
}
```

**Problema:**  
Solo valida longitud, permite contraseñas débiles como "123456" o "aaaaaa".

**Solución:**
```php
function validar_password_fuerte($password) {
    $errors = [];
    
    if (strlen($password) < 8) {
        $errors[] = 'La contraseña debe tener al menos 8 caracteres';
    }
    
    if (!preg_match('/[A-Z]/', $password)) {
        $errors[] = 'Debe contener al menos una mayúscula';
    }
    
    if (!preg_match('/[a-z]/', $password)) {
        $errors[] = 'Debe contener al menos una minúscula';
    }
    
    if (!preg_match('/[0-9]/', $password)) {
        $errors[] = 'Debe contener al menos un número';
    }
    
    // Opcional: símbolos especiales
    if (!preg_match('/[^A-Za-z0-9]/', $password)) {
        $errors[] = 'Debe contener al menos un símbolo especial';
    }
    
    // Verificar contraseñas comunes
    $commonPasswords = [
        '12345678', 'password', 'qwerty123', 'abc123456', 
        'password1', '12345678a', 'Password1'
    ];
    
    if (in_array(strtolower($password), array_map('strtolower', $commonPasswords))) {
        $errors[] = 'Esta contraseña es demasiado común';
    }
    
    return $errors;
}

// Uso en register.php
$passwordErrors = validar_password_fuerte($password);
if (!empty($passwordErrors)) {
    http_response_code(400);
    echo json_encode([
        'error' => 'Contraseña no cumple con los requisitos de seguridad',
        'details' => $passwordErrors
    ]);
    exit;
}
```

---

### 11. Falta de Logs de Auditoría Completos - MEDIA
**Archivo:** logger.php  
**Severidad:** 🟡 MEDIA

**Problema:**  
Aunque existe un sistema de logs, faltan campos importantes para auditoría.

**Mejoras necesarias:**
```php
function registrar_log_seguro(
    $accion,
    $tipo,
    $descripcion,
    $entidad_id = null,
    $datos_antes = null,
    $datos_despues = null,
    $usuario_id = null,
    $usuario_email = null
) {
    global $pdo;
    
    // Información adicional de seguridad
    $ip_address = $_SERVER['REMOTE_ADDR'] ?? 'UNKNOWN';
    $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? 'UNKNOWN';
    $request_uri = $_SERVER['REQUEST_URI'] ?? 'UNKNOWN';
    $request_method = $_SERVER['REQUEST_METHOD'] ?? 'UNKNOWN';
    
    // Hash de integridad para evitar manipulación de logs
    $integrity_hash = hash('sha256', json_encode([
        $accion, $tipo, $descripcion, time(), $ip_address
    ]));
    
    $stmt = $pdo->prepare('
        INSERT INTO logs (
            accion, tipo, descripcion, entidad_id, 
            datos_antes, datos_despues, usuario_id, usuario_email,
            ip_address, user_agent, request_uri, request_method,
            integrity_hash
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ');
    
    $stmt->execute([
        $accion, $tipo, $descripcion, $entidad_id,
        json_encode($datos_antes), json_encode($datos_despues),
        $usuario_id, $usuario_email,
        $ip_address, $user_agent, $request_uri, $request_method,
        $integrity_hash
    ]);
}
```

---

### 12. Sin Protección de Enumeración de Usuarios - MEDIA
**Archivo:** login.php  
**Severidad:** 🟡 MEDIA

**Código vulnerable:**
```php
if (!$user) {
    echo json_encode(['error' => 'Credenciales inválidas']); // ✓ Correcto
    exit;
}

if (!password_verify($password, $user['password'])) {
    echo json_encode(['error' => 'Credenciales inválidas']); // ✓ Correcto
    exit;
}
```

**Problema:**  
Aunque el mensaje es genérico, el tiempo de respuesta puede revelar si un usuario existe (timing attack).

**Solución:**
```php
$user = $stmt->fetch();

// Siempre verificar password aunque no exista usuario
$dummy_hash = '$2y$10$dummyhashxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
$hash_to_verify = $user ? $user['password'] : $dummy_hash;

// Esto toma tiempo constante
if (!password_verify($password, $hash_to_verify) || !$user) {
    // Esperar tiempo aleatorio adicional (0-200ms)
    usleep(rand(0, 200000));
    
    registrar_log('LOGIN_FAILED', 'AUTH', "Intento fallido para: $email");
    
    http_response_code(401);
    echo json_encode(['error' => 'Credenciales inválidas']);
    exit;
}
```

---

## 🟢 VULNERABILIDADES BAJAS

### 13. Headers de Seguridad Faltantes - BAJA
**Archivos:** Todos  
**Severidad:** 🟢 BAJA

**Solución:**  
Agregar en `.htaccess` o en cada archivo PHP:

```php
// security_headers.php
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');
header("Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;");
header('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload');
```

---

### 14. Código de Depuración en Producción - BAJA
**Archivos:** Varios  
**Severidad:** 🟢 BAJA

**Código encontrado:**
```javascript
console.log(...); // En varios archivos JS
```

**Solución:**  
Usar sistema de build que elimine console.log en producción.

---

## 📊 RESUMEN DE RECOMENDACIONES PRIORITARIAS

### 🔥 URGENTE (Implementar de inmediato)

1. **Implementar CSRF Tokens** en todos los endpoints que modifican datos
2. **Corregir configuración CORS** - Whitelist específico de dominios
3. **Agregar Rate Limiting** en login/register
4. **Configurar sesiones seguras** con cookies HttpOnly, Secure, SameSite

### ⚡ ALTA PRIORIDAD (Esta semana)

5. **Mejorar validación de subida de archivos**
6. **Implementar validación estricta de entradas**
7. **Agregar verificaciones de autorización** antes de operaciones
8. **Configurar entorno de producción** vs desarrollo

### 📋 MEDIA PRIORIDAD (Este mes)

9. **Sanitizar salidas** para prevenir XSS
10. **Política de contraseñas fuertes**
11. **Mejorar sistema de logs** con información de auditoría
12. **Protección contra timing attacks**

### ✓ MANTENIMIENTO (Cuando sea posible)

13. **Headers de seguridad HTTP**
14. **Eliminar código de depuración**

---

## 🛠️ SCRIPT DE IMPLEMENTACIÓN RÁPIDA

Crear archivo `api/security_middleware.php`:

```php
<?php
/**
 * Middleware de seguridad centralizado
 */

// 1. Configuración de sesiones seguras
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', 1);
ini_set('session.cookie_samesite', 'Strict');
ini_set('session.use_strict_mode', 1);
session_name('CARBASS_SESSION');

// 2. Headers de seguridad
function set_security_headers() {
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('X-XSS-Protection: 1; mode=block');
    header('Referrer-Policy: strict-origin-when-cross-origin');
}

// 3. CORS seguro
function set_cors_headers() {
    $allowed_origins = [
        'https://carbassdeportes.com',
        'http://localhost' // Solo para desarrollo
    ];
    
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token');
    }
}

// 4. CSRF Token
function generar_csrf_token() {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function verificar_csrf($token) {
    if (!isset($_SESSION['csrf_token']) || $token !== $_SESSION['csrf_token']) {
        http_response_code(403);
        die(json_encode(['error' => 'Token CSRF inválido']));
    }
}

// 5. Rate Limiting
function check_rate_limit($identifier, $max_attempts = 10, $window = 60) {
    $cache_dir = sys_get_temp_dir() . '/rate_limits/';
    
    if (!is_dir($cache_dir)) {
        mkdir($cache_dir, 0700, true);
    }
    
    $cache_file = $cache_dir . md5($identifier);
    
    if (file_exists($cache_file)) {
        $data = json_decode(file_get_contents($cache_file), true);
        
        if (time() - $data['timestamp'] < $window) {
            if ($data['attempts'] >= $max_attempts) {
                $wait_time = $window - (time() - $data['timestamp']);
                http_response_code(429);
                die(json_encode([
                    'error' => 'Demasiados intentos',
                    'retry_after' => $wait_time
                ]));
            }
            $data['attempts']++;
        } else {
            $data = ['attempts' => 1, 'timestamp' => time()];
        }
    } else {
        $data = ['attempts' => 1, 'timestamp' => time()];
    }
    
    file_put_contents($cache_file, json_encode($data));
}

// Aplicar headers en cada request
set_security_headers();
set_cors_headers();

// Manejar OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
```

**Uso en cada endpoint:**
```php
<?php
require_once 'security_middleware.php';
require_once 'db.php';

session_start();

// Para operaciones que modifican datos
if (in_array($_SERVER['REQUEST_METHOD'], ['POST', 'PUT', 'DELETE'])) {
    $data = json_decode(file_get_contents('php://input'), true);
    verificar_csrf($data['csrf_token'] ?? '');
}

// Rate limiting en login
if (basename(__FILE__) === 'login.php') {
    $ip = $_SERVER['REMOTE_ADDR'];
    check_rate_limit("login_$ip", 5, 300);
}

// ... resto del código
```

---

## 📝 CHECKLIST DE VERIFICACIÓN POST-IMPLEMENTACIÓN

- [ ] CSRF tokens implementados y funcionando
- [ ] CORS configurado con whitelist
- [ ] Rate limiting activo en login/register
- [ ] Sesiones con cookies seguras (HttpOnly, Secure, SameSite)
- [ ] Validación de subida de archivos mejorada
- [ ] Validación de entradas en todos los endpoints
- [ ] Headers de seguridad HTTP configurados
- [ ] Sistema de logs mejorado con IP y User-Agent
- [ ] Política de contraseñas fuertes implementada
- [ ] Código de depuración eliminado
- [ ] Variables de entorno para producción vs desarrollo
- [ ] Pruebas de penetración realizadas

---

## 🔗 REFERENCIAS Y RECURSOS

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [PHP Security Guide](https://www.php.net/manual/es/security.php)
- [OWASP CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [Content Security Policy](https://developer.mozilla.org/es/docs/Web/HTTP/CSP)

---

**Nota Final:** Esta auditoría debe complementarse con pruebas de penetración profesionales antes del despliegue en producción. Se recomienda implementar las correcciones en orden de prioridad y realizar testing exhaustivo después de cada cambio.
