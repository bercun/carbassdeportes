<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

try {
    // Obtener datos del cuerpo de la solicitud
    $data = json_decode(file_get_contents('php://input'), true);
    
    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';
    
    // Validaciones
    if (empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(['error' => 'Email y contraseña son obligatorios']);
        exit;
    }
    
    // Buscar usuario por email
    $stmt = $pdo->prepare('SELECT id, email, password, nombre, rol FROM usuarios WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    if (!$user) {
        http_response_code(401);
        echo json_encode(['error' => 'Credenciales inválidas']);
        exit;
    }
    
    // Verificar contraseña
    if (!password_verify($password, $user['password'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Credenciales inválidas']);
        exit;
    }
    
    // Iniciar sesión
    session_start();
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['email'] = $user['email'];
    $_SESSION['nombre'] = $user['nombre'];
    $_SESSION['rol'] = $user['rol'];
    
    // Devolver datos del usuario (sin password)
    echo json_encode([
        'success' => true,
        'message' => 'Login exitoso',
        'user' => [
            'id' => $user['id'],
            'email' => $user['email'],
            'nombre' => $user['nombre'],
            'rol' => $user['rol']
        ]
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error en el servidor']);
}
