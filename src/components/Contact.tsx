import React, { useState } from 'react';
import { Mail, MessageSquare, Copy, Check, Send, AlertCircle, CheckCircle2, ShieldCheck, MapPin, ExternalLink } from 'lucide-react';
import { PROFILE_DATA } from '../data/profile';
import { SocialSvgIcon } from './SocialIcons';
import { DataPrivacyModal } from './DataPrivacyModal';
import { useA11yAnnouncer } from './A11yAnnouncer';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  consent: boolean;
  honeypot: string; // Anti-spam hidden honeypot
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  consent?: string;
  server?: string;
}

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    consent: false,
    honeypot: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const { announce } = useA11yAnnouncer();

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Por favor ingresa tu nombre completo.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Por favor ingresa tu correo electrónico.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Por favor ingresa una dirección de correo válida.';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Por favor indica el asunto de tu mensaje.';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Por favor escribe tu consulta o propuesta.';
    } else if (formData.message.trim().length < 15) {
      newErrors.message = 'El mensaje debe tener al menos 15 caracteres para brindarte una respuesta adecuada.';
    }

    if (!formData.consent) {
      newErrors.consent = 'Debes autorizar el tratamiento de datos para poder responder tu solicitud conforme a la Ley 1581 de 2012.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      announce('El formulario contiene errores. Por favor revisa los campos señalados.');
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    announce('Enviando mensaje y registrando en la base de datos...');

    try {
      const response = await fetch('/api/contacto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          consent: formData.consent,
          honeypot: formData.honeypot,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Ocurrió un error al enviar el mensaje.');
      }

      setIsSubmitted(true);
      announce('¡Mensaje enviado y registrado en la base de datos con éxito! Me pondré en contacto contigo pronto.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        consent: false,
        honeypot: '',
      });
    } catch (err: any) {
      setErrors({ server: err.message });
      announce(`Error al enviar: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PROFILE_DATA.email);
    setCopiedEmail(true);
    announce(`Correo ${PROFILE_DATA.email} copiado al portapapeles.`);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <section
      id="contacto"
      aria-labelledby="contact-title"
      className="py-16 md:py-24 bg-neutral-50/50 dark:bg-neutral-950/50"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="max-w-2xl space-y-3">
          <p className="text-xs uppercase tracking-wider font-semibold text-[#C8102E] dark:text-[#FF3B56]">
            Hablemos de tus proyectos
          </p>
          <h2
            id="contact-title"
            className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#0A0A0A] dark:text-white tracking-tight"
          >
            Contacto & Colaboración
          </h2>
          <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
            ¿Tienes un reto de ingeniería, una oportunidad formativa o una consultoría en arquitectura de software? Envíame un mensaje o contáctame directamente por los canales oficiales.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          
          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white dark:bg-neutral-900 rounded-2xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800 shadow-xs">
            
            {isSubmitted ? (
              <div
                role="status"
                aria-live="polite"
                className="py-10 text-center space-y-4"
              >
                <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-serif font-bold text-[#0A0A0A] dark:text-white">
                  ¡Mensaje registrado en la Base de Datos!
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
                  Gracias por comunicarte. Tu mensaje ha quedado registrado con prepared statements seguros y se ha despachado la notificación. Responderé a tu correo en menos de 24 horas hábiles.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 px-5 py-2.5 min-h-[44px] text-xs font-semibold rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:outline-none"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                
                {/* Server Error Alert */}
                {errors.server && (
                  <div role="alert" className="p-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{errors.server}</span>
                  </div>
                )}

                {/* Anti-Spam Honeypot field (hidden from legitimate users) */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="website_url_check">No llenar este campo si eres humano</label>
                  <input
                    id="website_url_check"
                    name="website_url_check"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.honeypot}
                    onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                  />
                </div>

                {/* Name */}
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5"
                  >
                    Nombre completo <span className="text-[#C8102E] dark:text-[#FF3B56]" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    aria-required="true"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'contact-name-error' : undefined}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej. Carolina Gómez"
                    className={`w-full px-4 py-2.5 min-h-[44px] text-sm bg-neutral-50 dark:bg-neutral-800/80 border rounded-xl text-[#0A0A0A] dark:text-white placeholder:text-neutral-400 transition-colors focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:outline-none ${
                      errors.name
                        ? 'border-[#C8102E] dark:border-[#FF3B56] ring-1 ring-[#C8102E]'
                        : 'border-neutral-300 dark:border-neutral-700 focus:border-neutral-900 dark:focus:border-neutral-100'
                    }`}
                  />
                  {errors.name && (
                    <p id="contact-name-error" role="alert" className="mt-1 text-xs text-[#C8102E] dark:text-[#FF3B56] flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5"
                  >
                    Correo electrónico <span className="text-[#C8102E] dark:text-[#FF3B56]" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    aria-required="true"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'contact-email-error' : undefined}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="tu-correo@empresa.com"
                    className={`w-full px-4 py-2.5 min-h-[44px] text-sm bg-neutral-50 dark:bg-neutral-800/80 border rounded-xl text-[#0A0A0A] dark:text-white placeholder:text-neutral-400 transition-colors focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:outline-none ${
                      errors.email
                        ? 'border-[#C8102E] dark:border-[#FF3B56] ring-1 ring-[#C8102E]'
                        : 'border-neutral-300 dark:border-neutral-700 focus:border-neutral-900 dark:focus:border-neutral-100'
                    }`}
                  />
                  {errors.email && (
                    <p id="contact-email-error" role="alert" className="mt-1 text-xs text-[#C8102E] dark:text-[#FF3B56] flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5"
                  >
                    Asunto <span className="text-[#C8102E] dark:text-[#FF3B56]" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    required
                    aria-required="true"
                    aria-invalid={!!errors.subject}
                    aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Ej. Oportunidad de consultoría en .NET / Optimización SQL"
                    className={`w-full px-4 py-2.5 min-h-[44px] text-sm bg-neutral-50 dark:bg-neutral-800/80 border rounded-xl text-[#0A0A0A] dark:text-white placeholder:text-neutral-400 transition-colors focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:outline-none ${
                      errors.subject
                        ? 'border-[#C8102E] dark:border-[#FF3B56] ring-1 ring-[#C8102E]'
                        : 'border-neutral-300 dark:border-neutral-700 focus:border-neutral-900 dark:focus:border-neutral-100'
                    }`}
                  />
                  {errors.subject && (
                    <p id="contact-subject-error" role="alert" className="mt-1 text-xs text-[#C8102E] dark:text-[#FF3B56] flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{errors.subject}</span>
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5"
                  >
                    Mensaje o consulta <span className="text-[#C8102E] dark:text-[#FF3B56]" aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    required
                    aria-required="true"
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'contact-message-error' : undefined}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe los objetivos de tu proyecto, requerimientos técnicos o propuesta de trabajo..."
                    className={`w-full px-4 py-2.5 text-sm bg-neutral-50 dark:bg-neutral-800/80 border rounded-xl text-[#0A0A0A] dark:text-white placeholder:text-neutral-400 transition-colors focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:outline-none ${
                      errors.message
                        ? 'border-[#C8102E] dark:border-[#FF3B56] ring-1 ring-[#C8102E]'
                        : 'border-neutral-300 dark:border-neutral-700 focus:border-neutral-900 dark:focus:border-neutral-100'
                    }`}
                  />
                  {errors.message && (
                    <p id="contact-message-error" role="alert" className="mt-1 text-xs text-[#C8102E] dark:text-[#FF3B56] flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{errors.message}</span>
                    </p>
                  )}
                </div>

                {/* Data Privacy Consent (Ley Estatutaria 1581 de 2012 de Habeas Data Colombia) */}
                <div className="pt-1">
                  <div className="flex items-start gap-3">
                    <input
                      id="contact-consent"
                      name="consent"
                      type="checkbox"
                      required
                      aria-required="true"
                      aria-invalid={!!errors.consent}
                      aria-describedby={errors.consent ? 'contact-consent-error' : undefined}
                      checked={formData.consent}
                      onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                      className="mt-1 w-4 h-4 rounded text-[#C8102E] focus:ring-[#C8102E] border-neutral-300 dark:border-neutral-700"
                    />
                    <label
                      htmlFor="contact-consent"
                      className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed cursor-pointer"
                    >
                      Autorizo expresamente el tratamiento de mis datos personales de contacto para atender esta consulta, conforme a la{' '}
                      <button
                        type="button"
                        onClick={() => setIsPrivacyModalOpen(true)}
                        className="text-[#C8102E] dark:text-[#FF3B56] underline font-semibold hover:text-[#A00D24] inline-flex items-center gap-0.5"
                      >
                        <span>Política de Privacidad y Habeas Data (Ley Estatutaria 1581 de 2012 de Colombia)</span>
                        <ExternalLink className="w-3 h-3 inline" aria-hidden="true" />
                      </button>
                      .
                    </label>
                  </div>
                  {errors.consent && (
                    <p id="contact-consent-error" role="alert" className="mt-1.5 text-xs text-[#C8102E] dark:text-[#FF3B56] flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{errors.consent}</span>
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] text-sm font-semibold rounded-xl bg-[#C8102E] text-white hover:bg-[#A00D24] dark:bg-[#C8102E] dark:hover:bg-[#E52E4D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C8102E] focus-visible:outline-none shadow-xs"
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                  <span>{isSubmitting ? 'Guardando en base de datos...' : 'Enviar consulta a MySQL'}</span>
                </button>

              </form>
            )}

          </div>

          {/* Direct Contact Cards & Social Channels */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct Email Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-[#C8102E] dark:text-[#FF3B56]">
                  <Mail className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Correo Directo
                  </h3>
                  <a
                    href={`mailto:${PROFILE_DATA.email}`}
                    className="text-sm font-medium text-neutral-900 dark:text-white hover:text-[#C8102E] dark:hover:text-[#FF3B56] transition-colors break-all"
                  >
                    {PROFILE_DATA.email}
                  </a>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyEmail}
                aria-label={`Copiar correo electrónico ${PROFILE_DATA.email}`}
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 min-h-[40px] text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:outline-none"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copiado al portapapeles</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Copiar dirección de correo</span>
                  </>
                )}
              </button>
            </div>

            {/* Direct WhatsApp Card with exact requested URL */}
            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <MessageSquare className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Mensajería Instantánea
                  </h3>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    WhatsApp Profesional
                  </p>
                </div>
              </div>

              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Contacto directo para conversaciones ágiles sobre consultoría y docencia. Número oficial registrado: <strong>+57 311 289 2173</strong>.
              </p>

              <a
                href="https://wa.me/573112892173?text=Hola%20Camilo,%20vi%20tu%20sitio%20web%20y%20me%20gustar%C3%ADa%20contactarte"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Iniciar chat directo de WhatsApp con Camilo, se abre en una pestaña nueva"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-600 focus-visible:outline-none"
              >
                <SocialSvgIcon type="whatsapp" className="w-4 h-4" />
                <span>Chatear en WhatsApp</span>
              </a>
            </div>

            {/* Integrated Social Channels (Facebook, Instagram, LinkedIn, GitHub) */}
            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Redes Sociales Oficiales
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Conéctate conmigo a través de cualquiera de mis perfiles verificados:
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                {PROFILE_DATA.socialLinks
                  .filter((l) => l.icon !== 'mail')
                  .map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      className="flex items-center gap-2.5 p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-[#C8102E] dark:hover:text-[#FF3B56] hover:border-[#C8102E] dark:hover:border-[#FF3B56] hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-xs font-medium focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:outline-none"
                    >
                      <SocialSvgIcon type={link.icon} className="w-4 h-4 shrink-0" />
                      <span className="truncate">{link.name}</span>
                    </a>
                  ))}
              </div>
            </div>

            {/* Geographic & Availability Card */}
            <div className="p-6 rounded-2xl bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-900 dark:text-white">
                <MapPin className="w-4 h-4 text-[#C8102E] dark:text-[#FF3B56]" aria-hidden="true" />
                <span>Ubicación y disponibilidad</span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Base en <strong>Ibagué (Tolima)</strong> y <strong>Bogotá D.C., Colombia</strong>. Modalidad disponible: presencial en Colombia o remoto internacional.
              </p>
              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                <ShieldCheck className="w-4 h-4 text-[#C8102E] dark:text-[#FF3B56]" aria-hidden="true" />
                <span>Base de datos protegida con prepared statements y normatividad legal colombiana</span>
              </div>
            </div>

          </div>

        </div>

        {/* Habeas Data Legal Policy Modal */}
        <DataPrivacyModal
          isOpen={isPrivacyModalOpen}
          onClose={() => setIsPrivacyModalOpen(false)}
        />

      </div>
    </section>
  );
};
