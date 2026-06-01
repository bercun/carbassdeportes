<?php
require_once 'security_middleware.php';
require_once 'db.php';
require_once 'logger.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

session_start();

try {
    // Obtener datos del cuerpo de la solicitud
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Verificar token CSRF
    verificar_csrf($data['csrf_token'] ?? '');
    
    // Rate limiting por IP
    $ip = $_SERVER['REMOTE_ADDR'];
    check_rate_limit("register_$ip", 3, 300); // 3 registros en 5 minutos
    
    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';
    $nombre = trim($data['nombre'] ?? '');
    
    // Validaciones
    if (empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(['error' => 'Email y contraseña son obligatorios']);
        exit;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Email inválido']);
        exit;
    }
    
    if (strlen($password) < 6) {
        http_response_code(400);
        echo json_encode(['error' => 'La contraseña debe tener al menos 6 caracteres']);
        exit;
    }
    
    // Verificar si el email ya existe
    $stmt = $pdo->prepare('SELECT id FROM usuarios WHERE email = ?');
    $stmt->execute([$email]);
    
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(['error' => 'El email ya está registrado']);
        exit;
    }
    
    // Hashear la contraseña
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    // Insertar nuevo usuario
    $stmt = $pdo->prepare('
        INSERT INTO usuarios (email, password, nombre, rol) 
        VALUES (?, ?, ?, ?)
    ');
    
    $stmt->execute([$email, $hashedPassword, $nombre, 'user']);
    
    $userId = $pdo->lastInsertId();
    
    // Iniciar sesión automáticamente
    $_SESSION['user_id'] = $userId;
    $_SESSION['email'] = $email;
    $_SESSION['nombre'] = $nombre;
    $_SESSION['rol'] = 'user';
    
    // Regenerar token CSRF después de registro exitoso
    $new_csrf_token = regenerar_csrf_token();
    
    // Registrar log
    registrar_log(
        'USUARIO_CREADO',
        'USUARIOS',
        "Nuevo usuario registrado: $nombre ($email)",
        $userId,
        null,
        ['email' => $email, 'nombre' => $nombre, 'rol' => 'user'],
        $userId,
        $email
    );
    
    echo json_encode([
        'success' => true,
        'message' => 'Usuario registrado exitosamente',
        'user' => [
            'id' => $userId,
            'email' => $email,
            'nombre' => $nombre,
            'rol' => 'user'
        ],
        'csrf_token' => $new_csrf_token
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al registrar usuario']);
}
