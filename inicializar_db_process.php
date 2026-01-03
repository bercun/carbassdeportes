<?php
// Evitar cualquier salida antes de los headers
error_reporting(E_ALL);
ini_set('display_errors', 0);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'api/db.php';

try {
    // Verificar método
    $method = $_SERVER['REQUEST_METHOD'];
    
    if ($method === 'GET' && isset($_GET['action']) && $_GET['action'] === 'verify') {
        // VERIFICAR datos actuales
        $stmtCat = $pdo->query('SELECT COUNT(*) as total FROM categorias');
        $totalCat = $stmtCat->fetch()['total'];
        
        $stmtProd = $pdo->query('SELECT COUNT(*) as total FROM productos');
        $totalProd = $stmtProd->fetch()['total'];
        
        $categorias = $pdo->query('SELECT * FROM categorias')->fetchAll();
        $productos = $pdo->query('SELECT * FROM productos LIMIT 5')->fetchAll();
        
        echo json_encode([
            'success' => true,
            'categorias' => $totalCat,
            'productos' => $totalProd,
            'lista_categorias' => $categorias,
            'muestra_productos' => $productos
        ], JSON_PRETTY_PRINT);
        exit;
    }
    
    if ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $action = $input['action'] ?? '';
        
        if ($action === 'clean') {
            // LIMPIAR todos los datos
            $pdo->exec('DELETE FROM productos');
            $pdo->exec('DELETE FROM categorias');
            $pdo->exec('ALTER TABLE productos AUTO_INCREMENT = 1');
            $pdo->exec('ALTER TABLE categorias AUTO_INCREMENT = 1');
            
            echo json_encode([
                'success' => true,
                'mensaje' => 'Todos los datos han sido eliminados'
            ]);
            exit;
        }
        
        if ($action === 'insert') {
            // INSERTAR datos de ejemplo
            
            // 1. Verificar si ya existen categorías
            $stmtCheck = $pdo->query('SELECT COUNT(*) as total FROM categorias');
            $existingCat = $stmtCheck->fetch()['total'];
            
            $categoriasInsertadas = 0;
            
            if ($existingCat == 0) {
                // Insertar categorías
                $categorias = [
                    ['Fútbol', 'futbol'],
                    ['Basket', 'basket'],
                    ['Gym', 'gym'],
                    ['Coleccionables', 'coleccionables']
                ];
                
                $sqlCat = 'INSERT INTO categorias (nombre, slug) VALUES (?, ?)';
                $stmtCat = $pdo->prepare($sqlCat);
                
                foreach ($categorias as $cat) {
                    $stmtCat->execute($cat);
                    $categoriasInsertadas++;
                }
            }
            
            // 2. Obtener IDs de categorías
            $cats = $pdo->query('SELECT id, nombre FROM categorias')->fetchAll(PDO::FETCH_KEY_PAIR);
            
            // 3. Insertar productos
            $productos = [
                // Fútbol
                ['Balón de Fútbol Profesional', 'Balón oficial tamaño 5, ideal para partidos y entrenamientos', 45.99, 'sours/img/articulos/balon-futbol.jpg', 'Fútbol', 1, 50],
                ['Botines Nike Mercurial', 'Botines de alto rendimiento con tecnología Flyknit', 129.99, 'sours/img/articulos/botines-nike.jpg', 'Fútbol', 1, 30],
                ['Camiseta de Entrenamiento', 'Camiseta técnica transpirable para entrenamientos', 29.99, 'sours/img/articulos/camiseta-entrenamiento.jpg', 'Fútbol', 0, 100],
                ['Guantes de Arquero Adidas', 'Guantes profesionales con grip superior', 39.99, 'sours/img/articulos/guantes-arquero.jpg', 'Fútbol', 0, 25],
                ['Medias de Compresión', 'Medias técnicas de compresión para mejor rendimiento', 15.99, 'sours/img/articulos/medias-compresion.jpg', 'Fútbol', 0, 150],
                
                // Basket
                ['Balón Basketball Spalding', 'Balón oficial NBA, tamaño 7', 54.99, 'sours/img/articulos/balon-basket.jpg', 'Basket', 1, 40],
                ['Zapatillas Air Jordan', 'Zapatillas de baloncesto de alto rendimiento', 189.99, 'sours/img/articulos/zapatillas-jordan.jpg', 'Basket', 1, 20],
                ['Tablero con Aro', 'Set completo de tablero y aro para exteriores', 159.99, 'sours/img/articulos/tablero-aro.jpg', 'Basket', 0, 15],
                ['Camiseta NBA Reversible', 'Camiseta reversible para entrenamientos', 34.99, 'sours/img/articulos/camiseta-nba.jpg', 'Basket', 0, 60],
                ['Rodilleras Protectoras', 'Rodilleras acolchadas para protección', 24.99, 'sours/img/articulos/rodilleras.jpg', 'Basket', 0, 80],
                
                // Gym
                ['Mancuernas Set 20kg', 'Set de mancuernas ajustables hasta 20kg', 89.99, 'sours/img/articulos/mancuernas.jpg', 'Gym', 1, 35],
                ['Colchoneta de Yoga', 'Colchoneta antideslizante de alta densidad', 29.99, 'sours/img/articulos/colchoneta-yoga.jpg', 'Gym', 0, 100],
                ['Banda Elástica Set', 'Set de 5 bandas elásticas de resistencia', 19.99, 'sours/img/articulos/bandas-elasticas.jpg', 'Gym', 0, 120],
                ['Guantes de Gimnasio', 'Guantes con soporte de muñeca para levantamiento', 24.99, 'sours/img/articulos/guantes-gym.jpg', 'Gym', 0, 70],
                ['Botella Shaker Proteína', 'Botella mezcladora de 700ml con compartimento', 12.99, 'sours/img/articulos/botella-shaker.jpg', 'Gym', 0, 200],
                ['Pesa Rusa Kettlebell 16kg', 'Pesa rusa de hierro fundido profesional', 64.99, 'sours/img/articulos/kettlebell.jpg', 'Gym', 1, 25],
                
                // Coleccionables
                ['Jersey Edición Limitada', 'Camiseta conmemorativa edición limitada numerada', 149.99, 'sours/img/coleccionables/jersey-edicion-limitada.jpg', 'Coleccionables', 1, 10],
                ['Camiseta Retro Clásica', 'Réplica de camiseta histórica años 90', 89.99, 'sours/img/coleccionables/camiseta-retro-clasica.jpg', 'Coleccionables', 1, 15],
                ['Banderín Equipo Clásico', 'Banderín oficial de equipo histórico', 34.99, 'sours/img/coleccionables/banderin-equipo-clasico.jpg', 'Coleccionables', 0, 30],
                ['Camiseta Época Histórica', 'Camiseta conmemorativa de época dorada', 99.99, 'sours/img/coleccionables/camiseta-epoca-historica.jpg', 'Coleccionables', 0, 12],
                ['Jersey Conmemorativo', 'Jersey especial con autógrafos impresos', 179.99, 'sours/img/coleccionables/jersey-conmemorativo.jpg', 'Coleccionables', 1, 8]
            ];
            
            $sqlProd = 'INSERT INTO productos (nombre, descripcion, precio, imagen_url, categoria_id, destacado, stock) VALUES (?, ?, ?, ?, ?, ?, ?)';
            $stmtProd = $pdo->prepare($sqlProd);
            
            $productosInsertados = 0;
            
            foreach ($productos as $prod) {
                $catNombre = $prod[4];
                $categoriaId = $cats[$catNombre] ?? null;
                
                if ($categoriaId) {
                    $stmtProd->execute([
                        $prod[0], // nombre
                        $prod[1], // descripcion
                        $prod[2], // precio
                        $prod[3], // imagen_url
                        $categoriaId, // categoria_id
                        $prod[5], // destacado
                        $prod[6]  // stock
                    ]);
                    $productosInsertados++;
                }
            }
            
            echo json_encode([
                'success' => true,
                'mensaje' => 'Base de datos inicializada correctamente',
                'categorias_insertadas' => $categoriasInsertadas,
                'productos_insertados' => $productosInsertados,
                'total_categorias' => count($cats),
                'total_productos' => $pdo->query('SELECT COUNT(*) FROM productos')->fetchColumn()
            ], JSON_PRETTY_PRINT);
            exit;
        }
    }
    
    // Acción no válida
    http_response_code(400);
    echo json_encode(['error' => 'Acción no válida']);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error en la base de datos',
        'mensaje' => $e->getMessage()
    ]);
}
