<?php
// Evitar cualquier salida antes de los headers
error_reporting(E_ALL);
ini_set('display_errors', 0);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    require_once 'db.php';
    
    // Verificar que $pdo exista
    if (!isset($pdo)) {
        throw new Exception('Conexión PDO no inicializada');
    }
    
    // Verificar conexión
    $stmt = $pdo->query('SELECT COUNT(*) as total FROM productos');
    $result = $stmt->fetch();
    
    // Obtener algunos productos de ejemplo
    $stmt = $pdo->query('SELECT * FROM productos LIMIT 5');
    $productos = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'total_productos' => $result['total'],
        'muestra_productos' => $productos,
        'conexion' => 'OK',
        'database' => 'brkoonuy_carbass_db'
    ], JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'file' => basename($e->getFile()),
        'line' => $e->getLine()
    ]);
}
