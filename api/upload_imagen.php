<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

require_once 'db.php';

session_start();

// Verificar que el usuario sea administrador
if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['error' => 'Acceso denegado']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

try {
    // Verificar que se haya enviado un archivo
    if (!isset($_FILES['imagen']) || $_FILES['imagen']['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(['error' => 'No se ha enviado ninguna imagen válida']);
        exit;
    }
    
    $file = $_FILES['imagen'];
    $fileName = $file['name'];
    $fileTmpName = $file['tmp_name'];
    $fileSize = $file['size'];
    $fileError = $file['error'];
    
    // Obtener extensión del archivo
    $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
    
    // Extensiones permitidas
    $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    
    if (!in_array($fileExt, $allowedExtensions)) {
        http_response_code(400);
        echo json_encode(['error' => 'Formato de imagen no permitido. Use: jpg, jpeg, png, gif, webp']);
        exit;
    }
    
    // Limitar tamaño (5MB)
    $maxSize = 5 * 1024 * 1024; // 5MB en bytes
    if ($fileSize > $maxSize) {
        http_response_code(400);
        echo json_encode(['error' => 'La imagen es demasiado grande. Máximo 5MB']);
        exit;
    }
    
    // Generar nombre único para evitar sobrescrituras
    $newFileName = uniqid('img_', true) . '.' . $fileExt;
    
    // Ruta de destino
    $uploadDir = __DIR__ . '/../uploads/';
    $uploadPath = $uploadDir . $newFileName;
    
    // Crear directorio si no existe
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    // Mover archivo subido
    if (move_uploaded_file($fileTmpName, $uploadPath)) {
        // Devolver la URL relativa de la imagen
        $imageUrl = '/uploads/' . $newFileName;
        
        echo json_encode([
            'success' => true,
            'message' => 'Imagen subida exitosamente',
            'url' => $imageUrl,
            'filename' => $newFileName
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error al guardar la imagen']);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error en el servidor']);
}
?>
