-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 18-01-2026 a las 11:43:57
-- Versión del servidor: 10.6.24-MariaDB-cll-lve
-- Versión de PHP: 8.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `brkoonuy_carbass_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `imagen_url` varchar(255) DEFAULT NULL,
  `categoria_id` int(11) DEFAULT NULL,
  `estado` varchar(50) DEFAULT 'normal',
  `destacado` tinyint(1) DEFAULT 0,
  `stock` int(11) DEFAULT 0,
  `activo` tinyint(1) DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `nombre`, `descripcion`, `precio`, `imagen_url`, `categoria_id`, `estado`, `destacado`, `stock`, `activo`, `fecha_creacion`) VALUES
(8, 'Camiseta de Entrenamiento', 'Camiseta técnica transpirable para entrenamientos', 29.99, 'sours/img/articulos/producto_696c03e1efc9b0.62935292.jpg', 9, 'destacado', 1, 7, 1, '2026-01-03 20:02:40'),
(9, 'Guantes de Arquero Adidas', 'Guantes profesionales con grip superior', 39.99, 'sours/img/articulos/producto_696c03e1efc9b0.62935292.jpg', 9, 'destacado', 1, 6, 1, '2026-01-03 20:02:40'),
(10, 'Medias de Compresión', 'Medias técnicas de compresión para mejor rendimiento', 15.99, 'sours/img/articulos/producto_696c03e1efc9b0.62935292.jpg', 9, 'destacado', 1, 100, 1, '2026-01-03 20:02:40'),
(19, 'Guantes de Gimnasio', 'Guantes con soporte de muñeca para levantamiento', 24.99, 'sours/img/articulos/producto_696c03e1efc9b0.62935292.jpg', 9, 'normal', 0, 100, 1, '2026-01-03 20:02:41'),
(20, 'Botella Shaker Proteína', 'Botella mezcladora de 700ml con compartimento', 12.99, 'sours/img/articulos/producto_696c03e1efc9b0.62935292.jpg', 10, 'normal', 0, 4, 1, '2026-01-03 20:02:41'),
(21, 'Pesa Rusa Kettlebell 16kg', 'Pesa rusa de hierro fundido profesional', 64.99, 'sours/img/articulos/producto_696c03e1efc9b0.62935292.jpg', 9, 'recien_agregado', 1, 8, 1, '2026-01-03 20:02:41'),
(22, 'Jersey Edición Limitada', 'Camiseta conmemorativa edición limitada numerada', 149.99, 'sours/img/articulos/producto_696c03e1efc9b0.62935292.jpg', 12, 'destacado', 1, 95, 1, '2026-01-03 20:02:41'),
(23, 'Camiseta Retro Clásica', 'Réplica de camiseta histórica años 90', 89.99, 'sours/img/articulos/producto_696c03e1efc9b0.62935292.jpg', 12, 'normal', 0, 15, 1, '2026-01-03 20:02:41'),
(24, 'Banderín Equipo Clásico', 'Banderín oficial de equipo histórico', 34.99, 'sours/img/articulos/producto_696c03e1efc9b0.62935292.jpg', 12, 'normal', 0, 2, 1, '2026-01-03 20:02:41'),
(25, 'Camiseta Época Histórica', 'Camiseta conmemorativa de época dorada', 99.99, 'sours/img/articulos/producto_696c03e1efc9b0.62935292.jpg', 12, 'normal', 0, 2, 1, '2026-01-03 20:02:41'),
(26, 'Banderin grande de Estudiantes De La Plata', 'Jersey especial con autógrafos impresos', 179.99, 'sours/img/articulos/producto_696c03e1efc9b0.62935292.jpg', 12, 'destacado', 1, 0, 1, '2026-01-03 20:02:41'),
(27, 'Shorts de Fútbol Réplica Oficial', 'lorem', 22.00, 'sours/img/articulos/producto_696c03e1efc9b0.62935292.jpg', 12, 'destacado', 0, 99, 1, '2026-01-04 13:08:17'),
(28, 'Vendas coban', 'vendas', 80.00, 'sours/img/articulos/producto_696c03e1efc9b0.62935292.jpg', 9, 'oferta', 0, 9, 1, '2026-01-11 15:56:41'),
(32, 'Trofeo Réplica Puma Training', 'Producto oficial certificado para competencias', 66.01, 'sours/img/articulos/producto_696c041d03b372.48101101.jpg', 9, 'recien_agregado', 0, 58, 1, '2026-01-17 22:37:56'),
(33, 'Guantes de Arquero Wilson Pro', 'Resistente al desgaste y condiciones extremas', 110.38, 'sours/img/articulos/producto_696c041d03b372.48101101.jpg', 10, 'normal', 0, 46, 1, '2026-01-17 22:37:56'),
(34, 'Pelota de Fútbol Reebok Competition', 'Producto oficial certificado para competencias', 16.26, 'sours/img/articulos/producto_696c043182a524.31753234.jpg', 10, 'normal', 0, 49, 1, '2026-01-17 22:37:56'),
(35, 'Jersey Edición Limitada Spalding Training', 'Perfecta para entrenamientos intensivos y competencias', 100.99, 'sours/img/articulos/producto_696c043182a524.31753234.jpg', 10, 'normal', 0, 81, 1, '2026-01-17 22:37:56'),
(36, 'Pesa Rusa Kettlebell Wilson Competition', 'Diseño ergonómico y materiales resistentes de primera línea', 15.62, 'sours/img/articulos/producto_696c041d03b372.48101101.jpg', 10, 'oferta', 0, 78, 1, '2026-01-17 22:37:56'),
(37, 'Jersey Edición Limitada Puma Professional', 'Tecnología innovadora que mejora el rendimiento deportivo', 43.48, 'sours/img/articulos/producto_696c043182a524.31753234.jpg', 9, 'destacado', 1, 94, 1, '2026-01-17 22:37:56'),
(39, 'Cuerda para Saltar Mikasa Original', 'Perfecta para entrenamientos intensivos y competencias', 143.72, 'sours/img/articulos/producto_696c041d03b372.48101101.jpg', 9, 'normal', 0, 40, 1, '2026-01-17 22:37:56'),
(40, 'Guantes de Gimnasio Puma Professional', 'Diseño ergonómico y materiales resistentes de primera línea', 110.16, 'sours/img/articulos/producto_696c041380d612.28062148.jpg', 9, 'destacado', 1, 29, 1, '2026-01-17 22:37:56'),
(42, 'Bolso Deportivo Spalding Premium', 'Tecnología innovadora que mejora el rendimiento deportivo', 22.81, 'sours/img/articulos/producto_696c03e1efc9b0.62935292.jpg', 10, 'normal', 0, 26, 1, '2026-01-17 22:37:56'),
(44, 'Bolso Deportivo Under Armour Original', 'Resistente al desgaste y condiciones extremas', 156.49, 'sours/img/articulos/producto_696c03e1efc9b0.62935292.jpg', 12, 'normal', 0, 86, 1, '2026-01-17 22:37:56');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categoria_id` (`categoria_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
