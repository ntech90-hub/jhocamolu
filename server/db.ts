import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { PROJECTS_DATA, Project } from '../src/data/projects';
import { ARTICLES_DATA, Article } from '../src/data/articles';

dotenv.config();

// In-Memory store for development/sandbox fallback when external MySQL is not reachable
interface InMemoryDB {
  proyectos: any[];
  articulos: any[];
  mensajes: any[];
  suscriptores: any[];
  adminUsers: any[];
}

const inMemoryDB: InMemoryDB = {
  proyectos: PROJECTS_DATA.map((p) => ({
    id: p.id,
    titulo: p.title,
    cliente_org: p.clientOrOrg,
    periodo: p.period,
    categoria: p.category,
    categoria_label: p.categoryLabel,
    descripcion: p.shortDescription,
    tecnologias: JSON.stringify(p.technologies),
    resultado: p.measurableResult,
    problema: p.problem,
    solucion: p.solution,
    resultados_detalle: JSON.stringify(p.results),
    imagen: p.image || null,
    enlace: null,
    visible: 1,
    creado_en: new Date().toISOString(),
  })),
  articulos: ARTICLES_DATA.map((a) => ({
    id: a.id,
    slug: a.slug,
    titulo: a.title,
    extracto: a.excerpt,
    contenido: a.content,
    categoria: a.category,
    imagen: a.image || null,
    fecha_publicacion: a.date,
    tiempo_lectura: a.readTime,
    tags: JSON.stringify(a.tags),
    estado: 'publicado',
    creado_en: new Date().toISOString(),
  })),
  mensajes: [
    {
      id: 1,
      nombre: 'Juan Pérez (Ejemplo)',
      correo: 'juan.perez@empresa.com',
      asunto: 'Propuesta de consultoría en migración .NET',
      mensaje: 'Hola Jhonatan, vimos tu experiencia en arquitectura con .NET 6/8 y quisiéramos coordinar una asesoría técnica.',
      consentimiento_ley1581: 1,
      ip_origen: '127.0.0.1',
      leido: 0,
      fecha: new Date().toISOString(),
    },
  ],
  suscriptores: [],
  adminUsers: [
    {
      id: 1,
      username: process.env.ADMIN_DEFAULT_USER || 'admin',
      password_hash: bcrypt.hashSync(process.env.ADMIN_DEFAULT_PASSWORD || 'AdminPassword2026*!', 10),
      rol: 'admin',
    },
  ],
};

let pool: mysql.Pool | null = null;
let isConnectedToMySQL = false;

export async function initDB() {
  const host = process.env.MYSQL_HOST;
  const user = process.env.MYSQL_USER;
  const password = process.env.MYSQL_PASSWORD;
  const database = process.env.MYSQL_DATABASE;

  if (host && user && database) {
    try {
      console.log(`[DB] Intentando conexión con MySQL en ${host}:${process.env.MYSQL_PORT || 3306}...`);
      pool = mysql.createPool({
        host,
        port: parseInt(process.env.MYSQL_PORT || '3306', 10),
        user,
        password,
        database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
      });

      // Test connection with prepared statement
      const [rows] = await pool.execute('SELECT 1 as connected');
      isConnectedToMySQL = true;
      console.log('[DB] ¡Conexión exitosa a MySQL! Utilizando consultas preparadas en todas las operaciones.');
      
      // Auto-create tables if missing
      await ensureTablesExist(pool);
      return;
    } catch (err: any) {
      console.warn(`[DB] MySQL no disponible (${err.message}). Activando almacén en memoria con datos iniciales para desarrollo fluido.`);
      isConnectedToMySQL = false;
      pool = null;
    }
  } else {
    console.log('[DB] Variables de entorno MYSQL_HOST / MYSQL_USER / MYSQL_DATABASE no configuradas. Operando con almacén seguro en memoria.');
  }
}

