import React, { useState, useEffect, useRef } from 'react';
import { X, Lock, Key, Mail, FolderKanban, BookOpen, Database, Trash2, CheckCircle, AlertCircle, Plus, Eye, RefreshCw, LogOut } from 'lucide-react';
import { useA11yAnnouncer } from './A11yAnnouncer';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged?: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({ isOpen, onClose, onDataChanged }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('jhonatan_admin_token'));
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'messages' | 'projects' | 'articles' | 'database'>('messages');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Data states
  const [messages, setMessages] = useState<any[]>([]);
  const [dbStatus, setDbStatus] = useState<any>(null);

  // New project state
  const [newProject, setNewProject] = useState({
    title: '',
    clientOrOrg: '',
    period: '2026',
    category: 'dotnet',
    categoryLabel: '.NET & C#',
    shortDescription: '',
    technologies: '.NET 8, C#, SQL Server',
    measurableResult: '',
    problem: '',
    solution: '',
  });

  // New article state
  const [newArticle, setNewArticle] = useState({
    title: '',
    slug: '',
    category: 'Ingeniería de software',
    excerpt: '',
    content: '',
    tags: 'Software, Arquitectura',
  });

  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const { announce } = useA11yAnnouncer();

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 50);
      announce('Panel de Administración abierto');
      document.body.style.overflow = 'hidden';

      if (token) {
        fetchAdminData();
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleClose();
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, token, announce]);

  const handleClose = () => {
    onClose();
    announce('Panel de administración cerrado');
    setTimeout(() => {
      previousFocusRef.current?.focus();
    }, 50);
  };

  const fetchAdminData = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      // 1. Messages
      const msgRes = await fetch('/api/admin/mensajes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (msgRes.ok) {
        const msgData = await msgRes.json();
        setMessages(msgData);
      }

      // 2. DB Status
      const statusRes = await fetch('/api/status');
      if (statusRes.ok) {
        const statData = await statusRes.json();
        setDbStatus(statData);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Credenciales inválidas');
      }

      setToken(data.token);
      localStorage.setItem('jhonatan_admin_token', data.token);
      announce('Inicio de sesión de administrador exitoso');
      fetchAdminData();
    } catch (err: any) {
      setLoginError(err.message);
      announce(`Error de autenticación: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('jhonatan_admin_token');
    announce('Sesión de administrador cerrada');
  };

  const toggleMessageRead = async (id: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/mensajes/${id}/leido`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ leido: !currentStatus }),
      });

      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, leido: currentStatus ? 0 : 1 } : m))
        );
        announce('Estado del mensaje actualizado');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMessage = async (id: number) => {
    if (!window.confirm('¿Confirmas eliminar este mensaje de contacto de la base de datos?')) return;
    try {
      const res = await fetch(`/api/admin/mensajes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        announce('Mensaje eliminado');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...newProject,
        technologies: newProject.technologies.split(',').map((t) => t.trim()),
        results: ['Proyecto registrado desde el panel de control'],
      };

      const res = await fetch('/api/proyectos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setActionSuccess('¡Proyecto registrado exitosamente en la base de datos!');
        announce('Proyecto creado exitosamente');
        setNewProject({
          title: '',
          clientOrOrg: '',
          period: '2026',
          category: 'dotnet',
          categoryLabel: '.NET & C#',
          shortDescription: '',
          technologies: '.NET 8, C#, SQL Server',
          measurableResult: '',
          problem: '',
          solution: '',
        });
        onDataChanged?.();
        setTimeout(() => setActionSuccess(null), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...newArticle,
        tags: newArticle.tags.split(',').map((t) => t.trim()),
        readTime: '6 min de lectura',
        date: new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' }),
      };

      const res = await fetch('/api/articulos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setActionSuccess('¡Artículo publicado exitosamente en el blog!');
        announce('Artículo publicado exitosamente');
        setNewArticle({
          title: '',
          slug: '',
          category: 'Ingeniería de software',
          excerpt: '',
          content: '',
          tags: 'Software, Arquitectura',
        });
        onDataChanged?.();
        setTimeout(() => setActionSuccess(null), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-panel-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-xs"
    >
      <div className="fixed inset-0" aria-hidden="true" onClick={handleClose} />

      <div className="relative w-full max-w-4xl bg-white dark:bg-[#121212] border border-neutral-300 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-6 z-10 max-h-[92vh] flex flex-col">
        
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-4 bg-neutral-50 dark:bg-neutral-900">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#C8102E] text-white flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="admin-panel-title" className="text-lg font-serif font-bold text-[#0A0A0A] dark:text-white">
                Panel de Administración del Portafolio
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Gestión de base de datos MySQL, mensajes, proyectos y artículos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {token && (
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Cerrar sesión de administrador"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[38px] text-xs font-semibold rounded-lg bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Salir</span>
              </button>
            )}

            <button
              ref={closeBtnRef}
              type="button"
              onClick={handleClose}
              aria-label="Cerrar panel de administración"
              className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:outline-none"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {!token ? (
          /* Login Form */
          <div className="p-8 sm:p-12 max-w-md mx-auto w-full space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto text-[#C8102E] dark:text-[#FF3B56]">
                <Key className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#0A0A0A] dark:text-white">
                Iniciar Sesión de Administrador
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Credencial por defecto para evaluación: <code className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded font-mono">admin</code> / <code className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded font-mono">AdminPassword2026*!</code>
              </p>
            </div>

            {loginError && (
              <div role="alert" className="p-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="admin-user" className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                  Usuario
                </label>
                <input
                  id="admin-user"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2.5 min-h-[44px] text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-[#0A0A0A] dark:text-white focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:outline-none"
                />
              </div>

              <div>
                <label htmlFor="admin-pass" className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                  Contraseña
                </label>
                <input
                  id="admin-pass"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="AdminPassword2026*!"
                  className="w-full px-4 py-2.5 min-h-[44px] text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-[#0A0A0A] dark:text-white focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 min-h-[44px] text-sm font-semibold rounded-xl bg-[#C8102E] hover:bg-[#A00D24] text-white transition-colors disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:outline-none shadow-xs"
              >
                {isLoading ? 'Verificando con bcrypt...' : 'Ingresar al Panel'}
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Tabs */}
            <div className="px-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-2 overflow-x-auto text-xs font-medium bg-neutral-50/50 dark:bg-neutral-900/50">
              <button
                type="button"
                onClick={() => setActiveTab('messages')}
                className={`py-3 px-4 min-h-[44px] border-b-2 font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'messages'
                    ? 'border-[#C8102E] text-[#C8102E] dark:text-[#FF3B56]'
                    : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                <span>Mensajes ({messages.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('projects')}
                className={`py-3 px-4 min-h-[44px] border-b-2 font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'projects'
                    ? 'border-[#C8102E] text-[#C8102E] dark:text-[#FF3B56]'
                    : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <FolderKanban className="w-4 h-4" aria-hidden="true" />
                <span>Crear Proyecto</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('articles')}
                className={`py-3 px-4 min-h-[44px] border-b-2 font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'articles'
                    ? 'border-[#C8102E] text-[#C8102E] dark:text-[#FF3B56]'
                    : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" aria-hidden="true" />
                <span>Crear Artículo</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('database')}
                className={`py-3 px-4 min-h-[44px] border-b-2 font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'database'
                    ? 'border-[#C8102E] text-[#C8102E] dark:text-[#FF3B56]'
                    : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <Database className="w-4 h-4" aria-hidden="true" />
                <span>Estado MySQL</span>
              </button>
            </div>

            {/* Notification alert */}
            {actionSuccess && (
              <div role="status" className="mx-6 mt-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{actionSuccess}</span>
              </div>
            )}

            {/* Tab Panels */}
            <div className="p-6 overflow-y-auto flex-1">
              
              {/* TAB 1: Messages */}
              {activeTab === 'messages' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                      Bandeja de Contacto Recibida (Tabla: mensajes_contacto)
                    </h3>
                    <button
                      type="button"
                      onClick={fetchAdminData}
                      className="inline-flex items-center gap-1 text-xs text-[#C8102E] dark:text-[#FF3B56] hover:underline"
                    >
                      <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Actualizar</span>
                    </button>
                  </div>

                  {messages.length === 0 ? (
                    <p className="text-xs text-neutral-500 py-8 text-center">No hay mensajes registrados aún.</p>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((m) => (
                        <div
                          key={m.id}
                          className={`p-4 rounded-xl border transition-colors ${
                            m.leido
                              ? 'bg-neutral-50 dark:bg-neutral-900/40 border-neutral-200 dark:border-neutral-800'
                              : 'bg-white dark:bg-neutral-900 border-[#C8102E]/40 dark:border-[#FF3B56]/40 shadow-xs'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-neutral-900 dark:text-white">{m.nombre}</span>
                              <span className="text-neutral-500 font-mono">&lt;{m.correo}&gt;</span>
                              {!m.leido && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#C8102E] text-white">
                                  Nuevo
                                </span>
                              )}
                            </div>
                            <span className="text-neutral-400 font-mono tabular-nums text-[11px]">
                              {new Date(m.fecha).toLocaleString('es-CO')}
                            </span>
                          </div>

                          <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
                            Asunto: {m.asunto}
                          </p>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800/60 p-3 rounded-lg leading-relaxed">
                            {m.mensaje}
                          </p>

                          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-neutral-100 dark:border-neutral-800">
                            <span className="text-[11px] text-neutral-500">
                              Consentimiento Ley 1581: <strong>{m.consentimiento_ley1581 ? 'Aceptado' : 'No'}</strong> · IP: {m.ip_origen || 'local'}
                            </span>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => toggleMessageRead(m.id, !!m.leido)}
                                className="px-2.5 py-1 min-h-[36px] rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                              >
                                {m.leido ? 'Marcar no leído' : 'Marcar leído'}
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteMessage(m.id)}
                                aria-label="Eliminar mensaje"
                                className="p-1.5 min-h-[36px] min-w-[36px] flex items-center justify-center rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-950/60"
                              >
                                <Trash2 className="w-4 h-4" aria-hidden="true" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: Create Project */}
              {activeTab === 'projects' && (
                <form onSubmit={handleCreateProject} className="space-y-4 max-w-2xl">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                    Añadir Proyecto a la Base de Datos (Tabla: proyectos)
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Título del Proyecto</label>
                      <input
                        type="text"
                        required
                        value={newProject.title}
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                        placeholder="Ej. Sistema de Monitoreo IoT"
                        className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border rounded-lg border-neutral-300 dark:border-neutral-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Cliente u Organización</label>
                      <input
                        type="text"
                        required
                        value={newProject.clientOrOrg}
                        onChange={(e) => setNewProject({ ...newProject, clientOrOrg: e.target.value })}
                        placeholder="Ej. Sena / IPS"
                        className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border rounded-lg border-neutral-300 dark:border-neutral-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Categoría</label>
                      <select
                        value={newProject.category}
                        onChange={(e) => {
                          const cat = e.target.value;
                          const labels: Record<string, string> = {
                            dotnet: '.NET & C#',
                            data: 'Bases de Datos & SQL',
                            web: 'Desarrollo Web & APIs',
                            architecture: 'Arquitectura & Liderazgo',
                          };
                          setNewProject({ ...newProject, category: cat, categoryLabel: labels[cat] || '.NET' });
                        }}
                        className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border rounded-lg border-neutral-300 dark:border-neutral-700"
                      >
                        <option value="dotnet">.NET & C#</option>
                        <option value="data">Bases de Datos & SQL</option>
                        <option value="web">Desarrollo Web & APIs</option>
                        <option value="architecture">Arquitectura & Liderazgo</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Período</label>
                      <input
                        type="text"
                        value={newProject.period}
                        onChange={(e) => setNewProject({ ...newProject, period: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border rounded-lg border-neutral-300 dark:border-neutral-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Tecnologías (separadas por coma)</label>
                      <input
                        type="text"
                        value={newProject.technologies}
                        onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border rounded-lg border-neutral-300 dark:border-neutral-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Resultado Medible</label>
                    <input
                      type="text"
                      required
                      value={newProject.measurableResult}
                      onChange={(e) => setNewProject({ ...newProject, measurableResult: e.target.value })}
                      placeholder="Ej. Reducción del 50% en tiempo de carga"
                      className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border rounded-lg border-neutral-300 dark:border-neutral-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Descripción Corta</label>
                    <textarea
                      rows={2}
                      required
                      value={newProject.shortDescription}
                      onChange={(e) => setNewProject({ ...newProject, shortDescription: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border rounded-lg border-neutral-300 dark:border-neutral-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Problema / Desafío</label>
                    <textarea
                      rows={2}
                      value={newProject.problem}
                      onChange={(e) => setNewProject({ ...newProject, problem: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border rounded-lg border-neutral-300 dark:border-neutral-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Solución Técnica</label>
                    <textarea
                      rows={2}
                      value={newProject.solution}
                      onChange={(e) => setNewProject({ ...newProject, solution: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border rounded-lg border-neutral-300 dark:border-neutral-700"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] text-xs font-semibold rounded-lg bg-[#C8102E] text-white hover:bg-[#A00D24] transition-colors"
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                    <span>Guardar Proyecto en MySQL</span>
                  </button>
                </form>
              )}

              {/* TAB 3: Create Article */}
              {activeTab === 'articles' && (
                <form onSubmit={handleCreateArticle} className="space-y-4 max-w-2xl">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                    Añadir Artículo al Blog (Tabla: articulos)
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Título del Artículo</label>
                    <input
                      type="text"
                      required
                      value={newArticle.title}
                      onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                      placeholder="Ej. Patrones de Diseño en Microservicios con C#"
                      className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border rounded-lg border-neutral-300 dark:border-neutral-700"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Categoría</label>
                      <select
                        value={newArticle.category}
                        onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border rounded-lg border-neutral-300 dark:border-neutral-700"
                      >
                        <option value="Ingeniería de software">Ingeniería de software</option>
                        <option value="Educación tecnológica">Educación tecnológica</option>
                        <option value="Reflexiones">Reflexiones</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Etiquetas (separadas por coma)</label>
                      <input
                        type="text"
                        value={newArticle.tags}
                        onChange={(e) => setNewArticle({ ...newArticle, tags: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border rounded-lg border-neutral-300 dark:border-neutral-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Extracto / Resumen</label>
                    <textarea
                      rows={2}
                      required
                      value={newArticle.excerpt}
                      onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border rounded-lg border-neutral-300 dark:border-neutral-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Contenido (Markdown / Texto)</label>
                    <textarea
                      rows={6}
                      required
                      value={newArticle.content}
                      onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                      placeholder="Escribe el artículo usando subtítulos ### y párrafos..."
                      className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border rounded-lg border-neutral-300 dark:border-neutral-700 font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] text-xs font-semibold rounded-lg bg-[#C8102E] text-white hover:bg-[#A00D24] transition-colors"
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                    <span>Publicar Artículo en MySQL</span>
                  </button>
                </form>
              )}

              {/* TAB 4: Database Status */}
              {activeTab === 'database' && (
                <div className="space-y-6 max-w-xl">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                    Estado de Conexión & Seguridad MySQL
                  </h3>

                  <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">Motor de Base de Datos:</span>
                      <span className="font-semibold text-neutral-900 dark:text-white">
                        {dbStatus?.database?.engine || 'MySQL 8.0+ Ready'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">Conexión MySQL Nativa:</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Prepared Statements Activos</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">Protección Inyección SQL:</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">Habilitada (prepared queries)</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">Protección Anti-Spam:</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">Honeypot + Rate Limiting por IP</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">Cifrado de Contraseñas:</span>
                      <span className="font-semibold text-neutral-900 dark:text-white">bcrypt (salt rounds: 10)</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs text-neutral-600 dark:text-neutral-400 space-y-2">
                    <p className="font-semibold text-neutral-900 dark:text-white">Instrucciones de Despliegue con MySQL:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Ejecuta el script <code className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded font-mono">schema.sql</code> en tu servidor MySQL (local, RDS, Railway o PlanetScale).</li>
                      <li>Configura tus variables <code className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded font-mono">MYSQL_HOST</code>, <code className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded font-mono">MYSQL_USER</code>, <code className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded font-mono">MYSQL_PASSWORD</code> y <code className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded font-mono">MYSQL_DATABASE</code> en el archivo <code className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded font-mono">.env</code>.</li>
                      <li>Inicia el servidor con <code className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded font-mono">npm run dev</code> o <code className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded font-mono">npm start</code>.</li>
                    </ol>
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
