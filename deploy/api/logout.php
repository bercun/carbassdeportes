<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');

require_once 'logger.php';

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

// Destruir la sesión
session_destroy();

echo json_encode([
    'success' => true,
    'message' => 'Sesión cerrada exitosamente'
]);
