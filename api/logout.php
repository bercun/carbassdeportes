<?php
require_once 'security_middleware.php';
require_once 'logger.php';

header('Content-Type: application/json');

session_start();

// Guardar datos del usuario antes de destruir la sesión
$user_id = $_SESSION['user_id'] ?? null;
$user_email = $_SESSION['email'] ?? null;

// Registrar logout
if ($user_id) {
    registrar_log(
        'LOGOUT',
        'AUTH',
        "Cierre de sesión de $user_email",
        $user_id,
        null,
        null,
        $user_id,
        $user_email
    );
}

// Destruir todas las variables de sesión
$_SESSION = array();

// Si se usa una cookie de sesión, eliminarla también
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params["path"],
        $params["domain"],
        $params["secure"],
        $params["httponly"]
    );
}

// Destruir la sesión
session_destroy();

echo json_encode([
    'success' => true,
    'message' => 'Sesión cerrada exitosamente'
]);
