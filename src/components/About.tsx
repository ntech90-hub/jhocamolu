import React, { useState } from 'react';
import { Briefcase, GraduationCap, Award, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { PROFILE_DATA } from '../data/profile';
import { TIMELINE_DATA, TimelineItem } from '../data/timeline';
import { useA11yAnnouncer } from './A11yAnnouncer';

export const About: React.FC = () => {
  const [filterType, setFilterType] = useState<'all' | 'experience' | 'education'>('all');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    'sena-instructor': true,
    'snr-profesional': true,
    'vek-director': true,
    'expert-medica': true
  });
  const { announce } = useA11yAnnouncer();

  const toggleItemExpansion = (id: string, role: string) => {
    const isCurrentlyExpanded = !!expandedItems[id];
    const nextState = !isCurrentlyExpanded;
    setExpandedItems((prev) => ({ ...prev, [id]: nextState }));
    announce(nextState ? `Detalles de ${role} expandidos` : `Detalles de ${role} colapsados`);
  };

  const filteredTimeline = TIMELINE_DATA.filter((item) => {
    if (filterType === 'all') return true;
    if (filterType === 'experience') return item.type === 'experience';
    if (filterType === 'education') return item.type === 'education' || item.type === 'certification';
    return true;
  });

  const handleTabChange = (type: 'all' | 'experience' | 'education', label: string) => {
    setFilterType(type);
    announce(`Filtrando línea de tiempo por: ${label}`);
  };

  return (
    <section
      id="sobre-mi"
      aria-labelledby="about-title"
      className="py-16 md:py-24 border-b border-neutral-200 dark:border-neutral-900"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <p className="text-xs uppercase tracking-wider font-semibold text-[#C8102E] dark:text-[#FF3B56]">
            Perfil profesional & Trayectoria
          </p>
          <h2
            id="about-title"
            className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#0A0A0A] dark:text-white tracking-tight"
          >
            Sobre mí
          </h2>
          <p className="text-base sm:text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
            {PROFILE_DATA.summary}
          </p>
        </div>

        {/* Highlighted Quantitative Metrics (Rigorous & Adjacency) */}
        <div
          aria-label="Cifras destacadas de impacto"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {PROFILE_DATA.metrics.map((metric, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40"
            >
              <div className="text-3xl sm:text-4xl font-serif font-bold text-[#C8102E] dark:text-[#FF3B56] tabular-nums tracking-tight">
                {metric.value}
              </div>
              <div className="mt-1 text-sm font-semibold text-[#0A0A0A] dark:text-white">
                {metric.label}
              </div>
              <p className="mt-1.5 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {metric.description}
              </p>
            </div>
          ))}
        </div>

        {/* Technical Competencies Matrix */}
        <div className="space-y-6">
          <h3 className="text-xl font-serif font-bold text-[#0A0A0A] dark:text-white">
            Ecosistema técnico y metodológico
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Backend */}
            <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/30 space-y-3">
              <h4 className="text-sm font-semibold text-[#0A0A0A] dark:text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#C8102E] dark:text-[#FF3B56]" aria-hidden="true" />
                Backend & Frameworks
              </h4>
              <ul className="space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300">
                {PROFILE_DATA.technologies.backend.map((tech) => (
                  <li key={tech} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600" aria-hidden="true" />
                    <span>{tech}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Frontend */}
            <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/30 space-y-3">
              <h4 className="text-sm font-semibold text-[#0A0A0A] dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C8102E] dark:text-[#FF3B56]" aria-hidden="true" />
                Frontend & Lenguajes
              </h4>
              <ul className="space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300">
                {PROFILE_DATA.technologies.frontend.map((tech) => (
                  <li key={tech} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600" aria-hidden="true" />
                    <span>{tech}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bases de datos */}
            <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/30 space-y-3">
              <h4 className="text-sm font-semibold text-[#0A0A0A] dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-[#C8102E] dark:text-[#FF3B56]" aria-hidden="true" />
                Datos & Almacenamiento
              </h4>
              <ul className="space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300">
                {PROFILE_DATA.technologies.databases.map((tech) => (
                  <li key={tech} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600" aria-hidden="true" />
                    <span>{tech}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Principios */}
            <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/30 space-y-3">
              <h4 className="text-sm font-semibold text-[#0A0A0A] dark:text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#C8102E] dark:text-[#FF3B56]" aria-hidden="true" />
                Enfoque & Arquitectura
              </h4>
              <ul className="space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300">
                {PROFILE_DATA.technologies.principles.map((tech) => (
                  <li key={tech} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C8102E] dark:bg-[#FF3B56]" aria-hidden="true" />
                    <span className="font-medium text-neutral-900 dark:text-neutral-200">{tech}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* Timeline Section */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-serif font-bold text-[#0A0A0A] dark:text-white">
                Trayectoria cronológica
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                Experiencia laboral como desarrollador e instructor, y formación académica.
              </p>
            </div>

            {/* Accessible Tab Filter */}
            <div
              role="tablist"
              aria-label="Filtro de la línea de tiempo"
              className="inline-flex p-1 bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs font-medium"
            >
              <button
                role="tab"
                type="button"
                aria-selected={filterType === 'all'}
                onClick={() => handleTabChange('all', 'Todos los hitos')}
                className={`px-3 py-1.5 min-h-[38px] rounded-md transition-colors ${
                  filterType === 'all'
                    ? 'bg-white dark:bg-neutral-800 text-[#0A0A0A] dark:text-white shadow-xs font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Todos
              </button>
              <button
                role="tab"
                type="button"
                aria-selected={filterType === 'experience'}
                onClick={() => handleTabChange('experience', 'Experiencia laboral')}
                className={`px-3 py-1.5 min-h-[38px] rounded-md transition-colors ${
                  filterType === 'experience'
                    ? 'bg-white dark:bg-neutral-800 text-[#0A0A0A] dark:text-white shadow-xs font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Experiencia laboral
              </button>
              <button
                role="tab"
                type="button"
                aria-selected={filterType === 'education'}
                onClick={() => handleTabChange('education', 'Formación y educación')}
                className={`px-3 py-1.5 min-h-[38px] rounded-md transition-colors ${
                  filterType === 'education'
                    ? 'bg-white dark:bg-neutral-800 text-[#0A0A0A] dark:text-white shadow-xs font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Formación
              </button>
            </div>
          </div>

          {/* Timeline List */}
          <div className="relative border-l-2 border-neutral-200 dark:border-neutral-800 ml-3 sm:ml-4 pl-6 sm:pl-8 space-y-8">
            {filteredTimeline.map((item) => {
              const isExpanded = !!expandedItems[item.id];
              return (
                <div key={item.id} className="relative group">
                  {/* Timeline bullet dot */}
                  <span
                    aria-hidden="true"
                    className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full border-2 bg-white dark:bg-[#0A0A0A] transition-colors ${
                      item.type === 'experience'
                        ? 'border-[#C8102E] dark:border-[#FF3B56]'
                        : 'border-neutral-500 dark:border-neutral-400'
                    }`}
                  />

                  <div className="bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 sm:p-6 transition-colors hover:border-neutral-300 dark:hover:border-neutral-700">
                    
                    {/* Header info */}
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                      <h4 className="text-base sm:text-lg font-serif font-bold text-[#0A0A0A] dark:text-white">
                        {item.role}
                      </h4>
                      <span className="text-xs font-mono font-medium text-[#C8102E] dark:text-[#FF3B56] tabular-nums whitespace-nowrap">
                        {item.period}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400 mt-1 mb-3">
                      <span className="font-semibold text-neutral-900 dark:text-neutral-200">{item.organization}</span>
                      {item.location && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{item.location}</span>
                        </>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                      {item.description}
                    </p>

                    {/* Collapsible toggle for detail list */}
                    {item.highlights && item.highlights.length > 0 && (
                      <div>
                        <button
                          type="button"
                          onClick={() => toggleItemExpansion(item.id, item.role)}
                          aria-expanded={isExpanded}
                          aria-controls={`highlights-${item.id}`}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C8102E] dark:text-[#FF3B56] hover:underline focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:outline-none rounded-xs py-1"
                        >
                          <span>{isExpanded ? 'Ocultar responsabilidades y logros' : 'Ver responsabilidades y logros'}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                          )}
                        </button>

                        {isExpanded && (
                          <ul
                            id={`highlights-${item.id}`}
                            className="mt-3 space-y-2 border-t border-neutral-100 dark:border-neutral-800 pt-3"
                          >
                            {item.highlights.map((h, i) => (
                              <li key={i} className="text-xs text-neutral-600 dark:text-neutral-400 flex items-start gap-2">
                                <span className="text-[#C8102E] dark:text-[#FF3B56] mt-0.5" aria-hidden="true">✓</span>
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
