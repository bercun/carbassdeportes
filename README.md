# CarbassDeportes - Documentación del Proyecto

## 📋 Descripción General

**CarbassDeportes** es una tienda online especializada en artículos deportivos y coleccionables. Este proyecto web ofrece una experiencia de usuario moderna y responsiva, con funcionalidades interactivas como carruseles, videos hover, gestión de productos y **sistema de autenticación completo con Firebase**.

### ✨ Características Principales

- 🔐 **Autenticación completa** con Firebase Authentication (Login/Registro)
- � **Sistema de roles** - Administradores y Compradores con permisos diferenciados
- 🛡️ **Panel de administración** - Gestión completa de productos y usuarios
- 🛒 **Catálogo dinámico** de productos deportivos y coleccionables
- 🎨 **Diseño responsivo** con CSS moderno y variables personalizadas
- 🎬 **Videos hover** en elementos promocionales
- 🎠 **Carrusel automático** con controles manuales
- 👤 **Gestión de sesión** con persistencia de usuario y timeout automático (15 min)
- 📱 **Compatible** con dispositivos móviles y tablets
- 🗄️ **Base de datos** Cloud Firestore para usuarios y productos
- ✅ **Auto-creación de usuarios** en Firestore al iniciar sesión
- 🎯 **Badge visual** para identificar administradores
- 🔄 **Script de migración** para pasar datos de Realtime Database a Firestore

---

## 🚀 Inicio Rápido

### Prerrequisitos

- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Conexión a internet (para cargar Firebase SDK)
- Cuenta de Firebase con **Cloud Firestore** habilitado

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/bercun/carbassdeportes.git
   cd carbassdeportes
   ```

2. **Abrir el proyecto**
  - Opción 1: Abrir `app/pages/index.html` directamente en el navegador
   - Opción 2: Usar Live Server en VS Code
   - Opción 3: Usar un servidor local simple:
     ```bash
     # Python 3
     python -m http.server 8000
    # Luego visitar http://localhost:8000/app/pages/
     ```

3. **Configurar Firebase**
   - Edita [firebase-config.js](firebase-config.js) con tus credenciales de Firebase.
   - Asegúrate de habilitar **Authentication** (Email/Password) y **Cloud Firestore** en la consola de Firebase.

### Migración de Datos (Si vienes de Realtime Database)

Si ya tenías datos en Realtime Database y quieres pasarlos a Firestore:
1. Abre el proyecto en el navegador.
2. Abre la consola (F12).
3. Ejecuta:
   ```javascript
   const script = document.createElement('script');
   script.src = 'migrate-to-firestore.js';
   document.head.appendChild(script);
   // Luego:
   migrateToFirestore();
   ```

---

## 🏗️ Estructura del Proyecto

```
carbassdeportes/
├── index.html              # Página principal (vista pública)
├── catalogo.html           # Catálogo completo de productos
├── login.html              # Página de autenticación (con navbar de retorno)
├── script.js               # Lógica JavaScript principal (lectura desde Firestore)
├── auth.js                 # Lógica de autenticación Firebase (escritura en Firestore)
├── auth-check.js           # Verificación de sesión activa y roles (Firestore)
├── firebase-config.js      # Configuración de Firebase (Auth, RTDB y Firestore)
├── admin.html              # Panel de administración
├── admin.js                # Lógica del panel administrativo (CRUD Firestore)
├── migrate-to-firestore.js # Script de migración RTDB -> Firestore
├── test-db.html            # Herramienta de diagnóstico Firebase
├── CONFIGURACION_ADMIN.md  # Guía de configuración de administradores
├── firebase-rules.json     # Reglas de seguridad Firebase (RTDB)
├── styles.css              # Estilos principales CSS
├── db.json                 # Datos de productos (formato JSON)
├── README.md               # Documentación del proyecto
└── sours/
```

### Descripción de Archivos Clave

| Archivo | Descripción |
|---------|-------------|
| `index.html` | Página principal con productos destacados, carrusel y promociones |
| `catalogo.html` | Catálogo completo organizado por categorías (Fútbol, Running, Fitness, etc.) |
| `login.html` | Formulario de login/registro con Firebase Authentication y botón de volver |
| `admin.html` | Panel de administración para gestionar productos y usuarios (solo administradores) |
| `script.js` | Lógica principal: carrusel, videos hover, carga de productos desde Firestore |
| `auth.js` | Manejo de login/registro, validación y guardado en Firestore con rol 'comprador' |
| `auth-check.js` | Verificación de sesión, gestión de roles en Firestore, timeout automático |
| `admin.js` | CRUD completo de productos y gestión de roles de usuarios en Firestore |
| `firebase-config.js` | Credenciales y configuración de Firebase (Auth, RTDB y Firestore) |
| `migrate-to-firestore.js` | Script para migrar datos existentes de Realtime Database a Firestore |
| `styles.css` | Estilos completos, incluyendo centrado de navbar en login y panel admin |

---

## 🔥 Configuración de Firebase

### Estructura de la Base de Datos (Firestore)

El proyecto utiliza Cloud Firestore con las siguientes colecciones:

#### Colección: `articulos`
Documentos con ID automático o manual:
```json
{
  "nombre": "Zapatillas Deportivas Premium",
  "imagen": "sours/img/articulos/zapatillas-deportivas-premium.jpg",
  "descripción": "Zapatillas diseñadas para ofrecer el máximo rendimiento.",
  "precio": 120.0,
  "categoria": "gym",
  "estatus": "destacado",
  "ultimaActualizacion": "timestamp"
}
```

#### Colección: `usuarios`
Documentos con ID igual al `uid` de Firebase Auth:
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "rol": "comprador",
  "fechaRegistro": "2025-12-22T10:30:00Z"
}
```

