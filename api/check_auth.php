<?php
require_once 'security_middleware.php';

header('Content-Type: application/json');

session_start();

// Regenerar sesión si es necesario
regenerar_sesion_si_necesario();

if (isset($_SESSION['user_id'])) {
    // Usuario está autenticado
    // Generar token CSRF si no existe
    $csrf_token = generar_csrf_token();
    
    echo json_encode([
        'logged_in' => true,
        'user' => [
            'id' => $_SESSION['user_id'],
            'email' => $_SESSION['email'],
            'nombre' => $_SESSION['nombre'] ?? '',
            'rol' => $_SESSION['rol']
        ],
        'csrf_token' => $csrf_token
    ]);
} else {
    // Usuario no está autenticado
    // Generar token CSRF de todas formas para forms públicos
    $csrf_token = generar_csrf_token();
    
    echo json_encode([
        'logged_in' => false,
        'csrf_token' => $csrf_token
    ]);
}
