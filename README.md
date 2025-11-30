# CarbassDeportes - Documentación del Proyecto

## 📋 Descripción General

**CarbassDeportes** es una tienda online especializada en artículos deportivos y coleccionables. Este proyecto web ofrece una experiencia de usuario moderna y responsiva, con funcionalidades interactivas como carruseles, videos hover, y gestión de productos.

---

## 🏗️ Estructura del Proyecto

```
carbassdeportes/
├── index.html              # Página principal
├── script.js               # Lógica JavaScript
├── styles.css              # Estilos principales
├── carbassdeportes_.css    # Estilos alternativos
├── README.md               # Este archivo
└── sours/
    ├── img/
    │   ├── articulos/      # Imágenes de productos
    │   ├── aside/          # Imágenes del aside
    │   ├── carrousel/      # Imágenes del carrusel
    │   ├── coleccionables/ # Imágenes de items coleccionables
    │   └── logos/          # Logo de la marca
    └── videos/             # Videos promocionales
```

---

## 🎨 Paleta de Colores

El diseño utiliza una paleta de colores definida en variables CSS:

| Color  | Código   | Uso                          |
|--------|----------|------------------------------|
| Verde  | `#1ecb63`| Elementos destacados, CTAs   |
| Negro  | `#000000`| Navbar, footer, textos       |
| Blanco | `#ffffff`| Fondos, contenedores         |
| Gris   | `#e0e0e0`| Fondo general, separadores   |

```css
:root {
  --verde: #1ecb63;
  --negro: #000000;
  --blanco: #ffffff;
  --gris: #e0e0e0;
  --max-width: 1200px;
}
```

---

## 📄 HTML - Estructura y Secciones

### `index.html`

#### **1. Header - Barra de Navegación**

```html
<header class="navbar">
  <div class="brand">
    <img class="logo-svg" src="sours/img/logos/logo_carbass.jpg" alt="CarbassDeportes Logo" />
    <h1>CarbassDeportes</h1>
  </div>
  <nav>
    <ul class="navlinks">
      <li><a href="#home">Home</a></li>
      <li><a href="#categorias">Categorías</a></li>
      <li><a href="#coleccionables">Coleccionables</a></li>
      <li><a href="#ofertas">Ofertas</a></li>
      <li><a href="#sobre-nosotros">Sobre Nosotros</a></li>
    </ul>
  </nav>
  <div><a href="#" class="cta">Tienda Online</a></div>
</header>
```

**Función:** Navegación principal sticky con logo, menú de navegación y botón CTA para acceso a la tienda online.

---

#### **2. Aside Izquierdo - Promociones**

```html
<aside class="left">
  <div class="promo">
    <img src="sours/img/aside/soccer-755825_1920.jpg" alt="Promo entrenar" />
    <div class="txt">20% OFF en equipamiento running</div>
  </div>
  <div class="promo">
    <img id="coleccionable-random" src="sours/img/coleccionables/jersey-edicion-limitada.jpg" alt="Coleccionables" />
    <div class="txt">Figuras limitadas: lanzamiento semanal</div>
  </div>
  <div class="promo video-promo">
    <video class="hover-video" muted loop playsinline>
      <source src="sours/videos/libro pistolero.mp4" type="video/mp4">
    </video>
  </div>
</aside>
```

**Función:** Sidebar con promociones destacadas, imagen aleatoria de coleccionables y video interactivo.

---

#### **3. Carrusel de Imágenes**

```html
<div class="carousel" id="home">
  <div class="slides" id="slides">
    <div class="slide"><img src="sours/img/carrousel/ball-488717_1280.jpg" alt="Deportes" /></div>
    <div class="slide"><img src="sours/img/carrousel/sports-6480830_1280.jpg" alt="Equipamiento deportivo" /></div>
  </div>
  <div class="carousel-controls">
    <button class="btn-ctrl" id="prev" aria-label="Anterior">◀</button>
    <button class="btn-ctrl" id="next" aria-label="Siguiente">▶</button>
  </div>
</div>
```

**Función:** Carrusel automático con controles manuales para mostrar imágenes destacadas de productos y deportes.

---

#### **4. Presentación del Negocio**

```html
<div class="presentacion">
  <h2>CarbassDeportes</h2>
  <p>CarbassDeportes es una tienda especializada en artículos deportivos y coleccionables afines...</p>
  <div class="palette" >
    <div class="swatch swatch-verde">Verde<br>#1ecb63</div>
    <div class="swatch swatch-negro">Negro<br>#000000</div>
    <div class="swatch swatch-blanco">Blanco<br>#ffffff</div>
    <div class="swatch swatch-gris">Gris<br>#e0e0e0</div>
  </div>
</div>
```

