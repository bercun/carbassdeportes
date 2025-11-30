
// Imagen aleatoria de coleccionables en el aside
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

// Video con reproducción al hacer hover
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

// Carrusel simple: auto-play + controles
(function(){
  const slidesEl = document.getElementById('slides');
  const slidesCount = slidesEl.children.length;
  const nextBtn = document.getElementById('next');
  const prevBtn = document.getElementById('prev');
  let index = 0;
  let interval = null;

  function goTo(i){
    index = (i + slidesCount) % slidesCount;
    slidesEl.style.transform = `translateX(${ -index * 101.6 }%)`;
  }
  function next(){ goTo(index + 1) }
  function prev(){ goTo(index - 1) }

  nextBtn.addEventListener('click', ()=>{ next(); resetTimer(); });
  prevBtn.addEventListener('click', ()=>{ prev(); resetTimer(); });

  function startTimer(){ interval = setInterval(next, 4000); }
  function resetTimer(){ clearInterval(interval); startTimer(); }

  // keyboard navigation
  window.addEventListener('keydown', (e)=>{ if(e.key==='ArrowRight') next(); if(e.key==='ArrowLeft') prev(); });

  // init
  goTo(0);
  startTimer();

  // tiny accessibility: pause on focus
  slidesEl.addEventListener('mouseover', ()=>clearInterval(interval));
  slidesEl.addEventListener('mouseleave', ()=>startTimer());
})();

// Funcionalidad simple para botones "Agregar" (simula añadir al carrito)
function setupAddButtons() {
  document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', (e)=>{
      const card = e.target.closest('.card');
      const title = card.querySelector('h4').innerText;
      e.target.innerText = 'Añadido ✓';
      e.target.disabled = true;
      setTimeout(()=>{ e.target.innerText = 'Agregar al carrito'; e.target.disabled = false; }, 1400);
      // Aquí podés integrar la lógica real del carrito o llamadas API
      console.info('Añadido al carrito:', title);
    })
  })
}

setupAddButtons();

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
import { db } from './firebase-config.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Cargar productos desde Firebase y distribuirlos por secciones
async function cargarProductos() {
  const destacadosContainer = document.getElementById('destacados-container');
  const recientesContainer = document.getElementById('recientes-container');
  const ofertasContainer = document.getElementById('ofertas-container');

  // Limpiar contenedores (o mostrar mensaje de carga si no se hizo en HTML)
  if(destacadosContainer) destacadosContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Cargando...</p>';
  if(recientesContainer) recientesContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Cargando...</p>';
  if(ofertasContainer) ofertasContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Cargando...</p>';

  try {
    const querySnapshot = await getDocs(collection(db, "productos"));
    
    // Limpiar mensajes de carga
    if(destacadosContainer) destacadosContainer.innerHTML = '';
    if(recientesContainer) recientesContainer.innerHTML = '';
    if(ofertasContainer) ofertasContainer.innerHTML = '';

    if (querySnapshot.empty) {
      console.log("No se encontraron productos.");
      return;
    }

    querySnapshot.forEach((doc) => {
      const producto = doc.data();
      // Normalizar estatus a minúsculas para comparar
      const estatus = (producto.estatus || '').toLowerCase();
      
      // Crear HTML según el tipo de tarjeta (completa para destacados, simple para otros)
      
      // 1. DESTACADOS (Top, Destacado)
      if (estatus.includes('top') || estatus.includes('destacado')) {
        if(destacadosContainer) {
          destacadosContainer.innerHTML += `
            <article class="card">
              <div class="thumb">
                <img src="${producto.imagen || 'https://placehold.co/600x400?text=Sin+Imagen'}" alt="${producto.nombre}"/>
              </div>
              <h4>${producto.nombre}</h4>
              <p class="meta">
                <span class="price">$${producto.precio}</span>
                <span class="badge">${producto.etiqueta || 'Top'}</span>
              </p>
              <p>${producto.descripcion || ''}</p>
              <button class="add-btn">Agregar al carrito</button>
            </article>
          `;
        }
      }

      // 2. RECIÉN AGREGADOS (Nuevo)
      if (estatus.includes('nuevo') || estatus.includes('reciente')) {
        if(recientesContainer) {
          recientesContainer.innerHTML += `
            <div class="card">
              <div class="thumb">
                <img src="${producto.imagen || 'https://placehold.co/400x260?text=Nuevo'}" alt="${producto.nombre}"/>
              </div>
              <h4>${producto.nombre}</h4>
              <p class="meta" style="margin-top:5px;">
                <span class="price" style="font-size:0.9em">$${producto.precio}</span>
              </p>
            </div>
          `;
        }
      }

      // 3. OFERTAS (Oferta)
      if (estatus.includes('oferta')) {
        if(ofertasContainer) {
          ofertasContainer.innerHTML += `
            <div class="card">
              <div class="thumb">
                <img src="${producto.imagen || 'https://placehold.co/400x260?text=Oferta'}" alt="${producto.nombre}"/>
              </div>
              <h4>${producto.nombre}</h4>
              <p class="meta" style="margin-top:5px;">
                <span class="price" style="font-size:0.9em">$${producto.precio}</span>
                <span class="badge" style="font-size:0.7em; padding:4px;">Oferta</span>
              </p>
            </div>
          `;
        }
      }
    });

    // Re-inicializar los botones de agregar al carrito
    inicializarBotonesCarrito();

  } catch (error) {
    console.error("Error cargando productos:", error);
  }
}

// Inicializar botones
function inicializarBotonesCarrito() {
  document.querySelectorAll('.add-btn').forEach(btn => {
    if(btn.dataset.bound) return;
    btn.dataset.bound = true;

    btn.addEventListener('click', (e)=>{
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

// Llamar a la carga de productos al iniciar
cargarProductos();

// Imagen aleatoria de coleccionables en el aside

// Cargar artículos desde Firebase
const articlesGrid = document.querySelector('.grid');

function renderArticles(articles) {
  articlesGrid.innerHTML = ''; // Limpiar el grid
  for (const articleId in articles) {
    const article = articles[articleId];
    const card = `
      <article class="card">
        <div class="thumb"><img src="${article.imagen}" alt="${article.nombre}"/></div>
        <h4>${article.nombre}</h4>
        <p class="meta"><span class="price">$${article.precio.toFixed(2)}</span><span class="badge">${article.estatus}</span></p>
        <p>${article.descripción}</p>
        <button class="add-btn">Agregar al carrito</button>
      </article>
    `;
    articlesGrid.innerHTML += card;
  }
  setupAddButtons(); // Re-asociar eventos a los nuevos botones
}

db.ref('articulos').on('value', (snapshot) => {
  const articles = snapshot.val();
  renderArticles(articles);
});
