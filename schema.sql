-- ==========================================
-- Base de datos PeerHive (estructura inicial)
-- ==========================================

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  matricula VARCHAR(20) UNIQUE NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  correo VARCHAR(150) UNIQUE NOT NULL,
  contrasena_hash TEXT NOT NULL,
  edad INT,
  fecha_nacimiento DATE,
  pais_origen VARCHAR(80),
  semestre INT,
  materias TEXT[],
  rol VARCHAR(20) DEFAULT 'alumno',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE requests (
  id SERIAL PRIMARY KEY,
  alumno_id INT REFERENCES users(id),
  materia VARCHAR(100) NOT NULL,
  tema TEXT NOT NULL,
  prioridad VARCHAR(20),
  estado VARCHAR(20) DEFAULT 'pendiente',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  asesor_id INT REFERENCES users(id),
  alumno_id INT REFERENCES users(id),
  solicitud_id INT REFERENCES requests(id),
  fecha DATE,
  hora_inicio TIMESTAMP,
  hora_fin TIMESTAMP,
  duracion_horas NUMERIC(4,2),
  confirmado_asesor BOOLEAN DEFAULT false,
  confirmado_alumno BOOLEAN DEFAULT false
);

CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  evento VARCHAR(100),
  usuario_id INT,
  detalle TEXT,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);