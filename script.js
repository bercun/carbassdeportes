
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
const db = firebase.database();

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