### Roles de Usuario

El sistema implementa dos niveles de acceso:

- **`comprador`** - Usuario estándar que puede navegar y comprar productos
- **`administrador`** - Usuario con privilegios completos (Acceso a [admin.html](admin.html))

### Reglas de Seguridad Recomendadas (Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /articulos/{articuloId} {
      allow read: if true;
      allow write: if request.auth != null; // O restringir a admins
    }
    match /usuarios/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow list: if request.auth != null && 
        get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.rol == 'administrador';
    }
  }
}
```

### Configuración del Primer Administrador

1. Crea un usuario desde [login.html](login.html).
2. En Firebase Console > Firestore Database, busca el documento del usuario en la colección `usuarios`.
3. Cambia el campo `rol` de `"comprador"` a `"administrador"`.
4. Recarga la página y verás el acceso al panel de administración.

---

## 🎨 Paleta de Colores

El diseño utiliza una paleta de colores definida en variables CSS:

| Color         | Código   | Uso                          |
|---------------|----------|------------------------------|
| Verde         | `#1ecb63`| Elementos destacados, CTAs   |
| Verde Oscuro  | `#17a352`| Hover en botones verdes      |
| Negro         | `#000000`| Navbar, footer, textos       |
| Blanco        | `#ffffff`| Fondos, contenedores         |
| Gris          | `#e0e0e0`| Fondo general, separadores   |

```css
:root {
  --verde: #1ecb63;
  --verde-oscuro: #17a352;
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
    <img class="logo-svg" src="sours/img/logos/logo_carbass.png" alt="CarbassDeportes Logo" />
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
  <div class="user-section">
    <span id="user-name" class="user-name"></span>
    <a href="#" class="carrito">🛒</a>
    <button onclick="logout()" class="btn-logout" id="logout-btn" style="display: none;">Cerrar sesión</button>
    <a href="login.html" class="btn-login" id="login-btn" style="display: none;">Iniciar Sesión</a>
  </div>
</header>
```

**Función:** Navegación principal sticky con logo, menú de navegación y sección de usuario dinámica.

**Sección de usuario:**
- **Sin autenticar**: Muestra botón "Iniciar Sesión" (verde)
- **Autenticado**: Muestra nombre de usuario, carrito y botón "Cerrar sesión"
- Controlado dinámicamente por `auth-check.js`

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

### Archivos JavaScript

#### `firebase-config.js`
Configuración e inicialización de Firebase.

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "carbassdeportes.firebaseapp.com",
  databaseURL: "https://carbassdeportes-default-rtdb.firebaseio.com",
  projectId: "carbassdeportes",
  storageBucket: "carbassdeportes.appspot.com",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID",
  measurementId: "TU_MEASUREMENT_ID"
};

firebase.initializeApp(firebaseConfig);
```

---

#### `auth-check.js`
Gestiona la visualización del navbar según el estado de autenticación.

```javascript
firebase.auth().onAuthStateChanged((user) => {
  const userNameElement = document.getElementById('user-name');
  const logoutBtn = document.getElementById('logout-btn');
  const loginBtn = document.getElementById('login-btn');
  
  if (user) {
    // Usuario autenticado: mostrar nombre y botón de logout
    if (userNameElement) {
      userNameElement.textContent = user.displayName || user.email;
      userNameElement.style.display = 'inline';
    }
    if (logoutBtn) logoutBtn.style.display = 'inline-block';
    if (loginBtn) loginBtn.style.display = 'none';
  } else {
    // Usuario NO autenticado: mostrar botón de login
    if (userNameElement) {
      userNameElement.style.display = 'none';
    }
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (loginBtn) loginBtn.style.display = 'inline-block';
  }
});

function logout() {
  firebase.auth().signOut().then(() => {
    window.location.href = 'index.html';
  });
}
```

**Función:** Actualiza la UI del navbar dinámicamente según si el usuario está autenticado o no.

---

#### `auth.js`
Maneja el sistema de login y registro.

```javascript
let isLoginMode = true;

