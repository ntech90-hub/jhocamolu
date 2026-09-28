import React, { useEffect, useRef } from 'react';
import { X, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { useA11yAnnouncer } from './A11yAnnouncer';

interface DataPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataPrivacyModal: React.FC<DataPrivacyModalProps> = ({ isOpen, onClose }) => {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const { announce } = useA11yAnnouncer();

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 50);
      announce('Política de Tratamiento de Datos Personales abierta');

      document.body.style.overflow = 'hidden';

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
  }, [isOpen, announce]);

  const handleClose = () => {
    onClose();
    announce('Política de Tratamiento de Datos Personales cerrada');
    setTimeout(() => {
      previousFocusRef.current?.focus();
    }, 50);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-policy-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-xs"
    >
      <div className="fixed inset-0" aria-hidden="true" onClick={handleClose} />

      <div className="relative w-full max-w-2xl bg-white dark:bg-[#121212] border border-neutral-300 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-8 z-10 max-h-[88vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-4 bg-neutral-50 dark:bg-neutral-900/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#C8102E]/10 text-[#C8102E] dark:text-[#FF3B56] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3
                id="privacy-policy-title"
                className="text-lg font-serif font-bold text-[#0A0A0A] dark:text-white"
              >
                Política de Tratamiento de Datos Personales
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Cumplimiento Ley Estatutaria 1581 de 2012 y Decreto 1377 de 2013 (Colombia)
              </p>
            </div>
          </div>

          <button
            ref={closeBtnRef}
            type="button"
            onClick={handleClose}
            aria-label="Cerrar política de privacidad (tecla Escape)"
            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:outline-none"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-5 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">
          
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 space-y-1 text-xs">
            <p><strong>Responsable del Tratamiento:</strong> Jhonatan Camilo Moreno Luna</p>
            <p><strong>Domicilio:</strong> Ibagué (Tolima) / Bogotá D.C., Colombia</p>
            <p><strong>Canal Oficial de Contacto:</strong> jhocamolu2010@gmail.com</p>
          </div>

          <section className="space-y-2">
            <h4 className="font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#C8102E] dark:text-[#FF3B56]" aria-hidden="true" />
              1. Finalidad de la Recolección
            </h4>
            <p>
              Los datos personales solicitados a través del formulario de contacto (nombre, correo electrónico, asunto y contenido del mensaje) serán utilizados exclusivamente para:
            </p>
            <ul className="list-disc list-inside space-y-1 text-neutral-600 dark:text-neutral-400 pl-2">
              <li>Responder formalmente a su mensaje, solicitud de información o consulta técnica.</li>
              <li>Evaluar posibles colaboraciones profesionales, consultorías en desarrollo de software o actividades formativas.</li>
              <li>Llevar un registro histórico de contacto para seguimiento de compromisos acordados.</li>
            </ul>
            <p className="text-xs text-neutral-500 italic mt-1">
              En ningún caso sus datos serán vendidos, cedidos, transferidos ni compartidos con terceros con fines publicitarios o comerciales no autorizados.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#C8102E] dark:text-[#FF3B56]" aria-hidden="true" />
              2. Derechos del Titular (Derechos ARCO)
            </h4>
            <p>
              De conformidad con el artículo 8 de la Ley 1581 de 2012, usted como titular de los datos personales tiene derecho a:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-neutral-600 dark:text-neutral-400 pl-2">
              <li><strong>Conocer, actualizar y rectificar</strong> sus datos personales en cualquier momento.</li>
              <li><strong>Solicitar prueba</strong> de la autorización otorgada para el tratamiento.</li>
              <li><strong>Ser informado</strong> sobre el uso que se le ha dado a sus datos.</li>
              <li><strong>Revocar la autorización y/o solicitar la supresión</strong> del dato cuando considere que no se respetan los principios legales.</li>
              <li><strong>Acceder en forma gratuita</strong> a sus datos personales objeto de tratamiento.</li>
            </ol>
          </section>

          <section className="space-y-2">
            <h4 className="font-semibold text-neutral-900 dark:text-white">
              3. Procedimiento para Ejercer sus Derechos
            </h4>
            <p>
              Para ejercer cualquiera de sus derechos, puede enviar una solicitud por escrito indicando su nombre completo, correo de contacto y el derecho que desea ejercer a la dirección electrónica: <a href="mailto:jhocamolu2010@gmail.com" className="text-[#C8102E] dark:text-[#FF3B56] underline font-semibold">jhocamolu2010@gmail.com</a>. Su solicitud será atendida en un plazo máximo de quince (15) días hábiles.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="font-semibold text-neutral-900 dark:text-white">
              4. Seguridad de la Información y Base de Datos
            </h4>
            <p>
              Los datos se almacenan en infraestructura segura con acceso restringido y cifrado, implementando consultas preparadas (prepared statements) para prevenir vulnerabilidades de inyección SQL, además de políticas de protección contra spam y accesos no autorizados.
            </p>
          </section>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2.5 min-h-[44px] text-xs font-semibold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 transition-colors focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:outline-none"
          >
            Entendido y cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
