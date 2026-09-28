import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { executeQuery, getDBStatus } from './db';

const router = Router();

// Simple in-memory IP rate limiter for contact form spam protection
const ipRequests: Map<string, { count: number; firstRequestTime: number }> = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 5;

// Simple admin token authentication map
const activeAdminTokens = new Set<string>();

// Middleware to verify admin authentication
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado. Se requiere token de administrador.' });
  }

  const token = authHeader.split(' ')[1];
  if (!activeAdminTokens.has(token)) {
    return res.status(403).json({ error: 'Token inválido o expirado.' });
  }

  next();
}

// Helper to sanitize strings
function sanitize(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// -----------------------------------------------------------------------------
// 1. ENDPOINTS PÚBLICOS
// -----------------------------------------------------------------------------

// GET /api/status - Información del backend y MySQL
router.get('/status', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    database: getDBStatus(),
    version: '2.0.0',
  });
});

// GET /api/proyectos - Obtener todos los proyectos visibles
router.get('/proyectos', async (req: Request, res: Response) => {
  try {
    const rows = await executeQuery(
      'SELECT id, titulo, cliente_org, periodo, categoria, categoria_label, descripcion, tecnologias, resultado, problema, solucion, resultados_detalle, imagen, visible FROM proyectos WHERE visible = ?',
      [1]
    );

    const formatted = rows.map((r: any) => ({
      id: r.id,
      title: r.titulo,
      clientOrOrg: r.cliente_org,
      period: r.periodo,
      category: r.categoria,
      categoryLabel: r.categoria_label,
      shortDescription: r.descripcion,
      technologies: typeof r.tecnologias === 'string' ? JSON.parse(r.tecnologias) : r.tecnologias,
      measurableResult: r.resultado,
      problem: r.problema,
      solution: r.solucion,
      results: typeof r.resultados_detalle === 'string' ? JSON.parse(r.resultados_detalle) : (r.resultados_detalle || []),
      image: r.imagen,
    }));

    res.json(formatted);
  } catch (err: any) {
    console.error('Error fetching proyectos:', err);
    res.status(500).json({ error: 'Error al consultar proyectos en la base de datos' });
  }
});

// GET /api/articulos - Obtener artículos publicados
router.get('/articulos', async (req: Request, res: Response) => {
  try {
    const rows = await executeQuery(
      'SELECT id, slug, titulo, extracto, contenido, categoria, imagen, fecha_publicacion, tiempo_lectura, tags, estado FROM articulos WHERE estado = ?',
      ['publicado']
    );

    const formatted = rows.map((r: any) => ({
      id: r.id,
      slug: r.slug,
      title: r.titulo,
      excerpt: r.extracto,
      content: r.contenido,
      category: r.categoria,
      image: r.imagen,
      date: r.fecha_publicacion,
      readTime: r.tiempo_lectura,
      tags: typeof r.tags === 'string' ? JSON.parse(r.tags) : r.tags,
    }));

    res.json(formatted);
  } catch (err: any) {
    console.error('Error fetching articulos:', err);
    res.status(500).json({ error: 'Error al consultar artículos en la base de datos' });
  }
});

// POST /api/contacto - Envío de mensaje con honeypot, rate-limiting y cumplimiento Ley 1581
router.post('/contacto', async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message, consent, honeypot } = req.body;

    // 1. Protección Anti-Spam: Honeypot field (debe venir vacío)
    if (honeypot && String(honeypot).trim().length > 0) {
      console.warn('[SPAM BLOCK] Intento de bot detectado vía honeypot.');
      return res.status(400).json({ error: 'Envío no permitido.' });
    }

    // 2. Protección Anti-Spam: Rate Limit por IP
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const ipData = ipRequests.get(clientIp);

    if (ipData) {
      if (now - ipData.firstRequestTime > RATE_LIMIT_WINDOW_MS) {
        ipRequests.set(clientIp, { count: 1, firstRequestTime: now });
      } else {
        if (ipData.count >= MAX_REQUESTS_PER_WINDOW) {
          return res.status(429).json({
            error: 'Has alcanzado el límite de envíos por hora. Por favor inténtalo más tarde o contáctame directo por correo.',
          });
        }
        ipData.count += 1;
      }
    } else {
      ipRequests.set(clientIp, { count: 1, firstRequestTime: now });
    }

    // 3. Validación de campos obligatorios
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'El nombre es obligatorio y debe tener al menos 2 caracteres.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(String(email).trim())) {
      return res.status(400).json({ error: 'La dirección de correo electrónico no es válida.' });
    }

    if (!subject || typeof subject !== 'string' || subject.trim().length < 3) {
      return res.status(400).json({ error: 'El asunto es obligatorio.' });
    }

    if (!message || typeof message !== 'string' || message.trim().length < 15) {
      return res.status(400).json({ error: 'El mensaje debe tener al menos 15 caracteres.' });
    }

    // 4. Cumplimiento Legal (Ley 1581 de 2012 de Habeas Data Colombia)
    if (!consent) {
      return res.status(400).json({
        error: 'Debe autorizar el tratamiento de sus datos personales conforme a la Ley Estatutaria 1581 de 2012 de Colombia.',
      });
    }

    // Sanitización
    const cleanName = sanitize(name.trim());
    const cleanEmail = email.trim();
    const cleanSubject = sanitize(subject.trim());
    const cleanMessage = sanitize(message.trim());

    // 5. Inserción con Prepared Statement en MySQL
    await executeQuery(
      'INSERT INTO mensajes_contacto (nombre, correo, asunto, mensaje, consentimiento_ley1581, ip_origen) VALUES (?, ?, ?, ?, ?, ?)',
      [cleanName, cleanEmail, cleanSubject, cleanMessage, 1, clientIp]
    );

    // 6. Notificación por correo electrónico (Simulada / Logger en servidor)
    console.log(`[NOTIFICACIÓN EMAIL] Nuevo mensaje para ${process.env.NOTIFICATION_EMAIL_TO || 'jhocamolu2010@gmail.com'}`);
    console.log(` De: ${cleanName} <${cleanEmail}>`);
    console.log(` Asunto: ${cleanSubject}`);
    console.log(` Mensaje: ${cleanMessage.substring(0, 100)}...`);

    res.json({
      success: true,
      message: '¡Mensaje enviado y registrado con éxito en la base de datos! Jhonatan se comunicará contigo pronto.',
    });
  } catch (err: any) {
    console.error('Error procesando contacto:', err);
    res.status(500).json({ error: 'Ocurrió un error al procesar el mensaje. Por favor intenta de nuevo.' });
  }
});

