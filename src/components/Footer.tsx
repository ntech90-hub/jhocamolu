import React from 'react';
import { ArrowUp, Lock } from 'lucide-react';
import { PROFILE_DATA } from '../data/profile';
import { SocialSvgIcon } from './SocialIcons';
import { useA11yAnnouncer } from './A11yAnnouncer';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const { announce } = useA11yAnnouncer();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    announce('Desplazándose al inicio de la página');
  };

  const navLinks = [
    { href: '#inicio', label: 'Inicio' },
    { href: '#sobre-mi', label: 'Sobre mí' },
    { href: '#proyectos', label: 'Proyectos' },
    { href: '#blog', label: 'Blog' },
    { href: '#contacto', label: 'Contacto' },
  ];

  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-900 bg-white dark:bg-[#0A0A0A] py-12 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          {/* Brand info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-lg text-[#0A0A0A] dark:text-white">
                {PROFILE_DATA.name}
              </span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-md">
              Ingeniero de Sistemas · Especialista en Gestión de TI · Instructor SENA · Desarrollador Fullstack (.NET, C#, SQL Server, MySQL, Blazor, Web).
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Admin Panel Button */}
            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                aria-label="Abrir panel de administración del portafolio y base de datos"
                className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[44px] text-xs font-semibold rounded-lg border border-neutral-300 dark:border-neutral-700 hover:border-[#C8102E] dark:hover:border-[#FF3B56] text-neutral-700 dark:text-neutral-300 hover:text-[#C8102E] dark:hover:text-[#FF3B56] transition-colors focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:outline-none"
              >
                <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Panel Admin</span>
              </button>
            )}

            {/* Back to top button */}
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Volver al inicio de la página"
              className="inline-flex items-center gap-2 px-4 py-2 min-h-[44px] text-xs font-semibold rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-colors focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:outline-none"
            >
              <span>Volver arriba</span>
              <ArrowUp className="w-4 h-4 text-[#C8102E] dark:text-[#FF3B56]" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Quick Nav & Social Channels */}
        <div className="pt-6 border-t border-neutral-100 dark:border-neutral-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-neutral-600 dark:text-neutral-400">
          
          {/* Quick links */}
          <nav aria-label="Enlaces rápidos de pie de página" className="flex flex-wrap items-center gap-4 sm:gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-[#C8102E] dark:hover:text-[#FF3B56] transition-colors py-1 focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:outline-none rounded-xs"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Social Links with inline SVGs and explicit aria-labels */}
          <div className="flex flex-wrap items-center gap-2">
            {PROFILE_DATA.socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-neutral-700 dark:text-neutral-300 hover:text-[#C8102E] dark:hover:text-[#FF3B56] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:outline-none"
              >
                <SocialSvgIcon type={link.icon} className="w-4 h-4" />
              </a>
            ))}
          </div>

        </div>

        {/* Accessibility & Copyright Statement */}
        <div className="pt-4 border-t border-neutral-100 dark:border-neutral-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-neutral-500 dark:text-neutral-500">
          <p>
            © {new Date().getFullYear()} Jhonatan Camilo Moreno Luna. Todos los derechos reservados.
          </p>
          <p className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
            <span>Conformidad de accesibilidad WCAG 2.2 Nivel AA · Cumplimiento Ley 1581 de 2012.</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
