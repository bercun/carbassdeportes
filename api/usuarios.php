<?php
session_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'db.php';
require_once 'logger.php';

// Verificar que el usuario sea administrador
if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['error' => 'Acceso denegado. Solo administradores.']);
    exit;
}

// GET: Obtener todos los usuarios
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $sql = 'SELECT id, email, nombre, rol, fecha_registro FROM usuarios ORDER BY fecha_registro DESC';
        $stmt = $pdo->query($sql);
        $usuarios = $stmt->fetchAll();
        
        echo json_encode($usuarios);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al obtener usuarios']);
    }
}

// PUT: Actualizar rol de usuario
elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['id']) || !isset($data['rol'])) {
        http_response_code(400);
        echo json_encode(['error' => 'ID y rol son requeridos']);
        exit;
    }
    
    // Validar que el rol sea válido
    if (!in_array($data['rol'], ['user', 'admin'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Rol inválido']);
        exit;
    }
    
    try {
        // Obtener datos anteriores del usuario
        $stmt = $pdo->prepare('SELECT email, nombre, rol FROM usuarios WHERE id = ?');
        $stmt->execute([$data['id']]);
        $usuario = $stmt->fetch();
        $rol_anterior = $usuario['rol'];
        
        $sql = 'UPDATE usuarios SET rol = ? WHERE id = ?';
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$data['rol'], $data['id']]);
        
        // Registrar log
        registrar_log(
            'ROL_CAMBIADO',
            'USUARIOS',
            "Rol de {$usuario['nombre']} ({$usuario['email']}) cambiado de {$rol_anterior} a {$data['rol']}",
            $data['id'],
            ['rol' => $rol_anterior],
            ['rol' => $data['rol']]
        );
        
        echo json_encode(['success' => true, 'mensaje' => 'Rol actualizado']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al actualizar rol']);
    }
}

// DELETE: Eliminar usuario
elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str(file_get_contents('php://input'), $data);
    
    if (!isset($data['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'ID de usuario requerido']);
        exit;
    }
    
    // Prevenir que el admin se elimine a sí mismo
    if ($data['id'] == $_SESSION['user_id']) {
        http_response_code(400);
        echo json_encode(['error' => 'No puedes eliminar tu propia cuenta']);
        exit;
    }
    
    try {
        // Obtener datos del usuario antes de eliminar
        $stmt = $pdo->prepare('SELECT email, nombre, rol FROM usuarios WHERE id = ?');
        $stmt->execute([$data['id']]);
        $usuario = $stmt->fetch();
        
        $stmt = $pdo->prepare('DELETE FROM usuarios WHERE id = ?');
        $stmt->execute([$data['id']]);
        
        // Registrar log
        registrar_log(
            'USUARIO_ELIMINADO',
            'USUARIOS',
            "Usuario eliminado: {$usuario['nombre']} ({$usuario['email']}) - Rol: {$usuario['rol']}",
            $data['id'],
            [
                'nombre' => $usuario['nombre'],
                'email' => $usuario['email'],
                'rol' => $usuario['rol']
            ],
            null
        );
        
        echo json_encode(['success' => true, 'mensaje' => 'Usuario eliminado']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al eliminar usuario']);
    }
}

else {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
}
?>
