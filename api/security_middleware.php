<?php
/**
 * Middleware de seguridad centralizado
 * Incluye protección CSRF, configuración de sesiones seguras, CORS y rate limiting
 */

// ============================
// 1. CONFIGURACIÓN DE SESIONES SEGURAS
// ============================
ini_set('session.cookie_httponly', 1);  // Previene acceso desde JavaScript
ini_set('session.cookie_secure', 1);    // Solo transmite por HTTPS (cambiar a 0 en desarrollo HTTP)
ini_set('session.cookie_samesite', 'Strict'); // Protección CSRF adicional
ini_set('session.use_strict_mode', 1);  // Rechaza IDs de sesión no inicializados
ini_set('session.cookie_lifetime', 3600); // Expira en 1 hora

session_name('CARBASS_SESSION');

// ============================
// 2. HEADERS DE SEGURIDAD HTTP
// ============================
function set_security_headers() {
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('X-XSS-Protection: 1; mode=block');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    // Nota: Content-Security-Policy se puede agregar según necesidades específicas
}

// ============================
// 3. CORS SEGURO
// ============================
function set_cors_headers() {
    $allowed_origins = [
        'http://localhost',
        'http://127.0.0.1',
        'http://localhost:3000',
        'https://carbassdeportes.com',
        'https://www.carbassdeportes.com'
        // Agregar dominios de producción aquí
    ];
    
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    // Permitir origen solo si está en la whitelist
    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token');
    }
}

// ============================
// 4. PROTECCIÓN CSRF (Cross-Site Request Forgery)
// ============================

/**
 * Genera un token CSRF y lo almacena en la sesión
 * @return string Token CSRF
 */
function generar_csrf_token() {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Obtiene el token CSRF actual de la sesión
 * @return string|null Token CSRF o null si no existe
 */
function obtener_csrf_token() {
    return $_SESSION['csrf_token'] ?? null;
}

/**
 * Verifica que el token CSRF proporcionado sea válido
 * Termina la ejecución con error 403 si el token es inválido
 * @param string $token Token a verificar
 */
function verificar_csrf($token) {
    if (!isset($_SESSION['csrf_token']) || empty($token) || $token !== $_SESSION['csrf_token']) {
        http_response_code(403);
        die(json_encode([
            'error' => 'Token CSRF inválido o ausente',
            'message' => 'La solicitud no pudo ser verificada. Por favor, recarga la página.'
        ]));
    }
}

/**
 * Regenera el token CSRF (útil después de operaciones críticas como login)
 * @return string Nuevo token
 */
function regenerar_csrf_token() {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    return $_SESSION['csrf_token'];
}

// ============================
// 5. RATE LIMITING
// ============================

/**
 * Verifica límite de intentos para prevenir ataques de fuerza bruta
 * @param string $identifier Identificador único (ej: IP, email)
 * @param int $max_attempts Número máximo de intentos permitidos
 * @param int $window Ventana de tiempo en segundos
 */
function check_rate_limit($identifier, $max_attempts = 10, $window = 60) {
    $cache_dir = sys_get_temp_dir() . '/carbass_rate_limits/';
    
    // Crear directorio si no existe
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
                    'message' => "Por favor, espera $wait_time segundos antes de intentar nuevamente.",
                    'retry_after' => $wait_time
                ]));
            }
            $data['attempts']++;
        } else {
            // Ventana expirada, reiniciar contador
            $data = ['attempts' => 1, 'timestamp' => time()];
        }
    } else {
        // Primer intento
        $data = ['attempts' => 1, 'timestamp' => time()];
    }
    
    file_put_contents($cache_file, json_encode($data));
}

/**
 * Limpia el rate limit para un identificador (útil después de login exitoso)
 * @param string $identifier Identificador a limpiar
 */
function limpiar_rate_limit($identifier) {
    $cache_dir = sys_get_temp_dir() . '/carbass_rate_limits/';
    $cache_file = $cache_dir . md5($identifier);
    
    if (file_exists($cache_file)) {
        unlink($cache_file);
    }
}

// ============================
// 6. REGENERACIÓN DE SESIÓN
// ============================

/**
 * Regenera el ID de sesión periódicamente para prevenir session fixation
 */
function regenerar_sesion_si_necesario() {
    if (!isset($_SESSION['last_regeneration'])) {
        $_SESSION['last_regeneration'] = time();
    } elseif (time() - $_SESSION['last_regeneration'] > 300) { // 5 minutos
        session_regenerate_id(true);
        $_SESSION['last_regeneration'] = time();
    }
}

// ============================
// APLICAR CONFIGURACIÓN AUTOMÁTICAMENTE
// ============================

// Aplicar headers de seguridad
set_security_headers();
set_cors_headers();

// Manejar peticiones OPTIONS (preflight CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
