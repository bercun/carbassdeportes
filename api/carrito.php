<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'db.php';

session_start();

// Verificar que el usuario esté autenticado
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Usuario no autenticado']);
    exit;
}

$user_id = $_SESSION['user_id'];
$method = $_SERVER['REQUEST_METHOD'];

try {
    // GET - Obtener items del carrito del usuario
    if ($method === 'GET') {
        $stmt = $pdo->prepare('
            SELECT 
                c.id,
                c.producto_id,
                c.cantidad,
                p.nombre,
                p.descripcion,
                p.precio,
                p.imagen_url,
                p.stock,
                p.estado,
                cat.nombre as categoria_nombre,
                (p.precio * c.cantidad) as subtotal
            FROM carrito c
            INNER JOIN productos p ON c.producto_id = p.id
            LEFT JOIN categorias cat ON p.categoria_id = cat.id
            WHERE c.user_id = ?
            ORDER BY c.fecha_agregado DESC
        ');
        
        $stmt->execute([$user_id]);
        $items = $stmt->fetchAll();
        
        $total = 0;
        foreach ($items as $item) {
            $total += $item['subtotal'];
        }
        
        echo json_encode([
            'items' => $items,
            'total' => $total,
            'count' => count($items)
        ]);
    }
    
    // POST - Agregar producto al carrito
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $producto_id = $data['producto_id'] ?? null;
        $cantidad = isset($data['cantidad']) ? (int)$data['cantidad'] : 1;
        
        if (!$producto_id) {
            http_response_code(400);
            echo json_encode(['error' => 'ID de producto es requerido']);
            exit;
        }
        
        // Verificar que el producto existe y tiene stock
        $stmt = $pdo->prepare('SELECT id, nombre, stock FROM productos WHERE id = ?');
        $stmt->execute([$producto_id]);
        $producto = $stmt->fetch();
        
        if (!$producto) {
            http_response_code(404);
            echo json_encode(['error' => 'Producto no encontrado']);
            exit;
        }
        
        if ($producto['stock'] < $cantidad) {
            http_response_code(400);
            echo json_encode([
                'error' => 'Stock insuficiente',
                'stock_disponible' => $producto['stock']
            ]);
            exit;
        }
        
        // Verificar si el producto ya está en el carrito
        $stmt = $pdo->prepare('SELECT id, cantidad FROM carrito WHERE user_id = ? AND producto_id = ?');
        $stmt->execute([$user_id, $producto_id]);
        $carrito_item = $stmt->fetch();
        
        if ($carrito_item) {
            // Actualizar cantidad si ya existe
            $nueva_cantidad = $carrito_item['cantidad'] + $cantidad;
            
            // Calcular cuánto stock se necesita (solo la cantidad adicional)
            // El stock ya contiene lo que está en el carrito anteriormente restado
            if ($producto['stock'] < $cantidad) {
                http_response_code(400);
                echo json_encode([
                    'error' => 'No hay suficiente stock disponible',
                    'stock_disponible' => $producto['stock'],
                    'cantidad_en_carrito' => $carrito_item['cantidad']
                ]);
                exit;
            }
            
            $stmt = $pdo->prepare('UPDATE carrito SET cantidad = ? WHERE id = ?');
            $stmt->execute([$nueva_cantidad, $carrito_item['id']]);
            
            // Restar del stock solo la cantidad adicional
            $stmt = $pdo->prepare('UPDATE productos SET stock = stock - ? WHERE id = ?');
            $stmt->execute([$cantidad, $producto_id]);
            
            $message = 'Cantidad actualizada en el carrito';
        } else {
            // Insertar nuevo item
            $stmt = $pdo->prepare('
                INSERT INTO carrito (user_id, producto_id, cantidad) 
                VALUES (?, ?, ?)
            ');
            $stmt->execute([$user_id, $producto_id, $cantidad]);
            
            // Restar del stock
            $stmt = $pdo->prepare('UPDATE productos SET stock = stock - ? WHERE id = ?');
            $stmt->execute([$cantidad, $producto_id]);
            
            $message = 'Producto agregado al carrito';
        }
        
        // Obtener el nuevo stock del producto
        $stmt = $pdo->prepare('SELECT stock FROM productos WHERE id = ?');
        $stmt->execute([$producto_id]);
        $nuevo_stock = $stmt->fetch()['stock'];
        
        // Obtener conteo total del carrito
        $stmt = $pdo->prepare('SELECT COUNT(*) as count FROM carrito WHERE user_id = ?');
        $stmt->execute([$user_id]);
        $count = $stmt->fetch()['count'];
        
        echo json_encode([
            'success' => true,
            'message' => $message,
            'cart_count' => $count,
            'nuevo_stock' => $nuevo_stock
        ]);
    }
    
    // PUT - Actualizar cantidad de un item
    elseif ($method === 'PUT') {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $carrito_id = $data['id'] ?? null;
        $nueva_cantidad = isset($data['cantidad']) ? (int)$data['cantidad'] : 1;
        
        if (!$carrito_id) {
            http_response_code(400);
            echo json_encode(['error' => 'ID de carrito es requerido']);
            exit;
        }
        
        // Obtener el item actual del carrito
        $stmt = $pdo->prepare('
            SELECT c.id, c.producto_id, c.cantidad as cantidad_actual, p.stock, p.nombre 
            FROM carrito c
            INNER JOIN productos p ON c.producto_id = p.id
            WHERE c.id = ? AND c.user_id = ?
        ');
        $stmt->execute([$carrito_id, $user_id]);
        $item = $stmt->fetch();
        
        if (!$item) {
            http_response_code(404);
            echo json_encode(['error' => 'Item no encontrado']);
            exit;
        }
        
        // Calcular la diferencia de cantidad
        $diferencia = $nueva_cantidad - $item['cantidad_actual'];
        
        if ($nueva_cantidad <= 0) {
            // Si la cantidad es 0 o negativa, eliminar el item y devolver stock
            $stmt = $pdo->prepare('DELETE FROM carrito WHERE id = ?');
            $stmt->execute([$carrito_id]);
            
            // Devolver todo el stock que estaba reservado
            $stmt = $pdo->prepare('UPDATE productos SET stock = stock + ? WHERE id = ?');
            $stmt->execute([$item['cantidad_actual'], $item['producto_id']]);
            
            $message = 'Item eliminado del carrito';
        } elseif ($diferencia > 0) {
            // Aumentar cantidad - verificar si hay stock suficiente
            if ($item['stock'] < $diferencia) {
                http_response_code(400);
                echo json_encode([
                    'error' => 'Stock insuficiente',
                    'stock_disponible' => $item['stock']
                ]);
                exit;
            }
            
            // Actualizar cantidad en carrito
            $stmt = $pdo->prepare('UPDATE carrito SET cantidad = ? WHERE id = ?');
            $stmt->execute([$nueva_cantidad, $carrito_id]);
            
            // Decrementar stock
            $stmt = $pdo->prepare('UPDATE productos SET stock = stock - ? WHERE id = ?');
            $stmt->execute([$diferencia, $item['producto_id']]);
            
            $message = 'Cantidad aumentada';
        } else {
            // Disminuir cantidad - devolver stock
            $cantidad_devolver = abs($diferencia);
            
            // Actualizar cantidad en carrito
            $stmt = $pdo->prepare('UPDATE carrito SET cantidad = ? WHERE id = ?');
            $stmt->execute([$nueva_cantidad, $carrito_id]);
            
            // Incrementar stock
            $stmt = $pdo->prepare('UPDATE productos SET stock = stock + ? WHERE id = ?');
            $stmt->execute([$cantidad_devolver, $item['producto_id']]);
            
            $message = 'Cantidad disminuida';
        }
        
        echo json_encode([
            'success' => true,
            'message' => $message
        ]);
    }
    
    // DELETE - Eliminar item del carrito
    elseif ($method === 'DELETE') {
        $data = json_decode(file_get_contents('php://input'), true);
        $carrito_id = $data['id'] ?? $_GET['id'] ?? null;
        $confirmar_compra = $data['confirmar_compra'] ?? false;
        
        if (!$carrito_id) {
            http_response_code(400);
            echo json_encode(['error' => 'ID de carrito es requerido']);
            exit;
        }
        
        // Obtener cantidad actual antes de eliminar
        $stmt = $pdo->prepare('
            SELECT c.cantidad, c.producto_id 
            FROM carrito c
            WHERE c.id = ? AND c.user_id = ?
        ');
        $stmt->execute([$carrito_id, $user_id]);
        $item = $stmt->fetch();
        
        if (!$item) {
            http_response_code(404);
            echo json_encode(['error' => 'Item no encontrado']);
            exit;
        }
        
        // Eliminar del carrito
        $stmt = $pdo->prepare('DELETE FROM carrito WHERE id = ? AND user_id = ?');
        $stmt->execute([$carrito_id, $user_id]);
        
        // Devolver stock SOLO si NO es una confirmación de compra
        if (!$confirmar_compra) {
            $stmt = $pdo->prepare('UPDATE productos SET stock = stock + ? WHERE id = ?');
            $stmt->execute([$item['cantidad'], $item['producto_id']]);
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Producto eliminado del carrito'
        ]);
    }
    
    else {
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
    }
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error en la base de datos: ' . $e->getMessage()]);
}
