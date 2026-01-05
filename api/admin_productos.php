<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'db.php';

session_start();

// Verificar que el usuario sea administrador
if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['error' => 'Acceso denegado. Se requieren permisos de administrador.']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

try {
    // CREATE - Crear nuevo producto
    if ($method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $nombre = trim($data['nombre'] ?? '');
        $descripcion = trim($data['descripcion'] ?? '');
        $precio = $data['precio'] ?? 0;
        $imagen_url = trim($data['imagen_url'] ?? '');
        $categoria_id = $data['categoria_id'] ?? null;
        $estado = trim($data['estado'] ?? 'normal');
        $stock = isset($data['stock']) ? (int)$data['stock'] : 1;
        
        // Validaciones
        if (empty($nombre) || $precio <= 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Nombre y precio son obligatorios']);
            exit;
        }
        
        $stmt = $pdo->prepare('
            INSERT INTO productos 
            (nombre, descripcion, precio, imagen_url, categoria_id, estado, stock) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ');
        
        $stmt->execute([
            $nombre, 
            $descripcion, 
            $precio, 
            $imagen_url, 
            $categoria_id, 
            $estado, 
            $stock
        ]);
        
        $id = $pdo->lastInsertId();
        
        echo json_encode([
            'success' => true,
            'message' => 'Producto creado exitosamente',
            'id' => $id
        ]);
    }
    
    // UPDATE - Actualizar producto existente
    elseif ($method === 'PUT') {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $id = $data['id'] ?? null;
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'ID de producto es requerido']);
            exit;
        }
        
        // Si es solo para devolver stock
        if (isset($data['devolver_stock'])) {
            $cantidad = (int)$data['devolver_stock'];
            $stmt = $pdo->prepare('UPDATE productos SET stock = stock + ? WHERE id = ?');
            $stmt->execute([$cantidad, $id]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Stock actualizado'
            ]);
            exit;
        }
        
        $nombre = trim($data['nombre'] ?? '');
        $descripcion = trim($data['descripcion'] ?? '');
        $precio = $data['precio'] ?? 0;
        $imagen_url = trim($data['imagen_url'] ?? '');
        $categoria_id = $data['categoria_id'] ?? null;
        $estado = trim($data['estado'] ?? 'normal');
        $stock = isset($data['stock']) ? (int)$data['stock'] : 1;
        
        // Validaciones
        if (empty($nombre) || $precio <= 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Nombre y precio son obligatorios']);
            exit;
        }
        
        $stmt = $pdo->prepare('
            UPDATE productos 
            SET nombre = ?, descripcion = ?, precio = ?, imagen_url = ?, 
                categoria_id = ?, estado = ?, stock = ?
            WHERE id = ?
        ');
        
        $stmt->execute([
            $nombre, 
            $descripcion, 
            $precio, 
            $imagen_url, 
            $categoria_id, 
            $estado, 
            $stock,
            $id
        ]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Producto actualizado exitosamente'
        ]);
    }
    
    // DELETE - Eliminar producto
    elseif ($method === 'DELETE') {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $id = $data['id'] ?? $_GET['id'] ?? null;
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'ID de producto es requerido']);
            exit;
        }
        
        $stmt = $pdo->prepare('DELETE FROM productos WHERE id = ?');
        $stmt->execute([$id]);
        
        if ($stmt->rowCount() > 0) {
            echo json_encode([
                'success' => true,
                'message' => 'Producto eliminado exitosamente'
            ]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Producto no encontrado']);
        }
    }
    
    else {
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
    }
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error en la base de datos']);
}