**Función:** Sección informativa sobre la empresa con descripción del negocio y paleta de colores visual.

---

#### **5. Grid de Artículos Destacados**

```html
<div class="grid" aria-live="polite">
  <article class="card">
    <div class="thumb"><img src="https://placehold.co/600x400?text=Bal%C3%B3n+Pro" alt="Balon Pro"/></div>
    <h4>Balón Pro Elite</h4>
    <p class="meta"><span class="price">$59.990</span><span class="badge">Top</span></p>
    <p>Balón de competición con cosido profesional y tecnología de control.</p>
    <button class="add-btn">Agregar al carrito</button>
  </article>
  <!-- Más productos... -->
</div>
```

**Función:** Muestra productos destacados en formato de tarjetas con imagen, título, precio, badge y botón para agregar al carrito.

---

#### **6. Iconos de Categorías**

```html
<div class="icons-row" id="categorias">
  <div class="icon-card">
    <svg viewBox="0 0 24 24" fill="none">
      <!-- SVG de fútbol -->
    </svg>
    <div>Fútbol</div>
  </div>
  <!-- Más categorías: Basket, Gym, Coleccionables -->
</div>
```

**Función:** Navegación visual por categorías deportivas usando iconos SVG personalizados.

---

#### **7. Secciones Adicionales**

```html
<!-- Recién Agregados -->
<div class="section-title section-recientes">
  <h3>Recién Agregados</h3>
  <a href="#" class="ver-todo">Ver todo →</a>
</div>
<div class="small-grid">
  <!-- Grid de productos recientes -->
</div>

<!-- Ofertas -->
<div class="section-title section-ofertas">
  <h3>Ofertas</h3>
  <a href="#ofertas" class="ver-todo">Ir a Ofertas →</a>
</div>
<div class="small-grid">
  <!-- Grid de ofertas -->
</div>
```

**Función:** Secciones para productos nuevos y ofertas especiales con links para ver todos los items.

---

#### **8. Footer**

```html
<footer id="sobre-nosotros">
  <div class="footer-grid">
    <div class="map">
      <h4>Ubicación</h4>
      <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d815.9332039215774!2d-56.19519516004454!3d-34.906138460483746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x959f802d264e20b7%3A0x27afb75f4b448432!2sGaler%C3%ADa%20Cristal!5e1!3m2!1ses!2suy!4v1764497841029!5m2!1ses!2suy" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
    <div>
      <h4>Contacto</h4>
      <p>Email: contacto@carbassdeportes.com</p>
      <p>Tel: +598 0000 0000</p>
      <h4 class="footer-redes">Redes</h4>
      <p>@carbassdeportes</p>
      <p class="footer-copyright">© 2025 CarbassDeportes - Todos los derechos reservados.</p>
      <p>© designed by brkoon</p>
    </div>
  </div>
</footer>
```

**Función:** Información de contacto, ubicación en mapa integrado, redes sociales y copyright.

---

## 💻 JavaScript - Funcionalidades Interactivas

### `script.js`

#### **1. Imagen Aleatoria de Coleccionables**

```javascript
(function(){
  const coleccionables = [
    'banderin-equipo-clasico.jpg',
    'camiseta-epoca-historica.jpg',
    'camiseta-retro-clasica.jpg',
    'jersey-conmemorativo.jpg',
    'jersey-edicion-limitada.jpg'
  ];
  
  const imgElement = document.getElementById('coleccionable-random');
  if(imgElement){
    const randomImg = coleccionables[Math.floor(Math.random() * coleccionables.length)];
    imgElement.src = `sours/img/coleccionables/${randomImg}`;
  }
})();
```

**Función:** IIFE (Immediately Invoked Function Expression) que selecciona y muestra aleatoriamente una imagen de coleccionable cada vez que se carga la página.

**Parámetros:**
- `coleccionables`: Array con nombres de archivos de imágenes
- `imgElement`: Elemento DOM con id `coleccionable-random`
- `randomImg`: Imagen seleccionada aleatoriamente del array

---

#### **2. Video con Reproducción Hover**

```javascript
(function(){
  const video = document.querySelector('.hover-video');
  if(video){
    video.addEventListener('mouseenter', function(){
      this.play();
    });
    video.addEventListener('mouseleave', function(){
      this.pause();
      this.currentTime = 0;
    });
  }
})();
```

**Función:** IIFE que controla la reproducción de video basada en eventos del mouse.

**Eventos:**
- `mouseenter`: Reproduce el video cuando el cursor entra al área
- `mouseleave`: Pausa el video y lo reinicia cuando el cursor sale

**Elementos afectados:** Videos con clase `.hover-video`

---

