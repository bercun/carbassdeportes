<?php
// Script de prueba para verificar que el campo 'estado' se devuelve en ventas
require_once 'db.php';

header('Content-Type: application/json; charset=utf-8');

try {
    // Obtener una venta de ejemplo
    $stmt = $pdo->prepare("
        SELECT 
            v.*,
            u.nombre as usuario_nombre,
            u.email as usuario_email,
            COUNT(dv.id) as cantidad_items
        FROM ventas v
        LEFT JOIN usuarios u ON v.user_id = u.id
        LEFT JOIN detalle_ventas dv ON v.id = dv.venta_id
        GROUP BY v.id
        ORDER BY v.fecha_venta DESC
        LIMIT 1
    ");
    
    $stmt->execute();
    $venta = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($venta) {
        echo json_encode([
            'success' => true,
            'venta' => $venta,
            'tiene_campo_estado' => isset($venta['estado']),
            'valor_estado' => $venta['estado'] ?? 'NO EXISTE',
            'campos_disponibles' => array_keys($venta)
        ], JSON_PRETTY_PRINT);
    } else {
        echo json_encode([
            'success' => false,
            'mensaje' => 'No hay ventas en la base de datos'
        ], JSON_PRETTY_PRINT);
    }
    
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_PRETTY_PRINT);
}
