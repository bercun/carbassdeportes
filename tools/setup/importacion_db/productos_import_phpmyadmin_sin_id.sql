SET FOREIGN_KEY_CHECKS = 0;

INSERT INTO `productos` (
  `nombre`,
  `descripcion`,
  `precio`,
  `imagen_url`,
  `categoria_id`,
  `estado`,
  `destacado`,
  `stock`,
  `activo`,
  `fecha_creacion`
) VALUES
  ('Botines Futbol Profesional X1', 'Botines profesionales con tapones de aluminio. Perfectos para cesped natural y competencia.', 300.00, 'sours/img/articulos/botines-futbol-profesional.jpg', 10, 'normal', 1, 18, 1, '2026-08-11 20:00:00'),
  ('Zapatillas Deportivas Premium', 'Zapatillas multideporte de gama premium para entrenamiento intensivo.', 129.99, 'sours/img/articulos/zapatillas-deportivas-premium.jpg', 9, 'destacado', 1, 32, 1, '2026-08-11 20:00:00'),
  ('Producto Exclusivo Edicion Limitada', 'Articulo de coleccion limitada con certificado de autenticidad.', 299.99, 'sours/img/articulos/producto-exclusivo-limitado.jpg', 12, 'destacado', 1, 8, 1, '2026-08-11 20:00:00'),
  ('Accesorio Deportivo Premium', 'Accesorio deportivo ergonomico de alta resistencia.', 79.99, 'sours/img/articulos/accesorio-deportivo-premium.jpg', 10, 'recien_agregado', 1, 45, 1, '2026-08-11 20:00:00'),
  ('Aros de colores45', 'Aros para saltar y divertirte', 500.00, 'sours/img/articulos/producto_697181e55f1fe6.31336635.png', 11, 'oferta', 0, 20, 1, '2026-08-11 20:00:00');

SET FOREIGN_KEY_CHECKS = 1;
