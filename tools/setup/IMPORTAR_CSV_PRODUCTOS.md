# Importar CSV de productos en phpMyAdmin (sin error de columnas)

Si tu CSV tiene estas columnas (formato exportado por phpMyAdmin):

id,nombre,descripcion,precio,imagen_url,categoria_id,estado,destacado,stock,activo,fecha_creacion

## Archivos de plantilla

- `tools/setup/productos_plantilla_import.csv`
- `tools/setup/productos_plantilla_vacia.csv`

## Configuracion correcta en phpMyAdmin

1. Abre la tabla `productos`.
2. Ve a `Importar`.
3. Selecciona el archivo CSV.
4. Formato: `CSV`.
5. Charset: `utf-8`.
6. Separador de campos: `,`.
7. Delimitador de texto: `"` (comillas dobles).
8. Marca: `La primera linea contiene los nombres de las columnas`.
9. En la opcion **Columnas** (si aparece), escribe exactamente:

id,nombre,descripcion,precio,imagen_url,categoria_id,estado,destacado,stock,activo,fecha_creacion

10. Ejecuta importar.

## Por que aparece el error "numero de columnas"

Porque tu CSV y la tabla no tenian el mismo numero/orden de columnas durante la importacion.

## Reglas rapidas

- `id`: puedes incluirlo si importas en este formato exacto.
- `fecha_creacion`: en este formato se incluye con fecha/hora valida (`YYYY-MM-DD HH:MM:SS`).
- `destacado` y `activo`: usar 0/1.
- `estado`: `normal`, `destacado`, `oferta`, `recien_agregado`.
- `precio`: usar punto decimal, ej. `129.99`.
