// Este script maneja la visualización del usuario y protege acciones

// Configuración de timeout (15 minutos de inactividad)
const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutos en milisegundos
let sessionTimer = null;

// Función para reiniciar el temporizador de sesión
function resetSessionTimer() {
  // Limpiar el temporizador anterior
  if (sessionTimer) {
    clearTimeout(sessionTimer);
  }
  
  // Crear nuevo temporizador
  sessionTimer = setTimeout(() => {
    const user = firebase.auth().currentUser;
    if (user) {
      alert('Tu sesión ha expirado por inactividad. Por favor, inicia sesión nuevamente.');
      logout();
    }
  }, SESSION_TIMEOUT);
}

// Eventos que reinician el temporizador (actividad del usuario)
const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
activityEvents.forEach(event => {
  document.addEventListener(event, () => {
    if (firebase.auth().currentUser) {
      resetSessionTimer();
    }
  }, true);
});

firebase.auth().onAuthStateChanged((user) => {
  const userNameElement = document.getElementById('user-name');
  const logoutBtn = document.getElementById('logout-btn');
  const loginBtn = document.getElementById('login-btn');
  const adminLink = document.getElementById('admin-link');
  
  if (user) {
    // Cargar datos del usuario desde la base de datos
    database.ref('usuarios/' + user.uid).once('value')
      .then((snapshot) => {
        const userData = snapshot.val();
        const userRole = userData?.rol || 'comprador';
        
        // Guardar el rol en sessionStorage para acceso rápido
        sessionStorage.setItem('userRole', userRole);
        
        // Si no hay datos en la BD, crearlos ahora
        if (!userData) {
          database.ref('usuarios/' + user.uid).set({
            nombre: user.displayName || user.email.split('@')[0],
            email: user.email,
            rol: 'comprador',
            fechaRegistro: new Date().toISOString()
          }).catch(err => console.error('Error creando usuario en BD:', err));
        }
        
        // Usuario autenticado: mostrar nombre y botón de logout
        if (userNameElement) {
          let displayName = user.displayName || user.email;
          
          // Agregar badge de ADMIN si corresponde
          if (userRole === 'administrador') {
            displayName = `${displayName} <span class="admin-badge">ADMIN</span>`;
          }
          
          userNameElement.innerHTML = displayName;
          userNameElement.style.display = 'inline';
        }
        
        if (logoutBtn) {
          logoutBtn.classList.remove('hidden');
          logoutBtn.style.display = 'inline-block';
        }
        if (loginBtn) {
          loginBtn.classList.add('hidden');
          loginBtn.style.display = 'none';
        }
        
        // Mostrar enlace al panel de admin solo para administradores
        if (adminLink) {
          if (userRole === 'administrador') {
            adminLink.classList.remove('hidden');
            adminLink.style.display = 'inline-block';
          } else {
            adminLink.classList.add('hidden');
            adminLink.style.display = 'none';
          }
        }
      })
      .catch((error) => {
        console.error('Error al cargar datos del usuario:', error);
        
        // Aún así mostrar la interfaz básica
        if (userNameElement) {
          userNameElement.textContent = user.displayName || user.email;
          userNameElement.style.display = 'inline';
        }
        if (logoutBtn) {
          logoutBtn.classList.remove('hidden');
          logoutBtn.style.display = 'inline-block';
        }
        if (loginBtn) {
          loginBtn.classList.add('hidden');
          loginBtn.style.display = 'none';
        }
        if (adminLink) {
          adminLink.classList.add('hidden');
          adminLink.style.display = 'none';
        }
      });
    
    // Iniciar el temporizador de sesión
    resetSessionTimer();
  } else {
    // Limpiar sessionStorage
    sessionStorage.removeItem('userRole');
    
    // Usuario NO autenticado: mostrar botón de login
    if (userNameElement) {
      userNameElement.style.display = 'none';
      userNameElement.textContent = '';
    }
    if (logoutBtn) {
      logoutBtn.classList.add('hidden');
      logoutBtn.style.display = 'none';
    }
    if (loginBtn) {
      loginBtn.classList.remove('hidden');
      loginBtn.style.display = 'inline-block';
    }
    if (adminLink) {
      adminLink.classList.add('hidden');
      adminLink.style.display = 'none';
    }
    
    // Limpiar el temporizador si existe
    if (sessionTimer) {
      clearTimeout(sessionTimer);
      sessionTimer = null;
    }
  }
});

// Función de logout
function logout() {
  // Limpiar el temporizador de sesión
  if (sessionTimer) {
    clearTimeout(sessionTimer);
    sessionTimer = null;
  }
  
  firebase.auth().signOut().then(() => {
    console.log('Sesión cerrada exitosamente');
    window.location.href = 'index.html';
  }).catch((error) => {
    console.error('Error al cerrar sesión:', error);
    alert('Error al cerrar sesión. Por favor, intenta nuevamente.');
  });
}
