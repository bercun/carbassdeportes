<?php
/**
 * Archivo de conexión a la base de datos
 * Carga las credenciales desde db.config.php
 */

// Cargar configuración de credenciales
$configFile = __DIR__ . '/db.config.php';

if (!file_exists($configFile)) {
    http_response_code(500);
    die(json_encode([
        'error' => 'Archivo de configuración no encontrado',
        'message' => 'Por favor, crea el archivo db.config.php basándote en db.config.example.php'
    ]));
}

require_once $configFile;

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
?>
