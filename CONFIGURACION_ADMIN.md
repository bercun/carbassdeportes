# 🔐 Configuración del Sistema de Roles

## ✅ Sistema Implementado

El sistema de roles está completamente implementado con dos niveles:

- **👤 Comprador**: Usuario estándar (asignado por defecto al registrarse)
- **👨‍💼 Administrador**: Usuario con permisos completos

---

## 🚀 Cómo Crear el Primer Administrador

### Opción 1: Desde Firebase Console (Recomendado)

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto **carbassdeportes**
3. Ve a **Realtime Database**
4. Navega a: `usuarios` → `[uid-del-usuario]`
5. Encuentra el campo `rol` y cámbialo de `"comprador"` a `"administrador"`
6. Guarda los cambios
7. Recarga la página web y verás el badge **ADMIN** y el enlace al panel

### Opción 2: Crear Usuario Admin Manualmente

1. Regístrate normalmente desde la web
2. Copia tu UID (lo puedes ver en la consola del navegador o en Firebase Auth)
3. En Firebase Realtime Database, edita tu usuario:

```json
{
  "usuarios": {
    "TU-UID-AQUI": {
      "nombre": "Admin",
      "email": "admin@carbassdeportes.com",
      "rol": "administrador",  // ← Cambia esto
      "fechaRegistro": "2025-12-22T..."
    }
  }
}
```

### Opción 3: Importar Usuario Admin Predefinido

Puedes usar esta estructura en Firebase Database (Importar JSON):

```json
{
  "usuarios": {
    "crear-uid-manualmente": {
      "nombre": "Administrador",
      "email": "admin@carbassdeportes.com",
      "rol": "administrador",
      "fechaRegistro": "2025-12-22T10:00:00.000Z"
    }
  }
}
```

**NOTA**: Luego debes crear la cuenta de autenticación en Firebase Authentication con el mismo email.

---

## 🔒 Reglas de Seguridad de Firebase

Para proteger tu base de datos, actualiza las reglas en Firebase Realtime Database:

```json
{
  "rules": {
    "articulos": {
      ".read": true,
      ".write": "auth != null && root.child('usuarios').child(auth.uid).child('rol').val() === 'administrador'"
    },
    "usuarios": {
      ".read": "auth != null && root.child('usuarios').child(auth.uid).child('rol').val() === 'administrador'",
      "$uid": {
        ".read": "auth != null && auth.uid == $uid",
        ".write": "auth != null && (auth.uid == $uid || root.child('usuarios').child(auth.uid).child('rol').val() === 'administrador')"
      }
    }
  }
}
```

### Explicación de las Reglas:

- **Artículos**:
  - **Lectura**: Cualquiera puede ver productos
  - **Escritura**: Solo administradores

- **Usuarios**:
  - **Lectura General**: Solo administradores pueden ver la lista completa
  - **Lectura Individual**: Cada usuario puede ver sus propios datos
  - **Escritura**: Usuarios pueden editar sus datos, administradores pueden editar cualquiera

---

## 🎯 Funcionalidades por Rol

### 👤 Comprador (Rol: "comprador")

✅ Ver catálogo de productos  
✅ Agregar productos al carrito  
✅ Ver su perfil  
✅ Cerrar sesión  

❌ No ve el enlace "Admin" en navbar  
❌ No puede acceder a `/admin.html`  
❌ No puede agregar/editar/eliminar productos  

### 👨‍💼 Administrador (Rol: "administrador")

✅ Todo lo de comprador +  
✅ **Badge "ADMIN"** visible en navbar  
✅ **Enlace "🛠️ Admin"** en navbar  
✅ Acceso al panel de administración  
✅ Ver estadísticas de la tienda  
✅ **CRUD completo de productos**:
   - ➕ Agregar nuevos productos
   - ✏️ Editar productos existentes
   - 🗑️ Eliminar productos
✅ **Gestión de usuarios**:
   - Ver lista completa de usuarios
   - Cambiar roles de usuarios
   - Eliminar datos de usuarios
✅ Ver todas las categorías y estados

---

## 📋 Panel de Administración

### Acceso

- URL: `admin.html`
- Solo visible para usuarios con `rol: "administrador"`
- Si un comprador intenta acceder, ve mensaje de acceso denegado

### Características

#### 📊 Dashboard

- Total de productos
- Total de usuarios
- Total de categorías

#### 📦 Gestión de Productos

- Tabla con todos los productos
- Columnas: Imagen, Nombre, Categoría, Precio, Estado, Acciones
- Botones de editar y eliminar
- Modal para agregar/editar productos con validación

#### 👥 Gestión de Usuarios

- Tabla con todos los usuarios registrados
- Columnas: Nombre, Email, Rol, Fecha Registro, Acciones
- Cambiar rol directamente desde un select
- Eliminar usuarios (protegido para admins)

---

## 🔄 Flujo de Uso

### Para Compradores:

1. Registro → Automáticamente `rol: "comprador"`
2. Inicia sesión
3. Ve su nombre en navbar
4. Puede navegar y agregar al carrito
5. No ve opciones de administración

### Para Administradores:

1. Usuario existe con `rol: "administrador"` (configurado manualmente)
2. Inicia sesión
3. Ve su nombre + badge **ADMIN**
4. Ve enlace **🛠️ Admin** en navbar
5. Accede al panel de administración
6. Gestiona productos y usuarios

---

## ⚠️ Importante

1. **Primer Admin**: Debe crearse manualmente desde Firebase Console
2. **Protección**: Las reglas de Firebase son CRÍTICAS para seguridad
3. **No te quites permisos**: Un admin no puede quitarse sus propios permisos
4. **Backup**: Exporta tu base de datos antes de eliminar productos/usuarios
5. **Validación**: El frontend valida, pero las reglas de Firebase son la protección real

---

## 🧪 Prueba del Sistema

1. **Registra un usuario normal** → Verifica que es `comprador`
2. **Intenta acceder a `admin.html`** → Debe mostrar "Acceso Denegado"
3. **Cambia el rol a `administrador`** en Firebase
4. **Recarga la página** → Debe aparecer badge ADMIN y enlace
5. **Accede al panel** → Prueba agregar/editar/eliminar productos
6. **Cambia roles de usuarios** → Verifica que funciona

---

## 📞 Soporte

Si tienes problemas:

1. Verifica que Firebase esté configurado correctamente
2. Revisa la consola del navegador para errores
3. Confirma que las reglas de seguridad estén aplicadas
4. Asegúrate de que el usuario tenga `rol: "administrador"` en la base de datos

---

**Fecha de implementación**: 22 de diciembre de 2025
