# CarbassDeportes - Versión de Producción

Este directorio contiene la versión limpia y optimizada del sitio web CarbassDeportes lista para subir al servidor.

## Archivos Incluidos

### Páginas HTML:
- `index.html` - Página principal con destacados, recientes y ofertas
- `catalogo.html` - Catálogo completo por categorías
- `login.html` - Página de inicio de sesión
- `admin.html` - Panel de administración

### Estilos y Scripts:
- `styles.css` - Estilos CSS del sitio
- `script.js` - JavaScript principal (LIMPIO, sin console.log de debug)
- `firebase-config.js` - Configuración de Firebase
- `auth-check.js` - Verificación de estado de autenticación
- `auth.js` - Sistema de login/registro (LIMPIO, sin logs)
- `admin.js` - Funcionalidad del panel admin
- `check-resources.js` - Verificación de recursos (versión silenciosa)

### Recursos:
- `sours/` - Directorio completo con imágenes, videos y recursos

## Características de la Versión de Producción

✅ **Código Limpio**: 
- Sin console.log de debug
- Sin funciones de test
- Optimizado para producción

✅ **Funcionalidad Completa**:
- Carga de productos desde Firestore
- Navegación entre secciones
- Sistema de autenticación
- Panel de administración
- Carrito de compras (requiere login)

✅ **Responsive Design**:
- Compatible con dispositivos móviles
- Navegación adaptativa

## Instrucciones de Despliegue

1. **Subir todos los archivos** de este directorio al servidor
2. **Mantener la estructura** de carpetas (especialmente `sours/`)
3. **Verificar Firebase**: Asegúrate que `firebase-config.js` tiene la configuración correcta
4. **Probar funcionalidad**:
   - Página principal: productos destacados, recientes, ofertas
   - Catálogo: productos por categoría (fútbol, basket, gym, coleccionables)
   - Login: autenticación de usuarios
   - Admin: panel de administración

## Archivos Firebase Necesarios

- `firebase-config.js` debe tener las credenciales correctas
- Las reglas de Firestore deben estar configuradas para permitir lectura pública de la colección `articulos`

## Soporte

Sitio web desarrollado para CarbassDeportes - Tienda de Deportes & Coleccionables
Diseño responsive y funcionalidad de e-commerce con Firebase.