function toggleMode(e) {
  e.preventDefault();
  isLoginMode = !isLoginMode;
  
  if (isLoginMode) {
    formTitle.textContent = 'Iniciar Sesión';
    submitBtn.textContent = 'Iniciar Sesión';
    toggleText.innerHTML = '¿No tienes cuenta? <a href="#" id="toggle-link">Regístrate aquí</a>';
    nameGroup.style.display = 'none';
    nameInput.required = false;
  } else {
    formTitle.textContent = 'Crear Cuenta';
    submitBtn.textContent = 'Registrarse';
    toggleText.innerHTML = '¿Ya tienes cuenta? <a href="#" id="toggle-link">Inicia sesión</a>';
    nameGroup.style.display = 'block';
    nameInput.required = true;
  }
  
  const newToggleLink = document.getElementById('toggle-link');
  if (newToggleLink) {
    newToggleLink.addEventListener('click', toggleMode);
  }
}

authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const name = nameInput.value.trim();

  try {
    if (isLoginMode) {
      await auth.signInWithEmailAndPassword(email, password);
    } else {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      await user.updateProfile({ displayName: name });
      await database.ref('usuarios/' + user.uid).set({
        nombre: name,
        email: email,
        fechaRegistro: new Date().toISOString()
      });
    }
    window.location.href = 'index.html';
  } catch (error) {
    // Manejo de errores en español
    errorMessage.textContent = obtenerMensajeError(error.code);
  }
});
```

**Función:** Gestiona login y registro de usuarios con Firebase Authentication.

**Características:**
- Toggle entre modo login y registro
- Validación de campos
- Mensajes de error en español
- Almacenamiento de datos de usuario en Realtime Database
- Redirección automática después de autenticarse

---

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

#### **4. Botones Agregar al Carrito con Protección**

```javascript
function setupAddButtons() {
  document.querySelectorAll('.add-btn').forEach(btn => {
    if(btn.dataset.listener === 'true') return;
    btn.dataset.listener = 'true';

    btn.addEventListener('click', (e)=>{
      // Verificar si el usuario está autenticado
      const user = firebase.auth().currentUser;
      
      if (!user) {
        // Si no está logueado, redirigir al login
        if (confirm('Debes iniciar sesión para agregar productos al carrito. ¿Ir a iniciar sesión?')) {
          window.location.href = 'login.html';
        }
        return;
      }
      
      // Usuario autenticado: agregar al carrito
      const card = e.target.closest('.card');
      const title = card.querySelector('h4').innerText;
      const originalText = e.target.innerText;
      
      e.target.innerText = 'Añadido ✓';
      e.target.disabled = true;
      
      setTimeout(()=>{ 
        e.target.innerText = originalText; 
        e.target.disabled = false; 
      }, 1400);
      
      console.info('Añadido al carrito:', title);
    });
  });
}
```

**Función:** Protege la funcionalidad de agregar al carrito para usuarios autenticados.

**Proceso:**
1. Verifica si hay un usuario autenticado con `firebase.auth().currentUser`
2. Si NO está autenticado: Muestra confirmación para ir a login
3. Si está autenticado: Procesa la adición al carrito con feedback visual
4. Evita múltiples eventos con `dataset.listener`

---

#### **5. Carga de Artículos desde Firebase**

```javascript
const db = firebase.database();

