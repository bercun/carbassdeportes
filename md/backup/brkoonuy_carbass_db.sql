-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 17-01-2026 a las 18:38:21
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
-- Estructura de tabla para la tabla `carrito`
--

CREATE TABLE `carrito` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `cantidad` int(11) DEFAULT 1,
  `fecha_agregado` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id`, `nombre`, `slug`) VALUES
(9, 'Fútbol', 'futbol'),
(10, 'Basket', 'basket'),
(11, 'Gym', 'gym'),
(12, 'Coleccionables', 'coleccionables');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_ventas`
--

CREATE TABLE `detalle_ventas` (
  `id` int(11) NOT NULL,
  `venta_id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `nombre_producto` varchar(200) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `detalle_ventas`
--

INSERT INTO `detalle_ventas` (`id`, `venta_id`, `producto_id`, `nombre_producto`, `cantidad`, `precio_unitario`, `subtotal`, `created_at`) VALUES
(1, 1, 8, 'Pelota de Fútbol Nike', 2, 1500.00, 3000.00, '2026-01-11 14:51:52'),
(2, 1, 9, 'Zapatillas Adidas Running', 1, 2500.00, 2500.00, '2026-01-11 14:51:52'),
(3, 2, 10, 'Camiseta Selección Uruguay', 3, 800.00, 2400.00, '2026-01-11 14:51:52'),
(4, 2, 19, 'Medias Deportivas Pack x3', 2, 150.00, 300.00, '2026-01-11 14:51:52'),
(5, 3, 21, 'Balón de Basketball Wilson', 1, 3500.00, 3500.00, '2026-01-11 14:51:52'),
(6, 3, 8, 'Short Deportivo Nike', 2, 900.00, 1800.00, '2026-01-11 14:51:52'),
(7, 3, 9, 'Botella Térmica 1L', 3, 450.00, 1350.00, '2026-01-11 14:51:52'),
(8, 4, 10, 'Guantes de Arquero', 1, 1800.00, 1800.00, '2026-01-11 14:51:52'),
(9, 4, 19, 'Raqueta de Tenis Babolat', 1, 2200.00, 2200.00, '2026-01-11 14:51:52'),
(10, 5, 21, 'Mancuernas 5kg (Par)', 2, 600.00, 1200.00, '2026-01-11 14:51:52'),
(11, 5, 8, 'Pelota de Fútbol Nike', 1, 750.00, 750.00, '2026-01-11 14:51:52'),
(12, 6, 8, 'Pelota de Fútbol Nike', 5, 1500.00, 7500.00, '2026-01-11 14:51:52'),
(13, 6, 10, 'Camiseta Selección Uruguay', 8, 800.00, 6400.00, '2026-01-11 14:51:52'),
(14, 6, 19, 'Medias Deportivas Pack x3', 6, 150.00, 900.00, '2026-01-11 14:51:52'),
(15, 7, 9, 'Zapatillas Adidas Running', 1, 2500.00, 2500.00, '2026-01-11 14:51:52'),
(16, 8, 21, 'Balón de Basketball Wilson', 2, 3500.00, 7000.00, '2026-01-11 14:51:52'),
(17, 9, 9, 'Botella Térmica 1L', 2, 450.00, 900.00, '2026-01-11 14:51:52'),
(18, 9, 19, 'Medias Deportivas Pack x3', 2, 150.00, 300.00, '2026-01-11 14:51:52'),
(19, 10, 19, 'Raqueta de Tenis Babolat', 2, 2200.00, 4400.00, '2026-01-11 14:51:52'),
(20, 10, 8, 'Short Deportivo Nike', 3, 900.00, 2700.00, '2026-01-11 14:51:52'),
(21, 11, 8, 'Pelota de Fútbol Nike', 1, 1500.00, 1500.00, '2026-01-11 14:51:52'),
(22, 11, 10, 'Camiseta Selección Uruguay', 2, 800.00, 1600.00, '2026-01-11 14:51:52'),
(23, 11, 9, 'Botella Térmica 1L', 2, 450.00, 900.00, '2026-01-11 14:51:52'),
(24, 12, 21, 'Mancuernas 5kg (Par)', 1, 600.00, 600.00, '2026-01-11 14:51:52'),
(25, 12, 19, 'Medias Deportivas Pack x3', 2, 150.00, 300.00, '2026-01-11 14:51:52'),
(26, 13, 25, 'Camiseta Época Histórica', 2, 99.99, 199.98, '2026-01-11 15:58:55'),
(27, 13, 22, 'Jersey Edición Limitada', 1, 149.99, 149.99, '2026-01-11 15:58:55'),
(28, 13, 27, 'Shorts de Fútbol Réplica Oficial', 1, 22.00, 22.00, '2026-01-11 15:58:55'),
(29, 14, 27, 'Shorts de Fútbol Réplica Oficial', 1, 22.00, 22.00, '2026-01-14 20:18:45'),
(30, 14, 28, 'Vendas coban', 1, 80.00, 80.00, '2026-01-14 20:18:45'),
(31, 15, 27, 'Shorts de Fútbol Réplica Oficial', 1, 22.00, 22.00, '2026-01-14 21:43:09'),
(32, 15, 28, 'Vendas coban', 1, 80.00, 80.00, '2026-01-14 21:43:09'),
(33, 16, 28, 'Vendas coban', 2, 80.00, 160.00, '2026-01-14 21:44:54'),
(34, 17, 9, 'Guantes de Arquero Adidas', 1, 39.99, 39.99, '2026-01-14 21:48:21'),
(35, 17, 21, 'Pesa Rusa Kettlebell 16kg', 1, 64.99, 64.99, '2026-01-14 21:48:21'),
(36, 17, 26, 'Banderin grande de Estudiantes De La Plata', 2, 179.99, 359.98, '2026-01-14 21:48:21'),
(37, 18, 28, 'Vendas coban', 1, 80.00, 80.00, '2026-01-14 22:08:52'),
(38, 18, 26, 'Banderin grande de Estudiantes De La Plata', 1, 179.99, 179.99, '2026-01-14 22:08:52'),
(39, 19, 27, 'Shorts de Fútbol Réplica Oficial', 1, 22.00, 22.00, '2026-01-14 22:15:24'),
(40, 20, 22, 'Jersey Edición Limitada', 1, 149.99, 149.99, '2026-01-14 22:25:40'),
(41, 20, 26, 'Banderin grande de Estudiantes De La Plata', 2, 179.99, 359.98, '2026-01-14 22:25:40'),
(42, 21, 28, 'Vendas coban', 1, 80.00, 80.00, '2026-01-14 22:46:48'),
(43, 22, 22, 'Jersey Edición Limitada', 1, 149.99, 149.99, '2026-01-14 22:59:25'),
(44, 23, 22, 'Jersey Edición Limitada', 5, 149.99, 749.95, '2026-01-14 23:39:31'),
(45, 23, 26, 'Banderin grande de Estudiantes De La Plata', 1, 179.99, 179.99, '2026-01-14 23:39:31'),
(46, 24, 28, 'Vendas coban', 1, 80.00, 80.00, '2026-01-17 20:17:17'),
(47, 24, 27, 'Shorts de Fútbol Réplica Oficial', 1, 22.00, 22.00, '2026-01-17 20:17:17'),
(48, 24, 26, 'Banderin grande de Estudiantes De La Plata', 1, 179.99, 179.99, '2026-01-17 20:17:17');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `logs_auditoria`
--

CREATE TABLE `logs_auditoria` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `usuario_email` varchar(150) DEFAULT NULL,
  `accion` varchar(50) NOT NULL,
  `modulo` varchar(50) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `registro_afectado` int(11) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `datos_anteriores` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`datos_anteriores`)),
  `datos_nuevos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`datos_nuevos`)),
  `fecha_hora` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `logs_auditoria`
