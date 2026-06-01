<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');

session_start();
require_once 'csrf.php';

if (isset($_SESSION['user_id'])) {
    // Usuario está autenticado
    echo json_encode([
        'logged_in' => true,
        'csrf_token' => generate_csrf_token(),
        'user' => [
            'id' => $_SESSION['user_id'],
            'email' => $_SESSION['email'],
            'nombre' => $_SESSION['nombre'] ?? '',
            'rol' => $_SESSION['rol']
        ]
    ]);
} else {
    // Usuario no está autenticado - devolver token igualmente para el flujo de login
    echo json_encode([
        'logged_in' => false,
        'csrf_token' => generate_csrf_token()
    ]);
}