db.ref('articulos').on('value', (snapshot) => {
  const articlesData = snapshot.val();
  const allArticles = Object.values(articlesData || {});

  // Filtrar artículos por estatus
  const destacados = allArticles.filter(article => 
    article.estatus && article.estatus.toLowerCase() === 'destacado');
  const recientes = allArticles.filter(article => 
    article.estatus && article.estatus.toLowerCase() === 'recien agregado');
  const ofertas = allArticles.filter(article => 
    article.estatus && article.estatus.toLowerCase() === 'oferta');
  
  // Filtrar artículos por categoría
  const futbolArticles = allArticles.filter(article => 
    article.categoria && article.categoria.toLowerCase() === 'futbol');
  const basketArticles = allArticles.filter(article => 
    article.categoria && article.categoria.toLowerCase() === 'basket');
  const gymArticles = allArticles.filter(article => 
    article.categoria && article.categoria.toLowerCase() === 'gym');
  const coleccionablesArticles = allArticles.filter(article => 
    article.categoria && article.categoria.toLowerCase() === 'coleccionables');

  // Detectar si estamos en la página principal o en el catálogo
  const isCatalogPage = window.location.pathname.includes('catalogo.html');
  
  if (isCatalogPage) {
    // Catálogo: mostrar todos los artículos
    renderArticlesToContainer(futbolContainer, futbolArticles, false);
    renderArticlesToContainer(basketContainer, basketArticles, false);
    renderArticlesToContainer(gymContainer, gymArticles, false);
    renderArticlesToContainer(coleccionablesContainer, coleccionablesArticles, false);
  } else {
    // Página principal: máximo 3 artículos por sección
    renderArticlesToContainer(destacadosContainer, destacados, false, 3);
    renderArticlesToContainer(recientesContainer, recientes, true, 3);
    renderArticlesToContainer(ofertasContainer, ofertas, true, 3);
  }
});
```

**Función:** Carga productos desde Firebase Realtime Database y los distribuye por secciones.

**Características:**
- Lectura en tiempo real con `.on('value')`
- Filtrado por `estatus` (destacado, recien agregado, oferta)
- Filtrado por `categoria` (futbol, basket, gym, coleccionables)
- Detección automática de página (index vs catálogo)
- Límite de 3 productos en página principal
- Todos los productos en página de catálogo

---

#### **6. Renderizado Dinámico de Productos**

```javascript
function createArticleCardHtml(article, isSmallGrid = false) {
  return `
    <article class="card">
      <div class="thumb">
        <img src="${article.imagen}" alt="${article.nombre}"/>
      </div>
      <h4>${article.nombre}</h4>
      <p class="meta">
        <span class="price">$${article.precio}</span>
        ${article.estatus ? `<span class="badge">${article.estatus}</span>` : ''}
      </p>
      <p>${article.descripcion}</p>
      <button class="add-btn">Agregar al carrito</button>
    </article>
  `;
}

