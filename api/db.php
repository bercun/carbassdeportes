<?php
// Configuración de la base de datos
$host = 'localhost';  // En producción puede ser diferente
$db   = 'brkoonuy_carbass_db';  // Nombre de tu base de datos
$user = 'brkoonuy_brkncarbass'; // Usuario de la base de datos
$pass = 'OIxJBi-anV+O5jp5';    // Contraseña del usuario

$charset = 'utf8mb4';

// DSN (Data Source Name)
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

// Opciones de PDO
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

// Crear conexión
try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    // En producción, NO mostrar detalles del error
    http_response_code(500);
    die(json_encode(['error' => 'Error de conexión a la base de datos']));
}
// No cerrar PHP para evitar espacios en blanco adicionales
