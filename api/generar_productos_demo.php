<?php
/**
 * Script para generar productos de demostración automáticamente
 * Usa las imágenes disponibles en sours/img/articulos/
 * Solo accesible por administradores
 */

session_start();

// Verificar que el usuario sea admin
if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'admin') {
    http_response_code(403);
    die(json_encode(['error' => 'Acceso denegado. Solo administradores.']));
}

require_once 'db.php';
require_once 'logger.php';

header('Content-Type: application/json');

// Configuración
$cantidad_productos = isset($_GET['cantidad']) ? (int)$_GET['cantidad'] : 10;
$cantidad_productos = min($cantidad_productos, 50); // Máximo 50 productos

// Obtener imágenes disponibles
$uploadDir = '../sours/img/articulos/';
$imagenes_disponibles = [];

if (is_dir($uploadDir)) {
    $archivos = scandir($uploadDir);
    foreach ($archivos as $archivo) {
        if (in_array(pathinfo($archivo, PATHINFO_EXTENSION), ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
            if ($archivo !== 'default.jpg') { // Excluir default.jpg
                $imagenes_disponibles[] = 'sours/img/articulos/' . $archivo;
            }
        }
    }
}

if (empty($imagenes_disponibles)) {
    http_response_code(400);
    echo json_encode(['error' => 'No hay imágenes disponibles en la carpeta articulos']);
    exit;
}

// Obtener categorías disponibles
$stmt = $pdo->query('SELECT id, nombre FROM categorias ORDER BY id');
$categorias = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (empty($categorias)) {
    http_response_code(400);
    echo json_encode(['error' => 'No hay categorías en la base de datos']);
    exit;
}

// Arrays de datos para generar productos realistas
$nombres_base = [
    // Fútbol
    'Pelota de Fútbol', 'Botines Profesionales', 'Camiseta de Entrenamiento', 
    'Medias Deportivas', 'Espinilleras', 'Guantes de Arquero',
    'Short Deportivo', 'Balón de Entrenamiento', 'Bolso Deportivo',
    
    // Basket
    'Balón de Basketball', 'Zapatillas de Basketball', 'Camiseta NBA Style',
    'Pantalón Deportivo', 'Muñequeras', 'Red de Basketball',
    
    // Gym
    'Mancuernas', 'Pesa Rusa Kettlebell', 'Banda Elástica',
    'Colchoneta de Yoga', 'Guantes de Gimnasio', 'Botella Shaker',
    'Cuerda para Saltar', 'Foam Roller', 'Toalla Deportiva',
    
    // Coleccionables
    'Jersey Edición Limitada', 'Camiseta Retro Clásica', 'Banderín Histórico',
    'Autógrafo Enmarcado', 'Pelota Firmada', 'Trofeo Réplica'
];

$marcas = ['Nike', 'Adidas', 'Puma', 'Reebok', 'Under Armour', 'Wilson', 'Spalding', 'Mikasa'];
$adjetivos = ['Premium', 'Pro', 'Elite', 'Classic', 'Original', 'Professional', 'Training', 'Competition'];
$descripciones = [
    'Producto de alta calidad ideal para deportistas exigentes',
    'Diseño ergonómico y materiales resistentes de primera línea',
    'Perfecta para entrenamientos intensivos y competencias',
    'Tecnología innovadora que mejora el rendimiento deportivo',
    'Comodidad excepcional para uso prolongado',
    'Resistente al desgaste y condiciones extremas',
    'Diseño moderno con estilo deportivo único',
    'Producto oficial certificado para competencias'
];

$estados = ['normal', 'destacado', 'oferta', 'recien_agregado'];

// Generar productos
$productos_creados = [];
$productos_fallidos = 0;

try {
    $pdo->beginTransaction();
    
    for ($i = 0; $i < $cantidad_productos; $i++) {
        // Seleccionar datos aleatorios
        $nombre_base = $nombres_base[array_rand($nombres_base)];
        $marca = $marcas[array_rand($marcas)];
        $adjetivo = $adjetivos[array_rand($adjetivos)];
        $nombre = "$nombre_base $marca $adjetivo";
        
        $descripcion = $descripciones[array_rand($descripciones)];
        
        // Precio aleatorio entre 10 y 200
        $precio = round(mt_rand(1000, 20000) / 100, 2);
        
        // Stock aleatorio entre 0 y 100
        $stock = mt_rand(0, 100);
        
        // Categoría aleatoria
        $categoria = $categorias[array_rand($categorias)];
        
        // Estado aleatorio (más probabilidad de normal)
        $rand_estado = mt_rand(1, 10);
        if ($rand_estado <= 6) {
            $estado = 'normal';
        } elseif ($rand_estado <= 8) {
            $estado = 'destacado';
        } elseif ($rand_estado == 9) {
            $estado = 'oferta';
        } else {
            $estado = 'recien_agregado';
        }
        
        // Imagen aleatoria
        $imagen_url = $imagenes_disponibles[array_rand($imagenes_disponibles)];
        
        // Insertar en la base de datos
        $stmt = $pdo->prepare('
            INSERT INTO productos 
            (nombre, descripcion, precio, imagen_url, categoria_id, estado, destacado, stock) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ');
        
        $destacado = ($estado === 'destacado') ? 1 : 0;
        
        $resultado = $stmt->execute([
            $nombre,
            $descripcion,
            $precio,
            $imagen_url,
            $categoria['id'],
            $estado,
            $destacado,
            $stock
        ]);
        
        if ($resultado) {
            $productos_creados[] = [
                'id' => $pdo->lastInsertId(),
                'nombre' => $nombre,
                'precio' => $precio,
                'stock' => $stock,
                'categoria' => $categoria['nombre'],
                'estado' => $estado,
                'imagen' => basename($imagen_url)
            ];
        } else {
            $productos_fallidos++;
        }
    }
    
    $pdo->commit();
    
    // Registrar en logs
    registrar_log(
        'PRODUCTOS_DEMO_GENERADOS',
        'PRODUCTOS',
        "Se generaron {$cantidad_productos} productos de demostración",
        null,
        null,
        [
            'cantidad_solicitada' => $cantidad_productos,
            'cantidad_creada' => count($productos_creados),
            'cantidad_fallida' => $productos_fallidos
        ]
    );
    
    echo json_encode([
        'success' => true,
        'message' => 'Productos generados exitosamente',
        'cantidad_creada' => count($productos_creados),
        'cantidad_fallida' => $productos_fallidos,
        'imagenes_utilizadas' => count($imagenes_disponibles),
        'productos' => $productos_creados,
        'resumen' => [
            'total_imagenes' => count($imagenes_disponibles),
            'categorias_usadas' => count($categorias),
            'estados' => array_count_values(array_column($productos_creados, 'estado'))
        ]
    ]);
    
} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode([
        'error' => 'Error al generar productos',
        'detalle' => $e->getMessage()
    ]);
}
?>