function renderArticlesToContainer(containerElement, articlesArray, isSmallGrid = false, limit = null) {
  if (!containerElement) return;
  
  if (!articlesArray || articlesArray.length === 0) {
    containerElement.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No hay artículos disponibles</p>';
    return;
  }

  const articlesToRender = limit ? articlesArray.slice(0, limit) : articlesArray;
  containerElement.innerHTML = articlesToRender.map(article => 
    createArticleCardHtml(article, isSmallGrid)
  ).join('');
  
  setupAddButtons();
}
```

**Función:** Genera HTML de tarjetas de productos dinámicamente.

**Parámetros:**
- `article`: Objeto con datos del producto
- `isSmallGrid`: Determina el tamaño de la tarjeta
- `limit`: Número máximo de productos a mostrar

---

## 🔥 Firebase - Integración y Configuración

### Servicios Utilizados

1. **Firebase Authentication**
   - Autenticación por email y contraseña
   - Gestión de sesiones
   - Actualización de perfiles de usuario

2. **Firebase Realtime Database**
   - Almacenamiento de artículos
   - Almacenamiento de datos de usuarios
   - Lectura en tiempo real

### Estructura de Base de Datos

```json
{
  "articulos": {
    "id1": {
      "nombre": "Zapatillas Deportivas Premium",
      "precio": 89990,
      "imagen": "sours/img/articulos/zapatillas-deportivas-premium.jpg",
      "descripcion": "Zapatillas de alta gama...",
      "categoria": "futbol",
      "estatus": "destacado"
    }
  },
  "usuarios": {
    "uid123": {
      "nombre": "Juan Pérez",
      "email": "juan@example.com",
      "fechaRegistro": "2025-12-01T10:30:00.000Z"
    }
  }
}
```

### Reglas de Seguridad

```json
{
  "rules": {
    "articulos": {
      ".read": true,
      ".write": "auth != null"
    },
    "usuarios": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

**Explicación:**
- `articulos` → Lectura pública, escritura solo para autenticados
- `usuarios` → Cada usuario solo puede leer/escribir sus propios datos

### Configuración Inicial

1. Crear proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilitar **Email/Password** en Authentication
3. Crear **Realtime Database**
4. Actualizar reglas de seguridad
5. Copiar credenciales a `firebase-config.js`
6. Importar datos desde `db.json` (opcional)

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

#### **7. Botones de Autenticación**

```css
.btn-logout {
  padding: 8px 16px;
  background: transparent;
  border: 1px solid white;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
}

.btn-logout:hover {
  background: white;
  color: var(--negro);
}

.btn-login {
  padding: 8px 16px;
  background: var(--verde);
  border: 1px solid var(--verde);
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  text-decoration: none;
  display: inline-block;
}

.btn-login:hover {
  background: var(--verde-oscuro);
  border-color: var(--verde-oscuro);
  transform: scale(1.05);
}
```

**Función:** Estilos para botones de login y logout en el navbar.

---

#### **8. Página de Login**

```css
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
}

.login-box {
  background: var(--blanco);
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  max-width: 400px;
  width: 100%;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--negro);
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid var(--gris);
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--verde);
}

.btn-primary {
  width: 100%;
  padding: 14px;
  background: var(--verde);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover {
  background: var(--verde-oscuro);
  transform: translateY(-2px);
}

.error-message {
  color: #d32f2f;
  font-size: 14px;
  margin-bottom: 16px;
  padding: 10px;
  background: #ffebee;
  border-radius: 6px;
  display: none;
}

.error-message:not(:empty) {
  display: block;
}
```

**Función:** Estilos completos para la página de autenticación.

---

#### **9. Diseño Responsive**

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

**Navegación y UI:**
1. **Navegación Sticky**: Navbar fijo que permanece visible al hacer scroll
2. **UI Dinámica**: Botones que cambian según estado de autenticación
3. **Diseño Responsive**: Adaptación a móviles, tablets y desktop
4. **Efectos Hover**: Animaciones en tarjetas, botones e iconos

**Carrusel y Multimedia:**
5. **Carrusel Automático**: Rotación automática de imágenes cada 4 segundos
6. **Controles Manuales**: Botones y teclado para navegar el carrusel
7. **Video Hover**: Reproducción de video al pasar el cursor
8. **Imagen Aleatoria**: Muestra coleccionables diferentes en cada carga

**Autenticación (Firebase):**
9. **Sistema de Login**: Email y contraseña con Firebase Auth
10. **Sistema de Registro**: Creación de cuentas con datos de perfil
11. **Toggle Login/Registro**: Cambio dinámico entre modos
12. **Gestión de Sesión**: Verificación automática de estado de autenticación
13. **Logout**: Cierre de sesión con redirección
14. **Protección de Acciones**: Solo usuarios autenticados pueden agregar al carrito

**Productos (Firebase Realtime Database):**
15. **Carga Dinámica**: Productos cargados desde Firebase en tiempo real
16. **Filtrado por Estatus**: Destacados, Recién Agregados, Ofertas
17. **Filtrado por Categoría**: Fútbol, Basket, Gym, Coleccionables
18. **Límite en Página Principal**: Máximo 3 productos por sección
19. **Catálogo Completo**: Página separada con todos los productos
20. **Agregar al Carrito**: Feedback visual con protección de autenticación

**Otras Características:**
21. **Mapa Integrado**: Google Maps embebido en el footer
22. **Categorías Visuales**: Iconos SVG para navegación por categorías
23. **Mensajes de Error**: Mensajes en español para errores de autenticación
24. **Vista Pública**: Páginas visibles sin login, acciones protegidas

### 🔮 Posibles Mejoras Futuras

- ✨ Carrito de compras funcional con persistencia en Firebase
- ✨ Sistema de favoritos/lista de deseos
- ✨ Filtros avanzados (precio, disponibilidad, valoración)
- ✨ Búsqueda de productos con autocompletado
- ✨ Sistema de reviews y calificaciones
- ✨ Checkout y pasarela de pago
- ✨ Panel administrativo para gestión de productos
- ✨ Historial de pedidos
- ✨ Notificaciones push
- ✨ Modo oscuro
- ✨ Autenticación con Google/Facebook
- ✨ Recuperación de contraseña

---

## 📱 Compatibilidad

- ✅ Chrome/Edge (últimas versiones)
- ✅ Firefox (últimas versiones)
- ✅ Safari (últimas versiones)
- ✅ Dispositivos móviles (responsive)
- ✅ Firebase Web SDK v8.10.1

---

## 🔧 Instalación y Configuración

### Requisitos Previos

- Cuenta de Firebase (gratuita)
- Navegador web moderno
- Editor de código (VS Code recomendado)

### Pasos de Instalación

1. **Clonar o descargar el proyecto**
   ```bash
   git clone https://github.com/bercun/carbassdeportes.git
   cd carbassdeportes
   ```

2. **Configurar Firebase**
   - Ir a [Firebase Console](https://console.firebase.google.com/)
   - Crear nuevo proyecto "carbassdeportes"
   - Habilitar **Authentication** → Email/Password
   - Crear **Realtime Database**
   - Copiar credenciales del proyecto

3. **Actualizar `firebase-config.js`**
   ```javascript
   const firebaseConfig = {
     apiKey: "TU_API_KEY_AQUI",
     authDomain: "tu-proyecto.firebaseapp.com",
     databaseURL: "https://tu-proyecto.firebaseio.com",
     projectId: "tu-proyecto-id",
     storageBucket: "tu-proyecto.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123:web:abc123",
     measurementId: "G-ABC123"
   };
   ```

4. **Configurar Reglas de Firebase**
   - En Realtime Database → Reglas
   ```json
   {
     "rules": {
       "articulos": {
         ".read": true,
         ".write": "auth != null"
       },
       "usuarios": {
         "$uid": {
           ".read": "$uid === auth.uid",
           ".write": "$uid === auth.uid"
         }
       }
     }
   }
   ```

5. **Importar datos de productos (opcional)**
   - En Realtime Database → Datos
   - Importar archivo `db.json`

6. **Abrir la aplicación**
   - Abrir `index.html` en el navegador
   - O usar Live Server en VS Code

---

## 📚 Estructura de Datos Firebase

### Nodo: `articulos`

**Atributos:**
```javascript
{
  id: String,           // Identificador único
  nombre: String,       // Nombre del producto
  precio: Number,       // Precio en pesos
  imagen: String,       // URL de la imagen
  descripcion: String,  // Descripción del producto
  categoria: String,    // "futbol" | "basket" | "gym" | "coleccionables"
  estatus: String       // "destacado" | "recien agregado" | "oferta"
}
```

**Ejemplo:**
```json
{
  "articulos": {
    "art001": {
      "nombre": "Zapatillas Running Elite",
      "precio": 89990,
      "imagen": "sours/img/articulos/zapatillas-running-elite.jpg",
      "descripcion": "Zapatillas de alto rendimiento con tecnología de amortiguación avanzada.",
      "categoria": "futbol",
      "estatus": "destacado"
    }
  }
}
```

### Nodo: `usuarios`

**Atributos:**
```javascript
{
  nombre: String,       // Nombre completo del usuario
  email: String,        // Email de registro
  fechaRegistro: String // Fecha ISO de registro
}
```

**Ejemplo:**
```json
{
  "usuarios": {
    "aBc123XyZ": {
      "nombre": "María González",
      "email": "maria@example.com",
      "fechaRegistro": "2025-12-01T15:30:00.000Z"
    }
  }
}
```

---

## 🎯 Flujo de Usuario

### Usuario No Autenticado

1. Ingresa a `index.html` o `catalogo.html`
2. Ve todos los productos disponibles
3. Ve botón "Iniciar Sesión" en el navbar
4. Intenta agregar producto → Se le pide autenticarse
5. Click en "Iniciar Sesión" → Redirige a `login.html`

### Proceso de Registro

1. En `login.html`, click en "Regístrate aquí"
2. Aparece campo "Nombre completo"
3. Completa: Nombre, Email, Contraseña (mín. 6 caracteres)
4. Click en "Registrarse"
5. Firebase crea cuenta y guarda datos
6. Redirección automática a `index.html`

### Proceso de Login

1. En `login.html`, modo "Iniciar Sesión" (default)
2. Ingresa Email y Contraseña
3. Click en "Iniciar Sesión"
4. Firebase valida credenciales
5. Redirección automática a `index.html`

### Usuario Autenticado

1. Ve su nombre en el navbar
2. Ve botón "Cerrar sesión"
3. Puede agregar productos al carrito sin restricciones
4. Click en "Cerrar sesión" → Cierra sesión y vuelve a `index.html`

---

## 👤 Créditos

**Diseñado por:** brkoon  
**Año:** 2025  
**Proyecto:** CarbassDeportes  
**Repositorio:** [github.com/bercun/carbassdeportes](https://github.com/bercun/carbassdeportes)  
**Branch:** test_firebase

---

## 📞 Contacto

- **Email:** contacto@carbassdeportes.com
- **Teléfono:** +598 0000 0000
- **Redes Sociales:** @carbassdeportes
- **Ubicación:** Galería Cristal, Montevideo, Uruguay

---

## 📝 Licencia

© 2025 CarbassDeportes - Todos los derechos reservados.

---

## 📖 Notas del Desarrollador

### Cambios Principales Implementados

**v2.0 - Sistema de Autenticación y Firebase (Diciembre 2025)**

1. ✅ Integración completa con Firebase Authentication y Realtime Database
2. ✅ Sistema de login/registro con email y contraseña
3. ✅ Protección de acciones (agregar al carrito) para usuarios autenticados
4. ✅ Páginas públicas (visualización sin login)
5. ✅ Navbar dinámico según estado de autenticación
6. ✅ Carga dinámica de productos desde Firebase
7. ✅ Filtrado por categorías y estatus
8. ✅ Página de catálogo completo separada
9. ✅ Límite de 3 productos por sección en página principal
10. ✅ Mensajes de error en español
11. ✅ Iconos SVG personalizados para categorías
12. ✅ CSS con variables para verde oscuro en hovers
13. ✅ Botón "Iniciar Sesión" visible para usuarios no autenticados

**v1.0 - Versión Inicial (Noviembre 2025)**
- Diseño responsive básico
- Carrusel automático
- Grid de productos estático
- Video hover
- Mapa integrado

### Tecnologías Utilizadas

| Categoría | Tecnología | Versión | Uso |
|-----------|-----------|---------|-----|
| **Frontend** | HTML5 | - | Estructura semántica |
| | CSS3 | - | Diseño y estilos responsivos |
| | JavaScript | ES6+ | Lógica de interacción |
| **Backend/BaaS** | Firebase Authentication | 8.10.1 | Sistema de login/registro |
| | Firebase Realtime Database | 8.10.1 | Almacenamiento de usuarios y productos |
| **Diseño** | CSS Grid | - | Layout de productos |
| | Flexbox | - | Navegación y componentes |
| | CSS Variables | - | Tema de colores consistente |
| **Patrones JS** | IIFE | - | Encapsulamiento de lógica |
| | Event Delegation | - | Optimización de eventos |
| | Async/Await | - | Operaciones asíncronas |
| **Multimedia** | HTML5 Video | - | Videos hover promocionales |
| | SVG | - | Iconos de categorías personalizados |

### Dependencias Externas

```html
<!-- Firebase SDK v8.10.1 -->
<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js"></script>
```

> **Nota**: No se requiere `npm install`. Todas las dependencias se cargan vía CDN.

---

## ⚡ Funcionalidades Principales

### 🔐 Sistema de Autenticación

- **Login y Registro**: Formulario dual que alterna entre login y registro
- **Validación**: Email válido y contraseña mínimo 6 caracteres
- **Persistencia**: Sesión mantenida entre páginas
- **Protección**: Botón "Agregar al carrito" solo para usuarios autenticados
- **Feedback**: Mensajes de error en español
- **Perfil**: Nombre de usuario visible en navbar al autenticarse

### 🛍️ Catálogo de Productos

- **Carga Dinámica**: Productos cargados desde Firebase Realtime Database
- **Filtrado Múltiple**: Por categoría (Fútbol, Basket, Gym, Coleccionables)
- **Filtrado por Estado**: Destacados, Ofertas, Recién Agregados
- **Página Principal**: Muestra máximo 3 productos por sección
- **Catálogo Completo**: [catalogo.html](catalogo.html) muestra todos los productos por categoría
- **Placeholders**: Imágenes de ejemplo con Placehold.co mientras se agregan reales

### 🎨 Interfaz de Usuario

- **Navbar Sticky**: Navegación siempre visible
- **Responsive Design**: Adaptable a móviles, tablets y desktop
- **Carrusel Automático**: Auto-play con controles manuales
- **Videos Hover**: Reproducción al pasar el mouse
- **Iconos SVG**: Categorías representadas con iconos personalizados
- **Paleta Visual**: Muestra de colores corporativos en presentación
- **Badges**: Etiquetas visuales para productos (Top, Nuevo, Oferta)

### 💡 Interactividad JavaScript

- **IIFE Pattern**: Código modular y encapsulado
- **Event Delegation**: Optimización de eventos en productos dinámicos
- **Imagen Aleatoria**: Coleccionable aleatorio en el aside
- **Temporizador**: Auto-reset del carrusel tras interacción manual
- **Confirmaciones**: Modales nativas para acciones críticas
- **Feedback Visual**: Botones cambian a "Añadido ✓" temporalmente

---

## 📝 Notas Técnicas

### Orden de Carga de Scripts

Es crucial mantener este orden en todos los archivos HTML:

```html
<!-- 1. Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js"></script>

<!-- 2. Configuración de Firebase -->
<script src="firebase-config.js"></script>

<!-- 3. Verificación de autenticación (excepto en login.html) -->
<script src="auth-check.js"></script>

<!-- 4. Script principal -->
<script src="script.js"></script> <!-- Solo en index.html y catalogo.html -->
<script src="auth.js"></script>    <!-- Solo en login.html -->
```

### Consideraciones Importantes

- **Firebase SDK v8:** Se usa sintaxis de callbacks (no modular) para mayor compatibilidad
- **Realtime Database:** Preferido sobre Firestore por simplicidad en este proyecto
- **Auth Check:** `auth-check.js` debe cargarse después de Firebase pero antes de `script.js`
- **Reglas de Seguridad:** Lectura pública en artículos, escritura solo autenticados
- **Toggle Function:** Usa función nombrada para evitar problemas con `arguments.callee`
- **Event Delegation:** Los eventos de botones se configuran después del renderizado
- **Placeholders:** Imágenes temporales con Placehold.co mientras se agregan imágenes reales

---

## 🐛 Solución de Problemas Comunes

### Los productos no cargan

**Causa:** Reglas de Firebase muy restrictivas  
**Solución:** Verificar que las reglas permitan `.read: true` en nodo `articulos`

### El botón de login/registro no funciona

**Causa:** Firebase no inicializado correctamente  
**Solución:** Verificar que `firebase-config.js` tenga `firebase.initializeApp(firebaseConfig)`

### "Debes iniciar sesión" aparece siempre

**Causa:** Firebase Auth no reconoce la sesión  
**Solución:** Revisar que la configuración de Firebase sea correcta y que el dominio esté autorizado en Firebase Console

### Los botones de toggle no funcionan

**Causa:** Event listener no reasignado después de cambiar el DOM  
**Solución:** Usar función nombrada (`toggleMode`) en lugar de anónima

### Productos duplicados en el catálogo

**Causa:** Múltiples llamadas a `renderArticlesToContainer`  
**Solución:** Verificar que `setupAddButtons()` use `dataset.listener` para evitar duplicados

### El carrusel no avanza automáticamente

**Causa:** Error en la función de timer o falta el elemento `#slides`  
**Solución:** Verificar que el elemento existe antes de inicializar el carrusel

### Videos no se reproducen en móviles

**Causa:** Algunos navegadores móviles requieren interacción del usuario  
**Solución:** Considerar usar imágenes animadas (GIF) como alternativa para móviles

---

## 🚧 Roadmap y Mejoras Futuras

### En Desarrollo

- [ ] Carrito de compras funcional con almacenamiento local
- [ ] Página de perfil de usuario
- [ ] Sistema de favoritos
- [ ] Búsqueda de productos por nombre
- [ ] Paginación en catálogo completo

### Próximas Versiones

**v1.3 - Carrito Completo** (Planificado)
- Carrito persistente en localStorage
- Vista detallada del carrito
- Cálculo de totales
- Botón de checkout

**v1.4 - Mejoras de UX** (Planificado)
- Animaciones CSS en transiciones
- Skeleton loaders mientras cargan productos
- Toast notifications personalizadas
- Modo oscuro

**v1.5 - E-commerce Completo** (Futuro)
- Integración con pasarela de pago
- Historial de pedidos
- Gestión de inventario avanzada

### Características Deseables

- 📊 Analytics de productos más vistos
- ⭐ Sistema de valoraciones y reseñas
- 🔍 Filtros avanzados (precio, popularidad, etc.)
- 📧 Notificaciones por email
- 🌐 Internacionalización (i18n)
- 📦 Seguimiento de pedidos
- 💬 Chat de soporte

---

## 🎯 Próximos Pasos Recomendados

Ahora que el sistema de roles está implementado, estos son los pasos sugeridos para continuar el desarrollo:

### 1. **Migrar Usuarios Existentes** (Prioridad Alta)
Actualmente hay 4 usuarios adicionales en Firebase Authentication que necesitan ser migrados a la base de datos:
- Abre [test-db.html](test-db.html)
- Inicia sesión con cada usuario
- Haz clic en "Migrar Usuario Actual a Database"
- Asigna roles según corresponda desde el panel de admin

### 2. **Probar Funcionalidad del Panel Admin** (Prioridad Alta)
- Accede a [admin.html](admin.html) con el usuario administrador
- Prueba agregar, editar y eliminar productos
- Verifica que los cambios se reflejen en [catalogo.html](catalogo.html) e [index.html](index.html)
- Prueba cambiar roles de usuarios

### 3. **Actualizar Reglas de Seguridad Firebase** (Prioridad Media)
Las reglas actuales permiten lectura/escritura a cualquier usuario autenticado. Para producción:
- Implementa las reglas basadas en roles sugeridas en este README
- Protege la escritura en `articulos` solo para administradores
- Permite a usuarios leer/editar solo sus propios datos

### 4. **Agregar Imágenes Reales** (Prioridad Media)
Actualmente se usan placeholders de Unsplash:
- Sube imágenes de productos a `sours/img/articulos/`
- Actualiza las URLs en Firebase Database
- Optimiza imágenes para web (WebP, compresión)

### 5. **Implementar Carrito de Compras** (Próximo Feature)
- Crear estructura de carrito en localStorage
- Botones "Agregar al Carrito" funcionales
- Vista de carrito con totales
- Persistencia entre sesiones

### 6. **Sistema de Pedidos** (Próximo Feature)
- Crear nodo `pedidos` en Firebase Database
- Formulario de checkout
- Guardar historial de compras por usuario
- Vista de pedidos en perfil de usuario

### 7. **Testing y Optimización** (Continuo)
- Probar en diferentes navegadores
- Optimizar tiempos de carga
- Validar responsive design en móviles
- Auditoría con Lighthouse

### 8. **Deployment** (Futuro)
- Configurar Firebase Hosting
- Configurar dominio personalizado
- SSL/HTTPS automático
- CI/CD con GitHub Actions

---

## 👨‍💻 Autor y Contribuciones

**Proyecto:** CarbassDeportes  
**Desarrollado para:** Prueba Web con ChatGPT  
**Año:** 2025  
**Tecnología:** Vanilla JavaScript + Firebase  

### Contribuir

Si deseas contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: amazing feature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible para fines educativos.

---

## 🙏 Agradecimientos

- Firebase por proporcionar servicios BaaS gratuitos
- Placehold.co por imágenes placeholder
- Comunidad de desarrolladores web

---

**Última actualización:** 22 de diciembre de 2025

---