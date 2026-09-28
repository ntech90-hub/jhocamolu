import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useA11yAnnouncer } from './A11yAnnouncer';

interface HeaderProps {
  isDark: boolean;
  toggleDarkMode: () => void;
  activeSection: string;
}

export const Header: React.FC<HeaderProps> = ({ isDark, toggleDarkMode, activeSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const { announce } = useA11yAnnouncer();

  const navLinks = [
    { href: '#inicio', label: 'Inicio' },
    { href: '#sobre-mi', label: 'Sobre mí' },
    { href: '#proyectos', label: 'Proyectos' },
    { href: '#blog', label: 'Blog' },
    { href: '#contacto', label: 'Contacto' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
        announce('Menú de navegación cerrado');
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen, announce]);

  const toggleMobileMenu = () => {
    const nextState = !mobileMenuOpen;
    setMobileMenuOpen(nextState);
    announce(nextState ? 'Menú de navegación principal desplegado' : 'Menú de navegación cerrado');
  };

  const handleNavClick = (sectionName: string) => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
      menuButtonRef.current?.focus();
    }
    announce(`Navegando a la sección ${sectionName}`);
  };

  const handleThemeToggle = () => {
    toggleDarkMode();
    announce(isDark ? 'Tema claro activado' : 'Tema oscuro activado');
  };

  return (
    <>
      {/* Skip to Main Content Link for Keyboard / Screen Reader users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-[#C8102E] focus:text-white focus:font-medium focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white transition-transform"
      >
        Saltar al contenido principal
      </a>

      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-200 ${
          scrolled
            ? 'bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-md shadow-xs border-b border-neutral-200/80 dark:border-neutral-800/80'
            : 'bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-sm border-b border-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="#inicio"
            onClick={() => handleNavClick('Inicio')}
            className="flex items-center gap-2.5 group text-[#0A0A0A] dark:text-white rounded-md py-1 px-1 focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:outline-none"
            aria-label="Jhonatan Camilo Moreno Luna - Ir al inicio"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0A0A0A] dark:bg-white text-white dark:text-[#0A0A0A] flex items-center justify-center font-serif font-bold text-sm shadow-xs border border-transparent group-hover:border-[#C8102E] transition-colors">
              JM
            </div>
            <span className="font-serif font-semibold text-lg tracking-tight group-hover:text-[#C8102E] dark:group-hover:text-[#FF3B56] transition-colors">
              Jhonatan Moreno
            </span>
          </a>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav
            aria-label="Navegación principal"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => handleNavClick(link.label)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative py-1 transition-colors duration-150 rounded-xs focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:outline-none ${
                    isActive
                      ? 'text-[#C8102E] dark:text-[#FF3B56] font-semibold'
                      : 'hover:text-[#0A0A0A] dark:hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#C8102E] dark:bg-[#FF3B56] rounded-full"
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Zone 3: Actions (Theme Toggle & Mobile Menu Button) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleThemeToggle}
              aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:outline-none"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-amber-400" aria-hidden="true" />
              ) : (
                <Moon className="w-5 h-5 text-neutral-700" aria-hidden="true" />
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              ref={menuButtonRef}
              type="button"
              onClick={toggleMobileMenu}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={mobileMenuOpen ? 'Cerrar menú principal' : 'Abrir menú principal'}
              className="md:hidden p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            id="mobile-navigation"
            ref={mobileMenuRef}
            className="md:hidden border-b border-neutral-200 dark:border-neutral-800 bg-white/98 dark:bg-[#0A0A0A]/98 backdrop-blur-md px-4 pt-3 pb-6 space-y-2 shadow-lg transition-all"
          >
            <nav aria-label="Navegación móvil" className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.replace('#', '');
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => handleNavClick(link.label)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`px-3 py-3 rounded-lg text-base font-medium min-h-[44px] flex items-center justify-between transition-colors focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:outline-none ${
                      isActive
                        ? 'bg-neutral-100 dark:bg-neutral-900 text-[#C8102E] dark:text-[#FF3B56] font-semibold'
                        : 'text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-900'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C8102E] dark:bg-[#FF3B56]" aria-hidden="true" />
                    )}
                  </a>
                );
              })}
            </nav>
          </div>
        )}
      </header>
    </>
  );
};
