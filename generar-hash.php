<?php
// Script para generar hash de contraseña y crear usuario admin

$email = 'walter@brkoon.uy';
$password = 'admin123';
$nombre = 'rootwalter';
$rol = 'admin';

// Generar hash
$hash = password_hash($password, PASSWORD_DEFAULT);

echo "<h2>Crear Usuario Administrador</h2>";
echo "<p>Copia y pega esta consulta en phpMyAdmin:</p>";
echo "<textarea style='width:100%; height:150px; font-family:monospace;'>";
echo "DELETE FROM usuarios WHERE email = '$email';\n\n";
echo "INSERT INTO usuarios (email, password, nombre, rol) VALUES (\n";
echo "  '$email',\n";
echo "  '$hash',\n";
echo "  '$nombre',\n";
echo "  '$rol'\n";
echo ");";
echo "</textarea>";

echo "<h3>Credenciales:</h3>";
echo "<ul>";
echo "<li><strong>Email:</strong> $email</li>";
echo "<li><strong>Contraseña:</strong> $password</li>";
echo "<li><strong>Rol:</strong> $rol</li>";
echo "</ul>";

echo "<p><a href='login.html'>Ir a Login</a></p>";
?>
