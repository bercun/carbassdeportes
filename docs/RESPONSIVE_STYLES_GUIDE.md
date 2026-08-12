# 📱 Guía de Estilos Responsive - CarbassDeportes

## 🎯 Resumen de Reorganización

Tu archivo `styles.css` ha sido **completamente reorganizado y estructurado** de manera profesional para facilitar las pruebas de responsividad.

---

## 📊 Estructura del CSS (Desktop-First)

El archivo ahora está organizado en **orden de mayor a menor tamaño de pantalla**:

### 1️⃣ **VARIABLES Y CONFIGURACIÓN GLOBAL** (Líneas 1-27)
- Variables de colores
- Colores base del proyecto
- Estilos globales y reset CSS

---

### 2️⃣ **ESTILOS DESKTOP (1200px+)**

#### ✅ Sección 1: Barra Superior de Usuario
- Posición fija en la parte superior
- Barra de usuario (nombre, botones logout/login)
- Badge de carrito

#### ✅ Sección 2: Navbar Principal
- Logo y marca
- Menú de navegación
- Hamburger (oculto en desktop)

#### ✅ Sección 3: Layout Principal
- Grid de 2 columnas (aside + contenido)
- Gapación y máximo ancho

#### ✅ Sección 4: Aside Izquierdo
- Promociones
- Videos promocionales

#### ✅ Sección 5: Carrusel
- Slides con transiciones
- Controles

#### ✅ Sección 6: Tarjetas de Producto
- Grid de 3 columnas
- Efectos hover
- Badges y stock

#### ✅ Sección 7: Categorías (Iconos)
- Grid horizontal flexible

#### ✅ Sección 8: Secciones (Destacados/Ofertas)
- Grid de 4 columnas
- Títulos y separadores

#### ✅ Sección 9: Footer
- Grid de 2 columnas
- Redes y copyright

#### ✅ Sección 10: Login y Autenticación
- Formularios
- Botones de acceso

#### ✅ Sección 11: Panel de Administración
- Estadísticas
- Tablas
- Modales
- Tabs

#### ✅ Sección 12: Carrito de Compras
- Layout de 2 columnas (items + resumen)
- Botones de acción

#### ✅ Sección 13: Facturación
- Modales de factura
- Estilos de impresión

#### ✅ Sección 14: Ventas y Logs
- Filtros
- Estadísticas

#### ✅ Sección 15: Menú Móvil
- Hamburger (oculto)
- Overlay (oculto)

---

## 📱 MEDIA QUERIES ORGANIZADAS POR BREAKPOINTS

### 🖥️ **TABLET - (768px - 1024px)**
```css
@media (min-width: 768px) and (max-width: 1024px)
```
**Cambios:**
- Navbar: Padding ajustado
- Logo: 3.5rem
- Título: 1.4rem
- Navlinks: Centrados y con flex-wrap

### 📱 **MÓVIL - (<768px)**
```css
@media (max-width: 768px)
```
**Cambios:**
- Barra de usuario: Padding reducido, fuentes más pequeñas
- Layout: 1 columna
- Grid de productos: 1 columna
- Navbar: Padding reducido
- Carrito: Contenido en 1 columna
- Modales: 95% width

**Sub-breakpoint: <560px**
- Oculta logo SVG
- Reduce tamaño de fuente del título

**Sub-breakpoint: <480px (Móvil muy pequeño)**
- Navbar más compacto
- Menú lateral ajustado (max-width: 300px)

---

## 🎨 Paleta de Colores (Variables CSS)

```css
:root {
  --verde: #1ecb63           /* Verde primario */
  --verde-oscuro: #17a352    /* Verde oscuro (hover) */
  --negro: #000000           /* Negro base */
  --blanco: #ffffff          /* Blanco */
  --gris: #e0e0e0          /* Gris fondo */
  --max-width: 1200px       /* Ancho máximo del contenedor */
}
```

---

## 📐 Breakpoints Clave

| Dispositivo | Ancho | Breakpoint |
|-------------|-------|-----------|
| 🖥️ Desktop Grande | 1200px+ | Sin media query |
| 💻 Laptop | 980px - 1200px | `@media (max-width: 1200px)` |
| 📊 Tablet | 768px - 980px | `@media (max-width: 980px)` |
| 📱 Móvil | 560px - 768px | `@media (max-width: 768px)` |
| 📱 Móvil pequeño | <560px | `@media (max-width: 560px)` |
| 📱 Móvil XS | <480px | `@media (max-width: 479px)` |

