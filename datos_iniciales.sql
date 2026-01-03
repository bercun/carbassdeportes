-- Script para insertar categorías y productos de ejemplo en CarbassDeportes
-- IMPORTANTE: Ejecutar este script completo de una sola vez

-- PASO 1: Limpiar datos existentes (opcional, comentar si no quieres borrar)
-- DELETE FROM productos;
-- DELETE FROM categorias;

-- PASO 2: INSERTAR CATEGORÍAS PRIMERO
INSERT INTO categorias (nombre, slug) VALUES
('Fútbol', 'futbol'),
('Basket', 'basket'),
('Gym', 'gym'),
('Coleccionables', 'coleccionables');

-- PASO 3: INSERTAR PRODUCTOS usando los IDs de las categorías recién creadas

-- Productos de Fútbol
INSERT INTO productos (nombre, descripcion, precio, imagen_url, categoria_id, destacado, stock) 
SELECT 'Balón de Fútbol Profesional', 'Balón oficial tamaño 5, ideal para partidos y entrenamientos', 45.99, 'sours/img/articulos/balon-futbol.jpg', id, 1, 50 FROM categorias WHERE slug = 'futbol';

INSERT INTO productos (nombre, descripcion, precio, imagen_url, categoria_id, destacado, stock) 
SELECT 'Botines Nike Mercurial', 'Botines de alto rendimiento con tecnología Flyknit', 129.99, 'sours/img/articulos/botines-nike.jpg', id, 1, 30 FROM categorias WHERE slug = 'futbol';

INSERT INTO productos (nombre, descripcion, precio, imagen_url, categoria_id, destacado, stock) 
SELECT 'Camiseta de Entrenamiento', 'Camiseta técnica transpirable para entrenamientos', 29.99, 'sours/img/articulos/camiseta-entrenamiento.jpg', id, 0, 100 FROM categorias WHERE slug = 'futbol';

INSERT INTO productos (nombre, descripcion, precio, imagen_url, categoria_id, destacado, stock) 
SELECT 'Guantes de Arquero Adidas', 'Guantes profesionales con grip superior', 39.99, 'sours/img/articulos/guantes-arquero.jpg', id, 0, 25 FROM categorias WHERE slug = 'futbol';

INSERT INTO productos (nombre, descripcion, precio, imagen_url, categoria_id, destacado, stock) 
SELECT 'Medias de Compresión', 'Medias técnicas de compresión para mejor rendimiento', 15.99, 'sours/img/articulos/medias-compresion.jpg', id, 0, 150 FROM categorias WHERE slug = 'futbol';

-- Productos de Basket
INSERT INTO productos (nombre, descripcion, precio, imagen_url, categoria_id, destacado, stock) 
SELECT 'Balón Basketball Spalding', 'Balón oficial NBA, tamaño 7', 54.99, 'sours/img/articulos/balon-basket.jpg', id, 1, 40 FROM categorias WHERE slug = 'basket';

INSERT INTO productos (nombre, descripcion, precio, imagen_url, categoria_id, destacado, stock) 
SELECT 'Zapatillas Air Jordan', 'Zapatillas de baloncesto de alto rendimiento', 189.99, 'sours/img/articulos/zapatillas-jordan.jpg', id, 1, 20 FROM categorias WHERE slug = 'basket';

INSERT INTO productos (nombre, descripcion, precio, imagen_url, categoria_id, destacado, stock) 
SELECT 'Tablero con Aro', 'Set completo de tablero y aro para exteriores', 159.99, 'sours/img/articulos/tablero-aro.jpg', id, 0, 15 FROM categorias WHERE slug = 'basket';

INSERT INTO productos (nombre, descripcion, precio, imagen_url, categoria_id, destacado, stock) 
SELECT 'Camiseta NBA Reversible', 'Camiseta reversible para entrenamientos', 34.99, 'sours/img/articulos/camiseta-nba.jpg', id, 0, 60 FROM categorias WHERE slug = 'basket';