#### **3. Carrusel Automático con Controles**

```javascript
(function(){
  const slidesEl = document.getElementById('slides');
  const slidesCount = slidesEl.children.length;
  const nextBtn = document.getElementById('next');
  const prevBtn = document.getElementById('prev');
  let index = 0;
  let interval = null;

  function goTo(i){
    index = (i + slidesCount) % slidesCount;
    slidesEl.style.transform = `translateX(${ -index * 100 }%)`;
  }
  
  function next(){ goTo(index + 1) }
  function prev(){ goTo(index - 1) }

  nextBtn.addEventListener('click', ()=>{ next(); resetTimer(); });
  prevBtn.addEventListener('click', ()=>{ prev(); resetTimer(); });

  function startTimer(){ interval = setInterval(next, 4000); }
  function resetTimer(){ clearInterval(interval); startTimer(); }

  // Navegación por teclado
  window.addEventListener('keydown', (e)=>{ 
    if(e.key==='ArrowRight') next(); 
    if(e.key==='ArrowLeft') prev(); 
  });

  // Inicialización
  goTo(0);
  startTimer();

  // Accesibilidad: pausa al hacer hover
  slidesEl.addEventListener('mouseover', ()=>clearInterval(interval));
  slidesEl.addEventListener('mouseleave', ()=>startTimer());
})();
```

**Función:** Sistema completo de carrusel con auto-play, controles manuales y navegación por teclado.

**Funciones principales:**
- `goTo(i)`: Navega a la diapositiva especificada usando transformaciones CSS
- `next()`: Avanza a la siguiente diapositiva
- `prev()`: Retrocede a la diapositiva anterior
- `startTimer()`: Inicia el auto-play cada 4 segundos
- `resetTimer()`: Reinicia el temporizador al usar controles manuales

**Características:**
- Auto-play cada 4000ms (4 segundos)
- Navegación circular (loop infinito)
- Controles de botones (◀ y ▶)
- Navegación por teclado (flechas ← →)
- Pausa automática al hacer hover (accesibilidad)

---

#### **4. Botones Agregar al Carrito**

```javascript
document.querySelectorAll('.add-btn').forEach(btn => {
  btn.addEventListener('click', (e)=>{
    const card = e.target.closest('.card');
    const title = card.querySelector('h4').innerText;
    e.target.innerText = 'Añadido ✓';
    e.target.disabled = true;
    setTimeout(()=>{ 
      e.target.innerText = 'Agregar al carrito'; 
      e.target.disabled = false; 
    }, 1400);
    console.info('Añadido al carrito:', title);
  })
})
```

**Función:** Simula la funcionalidad de agregar productos al carrito con feedback visual.

**Proceso:**
1. Detecta click en cualquier botón `.add-btn`
2. Obtiene el título del producto desde la tarjeta padre
3. Cambia el texto del botón a "Añadido ✓"
4. Deshabilita el botón temporalmente
5. Después de 1400ms restaura el estado original
6. Registra el producto en la consola (preparado para integración con API real)

**Elementos afectados:** Todos los botones con clase `.add-btn`

---

## 🎨 CSS - Estilos y Diseño

### `styles.css`

#### **1. Variables y Reset**

```css
:root{
  --verde: #1ecb63;
  --negro: #000000;
  --blanco: #ffffff;
  --gris: #e0e0e0;
  --max-width: 1200px;
}

*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Inter, Arial, Helvetica, sans-serif;background:var(--gris);color:#222;line-height:1.4}
```

**Función:** Define variables CSS reutilizables y aplica reset básico para consistencia cross-browser.

---

#### **2. Navbar Sticky**

```css
.navbar{
  position:sticky;
  top:0;
  z-index:100;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:16px;
  padding:14px 10px;
  background:var(--negro);
  color:var(--blanco);
  border-radius:10px
}
```

**Función:** Barra de navegación que permanece fija en la parte superior al hacer scroll.

**Propiedades clave:**
- `position: sticky`: Mantiene el navbar visible
- `z-index: 100`: Asegura que esté sobre otros elementos
- `display: flex`: Layout flexible para distribución de elementos

---

#### **3. Layout Grid Principal**

```css
.layout{
  display:grid;
  grid-template-columns:240px 1fr;
  gap:18px;
  margin-top:16px
}
```

**Función:** Crea el layout de dos columnas (aside + contenido principal) usando CSS Grid.

**Columnas:**
- `240px`: Ancho fijo para el aside izquierdo
- `1fr`: Espacio restante para el contenido principal

---

#### **4. Carrusel con Transiciones**

