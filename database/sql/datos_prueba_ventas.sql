-- Seleccionar la base de datos
USE brkoonuy_carbass_db;

-- Datos de prueba para el sistema de ventas
-- Obtener IDs de usuarios existentes
SET @user1 = (SELECT id FROM usuarios LIMIT 1 OFFSET 0);
SET @user2 = (SELECT id FROM usuarios LIMIT 1 OFFSET 1);
SET @user3 = COALESCE((SELECT id FROM usuarios LIMIT 1 OFFSET 2), @user1);

-- Obtener IDs de productos existentes
SET @prod1 = (SELECT id FROM productos LIMIT 1 OFFSET 0);
SET @prod2 = (SELECT id FROM productos LIMIT 1 OFFSET 1);
SET @prod3 = (SELECT id FROM productos LIMIT 1 OFFSET 2);
SET @prod4 = (SELECT id FROM productos LIMIT 1 OFFSET 3);
SET @prod5 = (SELECT id FROM productos LIMIT 1 OFFSET 4);

-- Venta 1 - Hace 2 días
INSERT INTO ventas (numero_venta, user_id, fecha_venta, subtotal, iva, total, nombre_cliente, apellido_cliente, email_cliente, telefono_cliente, direccion_cliente, observaciones, estado)
VALUES ('2601090001', @user1, DATE_SUB(NOW(), INTERVAL 2 DAY), 4098.36, 901.64, 5000.00, 'María', 'González', 'maria.gonzalez@email.com', '099123456', 'Av. 18 de Julio 1234, Montevideo', 'Entrega urgente', 'completada');

SET @venta1_id = LAST_INSERT_ID();

INSERT INTO detalle_ventas (venta_id, producto_id, nombre_producto, cantidad, precio_unitario, subtotal)
VALUES 
(@venta1_id, @prod1, 'Pelota de Fútbol Nike', 2, 1500.00, 3000.00),
(@venta1_id, @prod2, 'Zapatillas Adidas Running', 1, 2500.00, 2500.00);

-- Venta 2 - Hace 5 días
INSERT INTO ventas (numero_venta, user_id, fecha_venta, subtotal, iva, total, nombre_cliente, apellido_cliente, email_cliente, telefono_cliente, direccion_cliente, observaciones, estado)
VALUES ('2601060001', @user2, DATE_SUB(NOW(), INTERVAL 5 DAY), 2459.02, 540.98, 3000.00, 'Juan', 'Pérez', 'juan.perez@email.com', '098765432', 'Bulevar Artigas 2345, Montevideo', '', 'completada');

SET @venta2_id = LAST_INSERT_ID();

INSERT INTO detalle_ventas (venta_id, producto_id, nombre_producto, cantidad, precio_unitario, subtotal)
VALUES 
(@venta2_id, @prod3, 'Camiseta Selección Uruguay', 3, 800.00, 2400.00),
(@venta2_id, @prod4, 'Medias Deportivas Pack x3', 2, 150.00, 300.00);

-- Venta 3 - Hace 1 semana
INSERT INTO ventas (numero_venta, user_id, fecha_venta, subtotal, iva, total, nombre_cliente, apellido_cliente, email_cliente, telefono_cliente, direccion_cliente, observaciones, estado)
VALUES ('2601040001', @user1, DATE_SUB(NOW(), INTERVAL 7 DAY), 6147.54, 1352.46, 7500.00, 'Ana', 'Rodríguez', 'ana.rodriguez@email.com', '091234567', 'Av. Italia 3456, Montevideo', 'Llamar antes de entregar', 'completada');

SET @venta3_id = LAST_INSERT_ID();

INSERT INTO detalle_ventas (venta_id, producto_id, nombre_producto, cantidad, precio_unitario, subtotal)
VALUES 
(@venta3_id, @prod5, 'Balón de Basketball Wilson', 1, 3500.00, 3500.00),
(@venta3_id, @prod1, 'Short Deportivo Nike', 2, 900.00, 1800.00),
(@venta3_id, @prod2, 'Botella Térmica 1L', 3, 450.00, 1350.00);

-- Venta 4 - Hace 10 días
INSERT INTO ventas (numero_venta, user_id, fecha_venta, subtotal, iva, total, nombre_cliente, apellido_cliente, email_cliente, telefono_cliente, direccion_cliente, observaciones, estado)
VALUES ('2601010001', @user3, DATE_SUB(NOW(), INTERVAL 10 DAY), 3278.69, 721.31, 4000.00, 'Carlos', 'Martínez', 'carlos.martinez@email.com', '092345678', 'Av. Agraciada 4567, Montevideo', '', 'completada');