INSERT INTO productos (nombre, descripcion, precio, imagen_url, categoria_id, destacado, stock) 
SELECT 'Rodilleras Protectoras', 'Rodilleras acolchadas para protección', 24.99, 'sours/img/articulos/rodilleras.jpg', id, 0, 80 FROM categorias WHERE slug = 'basket';

-- Productos de Gym
INSERT INTO productos (nombre, descripcion, precio, imagen_url, categoria_id, destacado, stock) 
SELECT 'Mancuernas Set 20kg', 'Set de mancuernas ajustables hasta 20kg', 89.99, 'sours/img/articulos/mancuernas.jpg', id, 1, 35 FROM categorias WHERE slug = 'gym';

INSERT INTO productos (nombre, descripcion, precio, imagen_url, categoria_id, destacado, stock) 
SELECT 'Colchoneta de Yoga', 'Colchoneta antideslizante de alta densidad', 29.99, 'sours/img/articulos/colchoneta-yoga.jpg', id, 0, 100 FROM categorias WHERE slug = 'gym';

INSERT INTO productos (nombre, descripcion, precio, imagen_url, categoria_id, destacado, stock) 
SELECT 'Banda Elástica Set', 'Set de 5 bandas elásticas de resistencia', 19.99, 'sours/img/articulos/bandas-elasticas.jpg', id, 0, 120 FROM categorias WHERE slug = 'gym';

INSERT INTO productos (nombre, descripcion, precio, imagen_url, categoria_id, destacado, stock) 
SELECT 'Guantes de Gimnasio', 'Guantes con soporte de muñeca para levantamiento', 24.99, 'sours/img/articulos/guantes-gym.jpg', id, 0, 70 FROM categorias WHERE slug = 'gym';

INSERT INTO productos (nombre, descripcion, precio, imagen_url, categoria_id, destacado, stock) 
SELECT 'Botella Shaker Proteína', 'Botella mezcladora de 700ml con compartimento', 12.99, 'sours/img/articulos/botella-shaker.jpg', id, 0, 200 FROM categorias WHERE slug = 'gym';

INSERT INTO productos (nombre, descripcion, precio, imagen_url, categoria_id, destacado, stock) 
SELECT 'Pesa Rusa Kettlebell 16kg', 'Pesa rusa de hierro fundido profesional', 64.99, 'sours/img/articulos/kettlebell.jpg', id, 1, 25 FROM categorias WHERE slug = 'gym';

-- Productos Coleccionables
INSERT INTO productos (nombre, descripcion, precio, imagen_url, categoria_id, destacado, stock) 
SELECT 'Jersey Edición Limitada', 'Camiseta conmemorativa edición limitada numerada', 149.99, 'sours/img/coleccionables/jersey-edicion-limitada.jpg', id, 1, 10 FROM categorias WHERE slug = 'coleccionables';

INSERT INTO productos (nombre, descripcion, precio, imagen_url, categoria_id, destacado, stock) 
SELECT 'Camiseta Retro Clásica', 'Réplica de camiseta histórica años 90', 89.99, 'sours/img/coleccionables/camiseta-retro-clasica.jpg', id, 1, 15 FROM categorias WHERE slug = 'coleccionables';

INSERT INTO productos (nombre, descripcion, precio, imagen_url, categoria_id, destacado, stock) 
SELECT 'Banderín Equipo Clásico', 'Banderín oficial de equipo histórico', 34.99, 'sours/img/coleccionables/banderin-equipo-clasico.jpg', id, 0, 30 FROM categorias WHERE slug = 'coleccionables';

INSERT INTO productos (nombre, descripcion, precio, imagen_url, categoria_id, destacado, stock) 
SELECT 'Camiseta Época Histórica', 'Camiseta conmemorativa de época dorada', 99.99, 'sours/img/coleccionables/camiseta-epoca-historica.jpg', id, 0, 12 FROM categorias WHERE slug = 'coleccionables';

INSERT INTO productos (nombre, descripcion, precio, imagen_url, categoria_id, destacado, stock) 
SELECT 'Jersey Conmemorativo', 'Jersey especial con autógrafos impresos', 179.99, 'sours/img/coleccionables/jersey-conmemorativo.jpg', id, 1, 8 FROM categorias WHERE slug = 'coleccionables';
