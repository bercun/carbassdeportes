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
      const endpoint = isLoginMode ? 'api/login.php' : 'api/register.php';
      const body = isLoginMode 
        ? { email, password }
        : { email, password, nombre };
      
      const response = await fetch(endpoint, {
        method: 'POST',
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

// Verificar si el usuario ya está autenticado
fetch('api/check_auth.php')
  .then(res => res.json())
  .then(data => {
    if (data.logged_in && window.location.pathname.includes('login.html')) {
      // Si ya está logueado y está en la página de login, redirigir
      window.location.href = 'index.html';
    }
  })
  .catch(err => console.log('No se pudo verificar autenticación'));
