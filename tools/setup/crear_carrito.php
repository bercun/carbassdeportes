<?php
// Script para crear la tabla del carrito
// Ejecutar navegando a: http://localhost/tu-proyecto/crear_carrito.php

require_once 'api/db.php';

try {
    echo "<h2>Creando tabla del carrito...</h2>";
    
    // Crear tabla carrito
    $sql = "CREATE TABLE IF NOT EXISTS carrito (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        producto_id INT NOT NULL,
        cantidad INT DEFAULT 1,
        fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_product (user_id, producto_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    $pdo->exec($sql);
    echo "<p style='color: green;'>✅ Tabla 'carrito' creada exitosamente.</p>";
    
    // Crear índices
    echo "<p>Creando índices...</p>";
    
    try {
        $pdo->exec("CREATE INDEX idx_user_id ON carrito(user_id)");
        echo "<p style='color: green;'>✅ Índice idx_user_id creado.</p>";
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), 'Duplicate key name') !== false) {
            echo "<p style='color: orange;'>⚠️ Índice idx_user_id ya existe.</p>";
        } else {
            throw $e;
        }
    }
    
    try {
        $pdo->exec("CREATE INDEX idx_producto_id ON carrito(producto_id)");
        echo "<p style='color: green;'>✅ Índice idx_producto_id creado.</p>";
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), 'Duplicate key name') !== false) {
            echo "<p style='color: orange;'>⚠️ Índice idx_producto_id ya existe.</p>";
        } else {
            throw $e;
        }
    }
    
    // Mostrar estructura de la tabla
    echo "<h3>Estructura de la tabla carrito:</h3>";
    $stmt = $pdo->query("DESCRIBE carrito");
    $columns = $stmt->fetchAll();
    
    echo "<table border='1' cellpadding='5' style='border-collapse: collapse;'>";
    echo "<tr><th>Campo</th><th>Tipo</th><th>Nulo</th><th>Clave</th><th>Por defecto</th><th>Extra</th></tr>";
    
    foreach ($columns as $column) {
        echo "<tr>";
        echo "<td>{$column['Field']}</td>";
        echo "<td>{$column['Type']}</td>";
        echo "<td>{$column['Null']}</td>";
        echo "<td>{$column['Key']}</td>";
        echo "<td>{$column['Default']}</td>";
        echo "<td>{$column['Extra']}</td>";
        echo "</tr>";
    }
    
    echo "</table>";
    
    echo "<h3 style='color: green;'>✅ Tabla del carrito configurada correctamente!</h3>";
    echo "<p><a href='index.html'>Ir a la página principal</a> | <a href='admin.html'>Ir al admin</a></p>";
    
} catch (PDOException $e) {
    echo "<h3 style='color: red;'>❌ Error:</h3>";
    echo "<p>" . htmlspecialchars($e->getMessage()) . "</p>";
}
?>