SET @venta4_id = LAST_INSERT_ID();

INSERT INTO detalle_ventas (venta_id, producto_id, nombre_producto, cantidad, precio_unitario, subtotal)
VALUES 
(@venta4_id, @prod3, 'Guantes de Arquero', 1, 1800.00, 1800.00),
(@venta4_id, @prod4, 'Raqueta de Tenis Babolat', 1, 2200.00, 2200.00);

-- Venta 5 - Hace 15 días
INSERT INTO ventas (numero_venta, user_id, fecha_venta, subtotal, iva, total, nombre_cliente, apellido_cliente, email_cliente, telefono_cliente, direccion_cliente, observaciones, estado)
VALUES ('2512270001', @user2, DATE_SUB(NOW(), INTERVAL 15 DAY), 1639.34, 360.66, 2000.00, 'Laura', 'Fernández', 'laura.fernandez@email.com', '093456789', 'Av. 8 de Octubre 5678, Montevideo', 'Oficina 301', 'completada');

SET @venta5_id = LAST_INSERT_ID();

INSERT INTO detalle_ventas (venta_id, producto_id, nombre_producto, cantidad, precio_unitario, subtotal)
VALUES 
(@venta5_id, @prod5, 'Mancuernas 5kg (Par)', 2, 600.00, 1200.00),
(@venta5_id, @prod1, 'Pelota de Fútbol Nike', 1, 750.00, 750.00);

-- Venta 6 - Hace 20 días (compra grande)
INSERT INTO ventas (numero_venta, user_id, fecha_venta, subtotal, iva, total, nombre_cliente, apellido_cliente, email_cliente, telefono_cliente, direccion_cliente, observaciones, estado)
VALUES ('2512220001', @user1, DATE_SUB(NOW(), INTERVAL 20 DAY), 9836.07, 2163.93, 12000.00, 'Roberto', 'Silva', 'roberto.silva@email.com', '094567890', 'Bvar. España 6789, Montevideo', 'Equipo completo para club', 'completada');

SET @venta6_id = LAST_INSERT_ID();

INSERT INTO detalle_ventas (venta_id, producto_id, nombre_producto, cantidad, precio_unitario, subtotal)
VALUES 
(@venta6_id, @prod1, 'Pelota de Fútbol Nike', 5, 1500.00, 7500.00),
(@venta6_id, @prod3, 'Camiseta Selección Uruguay', 8, 800.00, 6400.00),
(@venta6_id, @prod4, 'Medias Deportivas Pack x3', 6, 150.00, 900.00);

-- Venta 7 - Hace 25 días
INSERT INTO ventas (numero_venta, user_id, fecha_venta, subtotal, iva, total, nombre_cliente, apellido_cliente, email_cliente, telefono_cliente, direccion_cliente, observaciones, estado)
VALUES ('2512170001', @user3, DATE_SUB(NOW(), INTERVAL 25 DAY), 2049.18, 450.82, 2500.00, 'Sofía', 'López', 'sofia.lopez@email.com', '095678901', 'Av. Rivera 7890, Montevideo', '', 'completada');

SET @venta7_id = LAST_INSERT_ID();

INSERT INTO detalle_ventas (venta_id, producto_id, nombre_producto, cantidad, precio_unitario, subtotal)
VALUES 
(@venta7_id, @prod2, 'Zapatillas Adidas Running', 1, 2500.00, 2500.00);

-- Venta 8 - Hace 30 días (hace un mes)
INSERT INTO ventas (numero_venta, user_id, fecha_venta, subtotal, iva, total, nombre_cliente, apellido_cliente, email_cliente, telefono_cliente, direccion_cliente, observaciones, estado)
VALUES ('2512120001', @user2, DATE_SUB(NOW(), INTERVAL 30 DAY), 4918.03, 1081.97, 6000.00, 'Diego', 'Ramírez', 'diego.ramirez@email.com', '096789012', 'Av. Brasil 8901, Montevideo', 'Dejar en portería', 'completada');

SET @venta8_id = LAST_INSERT_ID();

INSERT INTO detalle_ventas (venta_id, producto_id, nombre_producto, cantidad, precio_unitario, subtotal)
VALUES 
(@venta8_id, @prod5, 'Balón de Basketball Wilson', 2, 3500.00, 7000.00);

