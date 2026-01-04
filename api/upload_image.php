<?php
session_start();

// Verificar que el usuario sea admin
if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'admin') {
    http_response_code(403);
    die(json_encode(['error' => 'Acceso denegado']));
}

header('Content-Type: application/json');

// Verificar que se haya enviado un archivo
if (!isset($_FILES['imagen']) || $_FILES['imagen']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    die(json_encode(['error' => 'No se recibió ninguna imagen válida']));
}

$file = $_FILES['imagen'];

// Validar tipo de archivo
$allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$fileType = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if (!in_array($fileType, $allowedTypes)) {
    http_response_code(400);
    die(json_encode(['error' => 'Tipo de archivo no permitido. Solo se permiten imágenes.']));
}

// Validar tamaño (máximo 5MB)
$maxSize = 5 * 1024 * 1024; // 5MB
if ($file['size'] > $maxSize) {
    http_response_code(400);
    die(json_encode(['error' => 'El archivo es demasiado grande. Máximo 5MB.']));
}

// Generar nombre único para evitar sobrescribir
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = uniqid('producto_', true) . '.' . $extension;

// Directorio de destino
$uploadDir = '../sours/img/articulos/';

// Crear directorio si no existe
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$targetPath = $uploadDir . $filename;

// Mover archivo
if (move_uploaded_file($file['tmp_name'], $targetPath)) {
    // Devolver la URL relativa
    $imageUrl = 'sours/img/articulos/' . $filename;
    
    echo json_encode([
        'success' => true,
        'url' => $imageUrl,
        'filename' => $filename
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Error al guardar la imagen']);
}
?>
