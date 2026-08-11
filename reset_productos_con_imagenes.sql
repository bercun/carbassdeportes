-- ============================================
-- Script para limpiar y recargar productos de prueba
-- Base de datos: brkoonuy_carbass_db
-- Fecha: 18-01-2026
-- ============================================

-- Desactivar verificación de claves foráneas temporalmente
SET FOREIGN_KEY_CHECKS = 0;

-- Limpiar tablas relacionadas primero
DELETE FROM `carrito`;
DELETE FROM `detalle_ventas`;

-- Limpiar tabla de productos
DELETE FROM `productos`;

-- Reiniciar auto incremento
ALTER TABLE `productos` AUTO_INCREMENT = 1;

-- Reactivar verificación de claves foráneas
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- Insertar productos de prueba con imágenes reales
-- ============================================

INSERT INTO `productos` (`nombre`, `descripcion`, `precio`, `imagen_url`, `categoria_id`, `estado`, `destacado`, `stock`, `activo`) VALUES

-- PRODUCTOS DESTACADOS
('Zapatillas Running Elite Pro', 'Zapatillas de alta gama para running profesional. Tecnología de amortiguación avanzada y diseño aerodinámico para máximo rendimiento.', 149.99, 'sours/img/articulos/zapatillas-running-elite.jpg', 9, 'destacado', 1, 25, 1),

('Botines Fútbol Profesional X1', 'Botines profesionales con tapones de aluminio. Perfectos para superficies de césped natural y competición de alto nivel.', 189.99, 'sours/img/articulos/botines-futbol-profesional.jpg', 9, 'destacado', 1, 18, 1),

('Zapatillas Deportivas Premium', 'Zapatillas multideporte de gama premium. Ideales para entrenamientos intensivos y uso diario deportivo.', 129.99, 'sours/img/articulos/zapatillas-deportivas-premium.jpg', 9, 'destacado', 1, 32, 1),

('Producto Exclusivo Edición Limitada', 'Artículo exclusivo de colección limitada. Solo 100 unidades numeradas disponibles. Incluye certificado de autenticidad.', 299.99, 'sours/img/articulos/producto-exclusivo-limitado.jpg', 12, 'destacado', 1, 8, 1),

-- PRODUCTOS RECIÉN AGREGADOS
('Accesorio Deportivo Premium', 'Accesorio deportivo de última generación. Material resistente y diseño ergonómico para máxima comodidad.', 79.99, 'sours/img/articulos/accesorio-deportivo-premium.jpg', 10, 'recien_agregado', 1, 45, 1),

('Artículo Especial Único', 'Producto especial con características únicas. Diseñado para deportistas exigentes que buscan lo mejor.', 159.99, 'sours/img/articulos/articulo-especial-unico.jpg', 10, 'recien_agregado', 1, 22, 1),

('Elemento Coleccionable Especial', 'Pieza de colección exclusiva para verdaderos fanáticos. Perfecto para exhibir o regalar.', 249.99, 'sours/img/articulos/elemento-coleccionable-especial.jpg', 12, 'recien_agregado', 1, 5, 1),

-- PRODUCTOS EN OFERTA
('Zapatillas Casuales Comfort', 'Zapatillas urbanas ultra cómodas. Perfectas para uso diario casual. ¡PRECIO ESPECIAL!', 59.99, 'sours/img/articulos/zapatillas-casuales-comfort.jpg', 9, 'oferta', 0, 50, 1),

('Calzado Urbano Casual', 'Calzado urbano de estilo moderno. Combina moda y comodidad. ¡OFERTA LIMITADA!', 49.99, 'sours/img/articulos/calzado-urbano-casual.jpg', 9, 'oferta', 0, 38, 1),

-- PRODUCTOS VINTAGE/RETRO
('Camiseta Vintage Retro Classic', 'Camiseta retro de los años 90. Réplica exacta del diseño original. Material premium de algodón.', 89.99, 'sours/img/articulos/camiseta-vintage-retro.jpg', 12, 'normal', 0, 15, 1),

('Botines Clásicos Vintage', 'Botines de estilo clásico inspirados en modelos legendarios. Para los amantes del fútbol tradicional.', 119.99, 'sours/img/articulos/botines-clasicos-vintage.jpg', 12, 'normal', 0, 12, 1),

-- PRODUCTOS NORMALES ADICIONALES
('Zapatillas Training Pro', 'Zapatillas versátiles para entrenamiento. Excelente relación calidad-precio.', 79.99, 'sours/img/articulos/zapatillas-running-elite.jpg', 9, 'normal', 0, 60, 1),

('Bolso Deportivo Grande', 'Bolso espacioso para equipamiento deportivo. Múltiples compartimentos y material impermeable.', 45.99, 'sours/img/articulos/accesorio-deportivo-premium.jpg', 10, 'normal', 0, 75, 1),

('Camiseta Técnica Deportiva', 'Camiseta técnica transpirable. Tejido de alta tecnología que elimina la humedad.', 34.99, 'sours/img/articulos/camiseta-vintage-retro.jpg', 9, 'normal', 0, 100, 1),

('Shorts Deportivos Performance', 'Shorts ligeros de alto rendimiento. Perfectos para correr y entrenar.', 29.99, 'sours/img/articulos/accesorio-deportivo-premium.jpg', 9, 'normal', 0, 85, 1),

('Medias Técnicas Compresión', 'Medias de compresión profesional. Mejoran circulación y recuperación muscular.', 19.99, 'sours/img/articulos/articulo-especial-unico.jpg', 9, 'normal', 0, 120, 1),

('Guantes de Arquero Pro', 'Guantes profesionales con grip superior. Látex de alta calidad para máximo agarre.', 69.99, 'sours/img/articulos/botines-futbol-profesional.jpg', 9, 'normal', 0, 28, 1),

('Balón Fútbol Match Quality', 'Balón de fútbol calidad match. Certificado para competición oficial.', 39.99, 'sours/img/articulos/producto-exclusivo-limitado.jpg', 9, 'normal', 0, 42, 1),

('Botella Deportiva Premium', 'Botella de acero inoxidable 750ml. Mantiene temperatura por 24 horas.', 24.99, 'sours/img/articulos/accesorio-deportivo-premium.jpg', 10, 'normal', 0, 95, 1),

('Toalla Deportiva Microfibra', 'Toalla de microfibra de secado rápido. Compacta y ultra absorbente.', 14.99, 'sours/img/articulos/articulo-especial-unico.jpg', 10, 'normal', 0, 110, 1),

-- PRODUCTOS AGOTADOS (para pruebas)
('Edición Especial Coleccionista', 'Artículo de edición especial AGOTADO. Próximamente nueva disponibilidad.', 199.99, 'sours/img/articulos/elemento-coleccionable-especial.jpg', 12, 'destacado', 1, 0, 1),

('Zapatillas Edición Limitada', 'Zapatillas de edición limitada AGOTADAS. Consultar por próximas reposiciones.', 179.99, 'sours/img/articulos/zapatillas-deportivas-premium.jpg', 9, 'oferta', 0, 0, 1);

-- ============================================
-- Resumen de la carga
-- ============================================
-- Total productos insertados: 22
-- - Destacados: 4
-- - Recién agregados: 3
-- - En oferta: 4 (2 con stock, 2 agotados)
-- - Normales: 11
-- - Agotados: 2
-- ============================================

SELECT 'Base de datos limpiada y productos de prueba cargados exitosamente!' AS mensaje;
SELECT COUNT(*) AS total_productos FROM productos;
SELECT estado, COUNT(*) AS cantidad FROM productos GROUP BY estado;
