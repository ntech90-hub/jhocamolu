-- ==============================================================================
-- Esquema de Base de Datos MySQL para Portafolio & Blog de Jhonatan Moreno
-- Motor: MySQL 8.0+ / MariaDB 10.5+
-- Charset: utf8mb4_unicode_ci
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS portafolio_jhonatan
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE portafolio_jhonatan;

-- ------------------------------------------------------------------------------
-- 1. Tabla: proyectos
-- Almacena el portafolio de proyectos de ingeniería con resultados medibles
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS proyectos (
  id VARCHAR(64) PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  cliente_org VARCHAR(255) NOT NULL,
  periodo VARCHAR(50) NOT NULL,
  categoria VARCHAR(50) NOT NULL DEFAULT 'dotnet',
  categoria_label VARCHAR(100) NOT NULL DEFAULT '.NET & C#',
  descripcion TEXT NOT NULL,
  tecnologias JSON NOT NULL,
  resultado VARCHAR(255) NOT NULL,
  problema TEXT,
  solucion TEXT,
  resultados_detalle JSON,
  imagen VARCHAR(500) DEFAULT NULL,
  enlace VARCHAR(500) DEFAULT NULL,
  visible TINYINT(1) NOT NULL DEFAULT 1,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_categoria (categoria),
  INDEX idx_visible (visible)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 2. Tabla: articulos
-- Almacena las publicaciones del blog técnico y reflexiones pedagógicas
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS articulos (
  id VARCHAR(64) PRIMARY KEY,
  slug VARCHAR(255) NOT NULL UNIQUE,
  titulo VARCHAR(255) NOT NULL,
  extracto TEXT NOT NULL,
  contenido MEDIUMTEXT NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  imagen VARCHAR(500) DEFAULT NULL,
  fecha_publicacion VARCHAR(50) NOT NULL,
  tiempo_lectura VARCHAR(50) NOT NULL DEFAULT '5 min de lectura',
  tags JSON NOT NULL,
  estado ENUM('publicado', 'borrador') NOT NULL DEFAULT 'publicado',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_categoria (categoria),
  INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 3. Tabla: mensajes_contacto
-- Registra los mensajes enviados a través del formulario con consentimiento legal
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mensajes_contacto (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  correo VARCHAR(255) NOT NULL,
  asunto VARCHAR(255) NOT NULL,
  mensaje TEXT NOT NULL,
  consentimiento_ley1581 TINYINT(1) NOT NULL DEFAULT 1,
  ip_origen VARCHAR(45) DEFAULT NULL,
  leido TINYINT(1) NOT NULL DEFAULT 0,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_leido (leido),
  INDEX idx_fecha (fecha)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 4. Tabla: suscriptores
-- Registro opcional de boletín de novedades y artículos
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS suscriptores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  correo VARCHAR(255) NOT NULL UNIQUE,
  confirmado TINYINT(1) NOT NULL DEFAULT 1,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_correo (correo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 5. Tabla: usuarios_admin
-- Credenciales con hash seguro (bcrypt) para el panel de administración
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios_admin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rol VARCHAR(50) NOT NULL DEFAULT 'admin',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Usuario inicial de administración (Contraseña inicial: AdminPassword2026*!)
-- Hash bcrypt correspondiente:
-- ------------------------------------------------------------------------------
INSERT INTO usuarios_admin (username, password_hash, rol)
VALUES ('admin', '$2a$10$w095xQ2F8j7Fq7/b8f.hxe3n1zH0U9TfBf2nB/oP1u9b8T5mQxS.e', 'admin')
ON DUPLICATE KEY UPDATE username=username;
