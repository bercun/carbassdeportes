<?php
/**
 * Helpers para protección CSRF (Cross-Site Request Forgery)
 * El token se almacena en la sesión PHP y se valida en cada mutación.
 */

function generate_csrf_token(): string {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function validate_csrf_token(?string $token): bool {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    if (empty($_SESSION['csrf_token']) || empty($token)) {
        return false;
    }
    return hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * Aborta con 403 si el token CSRF del header X-CSRF-Token no es válido.
 * Llamar después de session_start() y solo para métodos mutantes (POST/PUT/DELETE).
 */
function require_csrf_token(): void {
    $token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if (!validate_csrf_token($token)) {
        http_response_code(403);
        echo json_encode(['error' => 'Token CSRF inválido o ausente']);
        exit;
    }
}
?>
