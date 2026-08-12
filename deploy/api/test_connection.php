<?php
// Test simple de conexión
error_reporting(E_ALL);
ini_set('display_errors', 0);

header('Content-Type: application/json');

try {
    require_once 'db.php';
    
    echo json_encode([
        'success' => true,
        'message' => 'Conexión exitosa',
        'pdo_exists' => isset($pdo)
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ]);
}