```css
.carousel{
  position:relative;
  background:var(--blanco);
  padding:14px;
  border-radius:10px;
  overflow:hidden;
  box-shadow:0 8px 20px rgba(2,6,23,0.06)
}

.slides{
  display:flex;
  transition:transform 600ms cubic-bezier(.22,.9,.28,1);
  gap:14px
}

.slide{
  min-width:100%;
  display:flex;
  align-items:center;
  justify-content:center;
  border-radius:8px;
  overflow:hidden;
  height:400px
}
```

**Función:** Estilos para el carrusel con animaciones suaves.

**Características:**
- Transición custom con `cubic-bezier` para movimiento fluido
- `overflow: hidden` para ocultar slides fuera del viewport
- Altura fija de 400px para las imágenes

---

#### **5. Tarjetas de Producto con Hover**

```css
.card{
  background:var(--blanco);
  border-radius:12px;
  padding:12px;
  box-shadow:0 8px 18px rgba(2,6,23,0.06);
  transition:transform 250ms ease, box-shadow 250ms ease
}

.card:hover{
  transform:translateY(-6px);
  box-shadow:0 18px 40px rgba(2,6,23,0.12)
}
```

**Función:** Efecto de elevación al pasar el cursor sobre las tarjetas de productos.

**Efecto hover:**
- Se eleva 6px hacia arriba
- Aumenta la sombra para mayor profundidad
- Transición suave de 250ms

---

#### **6. Botones Interactivos**

```css
.add-btn{
  display:inline-block;
  margin-top:10px;
  padding:8px 12px;
  border-radius:8px;
  background:transparent;
  border:2px solid var(--verde);
  color:var(--negro);
  font-weight:700;
  cursor:pointer;
  transition:all 200ms
}

.add-btn:hover{
  background:var(--verde);
  color:var(--blanco)
}
```

**Función:** Botones con estilo outline que cambian a sólido al hacer hover.

---

#### **7. Diseño Responsive**

```css
@media (max-width:980px){
  .grid{grid-template-columns:repeat(2,1fr)}
  .small-grid{grid-template-columns:repeat(2,1fr)}
  .layout{grid-template-columns:1fr}
  .navlinks{display:none}
}

@media (max-width:560px){
  .grid{grid-template-columns:1fr}
  .small-grid{grid-template-columns:1fr}
  .brand h1{font-size:16px}
}
```

**Función:** Adaptación del diseño a diferentes tamaños de pantalla.

**Breakpoints:**
- **980px**: Grids de 3 a 2 columnas, aside apilado, navbar simplificado
- **560px**: Grids de 1 columna, texto más pequeño

---

## 🚀 Funcionalidades Principales

### ✅ Implementadas

1. **Navegación Sticky**: Navbar fijo que permanece visible al hacer scroll
2. **Carrusel Automático**: Rotación automática de imágenes cada 4 segundos
3. **Controles Manuales**: Botones y teclado para navegar el carrusel
4. **Imagen Aleatoria**: Muestra coleccionables diferentes en cada carga
5. **Video Hover**: Reproducción de video al pasar el cursor
6. **Agregar al Carrito**: Feedback visual al agregar productos
7. **Diseño Responsive**: Adaptación a móviles, tablets y desktop
8. **Efectos Hover**: Animaciones en tarjetas e iconos
9. **Mapa Integrado**: Google Maps embebido en el footer
10. **Categorías Visuales**: Iconos SVG para navegación por categorías

### 🔮 Posibles Mejoras Futuras

- Integración con API de carrito real
- Sistema de usuarios y autenticación
- Filtros de productos por categoría/precio
- Búsqueda de productos
- Sistema de reviews y calificaciones
- Checkout y pasarela de pago
- Panel administrativo

---

## 📱 Compatibilidad

- ✅ Chrome/Edge (últimas versiones)
- ✅ Firefox (últimas versiones)
- ✅ Safari (últimas versiones)
- ✅ Dispositivos móviles (responsive)

---

## 👤 Créditos

**Diseñado por:** brkoon  
**Año:** 2025  
**Proyecto:** CarbassDeportes

---

## 📞 Contacto

- **Email:** contacto@carbassdeportes.com
- **Teléfono:** +598 0000 0000
- **Redes Sociales:** @carbassdeportes

---

## 📝 Licencia

© 2025 CarbassDeportes - Todos los derechos reservados.



## db Base de datos en firebese

** crear un base de datos en firebase 
para hacer crud de los articulos**

Tipos y caracteristicas

Base de dato de articulos
Base de datos de el carrito
Base de datos con informacion de  usuarios


## Base de dato de articulos 

nombre: Articulos

Atributos :{

  id
  nombre
  imagen
  descripción
  precio
  categoria (futbol, basket, gym, coleccionables)
  estatus (recien agregados, oferta, destacados)
  
}

