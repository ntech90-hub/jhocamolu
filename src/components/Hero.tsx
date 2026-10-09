import React, { useState } from 'react';
import { ArrowDown, MapPin } from 'lucide-react';
import { PROFILE_DATA } from '../data/profile';
import { SocialSvgIcon } from './SocialIcons';
import { useA11yAnnouncer } from './A11yAnnouncer';

export const Hero: React.FC = () => {
  const [imageError, setImageError] = useState(false);
  const { announce } = useA11yAnnouncer();

  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      className="pt-28 pb-16 md:pt-36 md:pb-24 border-b border-neutral-200 dark:border-neutral-900 relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Main Copy */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Location & Status Line */}
            <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-neutral-600 dark:text-neutral-400">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#C8102E] dark:text-[#FF3B56]" aria-hidden="true" />
                <span>{PROFILE_DATA.location}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">Disponible para consultoría y proyectos</span>
            </div>

            {/* Name & Headline */}
            <div className="space-y-3">
              <h1
                id="hero-title"
                className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#0A0A0A] dark:text-white tracking-tight leading-[1.15]"
                style={{ textWrap: 'balance' }}
              >
                {PROFILE_DATA.name}
              </h1>
              <p className="text-base sm:text-lg font-medium text-[#C8102E] dark:text-[#FF3B56] leading-snug">
                {PROFILE_DATA.tagline}
              </p>
            </div>

            {/* Value Proposition */}
            <p className="text-neutral-700 dark:text-neutral-300 text-base sm:text-lg leading-relaxed max-w-2xl">
              {PROFILE_DATA.valueProposition}
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#proyectos"
                onClick={() => announce('Desplazándose a la sección de proyectos')}
                className="inline-flex items-center justify-center px-6 py-3 min-h-[48px] text-sm font-semibold rounded-lg bg-[#C8102E] text-white hover:bg-[#A00D24] dark:bg-[#C8102E] dark:hover:bg-[#E52E4D] shadow-xs transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C8102E] focus-visible:outline-none"
              >
                <span>Ver proyectos</span>
                <ArrowDown className="ml-2 w-4 h-4" aria-hidden="true" />
              </a>

              <a
                href="#contacto"
                onClick={() => announce('Desplazándose al formulario de contacto')}
                className="inline-flex items-center justify-center px-6 py-3 min-h-[48px] text-sm font-semibold rounded-lg border-2 border-neutral-800 text-neutral-900 hover:bg-neutral-100 dark:border-neutral-200 dark:text-white dark:hover:bg-neutral-900 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C8102E] focus-visible:outline-none"
              >
                Contáctame
              </a>
            </div>

            {/* Social Icons Bar with Accessible Labels */}
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <p className="text-xs uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400 mb-3">
                Conectar profesionalmente
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {PROFILE_DATA.socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:text-[#C8102E] dark:hover:text-[#FF3B56] hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:outline-none"
                  >
                    <SocialSvgIcon type={link.icon} className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

          </div>

          {/* Visual Avatar / Portrait Container */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm sm:max-w-md aspect-square rounded-2xl overflow-hidden shadow-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900">
              {!imageError ? (
                <img
                  src={PROFILE_DATA.avatarUrl}
                  alt={`Retrato profesional de ${PROFILE_DATA.name}`}
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover object-top transition-transform duration-300 hover:scale-102"
                />
              ) : (
                /* Accessible CSS Fallback Container */
                <div
                  role="img"
                  aria-label={`Retrato ilustrado de ${PROFILE_DATA.name}`}
                  className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-neutral-800 to-neutral-950 text-white text-center"
                >
                  <div className="w-24 h-24 rounded-full bg-[#C8102E] flex items-center justify-center font-serif text-3xl font-bold mb-4 shadow-md">
                    JM
                  </div>
                  <p className="font-serif text-xl font-bold">{PROFILE_DATA.name}</p>
                  <p className="text-xs text-neutral-400 mt-1 max-w-xs">{PROFILE_DATA.tagline}</p>
                </div>
              )}

              {/* Minimalist Subtitle overlay badge */}
              <div className="absolute bottom-3 left-3 right-3 bg-white/90 dark:bg-[#0A0A0A]/90 backdrop-blur-md px-3.5 py-2 rounded-lg border border-neutral-200/60 dark:border-neutral-700/60 flex items-center justify-between text-xs">
                <span className="font-medium text-neutral-900 dark:text-neutral-100">Instructor SENA & Fullstack</span>
                <span className="text-[#C8102E] dark:text-[#FF3B56] font-semibold tabular-nums">+8 años exp.</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