---

## 🧪 Cómo Probar Responsividad

### En VS Code (DevTools de Navegador):
1. **Abre DevTools** (F12)
2. **Haz clic** en el icono de dispositivos (esquina superior izquierda)
3. **Selecciona dispositivo** o **personaliza las dimensiones**
4. **Para tu Redmi Note 14 5G:**
   - Ancho: `412px`
   - Alto: `915px`
   - DPI: `2.75`

### Puntos de Quiebre para Probar:
✅ **1920px** - Desktop completo
✅ **1200px** - Laptop
✅ **980px** - Tablet grande
✅ **768px** - Tablet
✅ **600px** - Móvil estándar
✅ **480px** - Móvil pequeño
✅ **412px** - Redmi Note 14 5G ⭐
✅ **375px** - iPhone SE

---

## 🎯 Secciones Principales por Línea

| Sección | Línea Inicio | Línea Fin |
|---------|-----------|---------|
| Variables | 1 | 27 |
| Barra Usuario Desktop | 28 | 156 |
| Navbar Desktop | 157 | 275 |
| Layout Principal Desktop | 276 | 286 |
| Aside Izquierdo Desktop | 287 | 331 |
| Carrusel Desktop | 332 | 389 |
| Presentación Desktop | 390 | 407 |
| Tarjetas Producto Desktop | 408 | 591 |
| Categorías Desktop | 592 | 622 |
| Secciones Desktop | 623 | 653 |
| Paleta Visual Desktop | 654 | 687 |
| Footer Desktop | 688 | 729 |
| Login Desktop | 730 | 887 |
| Admin Desktop | 888 | 1500+ |
| Carrito Desktop | 1500+ | 1800+ |
| Facturación Desktop | 1800+ | 2000+ |
| Ventas Desktop | 2000+ | 2100+ |
| Menú Móvil | 2100+ | 2180+ |
| **MEDIA QUERIES** | 2181+ | Fin |

---

## 🔧 Cómo Agregar Nuevos Estilos

### Para Desktop (1200px+):
1. Encuentra la sección correspondiente
2. Agrega tu CSS después de los estilos base
3. **NO** uses media queries (heredarán por defecto)

### Para Tablet (768px - 1024px):
```css
@media (min-width: 768px) and (max-width: 1024px) {
  .tu-clase {
    /* Cambios para tablet */
  }
}
```

### Para Móvil (<768px):
```css
@media (max-width: 768px) {
  .tu-clase {
    /* Cambios para móvil */
  }
}
```

### Para Móvil Pequeño (<480px):
```css
@media (max-width: 479px) {
  .tu-clase {
    /* Cambios para móvil XS */
  }
}
```

---

## ✨ Beneficios de la Nueva Estructura

✅ **Fácil lectura** - Código bien organizado y comentado
✅ **Mantenimiento** - Encuentra cualquier sección rápidamente
✅ **Escalable** - Fácil agregar nuevos breakpoints
✅ **Mobile-First Order** - Desktop primero, luego decrece
✅ **Pruebas simplificadas** - Identifica problemas por tamaño
✅ **Performance** - Sin redundancias innecesarias

---

## 📝 Checklist de Responsive

Cuando pruebes en tu Redmi Note 14 5G (412px):

- [ ] Navbar es responsive y compacto
- [ ] Menú hamburguesa funciona
- [ ] Grid de productos es 1 columna
- [ ] Carrito se adapta bien
- [ ] Modales se ven correctamente
- [ ] Fuentes son legibles
- [ ] Botones son tocables
- [ ] Imágenes se cargan correctamente
- [ ] No hay desbordamientos de contenido
- [ ] Espaciado es adecuado

---

## 🎓 Más Información

Para entender mejor el sistema:
- **Desktop-First**: Comenzamos con estilos para pantallas grandes y vamos reduciendo
- **Mobile-First Order**: En el CSS, primero desktop, luego media queries en orden descendente
- **Breakpoints comunes**: 1200px, 980px, 768px, 560px, 480px, 320px

---

**¡Tu CSS está listo para pruebas de responsividad! 🚀**

Ahora puedes probar fácilmente en cualquier dispositivo y hacer cambios rápidamente.
