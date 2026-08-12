<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        // Obtener todas las categorías
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare('SELECT * FROM categorias WHERE id = ?');
            $stmt->execute([$_GET['id']]);
            $categoria = $stmt->fetch();
            
            if ($categoria) {
                echo json_encode($categoria);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Categoría no encontrada']);
            }
        } else {
            $stmt = $pdo->query('SELECT * FROM categorias ORDER BY nombre ASC');
            $categorias = $stmt->fetchAll();
            echo json_encode($categorias);
        }
    }
    
    elseif ($method === 'POST') {
        session_start();
        
        // Verificar que el usuario sea admin
        if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Acceso denegado']);
            exit;
        }
        
        $data = json_decode(file_get_contents('php://input'), true);
        $nombre = trim($data['nombre'] ?? '');
        $slug = trim($data['slug'] ?? '');
        
        if (empty($nombre) || empty($slug)) {
            http_response_code(400);
            echo json_encode(['error' => 'Nombre y slug son obligatorios']);
            exit;
        }
        
        $stmt = $pdo->prepare('INSERT INTO categorias (nombre, slug) VALUES (?, ?)');
        $stmt->execute([$nombre, $slug]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Categoría creada exitosamente',
            'id' => $pdo->lastInsertId()
        ]);
    }
    
    else {
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
    }
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error en la base de datos']);
}