--

INSERT INTO `logs_auditoria` (`id`, `user_id`, `usuario_email`, `accion`, `modulo`, `descripcion`, `registro_afectado`, `ip_address`, `user_agent`, `datos_anteriores`, `datos_nuevos`, `fecha_hora`) VALUES
(1, 4, 'walter@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de walter@brkoon.uy', 4, '167.62.115.51', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-11 15:55:33'),
(2, 4, 'walter@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de rootwalter (walter@brkoon.uy)', 4, '167.62.115.51', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-11 15:55:40'),
(3, 4, 'walter@brkoon.uy', 'PRODUCTO_CREADO', 'PRODUCTOS', 'Producto creado: Guantes de Gimnasio', 28, '167.62.115.51', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, '{\"nombre\":\"Guantes de Gimnasio\",\"precio\":80,\"stock\":7,\"categoria_id\":9}', '2026-01-11 15:56:41'),
(4, 4, 'walter@brkoon.uy', 'PRODUCTO_ACTUALIZADO', 'PRODUCTOS', 'Producto actualizado: Camiseta Época Histórica (ID: 25)', 25, '167.62.115.51', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, '{\"nombre\":\"Camiseta \\u00c9poca Hist\\u00f3rica\",\"precio\":99.9899999999999948840923025272786617279052734375,\"stock\":4,\"estado\":\"normal\"}', '2026-01-11 15:57:37'),
(5, 4, 'walter@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de walter@brkoon.uy', 4, '167.62.115.51', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-11 15:58:07'),
(6, 3, 'obrador@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de obrador (obrador@brkoon.uy)', 3, '167.62.115.51', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-11 15:58:12'),
(7, 3, 'obrador@brkoon.uy', 'VENTA_REGISTRADA', 'VENTAS', 'Venta registrada: 4712103502 - Total: $371.97 - Cliente: Walter Bercunchelli', 13, '167.62.115.51', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, '{\"numero_venta\":\"4712103502\",\"total\":371.970000000000027284841053187847137451171875,\"items\":3,\"cliente\":\"Walter Bercunchelli\"}', '2026-01-11 15:58:55'),
(8, 3, 'obrador@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de obrador@brkoon.uy', 3, '167.62.115.51', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-11 15:59:02'),
(9, 3, 'obrador@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de obrador@brkoon.uy', 3, '167.62.115.51', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-11 15:59:02'),
(10, 4, 'walter@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de rootwalter (walter@brkoon.uy)', 4, '167.62.115.51', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-11 15:59:07'),
(11, 4, 'walter@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de walter@brkoon.uy', 4, '167.62.115.51', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-11 15:59:50'),
(12, 4, 'walter@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de walter@brkoon.uy', 4, '167.62.115.51', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-11 15:59:50'),
(13, 5, 'marcelo@brkoon.uy', 'USUARIO_CREADO', 'USUARIOS', 'Nuevo usuario registrado: marcelo (marcelo@brkoon.uy)', 5, '167.62.115.51', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, '{\"email\":\"marcelo@brkoon.uy\",\"nombre\":\"marcelo\",\"rol\":\"user\"}', '2026-01-11 16:00:14'),
(14, 5, 'marcelo@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de marcelo@brkoon.uy', 5, '167.62.115.51', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-11 16:00:23'),
(15, 4, 'walter@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de rootwalter (walter@brkoon.uy)', 4, '167.62.115.51', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-11 16:00:31'),
(16, 4, 'walter@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de walter@brkoon.uy', 4, '167.62.115.51', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-11 16:18:10'),
(17, 4, 'walter@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de rootwalter (walter@brkoon.uy)', 4, '167.62.115.51', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', NULL, NULL, '2026-01-11 16:31:37'),
(18, 4, 'walter@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de walter@brkoon.uy', 4, '167.62.115.51', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', NULL, NULL, '2026-01-11 16:32:27'),
(19, 4, 'walter@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de rootwalter (walter@brkoon.uy)', 4, '167.62.115.51', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', NULL, NULL, '2026-01-11 17:06:23'),
(20, 4, 'walter@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de walter@brkoon.uy', 4, '167.62.115.51', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', NULL, NULL, '2026-01-11 17:06:52'),
(21, 4, 'walter@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de rootwalter (walter@brkoon.uy)', 4, '186.52.140.12', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', NULL, NULL, '2026-01-11 19:26:45'),
(22, 4, 'walter@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de walter@brkoon.uy', 4, '186.52.140.12', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', NULL, NULL, '2026-01-11 19:27:49'),
(23, 4, 'walter@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de rootwalter (walter@brkoon.uy)', 4, '167.62.115.51', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', NULL, NULL, '2026-01-12 01:15:47'),
(24, 4, 'walter@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de walter@brkoon.uy', 4, '167.62.115.51', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', NULL, NULL, '2026-01-12 01:19:00'),
(25, 4, 'walter@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de walter@brkoon.uy', 4, '167.62.115.51', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', NULL, NULL, '2026-01-12 01:19:00'),
(26, 4, 'walter@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de rootwalter (walter@brkoon.uy)', 4, '167.62.115.51', 'Mozilla/5.0 (Linux; Android 9; KFMUWI) AppleWebKit/537.36 (KHTML, like Gecko) Silk/124.3.2 like Chrome/124.0.6367.221 Safari/537.36', NULL, NULL, '2026-01-12 02:57:07'),
(27, 4, 'walter@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de rootwalter (walter@brkoon.uy)', 4, '179.29.197.63', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-13 20:01:32'),
(28, 4, 'walter@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de rootwalter (walter@brkoon.uy)', 4, '186.54.254.237', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-13 20:04:33'),
(29, 4, 'walter@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de walter@brkoon.uy', 4, '186.54.254.237', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-13 20:16:36'),
(30, 4, 'walter@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de walter@brkoon.uy', 4, '186.54.254.237', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-13 20:16:36'),
(31, 3, 'obrador@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de obrador (obrador@brkoon.uy)', 3, '186.54.254.237', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-13 20:16:40'),
(32, 3, 'obrador@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de obrador@brkoon.uy', 3, '186.54.254.237', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-13 20:19:34'),
(33, 3, 'obrador@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de obrador@brkoon.uy', 3, '186.54.254.237', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-13 20:19:34'),
(34, 4, 'walter@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de rootwalter (walter@brkoon.uy)', 4, '186.54.254.237', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-13 20:19:38'),
(35, 4, 'walter@brkoon.uy', 'PRODUCTO_ACTUALIZADO', 'PRODUCTOS', 'Producto actualizado: Vendas coban (ID: 28)', 28, '179.29.197.63', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, '{\"nombre\":\"Vendas coban\",\"precio\":80,\"stock\":7,\"estado\":\"oferta\"}', '2026-01-13 20:19:49'),
(36, 4, 'walter@brkoon.uy', 'PRODUCTO_ACTUALIZADO', 'PRODUCTOS', 'Producto actualizado: Banderin grande de Estudiantes De La Plata (ID: 26)', 26, '179.29.197.63', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, '{\"nombre\":\"Banderin grande de Estudiantes De La Plata\",\"precio\":179.990000000000009094947017729282379150390625,\"stock\":1,\"estado\":\"destacado\"}', '2026-01-13 20:30:47'),
(37, 4, 'walter@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de walter@brkoon.uy', 4, '186.54.254.237', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-13 20:32:24'),
(38, 4, 'walter@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de walter@brkoon.uy', 4, '179.29.197.63', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-13 20:46:33'),
(39, 4, 'walter@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de rootwalter (walter@brkoon.uy)', 4, '186.54.254.237', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-13 22:58:27'),
(40, 4, 'walter@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de walter@brkoon.uy', 4, '186.54.254.237', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-13 22:59:12'),
(41, 4, 'walter@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de rootwalter (walter@brkoon.uy)', 4, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 20:17:10'),
(42, 4, 'walter@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de walter@brkoon.uy', 4, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 20:17:46'),
(43, 4, 'walter@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de walter@brkoon.uy', 4, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 20:17:46'),
(44, 3, 'obrador@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de obrador (obrador@brkoon.uy)', 3, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 20:17:51'),
(45, 3, 'obrador@brkoon.uy', 'VENTA_REGISTRADA', 'VENTAS', 'Venta registrada: 2191041083 - Total: $102 - Cliente: Walter Bercunchelli', 14, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, '{\"numero_venta\":\"2191041083\",\"total\":102,\"items\":2,\"cliente\":\"Walter Bercunchelli\"}', '2026-01-14 20:18:45'),
(46, 3, 'obrador@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de obrador@brkoon.uy', 3, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 20:18:57'),
(47, 4, 'walter@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de rootwalter (walter@brkoon.uy)', 4, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 20:19:03'),
(48, 4, 'walter@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de walter@brkoon.uy', 4, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 20:19:55'),
(49, 4, 'walter@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de rootwalter (walter@brkoon.uy)', 4, '167.59.231.219', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', NULL, NULL, '2026-01-14 20:52:19'),
(50, 4, 'walter@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de walter@brkoon.uy', 4, '167.59.231.219', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', NULL, NULL, '2026-01-14 21:04:49'),
(51, 4, 'walter@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de walter@brkoon.uy', 4, '167.59.231.219', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', NULL, NULL, '2026-01-14 21:04:49'),
(52, 3, 'obrador@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de obrador (obrador@brkoon.uy)', 3, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 21:32:40'),
(53, 3, 'obrador@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de obrador@brkoon.uy', 3, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 21:38:42'),
(54, 3, 'obrador@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de obrador (obrador@brkoon.uy)', 3, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 21:42:49'),
(55, 3, 'obrador@brkoon.uy', 'VENTA_REGISTRADA', 'VENTAS', 'Venta registrada: 2698167699 - Total: $102 - Cliente: Walter Bercunchelli', 15, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, '{\"numero_venta\":\"2698167699\",\"total\":102,\"items\":2,\"cliente\":\"Walter Bercunchelli\"}', '2026-01-14 21:43:09'),
(56, 3, 'obrador@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de obrador@brkoon.uy', 3, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 21:43:44'),
(57, 6, 'bercun@gmail.com', 'USUARIO_CREADO', 'USUARIOS', 'Nuevo usuario registrado: gmail_bercun (bercun@gmail.com)', 6, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, '{\"email\":\"bercun@gmail.com\",\"nombre\":\"gmail_bercun\",\"rol\":\"user\"}', '2026-01-14 21:44:17'),
(58, 6, 'bercun@gmail.com', 'VENTA_REGISTRADA', 'VENTAS', 'Venta registrada: 2708463578 - Total: $160 - Cliente: Walter Bercunchelli', 16, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, '{\"numero_venta\":\"2708463578\",\"total\":160,\"items\":1,\"cliente\":\"Walter Bercunchelli\"}', '2026-01-14 21:44:54'),
(59, 6, 'bercun@gmail.com', 'LOGOUT', 'AUTH', 'Cierre de sesión de bercun@gmail.com', 6, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 21:45:57'),
(60, 6, 'bercun@gmail.com', 'LOGOUT', 'AUTH', 'Cierre de sesión de bercun@gmail.com', 6, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 21:45:57'),
(61, 4, 'walter@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de rootwalter (walter@brkoon.uy)', 4, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 21:46:06'),
(62, 4, 'walter@brkoon.uy', 'PRODUCTO_ACTUALIZADO', 'PRODUCTOS', 'Producto actualizado: Banderin grande de Estudiantes De La Plata (ID: 26)', 26, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, '{\"nombre\":\"Banderin grande de Estudiantes De La Plata\",\"precio\":179.990000000000009094947017729282379150390625,\"stock\":7,\"estado\":\"destacado\"}', '2026-01-14 21:46:16'),
(63, 4, 'walter@brkoon.uy', 'PRODUCTO_ACTUALIZADO', 'PRODUCTOS', 'Producto actualizado: Camiseta Retro Clásica (ID: 23)', 23, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, '{\"nombre\":\"Camiseta Retro Cl\\u00e1sica\",\"precio\":89.9899999999999948840923025272786617279052734375,\"stock\":15,\"estado\":\"normal\"}', '2026-01-14 21:46:27'),
(64, 4, 'walter@brkoon.uy', 'PRODUCTO_ACTUALIZADO', 'PRODUCTOS', 'Producto actualizado: Pesa Rusa Kettlebell 16kg (ID: 21)', 21, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, '{\"nombre\":\"Pesa Rusa Kettlebell 16kg\",\"precio\":64.9899999999999948840923025272786617279052734375,\"stock\":9,\"estado\":\"recien_agregado\"}', '2026-01-14 21:46:34'),
(65, 4, 'walter@brkoon.uy', 'PRODUCTO_ACTUALIZADO', 'PRODUCTOS', 'Producto actualizado: Guantes de Arquero Adidas (ID: 9)', 9, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, '{\"nombre\":\"Guantes de Arquero Adidas\",\"precio\":39.99000000000000198951966012828052043914794921875,\"stock\":7,\"estado\":\"destacado\"}', '2026-01-14 21:46:40'),
(66, 4, 'walter@brkoon.uy', 'PRODUCTO_ACTUALIZADO', 'PRODUCTOS', 'Producto actualizado: Camiseta de Entrenamiento (ID: 8)', 8, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, '{\"nombre\":\"Camiseta de Entrenamiento\",\"precio\":29.989999999999998436805981327779591083526611328125,\"stock\":1,\"estado\":\"destacado\"}', '2026-01-14 21:46:44'),
(67, 4, 'walter@brkoon.uy', 'PRODUCTO_ACTUALIZADO', 'PRODUCTOS', 'Producto actualizado: Camiseta de Entrenamiento (ID: 8)', 8, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, '{\"nombre\":\"Camiseta de Entrenamiento\",\"precio\":29.989999999999998436805981327779591083526611328125,\"stock\":7,\"estado\":\"destacado\"}', '2026-01-14 21:46:51'),
(68, 4, 'walter@brkoon.uy', 'PRODUCTO_ACTUALIZADO', 'PRODUCTOS', 'Producto actualizado: Medias de Compresión (ID: 10)', 10, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, '{\"nombre\":\"Medias de Compresi\\u00f3n\",\"precio\":15.9900000000000002131628207280300557613372802734375,\"stock\":2,\"estado\":\"destacado\"}', '2026-01-14 21:46:56'),
(69, 4, 'walter@brkoon.uy', 'PRODUCTO_ACTUALIZADO', 'PRODUCTOS', 'Producto actualizado: Medias de Compresión (ID: 10)', 10, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, '{\"nombre\":\"Medias de Compresi\\u00f3n\",\"precio\":15.9900000000000002131628207280300557613372802734375,\"stock\":1,\"estado\":\"destacado\"}', '2026-01-14 21:47:01'),
(70, 4, 'walter@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de walter@brkoon.uy', 4, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 21:47:22'),
(71, 6, 'bercun@gmail.com', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de gmail_bercun (bercun@gmail.com)', 6, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 21:47:30'),
(72, 6, 'bercun@gmail.com', 'VENTA_REGISTRADA', 'VENTAS', 'Venta registrada: 2729395571 - Total: $464.96 - Cliente: Walter Bercunchelli', 17, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, '{\"numero_venta\":\"2729395571\",\"total\":464.9600000000000363797880709171295166015625,\"items\":3,\"cliente\":\"Walter Bercunchelli\"}', '2026-01-14 21:48:21'),
(73, 6, 'bercun@gmail.com', 'LOGOUT', 'AUTH', 'Cierre de sesión de bercun@gmail.com', 6, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 21:49:58'),
(74, 6, 'bercun@gmail.com', 'LOGOUT', 'AUTH', 'Cierre de sesión de bercun@gmail.com', 6, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 21:49:58'),
(75, 4, 'walter@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de rootwalter (walter@brkoon.uy)', 4, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 21:50:02'),
(76, 4, 'walter@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de walter@brkoon.uy', 4, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 21:53:40'),
(77, 4, 'walter@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de rootwalter (walter@brkoon.uy)', 4, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 21:53:46'),
(78, 4, 'walter@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de rootwalter (walter@brkoon.uy)', 4, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 21:57:03'),
(79, 4, 'walter@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de rootwalter (walter@brkoon.uy)', 4, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 21:57:27'),
(80, 4, 'walter@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de rootwalter (walter@brkoon.uy)', 4, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 21:58:00'),
(81, 4, 'walter@brkoon.uy', 'LOGIN_FAILED', 'AUTH', 'Contraseña incorrecta para el usuario: walter@brkoon.uy', 4, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 21:58:18'),
(82, 4, 'walter@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de rootwalter (walter@brkoon.uy)', 4, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 22:01:18'),
(83, 3, 'obrador@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de obrador (obrador@brkoon.uy)', 3, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 22:02:11'),
(84, 4, 'walter@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de rootwalter (walter@brkoon.uy)', 4, '167.59.231.219', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', NULL, NULL, '2026-01-14 22:04:00'),
(85, 4, 'walter@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de rootwalter (walter@brkoon.uy)', 4, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 22:05:30'),
(86, 4, 'walter@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de rootwalter (walter@brkoon.uy)', 4, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 22:06:09'),
(87, 4, 'walter@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de walter@brkoon.uy', 4, '167.59.231.219', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', NULL, NULL, '2026-01-14 22:06:28'),
(88, 6, 'bercun@gmail.com', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de gmail_bercun (bercun@gmail.com)', 6, '167.59.231.219', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', NULL, NULL, '2026-01-14 22:06:33'),
(89, 6, 'bercun@gmail.com', 'LOGOUT', 'AUTH', 'Cierre de sesión de bercun@gmail.com', 6, '167.59.231.219', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', NULL, NULL, '2026-01-14 22:06:36'),
(90, 6, 'bercun@gmail.com', 'LOGOUT', 'AUTH', 'Cierre de sesión de bercun@gmail.com', 6, '167.59.231.219', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', NULL, NULL, '2026-01-14 22:06:36'),
(91, 4, 'walter@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de rootwalter (walter@brkoon.uy)', 4, '167.59.231.219', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', NULL, NULL, '2026-01-14 22:06:41'),
(92, 4, 'walter@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de walter@brkoon.uy', 4, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 22:07:34'),
(93, 4, 'walter@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de walter@brkoon.uy', 4, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 22:07:34'),
(94, 4, 'walter@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de rootwalter (walter@brkoon.uy)', 4, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 22:07:41'),
(95, 4, 'walter@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de walter@brkoon.uy', 4, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 22:07:46'),
(96, 6, 'bercun@gmail.com', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de gmail_bercun (bercun@gmail.com)', 6, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 22:08:05'),
(97, 6, 'bercun@gmail.com', 'VENTA_REGISTRADA', 'VENTAS', 'Venta registrada: 2852265065 - Total: $259.99 - Cliente: Walter Bercunchelli', 18, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, '{\"numero_venta\":\"2852265065\",\"total\":259.990000000000009094947017729282379150390625,\"items\":2,\"cliente\":\"Walter Bercunchelli\"}', '2026-01-14 22:08:52'),
(98, 6, 'bercun@gmail.com', 'LOGOUT', 'AUTH', 'Cierre de sesión de bercun@gmail.com', 6, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 22:15:05'),
(99, 6, 'bercun@gmail.com', 'LOGOUT', 'AUTH', 'Cierre de sesión de bercun@gmail.com', 6, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 22:15:05'),
(100, 6, 'bercun@gmail.com', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de gmail_bercun (bercun@gmail.com)', 6, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 22:15:09'),
(101, 6, 'bercun@gmail.com', 'VENTA_REGISTRADA', 'VENTAS', 'Venta registrada: 2891643504 - Total: $22 - Cliente: Walter Bercunchelli', 19, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, '{\"numero_venta\":\"2891643504\",\"total\":22,\"items\":1,\"cliente\":\"Walter Bercunchelli\"}', '2026-01-14 22:15:24'),
(102, 4, 'walter@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de walter@brkoon.uy', 4, '167.59.231.219', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', NULL, NULL, '2026-01-14 22:20:04'),
(103, 4, 'walter@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de rootwalter (walter@brkoon.uy)', 4, '167.59.231.219', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', NULL, NULL, '2026-01-14 22:20:39'),
(104, 4, 'walter@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de walter@brkoon.uy', 4, '167.59.231.219', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', NULL, NULL, '2026-01-14 22:21:33'),
(105, 4, 'walter@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de walter@brkoon.uy', 4, '167.59.231.219', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', NULL, NULL, '2026-01-14 22:21:33'),
(106, 6, 'bercun@gmail.com', 'LOGOUT', 'AUTH', 'Cierre de sesión de bercun@gmail.com', 6, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 22:24:24'),
(107, 6, 'bercun@gmail.com', 'LOGOUT', 'AUTH', 'Cierre de sesión de bercun@gmail.com', 6, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 22:24:24'),
(108, 6, 'bercun@gmail.com', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de gmail_bercun (bercun@gmail.com)', 6, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 22:24:48'),
(109, 6, 'bercun@gmail.com', 'VENTA_REGISTRADA', 'VENTAS', 'Venta registrada: 2953244728 - Total: $509.97 - Cliente: Walter Bercunchelli', 20, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, '{\"numero_venta\":\"2953244728\",\"total\":509.970000000000027284841053187847137451171875,\"items\":2,\"cliente\":\"Walter Bercunchelli\"}', '2026-01-14 22:25:40'),
(110, 6, 'bercun@gmail.com', 'LOGOUT', 'AUTH', 'Cierre de sesión de bercun@gmail.com', 6, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 22:43:05'),
(111, 6, 'bercun@gmail.com', 'LOGOUT', 'AUTH', 'Cierre de sesión de bercun@gmail.com', 6, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 22:43:05'),
(112, 4, 'walter@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de rootwalter (walter@brkoon.uy)', 4, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 22:44:19'),
(113, 4, 'walter@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de walter@brkoon.uy', 4, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 22:46:17'),
(114, 4, 'walter@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de walter@brkoon.uy', 4, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 22:46:17'),
(115, 6, 'bercun@gmail.com', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de gmail_bercun (bercun@gmail.com)', 6, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 22:46:23'),
(116, 6, 'bercun@gmail.com', 'VENTA_REGISTRADA', 'VENTAS', 'Venta registrada: 3079770852 - Total: $80 - Cliente: Walter Bercunchelli', 21, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, '{\"numero_venta\":\"3079770852\",\"total\":80,\"items\":1,\"cliente\":\"Walter Bercunchelli\"}', '2026-01-14 22:46:48'),
(117, 6, 'bercun@gmail.com', 'LOGOUT', 'AUTH', 'Cierre de sesión de bercun@gmail.com', 6, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 22:50:44'),
(118, 6, 'bercun@gmail.com', 'LOGOUT', 'AUTH', 'Cierre de sesión de bercun@gmail.com', 6, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 22:50:44'),
(119, 4, 'walter@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de rootwalter (walter@brkoon.uy)', 4, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 22:57:34'),
(120, 4, 'walter@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de walter@brkoon.uy', 4, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 22:59:03'),
(121, 6, 'bercun@gmail.com', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de gmail_bercun (bercun@gmail.com)', 6, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 22:59:10'),
(122, 6, 'bercun@gmail.com', 'VENTA_REGISTRADA', 'VENTAS', 'Venta registrada: 3155761183 - Total: $149.99 - Cliente: Walter Bercunchelli', 22, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, '{\"numero_venta\":\"3155761183\",\"total\":149.990000000000009094947017729282379150390625,\"items\":1,\"cliente\":\"Walter Bercunchelli\"}', '2026-01-14 22:59:25'),
(123, 6, 'bercun@gmail.com', 'LOGOUT', 'AUTH', 'Cierre de sesión de bercun@gmail.com', 6, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 23:02:03'),
(124, 6, 'bercun@gmail.com', 'LOGOUT', 'AUTH', 'Cierre de sesión de bercun@gmail.com', 6, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 23:02:03'),
(125, 6, 'bercun@gmail.com', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de gmail_bercun (bercun@gmail.com)', 6, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 23:02:11'),
(126, 6, 'bercun@gmail.com', 'LOGOUT', 'AUTH', 'Cierre de sesión de bercun@gmail.com', 6, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 23:02:15'),
(127, 4, 'walter@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de rootwalter (walter@brkoon.uy)', 4, '167.59.231.219', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', NULL, NULL, '2026-01-14 23:04:12'),
(128, 4, 'walter@brkoon.uy', 'PRODUCTO_ACTUALIZADO', 'PRODUCTOS', 'Producto actualizado: Vendas coban (ID: 28)', 28, '167.59.231.219', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, '{\"nombre\":\"Vendas coban\",\"precio\":80,\"stock\":10,\"estado\":\"oferta\"}', '2026-01-14 23:04:53'),
(129, 4, 'walter@brkoon.uy', 'PRODUCTO_ACTUALIZADO', 'PRODUCTOS', 'Producto actualizado: Shorts de Fútbol Réplica Oficial (ID: 27)', 27, '167.59.231.219', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, '{\"nombre\":\"Shorts de F\\u00fatbol R\\u00e9plica Oficial\",\"precio\":22,\"stock\":100,\"estado\":\"destacado\"}', '2026-01-14 23:05:23'),
(130, 4, 'walter@brkoon.uy', 'PRODUCTO_ACTUALIZADO', 'PRODUCTOS', 'Producto actualizado: Jersey Edición Limitada (ID: 22)', 22, '167.59.231.219', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, '{\"nombre\":\"Jersey Edici\\u00f3n Limitada\",\"precio\":149.990000000000009094947017729282379150390625,\"stock\":100,\"estado\":\"destacado\"}', '2026-01-14 23:06:22'),
(131, 4, 'walter@brkoon.uy', 'PRODUCTO_ACTUALIZADO', 'PRODUCTOS', 'Producto actualizado: Guantes de Gimnasio (ID: 19)', 19, '167.59.231.219', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, '{\"nombre\":\"Guantes de Gimnasio\",\"precio\":24.989999999999998436805981327779591083526611328125,\"stock\":100,\"estado\":\"normal\"}', '2026-01-14 23:06:34'),
(132, 4, 'walter@brkoon.uy', 'PRODUCTO_ACTUALIZADO', 'PRODUCTOS', 'Producto actualizado: Medias de Compresión (ID: 10)', 10, '167.59.231.219', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, '{\"nombre\":\"Medias de Compresi\\u00f3n\",\"precio\":15.9900000000000002131628207280300557613372802734375,\"stock\":100,\"estado\":\"destacado\"}', '2026-01-14 23:06:47'),
(133, 4, 'walter@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de walter@brkoon.uy', 4, '167.59.231.219', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-14 23:06:55'),
(134, NULL, 'pata76@montevideo.com.uy', 'LOGIN_FAILED', 'AUTH', 'Intento de login fallido para el email: pata76@montevideo.com.uy', NULL, '167.59.231.219', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', NULL, NULL, '2026-01-14 23:37:31'),
(135, 7, 'pata76@montevideo.com.uy', 'USUARIO_CREADO', 'USUARIOS', 'Nuevo usuario registrado: Pata (pata76@montevideo.com.uy)', 7, '167.59.231.219', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', NULL, '{\"email\":\"pata76@montevideo.com.uy\",\"nombre\":\"Pata\",\"rol\":\"user\"}', '2026-01-14 23:37:51'),
(136, 7, 'pata76@montevideo.com.uy', 'VENTA_REGISTRADA', 'VENTAS', 'Venta registrada: 3395872548 - Total: $929.94 - Cliente: Patricia  Zoppis', 23, '167.59.231.219', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', NULL, '{\"numero_venta\":\"3395872548\",\"total\":929.94000000000005456968210637569427490234375,\"items\":2,\"cliente\":\"Patricia  Zoppis\"}', '2026-01-14 23:39:31'),
(137, 7, 'pata76@montevideo.com.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de pata76@montevideo.com.uy', 7, '167.59.231.219', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', NULL, NULL, '2026-01-14 23:40:02'),
(138, 4, 'walter@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de rootwalter (walter@brkoon.uy)', 4, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-15 02:33:45'),
(139, 4, 'walter@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de walter@brkoon.uy', 4, '167.59.231.219', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-15 02:34:22'),
(140, 3, 'obrador@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de obrador (obrador@brkoon.uy)', 3, '167.57.167.127', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', NULL, NULL, '2026-01-15 14:52:19'),
(141, 6, 'bercun@gmail.com', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de gmail_bercun (bercun@gmail.com)', 6, '186.54.253.95', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-17 20:16:40'),
(142, 6, 'bercun@gmail.com', 'VENTA_REGISTRADA', 'VENTAS', 'Venta registrada: 8103502780 - Total: $281.99 - Cliente: Walter Bercunchelli', 24, '186.54.253.95', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, '{\"numero_venta\":\"8103502780\",\"total\":281.990000000000009094947017729282379150390625,\"items\":3,\"cliente\":\"Walter Bercunchelli\"}', '2026-01-17 20:17:17'),
(143, 6, 'bercun@gmail.com', 'LOGOUT', 'AUTH', 'Cierre de sesión de bercun@gmail.com', 6, '186.54.253.95', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-17 20:19:10'),
(144, 4, 'walter@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de rootwalter (walter@brkoon.uy)', 4, '186.54.253.95', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-17 20:19:15'),
(145, 4, 'walter@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de walter@brkoon.uy', 4, '186.54.253.95', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-17 20:29:58'),
(146, 4, 'walter@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de rootwalter (walter@brkoon.uy)', 4, '186.54.253.95', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-17 20:31:06'),
(147, 4, 'walter@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de walter@brkoon.uy', 4, '186.54.253.95', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-17 20:32:19'),
(148, 4, 'walter@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de rootwalter (walter@brkoon.uy)', 4, '186.54.253.95', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', NULL, NULL, '2026-01-17 20:33:09'),
(149, 4, 'walter@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de walter@brkoon.uy', 4, '186.54.253.95', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', NULL, NULL, '2026-01-17 20:33:12'),
(150, 4, 'walter@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de rootwalter (walter@brkoon.uy)', 4, '186.54.253.95', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', NULL, NULL, '2026-01-17 20:33:16'),
(151, 4, 'walter@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de rootwalter (walter@brkoon.uy)', 4, '186.54.253.95', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', NULL, NULL, '2026-01-17 20:33:50'),
(152, 4, 'walter@brkoon.uy', 'PRODUCTO_ACTUALIZADO', 'PRODUCTOS', 'Producto actualizado: Shorts de Fútbol Réplica Oficial (ID: 27)', 27, '186.54.253.95', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', NULL, '{\"nombre\":\"Shorts de F\\u00fatbol R\\u00e9plica Oficial\",\"precio\":22,\"stock\":99,\"estado\":\"destacado\"}', '2026-01-17 20:34:36'),
(153, 4, 'walter@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de walter@brkoon.uy', 4, '186.54.253.95', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', NULL, NULL, '2026-01-17 20:36:06'),
(154, 4, 'walter@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de rootwalter (walter@brkoon.uy)', 4, '186.54.253.95', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', NULL, NULL, '2026-01-17 20:37:39'),
(155, 4, 'walter@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de rootwalter (walter@brkoon.uy)', 4, '186.54.253.95', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-17 21:07:21'),
(156, 4, 'walter@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de walter@brkoon.uy', 4, '186.54.253.95', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-17 21:29:36'),
(157, 4, 'walter@brkoon.uy', 'LOGOUT', 'AUTH', 'Cierre de sesión de walter@brkoon.uy', 4, '186.54.253.95', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-17 21:29:36'),
(158, 4, 'walter@brkoon.uy', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso de rootwalter (walter@brkoon.uy)', 4, '186.54.253.95', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, NULL, '2026-01-17 21:30:05'),
(159, 4, 'walter@brkoon.uy', 'PRODUCTO_ACTUALIZADO', 'PRODUCTOS', 'Producto actualizado: Vendas coban (ID: 28)', 28, '186.54.253.95', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', NULL, '{\"nombre\":\"Vendas coban\",\"precio\":80,\"stock\":9,\"estado\":\"oferta\"}', '2026-01-17 21:31:11');

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
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `nombre`, `descripcion`, `precio`, `imagen_url`, `categoria_id`, `estado`, `destacado`, `stock`, `fecha_creacion`) VALUES
(8, 'Camiseta de Entrenamiento', 'Camiseta técnica transpirable para entrenamientos', 29.99, 'sours/img/articulos/producto_695afd6b40ba23.40749591.jpg', 9, 'destacado', 1, 7, '2026-01-03 20:02:40'),
(9, 'Guantes de Arquero Adidas', 'Guantes profesionales con grip superior', 39.99, 'sours/img/articulos/producto_695afd5c668040.88754875.jpg', 9, 'destacado', 1, 6, '2026-01-03 20:02:40'),
(10, 'Medias de Compresión', 'Medias técnicas de compresión para mejor rendimiento', 15.99, 'sours/img/articulos/producto_695afd4dd8f5b7.33716491.jpg', 9, 'destacado', 1, 100, '2026-01-03 20:02:40'),
(19, 'Guantes de Gimnasio', 'Guantes con soporte de muñeca para levantamiento', 24.99, 'sours/img/articulos/producto_695a66f90fa381.44802827.jpg', 9, 'normal', 0, 100, '2026-01-03 20:02:41'),
(20, 'Botella Shaker Proteína', 'Botella mezcladora de 700ml con compartimento', 12.99, 'sours/img/articulos/producto_695a669a5d16b1.55145907.jpg', 10, 'normal', 0, 4, '2026-01-03 20:02:41'),
(21, 'Pesa Rusa Kettlebell 16kg', 'Pesa rusa de hierro fundido profesional', 64.99, 'sours/img/articulos/producto_695a667460aa92.63762951.jpg', 9, 'recien_agregado', 1, 8, '2026-01-03 20:02:41'),
(22, 'Jersey Edición Limitada', 'Camiseta conmemorativa edición limitada numerada', 149.99, 'sours/img/articulos/producto_695afd6b40ba23.40749591.jpg', 12, 'destacado', 1, 95, '2026-01-03 20:02:41'),
(23, 'Camiseta Retro Clásica', 'Réplica de camiseta histórica años 90', 89.99, 'sours/img/articulos/producto_695afd6b40ba23.40749591.jpg', 12, 'normal', 0, 15, '2026-01-03 20:02:41'),
(24, 'Banderín Equipo Clásico', 'Banderín oficial de equipo histórico', 34.99, 'sours/img/articulos/producto_695afd6b40ba23.40749591.jpg', 12, 'normal', 0, 2, '2026-01-03 20:02:41'),
(25, 'Camiseta Época Histórica', 'Camiseta conmemorativa de época dorada', 99.99, 'sours/img/articulos/producto_695afd6b40ba23.40749591.jpg', 12, 'normal', 0, 2, '2026-01-03 20:02:41'),
(26, 'Banderin grande de Estudiantes De La Plata', 'Jersey especial con autógrafos impresos', 179.99, 'sours/img/articulos/producto_695afd6b40ba23.40749591.jpg', 12, 'destacado', 1, 0, '2026-01-03 20:02:41'),
(27, 'Shorts de Fútbol Réplica Oficial', 'lorem', 22.00, 'sours/img/articulos/producto_696bf25be509a1.43243322.jpg', 12, 'destacado', 0, 99, '2026-01-04 13:08:17'),
(28, 'Vendas coban', 'vendas', 80.00, 'sours/img/articulos/producto_696bff9fcb8dc8.94273456.jpg', 9, 'oferta', 0, 9, '2026-01-11 15:56:41');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `rol` enum('user','admin') DEFAULT 'user',
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `email`, `password`, `nombre`, `rol`, `fecha_registro`) VALUES
(1, 'admin_carbass@brkoon.uy', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrador', 'admin', '2026-01-03 12:28:24'),
(3, 'obrador@brkoon.uy', '$2y$10$2F9IZTfWA42NA9Ad/XtK2O5Ykvp2VD9l5pW3vt32QxZt5p4o9JqRC', 'obrador', 'user', '2026-01-03 20:29:59'),
(4, 'walter@brkoon.uy', '$2y$10$5VvFaNobCLFx/fFcLzw8x.j4svlppJgJ9bk96n2ctOU1yulWpnHdq', 'rootwalter', 'admin', '2026-01-03 20:42:25'),
(5, 'marcelo@brkoon.uy', '$2y$10$ZmmZmV.XraBU3C6kySS/f.FOJP3nofyfnoJ94YWwihRoxyF50NiOa', 'marcelo', 'user', '2026-01-11 16:00:14'),
(6, 'bercun@gmail.com', '$2y$10$7gbFXcJvrbHwKy3pSt4/luUgY6q9HCVu8sQRW7ivt1oO2sVL5GN02', 'gmail_bercun', 'user', '2026-01-14 21:44:17'),
(7, 'pata76@montevideo.com.uy', '$2y$10$ZjrPXNbZVw5fjPHXvgvh.OmYHJxVrwakkMLxYudc7nZr48kcJq3ee', 'Pata', 'user', '2026-01-14 23:37:51');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

CREATE TABLE `ventas` (
  `id` int(11) NOT NULL,
  `numero_venta` varchar(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `fecha_venta` datetime NOT NULL DEFAULT current_timestamp(),
  `subtotal` decimal(10,2) NOT NULL,
  `iva` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `nombre_cliente` varchar(100) NOT NULL,
  `apellido_cliente` varchar(100) NOT NULL,
  `email_cliente` varchar(150) NOT NULL,
  `telefono_cliente` varchar(20) NOT NULL,
  `direccion_cliente` text NOT NULL,
  `observaciones` text DEFAULT NULL,
  `estado` varchar(20) DEFAULT 'completada',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `ventas`
--

INSERT INTO `ventas` (`id`, `numero_venta`, `user_id`, `fecha_venta`, `subtotal`, `iva`, `total`, `nombre_cliente`, `apellido_cliente`, `email_cliente`, `telefono_cliente`, `direccion_cliente`, `observaciones`, `estado`, `created_at`, `updated_at`) VALUES
(1, '2601090001', 1, '2026-01-09 11:51:52', 4098.36, 901.64, 5000.00, 'María', 'González', 'maria.gonzalez@email.com', '099123456', 'Av. 18 de Julio 1234, Montevideo', 'Entrega urgente', 'completada', '2026-01-11 14:51:52', '2026-01-11 14:51:52'),
(2, '2601060001', 3, '2026-01-06 11:51:52', 2459.02, 540.98, 3000.00, 'Juan', 'Pérez', 'juan.perez@email.com', '098765432', 'Bulevar Artigas 2345, Montevideo', '', 'completada', '2026-01-11 14:51:52', '2026-01-11 14:51:52'),
(3, '2601040001', 1, '2026-01-04 11:51:52', 6147.54, 1352.46, 7500.00, 'Ana', 'Rodríguez', 'ana.rodriguez@email.com', '091234567', 'Av. Italia 3456, Montevideo', 'Llamar antes de entregar', 'completada', '2026-01-11 14:51:52', '2026-01-11 14:51:52'),
(4, '2601010001', 4, '2026-01-01 11:51:52', 3278.69, 721.31, 4000.00, 'Carlos', 'Martínez', 'carlos.martinez@email.com', '092345678', 'Av. Agraciada 4567, Montevideo', '', 'completada', '2026-01-11 14:51:52', '2026-01-11 14:51:52'),
(5, '2512270001', 3, '2025-12-27 11:51:52', 1639.34, 360.66, 2000.00, 'Laura', 'Fernández', 'laura.fernandez@email.com', '093456789', 'Av. 8 de Octubre 5678, Montevideo', 'Oficina 301', 'completada', '2026-01-11 14:51:52', '2026-01-11 14:51:52'),
(6, '2512220001', 1, '2025-12-22 11:51:52', 9836.07, 2163.93, 12000.00, 'Roberto', 'Silva', 'roberto.silva@email.com', '094567890', 'Bvar. España 6789, Montevideo', 'Equipo completo para club', 'completada', '2026-01-11 14:51:52', '2026-01-11 14:51:52'),
(7, '2512170001', 4, '2025-12-17 11:51:52', 2049.18, 450.82, 2500.00, 'Sofía', 'López', 'sofia.lopez@email.com', '095678901', 'Av. Rivera 7890, Montevideo', '', 'completada', '2026-01-11 14:51:52', '2026-01-11 14:51:52'),
(8, '2512120001', 3, '2025-12-12 11:51:52', 4918.03, 1081.97, 6000.00, 'Diego', 'Ramírez', 'diego.ramirez@email.com', '096789012', 'Av. Brasil 8901, Montevideo', 'Dejar en portería', 'completada', '2026-01-11 14:51:52', '2026-01-11 14:51:52'),
(9, '2512070001', 1, '2025-12-07 11:51:52', 1229.51, 270.49, 1500.00, 'Valentina', 'Torres', 'valentina.torres@email.com', '097890123', 'Av. Gral. Flores 9012, Montevideo', '', 'completada', '2026-01-11 14:51:52', '2026-01-11 14:51:52'),
(10, '2512020001', 4, '2025-12-02 11:51:52', 5737.70, 1262.30, 7000.00, 'Matías', 'Castro', 'matias.castro@email.com', '098901234', 'Av. Millán 0123, Montevideo', 'Compra corporativa', 'completada', '2026-01-11 14:51:52', '2026-01-11 14:51:52'),
(11, '2601110001', 1, '2026-01-11 11:51:52', 3278.69, 721.31, 4000.00, 'Lucía', 'Vargas', 'lucia.vargas@email.com', '099012345', 'Av. Sarmiento 1234, Montevideo', 'Envío express', 'completada', '2026-01-11 14:51:52', '2026-01-11 14:51:52'),
(12, '2601080001', 3, '2026-01-08 11:51:52', 819.67, 180.33, 1000.00, 'Pablo', 'Méndez', 'pablo.mendez@email.com', '099123456', 'Av. Propios 2345, Montevideo', 'Pago pendiente', 'pendiente', '2026-01-11 14:51:52', '2026-01-11 14:51:52'),
(13, '4712103502', 3, '2026-01-11 12:58:55', 304.89, 67.08, 371.97, 'Walter', 'Bercunchelli', 'bercun@gmail.com', '092353463', 'charrua 2747 p 4', '', 'completada', '2026-01-11 15:58:55', '2026-01-11 15:58:55'),
(14, '2191041083', 3, '2026-01-14 17:18:45', 83.61, 18.39, 102.00, 'Walter', 'Bercunchelli', 'bercun@gmail.com', '092353463', 'charrua 2747 p 4', 'prueba style', 'completada', '2026-01-14 20:18:45', '2026-01-14 20:18:45'),
(15, '2698167699', 3, '2026-01-14 18:43:09', 83.61, 18.39, 102.00, 'Walter', 'Bercunchelli', 'bercun@gmail.com', '092353463', 'charrua 2747 p 4', '', 'completada', '2026-01-14 21:43:09', '2026-01-14 21:43:09'),
(16, '2708463578', 6, '2026-01-14 18:44:54', 131.15, 28.85, 160.00, 'Walter', 'Bercunchelli', 'bercun@gmail.com', '092353463', 'charrua 2747 p 4', '', 'completada', '2026-01-14 21:44:54', '2026-01-14 21:44:54'),
(17, '2729395571', 6, '2026-01-14 18:48:21', 381.11, 83.85, 464.96, 'Walter', 'Bercunchelli', 'bercun@gmail.com', '092353463', 'charrua 2747 p 4', '', 'completada', '2026-01-14 21:48:21', '2026-01-14 21:48:21'),
(18, '2852265065', 6, '2026-01-14 19:08:52', 213.11, 46.88, 259.99, 'Walter', 'Bercunchelli', 'bercun@gmail.com', '092353463', 'charrua 2747 p 4', '', 'completada', '2026-01-14 22:08:52', '2026-01-14 22:08:52'),
(19, '2891643504', 6, '2026-01-14 19:15:24', 18.03, 3.97, 22.00, 'Walter', 'Bercunchelli', 'bercun@gmail.com', '092353463', 'charrua 2747 p 4', '', 'completada', '2026-01-14 22:15:24', '2026-01-14 22:15:24'),
(20, '2953244728', 6, '2026-01-14 19:25:40', 418.01, 91.96, 509.97, 'Walter', 'Bercunchelli', 'bercun@gmail.com', '092353463', 'charrua 2747 p 4', '', 'completada', '2026-01-14 22:25:40', '2026-01-14 22:25:40'),
(21, '3079770852', 6, '2026-01-14 19:46:48', 65.57, 14.43, 80.00, 'Walter', 'Bercunchelli', 'bercun@gmail.com', '092353463', 'charrua 2747 p 4', '', 'completada', '2026-01-14 22:46:48', '2026-01-14 22:46:48'),
(22, '3155761183', 6, '2026-01-14 19:59:25', 122.94, 27.05, 149.99, 'Walter', 'Bercunchelli', 'bercun@gmail.com', '092353463', 'charrua 2747 p 4', '', 'completada', '2026-01-14 22:59:25', '2026-01-14 22:59:25'),
(23, '3395872548', 7, '2026-01-14 20:39:31', 762.25, 167.69, 929.94, 'Patricia', ' Zoppis', 'pata76@montevideo.com.uy', '27093214', 'Charrúa 2747', 'Compra de prueba', 'completada', '2026-01-14 23:39:31', '2026-01-14 23:39:31'),
(24, '8103502780', 6, '2026-01-17 17:17:17', 231.14, 50.85, 281.99, 'Walter', 'Bercunchelli', 'bercun@gmail.com', '092353463', 'charrua 2747 p 4', 'prueba mails', 'completada', '2026-01-17 20:17:17', '2026-01-17 20:17:17');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_product` (`user_id`,`producto_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_producto_id` (`producto_id`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indices de la tabla `detalle_ventas`
--
ALTER TABLE `detalle_ventas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_venta_id` (`venta_id`),
  ADD KEY `idx_producto_id` (`producto_id`);

--
-- Indices de la tabla `logs_auditoria`
--
ALTER TABLE `logs_auditoria`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_accion` (`accion`),
  ADD KEY `idx_modulo` (`modulo`),
  ADD KEY `idx_fecha` (`fecha_hora`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categoria_id` (`categoria_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `numero_venta` (`numero_venta`),
  ADD KEY `idx_fecha_venta` (`fecha_venta`),
  ADD KEY `idx_numero_venta` (`numero_venta`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_estado` (`estado`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `carrito`
--
ALTER TABLE `carrito`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `detalle_ventas`
--
ALTER TABLE `detalle_ventas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT de la tabla `logs_auditoria`
--
ALTER TABLE `logs_auditoria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=160;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD CONSTRAINT `carrito_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `carrito_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `detalle_ventas`
--
ALTER TABLE `detalle_ventas`
  ADD CONSTRAINT `detalle_ventas_ibfk_1` FOREIGN KEY (`venta_id`) REFERENCES `ventas` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `detalle_ventas_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`);

--
-- Filtros para la tabla `logs_auditoria`
--
ALTER TABLE `logs_auditoria`
  ADD CONSTRAINT `logs_auditoria_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`);

--
-- Filtros para la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