-- Venta 9 - Hace 35 días
INSERT INTO ventas (numero_venta, user_id, fecha_venta, subtotal, iva, total, nombre_cliente, apellido_cliente, email_cliente, telefono_cliente, direccion_cliente, observaciones, estado)
VALUES ('2512070001', @user1, DATE_SUB(NOW(), INTERVAL 35 DAY), 1229.51, 270.49, 1500.00, 'Valentina', 'Torres', 'valentina.torres@email.com', '097890123', 'Av. Gral. Flores 9012, Montevideo', '', 'completada');

SET @venta9_id = LAST_INSERT_ID();

INSERT INTO detalle_ventas (venta_id, producto_id, nombre_producto, cantidad, precio_unitario, subtotal)
VALUES 
(@venta9_id, @prod2, 'Botella Térmica 1L', 2, 450.00, 900.00),
(@venta9_id, @prod4, 'Medias Deportivas Pack x3', 2, 150.00, 300.00);

-- Venta 10 - Hace 40 días
INSERT INTO ventas (numero_venta, user_id, fecha_venta, subtotal, iva, total, nombre_cliente, apellido_cliente, email_cliente, telefono_cliente, direccion_cliente, observaciones, estado)
VALUES ('2512020001', @user3, DATE_SUB(NOW(), INTERVAL 40 DAY), 5737.70, 1262.30, 7000.00, 'Matías', 'Castro', 'matias.castro@email.com', '098901234', 'Av. Millán 0123, Montevideo', 'Compra corporativa', 'completada');

SET @venta10_id = LAST_INSERT_ID();

INSERT INTO detalle_ventas (venta_id, producto_id, nombre_producto, cantidad, precio_unitario, subtotal)
VALUES 
(@venta10_id, @prod4, 'Raqueta de Tenis Babolat', 2, 2200.00, 4400.00),
(@venta10_id, @prod1, 'Short Deportivo Nike', 3, 900.00, 2700.00);

-- Venta 11 - Hoy (venta reciente)
INSERT INTO ventas (numero_venta, user_id, fecha_venta, subtotal, iva, total, nombre_cliente, apellido_cliente, email_cliente, telefono_cliente, direccion_cliente, observaciones, estado)
VALUES ('2601110001', @user1, NOW(), 3278.69, 721.31, 4000.00, 'Lucía', 'Vargas', 'lucia.vargas@email.com', '099012345', 'Av. Sarmiento 1234, Montevideo', 'Envío express', 'completada');

SET @venta11_id = LAST_INSERT_ID();

INSERT INTO detalle_ventas (venta_id, producto_id, nombre_producto, cantidad, precio_unitario, subtotal)
VALUES 
(@venta11_id, @prod1, 'Pelota de Fútbol Nike', 1, 1500.00, 1500.00),
(@venta11_id, @prod3, 'Camiseta Selección Uruguay', 2, 800.00, 1600.00),
(@venta11_id, @prod2, 'Botella Térmica 1L', 2, 450.00, 900.00);

-- Venta 12 - Hace 3 días (Estado pendiente como ejemplo)
INSERT INTO ventas (numero_venta, user_id, fecha_venta, subtotal, iva, total, nombre_cliente, apellido_cliente, email_cliente, telefono_cliente, direccion_cliente, observaciones, estado)
VALUES ('2601080001', @user2, DATE_SUB(NOW(), INTERVAL 3 DAY), 819.67, 180.33, 1000.00, 'Pablo', 'Méndez', 'pablo.mendez@email.com', '099123456', 'Av. Propios 2345, Montevideo', 'Pago pendiente', 'pendiente');

SET @venta12_id = LAST_INSERT_ID();

INSERT INTO detalle_ventas (venta_id, producto_id, nombre_producto, cantidad, precio_unitario, subtotal)
VALUES 
(@venta12_id, @prod5, 'Mancuernas 5kg (Par)', 1, 600.00, 600.00),
(@venta12_id, @prod4, 'Medias Deportivas Pack x3', 2, 150.00, 300.00);

-- Resumen de datos insertados
SELECT 'Datos de prueba insertados correctamente' as Mensaje;
SELECT COUNT(*) as 'Total Ventas Insertadas' FROM ventas WHERE numero_venta LIKE '26%' OR numero_venta LIKE '25%';
SELECT COUNT(*) as 'Total Detalles Insertados' FROM detalle_ventas WHERE venta_id >= @venta1_id;
SELECT SUM(total) as 'Monto Total de Ventas' FROM ventas WHERE numero_venta LIKE '26%' OR numero_venta LIKE '25%';
