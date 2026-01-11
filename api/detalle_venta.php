<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'db.php';

session_start();

// Verificar que el usuario esté autenticado y sea admin
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Usuario no autenticado']);
    exit;
}

$user_id = $_SESSION['user_id'];

// Verificar rol de admin
$stmt = $pdo->prepare('SELECT rol FROM usuarios WHERE id = ?');
$stmt->execute([$user_id]);
$user = $stmt->fetch();

if (!$user || $user['rol'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['error' => 'Acceso denegado']);
    exit;
}

try {
    // Obtener ID de la venta
    $venta_id = $_GET['id'] ?? null;
    
    if (!$venta_id) {
        throw new Exception('ID de venta requerido');
    }
    
    // Obtener datos de la venta
    $stmt = $pdo->prepare('
        SELECT 
            v.*,
            u.nombre as usuario_nombre,
            u.email as usuario_email
        FROM ventas v
        LEFT JOIN usuarios u ON v.user_id = u.id
        WHERE v.id = ?
    ');
    $stmt->execute([$venta_id]);
    $venta = $stmt->fetch();
    
    if (!$venta) {
        throw new Exception('Venta no encontrada');
    }
    
    // Obtener detalles de la venta
    $stmt = $pdo->prepare('
        SELECT 
            dv.*,
            p.imagen_url,
            p.categoria_id,
            cat.nombre as categoria_nombre
        FROM detalle_ventas dv
        LEFT JOIN productos p ON dv.producto_id = p.id
        LEFT JOIN categorias cat ON p.categoria_id = cat.id
        WHERE dv.venta_id = ?
        ORDER BY dv.id
    ');
    $stmt->execute([$venta_id]);
    $detalles = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'venta' => $venta,
        'detalles' => $detalles
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Error al obtener detalle de venta: ' . $e->getMessage()
    ]);
}
