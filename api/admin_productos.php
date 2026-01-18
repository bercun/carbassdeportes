<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'db.php';
require_once 'logger.php';

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
        
        // Registrar log
        registrar_log(
            'PRODUCTO_CREADO',
            'PRODUCTOS',
            "Producto creado: $nombre",
            $id,
            null,
            [
                'nombre' => $nombre,
                'precio' => $precio,
                'stock' => $stock,
                'categoria_id' => $categoria_id
            ]
        );
        
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
        
        // Registrar log
        registrar_log(
            'PRODUCTO_ACTUALIZADO',
            'PRODUCTOS',
            "Producto actualizado: $nombre (ID: $id)",
            $id,
            null,
            [
                'nombre' => $nombre,
                'precio' => $precio,
                'stock' => $stock,
                'estado' => $estado
            ]
        );
        
        echo json_encode([
            'success' => true,
            'message' => 'Producto actualizado exitosamente'
        ]);
    }
    
    // DELETE - Soft Delete (marcar como inactivo)
    elseif ($method === 'DELETE') {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $id = $data['id'] ?? $_GET['id'] ?? null;
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'ID de producto es requerido']);
            exit;
        }
        
        // Obtener datos del producto antes de marcar como inactivo
        $stmt = $pdo->prepare('SELECT nombre FROM productos WHERE id = ?');
        $stmt->execute([$id]);
        $producto = $stmt->fetch();
        
        if (!$producto) {
            http_response_code(404);
            echo json_encode(['error' => 'Producto no encontrado']);
            exit;
        }
        
        // Verificar si la columna 'activo' existe, si no, crearla
        try {
            $pdo->exec('ALTER TABLE productos ADD COLUMN IF NOT EXISTS activo TINYINT(1) DEFAULT 1');
        } catch (PDOException $e) {
            // La columna ya existe o hay otro error, continuar
        }
        
        // Marcar como inactivo en lugar de eliminar
        $stmt = $pdo->prepare('UPDATE productos SET activo = 0 WHERE id = ?');
        $stmt->execute([$id]);
        
        if ($stmt->rowCount() > 0) {
            // Registrar log
            registrar_log(
                'PRODUCTO_DESACTIVADO',
                'PRODUCTOS',
                "Producto desactivado: {$producto['nombre']} (ID: $id)",
                $id,
                ['nombre' => $producto['nombre']],
                null
            );
            
            echo json_encode([
                'success' => true,
                'message' => 'Producto eliminado exitosamente'
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Error al eliminar el producto']);
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
