<?php
// Evitar cualquier salida antes de los headers
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Limpiar cualquier salida previa
ob_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Limpiar buffer de salida
ob_clean();

try {
    require_once 'db.php';
    
    if (!isset($pdo)) {
        throw new Exception('Conexión a base de datos no disponible');
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error de conexión a la base de datos',
        'details' => $e->getMessage()
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';
    $nombre = trim($data['nombre'] ?? '');
    
    // Validaciones
    if (empty($email) || empty($password) || empty($nombre)) {
        http_response_code(400);
        echo json_encode(['error' => 'Todos los campos son obligatorios']);
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
    
    // Insertar nuevo usuario ADMINISTRADOR
    $stmt = $pdo->prepare('
        INSERT INTO usuarios (email, password, nombre, rol) 
        VALUES (?, ?, ?, ?)
    ');
    
    $stmt->execute([$email, $hashedPassword, $nombre, 'admin']);
    
    $userId = $pdo->lastInsertId();
    
    echo json_encode([
        'success' => true,
        'message' => 'Administrador creado exitosamente',
        'user' => [
            'id' => $userId,
            'email' => $email,
            'nombre' => $nombre,
            'rol' => 'admin'
        ]
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error al crear administrador',
        'details' => $e->getMessage()
    ]);
}
