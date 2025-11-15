-- Crear base de datos y tablas para la aplicación de cine
CREATE DATABASE IF NOT EXISTS cine CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE cine;

CREATE TABLE IF NOT EXISTS peliculas (
  id_pelicula INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  anio INT,
  duracion INT
);

CREATE TABLE IF NOT EXISTS salas (
  id_sala INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  capacidad INT
);

CREATE TABLE IF NOT EXISTS funciones (
  id_funcion INT AUTO_INCREMENT PRIMARY KEY,
  id_pelicula INT,
  id_sala INT,
  fecha_hora DATETIME,
  FOREIGN KEY (id_pelicula) REFERENCES peliculas(id_pelicula) ON DELETE SET NULL,
  FOREIGN KEY (id_sala) REFERENCES salas(id_sala) ON DELETE SET NULL
);

-- Nota: importar este archivo en phpMyAdmin o ejecutar con mysql en XAMPP.

-- Métodos de pago
CREATE TABLE IF NOT EXISTS metodos_pago (
  id_metodo INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL
);

-- Ventas
CREATE TABLE IF NOT EXISTS ventas (
  id_venta INT AUTO_INCREMENT PRIMARY KEY,
  id_metodo INT,
  fecha DATETIME,
  total DECIMAL(10,2),
  FOREIGN KEY (id_metodo) REFERENCES metodos_pago(id_metodo) ON DELETE SET NULL
);

-- Tickets
CREATE TABLE IF NOT EXISTS tickets (
  id_ticket INT AUTO_INCREMENT PRIMARY KEY,
  id_venta INT,
  id_funcion INT,
  asiento VARCHAR(64),
  precio DECIMAL(10,2),
  FOREIGN KEY (id_venta) REFERENCES ventas(id_venta) ON DELETE CASCADE,
  FOREIGN KEY (id_funcion) REFERENCES funciones(id_funcion) ON DELETE SET NULL
);

-- Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','user') NOT NULL DEFAULT 'user'
);