async function ensureTablesExist(p: mysql.Pool) {
  try {
    await p.execute(`
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
        INDEX idx_categoria (categoria),
        INDEX idx_visible (visible)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await p.execute(`
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
        INDEX idx_slug (slug),
        INDEX idx_categoria (categoria),
        INDEX idx_estado (estado)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await p.execute(`
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
        INDEX idx_leido (leido)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await p.execute(`
      CREATE TABLE IF NOT EXISTS usuarios_admin (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        rol VARCHAR(50) NOT NULL DEFAULT 'admin',
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
  } catch (e: any) {
    console.error('[DB] Error creando tablas automáticas en MySQL:', e.message);
  }
}

// Prepared Statement Query Executor with fallback
export async function executeQuery<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  if (pool && isConnectedToMySQL) {
    const [rows] = await pool.execute(sql, params);
    return rows as T[];
  }

  // In-Memory simulated query handler for smooth sandboxed execution
  const normalizedSql = sql.trim().toUpperCase();

  // 1. SELECT PROYECTOS
  if (normalizedSql.startsWith('SELECT') && normalizedSql.includes('PROYECTOS')) {
    if (normalizedSql.includes('WHERE VISIBLE = ?')) {
      const visibleVal = params[0];
      return inMemoryDB.proyectos.filter((p) => p.visible === visibleVal) as unknown as T[];
    }
    return inMemoryDB.proyectos as unknown as T[];
  }

  // 2. SELECT ARTICULOS
  if (normalizedSql.startsWith('SELECT') && normalizedSql.includes('ARTICULOS')) {
    if (normalizedSql.includes('WHERE SLUG = ?')) {
      const slug = params[0];
      return inMemoryDB.articulos.filter((a) => a.slug === slug) as unknown as T[];
    }
    if (normalizedSql.includes('WHERE ESTADO = ?')) {
      const estado = params[0];
      return inMemoryDB.articulos.filter((a) => a.estado === estado) as unknown as T[];
    }
    return inMemoryDB.articulos as unknown as T[];
  }

  // 3. SELECT MENSAJES
  if (normalizedSql.startsWith('SELECT') && normalizedSql.includes('MENSAJES_CONTACTO')) {
    return [...inMemoryDB.mensajes].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()) as unknown as T[];
  }

  // 4. SELECT ADMIN USERS
  if (normalizedSql.startsWith('SELECT') && normalizedSql.includes('USUARIOS_ADMIN')) {
    const username = params[0];
    return inMemoryDB.adminUsers.filter((u) => u.username === username) as unknown as T[];
  }

  // 5. INSERT MENSAJE
  if (normalizedSql.startsWith('INSERT INTO MENSAJES_CONTACTO')) {
    const newMsg = {
      id: inMemoryDB.mensajes.length + 1,
      nombre: params[0],
      correo: params[1],
      asunto: params[2],
      mensaje: params[3],
      consentimiento_ley1581: params[4],
      ip_origen: params[5],
      leido: 0,
      fecha: new Date().toISOString(),
    };
    inMemoryDB.mensajes.unshift(newMsg);
    return [{ insertId: newMsg.id }] as unknown as T[];
  }

  // 6. UPDATE MENSAJE LEIDO
  if (normalizedSql.startsWith('UPDATE MENSAJES_CONTACTO SET LEIDO = ?')) {
    const leidoVal = params[0];
    const idVal = Number(params[1]);
    const msg = inMemoryDB.mensajes.find((m) => m.id === idVal);
    if (msg) msg.leido = leidoVal;
    return [{ affectedRows: msg ? 1 : 0 }] as unknown as T[];
  }

  // 7. DELETE MENSAJE
  if (normalizedSql.startsWith('DELETE FROM MENSAJES_CONTACTO WHERE ID = ?')) {
    const idVal = Number(params[0]);
    const initialLen = inMemoryDB.mensajes.length;
    inMemoryDB.mensajes = inMemoryDB.mensajes.filter((m) => m.id !== idVal);
    return [{ affectedRows: initialLen - inMemoryDB.mensajes.length }] as unknown as T[];
  }

  // 8. INSERT PROYECTO
  if (normalizedSql.startsWith('INSERT INTO PROYECTOS')) {
    const newProj = {
      id: params[0],
      titulo: params[1],
      cliente_org: params[2],
      periodo: params[3],
      categoria: params[4],
      categoria_label: params[5],
      descripcion: params[6],
      tecnologias: typeof params[7] === 'string' ? params[7] : JSON.stringify(params[7]),
      resultado: params[8],
      problema: params[9],
      solucion: params[10],
      resultados_detalle: typeof params[11] === 'string' ? params[11] : JSON.stringify(params[11]),
      imagen: params[12] || null,
      visible: 1,
      creado_en: new Date().toISOString(),
    };
    inMemoryDB.proyectos.unshift(newProj);
    return [{ insertId: newProj.id }] as unknown as T[];
  }

  // 9. DELETE PROYECTO
  if (normalizedSql.startsWith('DELETE FROM PROYECTOS WHERE ID = ?')) {
    const id = params[0];
    inMemoryDB.proyectos = inMemoryDB.proyectos.filter((p) => p.id !== id);
    return [{ affectedRows: 1 }] as unknown as T[];
  }

  // 10. INSERT ARTICULO
  if (normalizedSql.startsWith('INSERT INTO ARTICULOS')) {
    const newArt = {
      id: params[0],
      slug: params[1],
      titulo: params[2],
      extracto: params[3],
      contenido: params[4],
      categoria: params[5],
      imagen: params[6] || null,
      fecha_publicacion: params[7],
      tiempo_lectura: params[8],
      tags: typeof params[9] === 'string' ? params[9] : JSON.stringify(params[9]),
      estado: params[10] || 'publicado',
      creado_en: new Date().toISOString(),
    };
    inMemoryDB.articulos.unshift(newArt);
    return [{ insertId: newArt.id }] as unknown as T[];
  }

  // 11. DELETE ARTICULO
  if (normalizedSql.startsWith('DELETE FROM ARTICULOS WHERE ID = ?')) {
    const id = params[0];
    inMemoryDB.articulos = inMemoryDB.articulos.filter((a) => a.id !== id);
    return [{ affectedRows: 1 }] as unknown as T[];
  }

  return [] as unknown as T[];
}

export function getDBStatus() {
  return {
    engine: isConnectedToMySQL ? 'MySQL (Conexión Activa)' : 'Almacén en Memoria / SQLite Fallback',
    isConnectedToMySQL,
    tables: {
      proyectos: isConnectedToMySQL ? 'En tabla proyectos' : inMemoryDB.proyectos.length,
      articulos: isConnectedToMySQL ? 'En tabla articulos' : inMemoryDB.articulos.length,
      mensajes: isConnectedToMySQL ? 'En tabla mensajes_contacto' : inMemoryDB.mensajes.length,
    },
  };
}
