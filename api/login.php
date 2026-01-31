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
    check_rate_limit("login_$ip", 5, 300); // 5 intentos en 5 minutos
    
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
        // Registrar intento fallido
        registrar_log(
            'LOGIN_FAILED',
            'AUTH',
            "Intento de login fallido para el email: $email",
            null,
            null,
            null,
            null,
            $email
        );
        
        http_response_code(401);
        echo json_encode(['error' => 'Credenciales inválidas']);
        exit;
    }
    
    // Verificar contraseña
    if (!password_verify($password, $user['password'])) {
        // Registrar intento fallido
        registrar_log(
            'LOGIN_FAILED',
            'AUTH',
            "Contraseña incorrecta para el usuario: {$user['email']}",
            $user['id'],
            null,
            null,
            $user['id'],
            $user['email']
        );
        
        http_response_code(401);
        echo json_encode(['error' => 'Credenciales inválidas']);
        exit;
    }
    
    // Iniciar sesión
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['email'] = $user['email'];
    $_SESSION['nombre'] = $user['nombre'];
    $_SESSION['rol'] = $user['rol'];
    
    // Regenerar token CSRF después de login exitoso
    $new_csrf_token = regenerar_csrf_token();
    
    // Limpiar rate limiting para este IP
    limpiar_rate_limit("login_$ip");
    
    // Registrar login exitoso
    registrar_log(
        'LOGIN',
        'AUTH',
        "Inicio de sesión exitoso de {$user['nombre']} ({$user['email']})",
        $user['id'],
        null,
        null,
        $user['id'],
        $user['email']
    );
    
    // Devolver datos del usuario (sin password)
    echo json_encode([
        'success' => true,
        'message' => 'Login exitoso',
        'user' => [
            'id' => $user['id'],
            'email' => $user['email'],
            'nombre' => $user['nombre'],
            'rol' => $user['rol']
        ],
        'csrf_token' => $new_csrf_token
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error en el servidor']);
}
