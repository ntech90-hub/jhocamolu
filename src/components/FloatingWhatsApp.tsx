import React from 'react';
import { SocialSvgIcon } from './SocialIcons';

export const FloatingWhatsApp: React.FC = () => {
  const whatsappUrl =
    'https://wa.me/573112892173?text=Hola%20Camilo,%20vi%20tu%20sitio%20web%20y%20me%20gustar%C3%ADa%20contactarte';

  return (
    <aside aria-label="Contacto directo por WhatsApp" className="fixed bottom-5 right-5 z-40">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chatear en WhatsApp con Camilo (+57 311 289 2173), se abre en una pestaña nueva"
        className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg hover:shadow-xl transition-all duration-200 ease-out hover:scale-105 active:scale-95 focus-visible:ring-3 focus-visible:ring-offset-2 focus-visible:ring-emerald-500 focus-visible:outline-none motion-reduce:hover:scale-100"
      >
        <SocialSvgIcon type="whatsapp" className="w-6 h-6 sm:w-7 sm:h-7" />

        {/* Accessible tooltip for mouse and keyboard focus */}
        <span
          role="tooltip"
          className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-3 py-1.5 text-xs font-semibold shadow-md opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-150"
        >
          ¿Conversamos por WhatsApp?
        </span>
      </a>
    </aside>
  );
};
