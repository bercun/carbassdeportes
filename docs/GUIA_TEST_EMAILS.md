# 🧪 Guía de Verificación de Sistema de Emails

## 📋 Métodos de Prueba Disponibles

### 1️⃣ **Test Web (Recomendado para principiantes)**

**Accede a:** `http://carbass.brkoon.uy/api/test_emails.php`

**Características:**
- ✅ Interfaz web amigable
- ✅ Verifica configuración de PHP
- ✅ Muestra administradores en BD
- ✅ Lista ventas recientes
- ✅ Permite enviar emails de prueba
- ✅ Permite reenviar emails de ventas existentes

**Cómo usar:**
1. Abre tu navegador
2. Visita: `http://carbass.brkoon.uy/api/test_emails.php`
3. Ingresa tu email en el formulario
4. Click en "📧 Enviar Email de Prueba"
5. Verifica tu bandeja de entrada (y spam)

---

### 2️⃣ **Test desde Terminal (Para usuarios avanzados)**

**Comando básico:**
```bash
php api/test_email_cli.php tu@email.com
```

**Enviar email de venta específica:**
```bash
php api/test_email_cli.php tu@email.com V-20250114-001
```

**Salida esperada:**
```
===========================================
  TEST DE ENVÍO DE EMAILS - CarbassDeportes
===========================================

📧 Email destino: tu@email.com

1. Verificando función mail()...
   ✅ Función mail() disponible

2. Conectando a base de datos...
   ✅ Conexión exitosa

3. Verificando administradores...
   ✅ Se encontraron 2 administrador(es)

4. Enviando email de prueba a tu@email.com...
   ✅ Email enviado exitosamente!
   📥 Verifica la bandeja de entrada (y spam) de: tu@email.com

===========================================
  Test completado
===========================================
```

---

### 3️⃣ **Test Manual desde el Carrito**

1. Accede a: `http://carbass.brkoon.uy/carrito.html`
2. Agrega productos al carrito
3. Click en "Confirmar Pedido"
4. Completa formulario de facturación
5. Click en "Finalizar"
6. Verifica que aparezca el mensaje: "✅ ¡Compra confirmada! 📧 Se han enviado emails..."
7. Revisa tu bandeja de entrada

---

## 🔍 Checklist de Verificación

### ✅ Antes de Probar

- [ ] Servidor web funcionando (Apache/Nginx)
- [ ] PHP instalado y configurado
- [ ] Base de datos MySQL accesible
- [ ] Al menos 1 usuario administrador en BD

### ✅ Durante la Prueba

- [ ] No hay errores en consola del navegador (F12)
- [ ] Función `mail()` disponible en PHP
- [ ] Conexión exitosa a base de datos
- [ ] Administradores encontrados en BD

### ✅ Después de Enviar

- [ ] Email recibido en bandeja de entrada
- [ ] Si no está, revisar carpeta de SPAM
- [ ] Verificar que el diseño del email se vea bien
- [ ] Todos los datos están presentes (productos, totales, etc.)

---

## ⚠️ Solución de Problemas

### ❌ "Función mail() NO disponible"

**Causa:** PHP no tiene habilitada la función mail()

**Solución:**
1. Editar `php.ini`
2. Habilitar: `extension=php_mail.dll` (Windows) o verificar configuración en Linux
3. Reiniciar servidor web

---

### ❌ "Email enviado pero no llega"

**Posibles causas:**
- Email en carpeta de SPAM
- Servidor de correo no configurado
- Email bloqueado por firewall

**Soluciones:**
1. **Revisar SPAM:** Verifica la carpeta de correo no deseado
2. **Configurar SPF/DKIM:** Agrega registros DNS
3. **Usar SMTP autenticado:** Instalar PHPMailer

---

### ❌ "Error de conexión a base de datos"

**Verificar:**
```bash
# Desde terminal
php api/test_connection.php
```

**O verifica credenciales en:** `api/db.php`

---

### ❌ "No se encontraron administradores"

**Crear administrador:**
1. Accede a: `http://carbass.brkoon.uy/crear_admin.html`
2. O ejecuta SQL:
```sql
UPDATE usuarios SET rol = 'admin' WHERE email = 'tu@email.com';
```

---

## 🚀 Alternativa: Usar PHPMailer (SMTP Autenticado)

Si la función `mail()` no funciona, usa PHPMailer con SMTP:

### Instalación:
```bash
composer require phpmailer/phpmailer
```

### Configuración para Gmail:
```php
use PHPMailer\PHPMailer\PHPMailer;

$mail = new PHPMailer(true);
$mail->isSMTP();
$mail->Host = 'smtp.gmail.com';
$mail->SMTPAuth = true;
$mail->Username = 'tu@gmail.com';
$mail->Password = 'tu_app_password';
$mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
$mail->Port = 587;
```

---

## 📊 Logs y Debugging

### Ver logs de PHP:
```bash
# Linux
tail -f /var/log/apache2/error.log

# Windows (XAMPP)
# C:\xampp\apache\logs\error.log
```

### Ver logs de correo:
```bash
# Linux
tail -f /var/log/mail.log
```

### Activar debug en PHP:
```php
// Agregar al inicio de enviar_factura.php
ini_set('display_errors', 1);
error_reporting(E_ALL);
```

---

## 📧 Emails que se Envían

### Email al Cliente:
- ✉️ Asunto: "Confirmación de Pedido #V-XXXXXXXX - CarbassDeportes"
- 📦 Contiene: Detalles del pedido, productos, total, dirección
- 🎨 Diseño: Verde con logo CarbassDeportes

### Email a Administradores:
- ✉️ Asunto: "Nuevo Pedido #V-XXXXXXXX - CarbassDeportes"
- 📊 Contiene: Datos del cliente, productos, acción requerida
- 🎨 Diseño: Naranja con botón al panel admin
- 🔔 Enviado a: Todos los usuarios con `rol = 'admin'`

---

## 🎯 Resultado Esperado

Cuando funciona correctamente:

1. **Cliente recibe:**
   - Email de confirmación inmediatamente
   - Con todos los detalles del pedido
   - Diseño profesional y responsive

2. **Administradores reciben:**
   - Notificación de nuevo pedido
   - Enlace directo al panel admin
   - Detalles completos del cliente

3. **En consola del navegador:**
   - "✅ Emails enviados correctamente"
   - Sin errores JavaScript

4. **En base de datos:**
   - Venta registrada correctamente
   - Estado: "pendiente"

---

## 📞 Soporte

Si después de todas estas pruebas los emails siguen sin funcionar:

1. Contacta a tu proveedor de hosting
2. Pregunta por configuración de correo saliente
3. Solicita habilitación de función `mail()` o acceso SMTP

---

**¡Sistema listo para producción! 🚀**
