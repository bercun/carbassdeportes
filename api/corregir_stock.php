<?php
/**
 * Script para corregir el stock de productos
 * Este script recalcula el stock basándose en el stock original menos las cantidades en carrito
 */

require_once 'db.php';

try {
    // Obtener todos los productos con stock negativo o problemático
    $stmt = $pdo->query('SELECT id, nombre, stock FROM productos WHERE stock < 0');
    $productos_problema = $stmt->fetchAll();
    
    if (count($productos_problema) > 0) {
        echo "Productos con stock negativo encontrados:\n";
        foreach ($productos_problema as $prod) {
            echo "ID: {$prod['id']}, Nombre: {$prod['nombre']}, Stock: {$prod['stock']}\n";
        }
        
        echo "\n¿Desea restablecer el stock a un valor por defecto? (ejecutar manualmente)\n";
        
        // Descomentar para ejecutar la corrección:
        // foreach ($productos_problema as $prod) {
        //     $pdo->prepare('UPDATE productos SET stock = 10 WHERE id = ?')->execute([$prod['id']]);
        // }
    } else {
        echo "No se encontraron productos con stock negativo.\n";
    }
    
    // Mostrar resumen del carrito
    $stmt = $pdo->query('
        SELECT 
            p.id,
            p.nombre,
            p.stock,
            SUM(c.cantidad) as cantidad_en_carrito
        FROM productos p
        LEFT JOIN carrito c ON p.id = c.producto_id
        WHERE c.cantidad IS NOT NULL
        GROUP BY p.id, p.nombre, p.stock
    ');
    
    $resumen = $stmt->fetchAll();
    
    if (count($resumen) > 0) {
        echo "\nResumen de productos en carritos:\n";
        echo str_repeat('-', 80) . "\n";
        printf("%-5s %-30s %-15s %-20s\n", "ID", "Nombre", "Stock Actual", "En Carritos");
        echo str_repeat('-', 80) . "\n";
        
        foreach ($resumen as $item) {
            printf("%-5s %-30s %-15s %-20s\n", 
                $item['id'], 
                substr($item['nombre'], 0, 30),
                $item['stock'],
                $item['cantidad_en_carrito']
            );
        }
    }
    
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
