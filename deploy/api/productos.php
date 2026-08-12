<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Permitir CORS

require_once 'db.php';

// GET: Obtener todos los productos o uno específico
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    
    // Si se solicita un producto específico por ID
    if (isset($_GET['id'])) {
        $id = (int)$_GET['id'];
        
        $stmt = $pdo->prepare('SELECT * FROM productos WHERE id = ?');
        $stmt->execute([$id]);
        $producto = $stmt->fetch();
        
        if ($producto) {
            echo json_encode($producto);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Producto no encontrado']);
        }
        
    } else {
        // Obtener todos los productos
        $sql = 'SELECT p.*, c.nombre as categoria_nombre 
                FROM productos p 
                LEFT JOIN categorias c ON p.categoria_id = c.id 
                ORDER BY p.fecha_creacion DESC';
        
        $stmt = $pdo->query($sql);
        $productos = $stmt->fetchAll();
        
        echo json_encode($productos);
    }
}

// POST: Crear nuevo producto (solo admin)
elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    session_start();
    
    // Verificar que el usuario sea admin
    if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Acceso denegado']);
        exit;
    }
    
    // Recibir datos JSON
    $data = json_decode(file_get_contents('php://input'), true);
    
    $nombre = $data['nombre'] ?? '';
    $descripcion = $data['descripcion'] ?? '';
    $precio = $data['precio'] ?? 0;
    $imagen_url = $data['imagen_url'] ?? '';
    $categoria_id = $data['categoria_id'] ?? null;
    $destacado = isset($data['destacado']) ? (int)$data['destacado'] : 0;
    $stock = $data['stock'] ?? 0;
    
    // Validaciones básicas
    if (empty($nombre) || $precio <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Datos inválidos']);
        exit;
    }
    
    // Insertar en la base de datos
    $sql = 'INSERT INTO productos (nombre, descripcion, precio, imagen_url, categoria_id, destacado, stock) 
            VALUES (?, ?, ?, ?, ?, ?, ?)';
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$nombre, $descripcion, $precio, $imagen_url, $categoria_id, $destacado, $stock]);
    
    echo json_encode([
        'success' => true,
        'id' => $pdo->lastInsertId(),
        'mensaje' => 'Producto creado exitosamente'
    ]);
}

// PUT: Actualizar producto existente (solo admin)
elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    session_start();
    
    if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Acceso denegado']);
        exit;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? 0;
    
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'ID de producto requerido']);
        exit;
    }
    
    $sql = 'UPDATE productos SET 
            nombre = ?, 
            descripcion = ?, 
            precio = ?, 
            imagen_url = ?, 
            categoria_id = ?, 
            destacado = ?, 
            stock = ? 
            WHERE id = ?';
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $data['nombre'],
        $data['descripcion'],
        $data['precio'],
        $data['imagen_url'],
        $data['categoria_id'],
        $data['destacado'],
        $data['stock'],
        $id
    ]);
    
    echo json_encode(['success' => true, 'mensaje' => 'Producto actualizado']);
}

// DELETE: Eliminar producto (solo admin)
elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    session_start();
    
    if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Acceso denegado']);
        exit;
    }
    
    parse_str(file_get_contents('php://input'), $data);
    $id = $data['id'] ?? 0;
    
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'ID de producto requerido']);
        exit;
    }
    
    $stmt = $pdo->prepare('DELETE FROM productos WHERE id = ?');
    $stmt->execute([$id]);
    
    echo json_encode(['success' => true, 'mensaje' => 'Producto eliminado']);
}

else {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
}
?>
