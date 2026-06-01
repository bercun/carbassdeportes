
// Variables del formulario
const authForm = document.getElementById('auth-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const nameInput = document.getElementById('name');
const nameGroup = document.getElementById('name-group');
const submitBtn = document.getElementById('submit-btn');
const formTitle = document.getElementById('form-title');
const toggleLink = document.getElementById('toggle-link');
const toggleText = document.getElementById('toggle-text');
const errorMessage = document.getElementById('error-message');

let isLoginMode = true;
let csrfToken = null; // Token CSRF global

// Obtener token CSRF al cargar la página
async function obtenerCsrfToken() {
  try {
    const response = await fetch('api/check_auth.php', { credentials: 'include' });
    const data = await response.json();
    csrfToken = data.csrf_token;
    
    // Si ya está autenticado, redirigir
    if (data.logged_in && window.location.pathname.includes('login.html')) {
      window.location.href = 'index.html';
    }
  } catch (err) {
    console.error('Error al obtener token CSRF:', err);
  }
}

// Obtener token al cargar
obtenerCsrfToken();

// Función para alternar entre login y registro
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
  
  // Re-asignar evento al nuevo link
  const newToggleLink = document.getElementById('toggle-link');
  if (newToggleLink) {
    newToggleLink.addEventListener('click', toggleMode);
  }
  
  // Limpiar mensaje de error
  if (errorMessage) {
    errorMessage.textContent = '';
  }
}

// Evento inicial para alternar modo
if (toggleLink) {
  toggleLink.addEventListener('click', toggleMode);
}

// Función para manejar el envío del formulario
if (authForm) {
  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value;
    const password = passwordInput.value;
    const nombre = nameInput ? nameInput.value : '';
    
    // Limpiar mensajes previos
    if (errorMessage) {
      errorMessage.textContent = '';
    }
    
    // Deshabilitar botón durante el proceso
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Procesando...';
    }
    
    try {
      // Asegurarse de tener el token CSRF
      if (!csrfToken) {
        await obtenerCsrfToken();
      }
      
      const endpoint = isLoginMode ? 'api/login.php' : 'api/register.php';
      const body = isLoginMode 
        ? { email, password, csrf_token: csrfToken }
        : { email, password, nombre, csrf_token: csrfToken };
      
      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error en la autenticación');
      }
      
      // Login/registro exitoso
      console.log('Usuario autenticado:', data.user);
      
      // Actualizar token CSRF con el nuevo token recibido
      if (data.csrf_token) {
        csrfToken = data.csrf_token;
      }
      
      // Redirigir a la página principal
      window.location.href = 'index.html';
      
    } catch (error) {
      // Mostrar mensaje de error
      if (errorMessage) {
        errorMessage.textContent = error.message || 'Ocurrió un error. Intenta nuevamente.';
      }
      
      // Restaurar botón
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = isLoginMode ? 'Iniciar Sesión' : 'Registrarse';
      }
    }
  });
}