// -----------------------------------------------------------------------------
// 2. ENDPOINTS DE ADMINISTRACIÓN (PROTEGIDOS CON BCRYPT Y PREPARED STATEMENTS)
// -----------------------------------------------------------------------------

// POST /api/admin/login
router.post('/admin/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña requeridos.' });
    }

    // Prepared statement to query admin user
    const users = await executeQuery(
      'SELECT id, username, password_hash, rol FROM usuarios_admin WHERE username = ?',
      [username]
    );

    if (!users || users.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const admin = users[0];
    const passwordMatches = await bcrypt.compare(password, admin.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    // Generate session token
    const token = 'tok_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    activeAdminTokens.add(token);

    res.json({
      success: true,
      token,
      user: {
        username: admin.username,
        role: admin.rol,
      },
    });
  } catch (err: any) {
    console.error('Error in admin login:', err);
    res.status(500).json({ error: 'Error en la autenticación' });
  }
});

// GET /api/admin/mensajes - Ver mensajes recibidos
router.get('/admin/mensajes', requireAdmin, async (req: Request, res: Response) => {
  try {
    const rows = await executeQuery('SELECT * FROM mensajes_contacto ORDER BY fecha DESC');
    res.json(rows);
  } catch (err: any) {
    console.error('Error fetching admin messages:', err);
    res.status(500).json({ error: 'Error consultando mensajes' });
  }
});

// PUT /api/admin/mensajes/:id/leido - Marcar leído/no leído
router.put('/admin/mensajes/:id/leido', requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { leido } = req.body;
    await executeQuery(
      'UPDATE mensajes_contacto SET leido = ? WHERE id = ?',
      [leido ? 1 : 0, id]
    );
    res.json({ success: true });
  } catch (err: any) {
    console.error('Error updating mensaje leido:', err);
    res.status(500).json({ error: 'Error actualizando estado del mensaje' });
  }
});

// DELETE /api/admin/mensajes/:id - Eliminar mensaje
router.delete('/admin/mensajes/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await executeQuery('DELETE FROM mensajes_contacto WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err: any) {
    console.error('Error deleting mensaje:', err);
    res.status(500).json({ error: 'Error eliminando mensaje' });
  }
});

// POST /api/proyectos - Crear nuevo proyecto (Admin)
router.post('/proyectos', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { title, clientOrOrg, period, category, categoryLabel, shortDescription, technologies, measurableResult, problem, solution, results, image } = req.body;

    const id = 'proj-' + Date.now().toString(36);
    await executeQuery(
      `INSERT INTO proyectos (id, titulo, cliente_org, periodo, categoria, categoria_label, descripcion, tecnologias, resultado, problema, solucion, resultados_detalle, imagen, visible)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        sanitize(title),
        sanitize(clientOrOrg || 'Cliente / Empresa'),
        sanitize(period || '2026'),
        sanitize(category || 'dotnet'),
        sanitize(categoryLabel || '.NET & C#'),
        sanitize(shortDescription),
        JSON.stringify(technologies || []),
        sanitize(measurableResult),
        sanitize(problem || ''),
        sanitize(solution || ''),
        JSON.stringify(results || []),
        image || null,
        1,
      ]
    );

    res.json({ success: true, id });
  } catch (err: any) {
    console.error('Error creating project:', err);
    res.status(500).json({ error: 'Error al registrar proyecto' });
  }
});

// DELETE /api/proyectos/:id - Eliminar proyecto (Admin)
router.delete('/proyectos/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await executeQuery('DELETE FROM proyectos WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err: any) {
    console.error('Error deleting project:', err);
    res.status(500).json({ error: 'Error al eliminar proyecto' });
  }
});

// POST /api/articulos - Crear nuevo artículo (Admin)
router.post('/articulos', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { title, slug, excerpt, content, category, image, date, readTime, tags } = req.body;

    const id = 'art-' + Date.now().toString(36);
    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    await executeQuery(
      `INSERT INTO articulos (id, slug, titulo, extracto, contenido, categoria, imagen, fecha_publicacion, tiempo_lectura, tags, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        finalSlug,
        sanitize(title),
        sanitize(excerpt),
        content,
        category || 'Ingeniería de software',
        image || null,
        date || new Date().toLocaleDateString('es-CO'),
        readTime || '5 min de lectura',
        JSON.stringify(tags || []),
        'publicado',
      ]
    );

    res.json({ success: true, id, slug: finalSlug });
  } catch (err: any) {
    console.error('Error creating article:', err);
    res.status(500).json({ error: 'Error al registrar artículo' });
  }
});

// DELETE /api/articulos/:id - Eliminar artículo (Admin)
router.delete('/articulos/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await executeQuery('DELETE FROM articulos WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err: any) {
    console.error('Error deleting article:', err);
    res.status(500).json({ error: 'Error al eliminar artículo' });
  }
});

export default router;
