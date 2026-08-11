let auth;

try {
  if (typeof firebase !== 'undefined') {
    auth = firebase.auth();
  }
} catch (error) {
  // Error de inicialización silencioso
}

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
    
    // Verificar que Firebase Auth esté disponible
    if (!auth) {
      if (errorMessage) {
        errorMessage.textContent = 'Servicio de autenticación no disponible.';
      }
      return;
    }
    
    const email = emailInput.value;
    const password = passwordInput.value;
    
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
      if (isLoginMode) {
        // Iniciar sesión
        await auth.signInWithEmailAndPassword(email, password);
      } else {
        // Registrar nuevo usuario
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        
        // Actualizar el perfil con el nombre si se proporcionó
        if (nameInput && nameInput.value) {
          await userCredential.user.updateProfile({
            displayName: nameInput.value
          });
        }
      }
      
      // Redirigir a la página principal
      window.location.href = 'index.html';
      
    } catch (error) {
      // Mensajes de error en español
      let errorMsg = 'Ocurrió un error. Intenta nuevamente.';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMsg = 'Este email ya está registrado.';
          break;
        case 'auth/invalid-email':
          errorMsg = 'Email inválido.';
          break;
        case 'auth/weak-password':
          errorMsg = 'La contraseña debe tener al menos 6 caracteres.';
          break;
        case 'auth/user-not-found':
          errorMsg = 'No existe una cuenta con este email.';
          break;
        case 'auth/wrong-password':
          errorMsg = 'Contraseña incorrecta.';
          break;
        case 'auth/too-many-requests':
          errorMsg = 'Demasiados intentos fallidos. Intenta más tarde.';
          break;
      }
      
      if (errorMessage) {
        errorMessage.textContent = errorMsg;
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
if (auth) {
  auth.onAuthStateChanged((user) => {
    if (user && window.location.pathname.includes('login.html')) {
      // Si ya está logueado y está en la página de login, redirigir
      window.location.href = 'index.html';
    }
  });
}
