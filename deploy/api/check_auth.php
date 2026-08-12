<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');

session_start();

if (isset($_SESSION['user_id'])) {
    // Usuario está autenticado
    echo json_encode([
        'logged_in' => true,
        'user' => [
            'id' => $_SESSION['user_id'],
            'email' => $_SESSION['email'],
            'nombre' => $_SESSION['nombre'] ?? '',
            'rol' => $_SESSION['rol']
        ]
    ]);
} else {
    // Usuario no está autenticado
    echo json_encode([
        'logged_in' => false
    ]);
}
