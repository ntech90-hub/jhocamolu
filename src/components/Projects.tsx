import React, { useState, useEffect } from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { PROJECTS_DATA, CATEGORIES, Project } from '../data/projects';
import { ProjectDetailModal } from './ProjectDetailModal';
import { GitHubShowcase } from './GitHubShowcase';
import { useA11yAnnouncer } from './A11yAnnouncer';

export const Projects: React.FC = () => {
  const [projectsList, setProjectsList] = useState<Project[]>(PROJECTS_DATA);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);
  const { announce } = useA11yAnnouncer();

  // Load dynamically from MySQL API endpoint with graceful fallback
  useEffect(() => {
    let isMounted = true;
    async function loadProjects() {
      try {
        const res = await fetch('/api/proyectos');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data) && data.length > 0) {
            setProjectsList(data);
          }
        }
      } catch (err) {
        // Fallback already populated with PROJECTS_DATA
      }
    }
    loadProjects();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProjects = projectsList.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  const handleCategorySelect = (catId: string, label: string) => {
    setSelectedCategory(catId);
    announce(
      `Filtrando proyectos por: ${label}. Mostrando ${
        catId === 'all'
          ? projectsList.length
          : projectsList.filter((p) => p.category === catId).length
      } proyectos.`
    );
  };

  return (
    <section
      id="proyectos"
      aria-labelledby="projects-title"
      className="py-16 md:py-24 border-b border-neutral-200 dark:border-neutral-900 bg-neutral-50/30 dark:bg-neutral-950/30"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header & Description */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs uppercase tracking-wider font-semibold text-[#C8102E] dark:text-[#FF3B56]">
              Portafolio de Ingeniería & Backend
            </p>
            <h2
              id="projects-title"
              className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#0A0A0A] dark:text-white tracking-tight"
            >
              Proyectos destacados & Resultados
            </h2>
            <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
              Soluciones construidas para los sectores de salud, administración pública, servicios y logística empresarial, con foco en alto rendimiento, arquitectura escalable y seguridad.
            </p>
          </div>

          {/* Accessible Category Filters */}
          <div
            role="tablist"
            aria-label="Filtrar proyectos por tecnología o área"
            className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-200/70 dark:bg-neutral-900 rounded-xl text-xs font-medium"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                role="tab"
                type="button"
                aria-selected={selectedCategory === cat.id}
                onClick={() => handleCategorySelect(cat.id, cat.label)}
                className={`px-3 py-2 min-h-[38px] rounded-lg transition-colors whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:outline-none ${
                  selectedCategory === cat.id
                    ? 'bg-white dark:bg-neutral-800 text-[#0A0A0A] dark:text-white shadow-xs font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards Grid with Enhanced Hover / Focus-Within Interactions */}
        <div
          role="region"
          aria-live="polite"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              className="project-card group relative flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 shadow-sm transition-all duration-200 ease-out hover:scale-102 focus-within:scale-102 hover:shadow-xl focus-within:shadow-xl dark:hover:shadow-[0_12px_28px_rgba(0,0,0,0.6)] dark:focus-within:shadow-[0_12px_28px_rgba(0,0,0,0.6)] hover:border-[#C8102E] focus-within:border-[#C8102E] dark:hover:border-[#FF3B56] dark:focus-within:border-[#FF3B56] motion-reduce:hover:scale-100 motion-reduce:focus-within:scale-100"
            >
              {/* Subtle Red Top Accent hairline that reveals on hover / focus */}
              <div
                aria-hidden="true"
                className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#C8102E] dark:via-[#FF3B56] to-transparent opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 rounded-t-2xl"
              />

              <div className="space-y-4">
                {/* Clean unboxed metadata with typographic separators */}
                <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                  <span className="text-[#C8102E] dark:text-[#FF3B56] font-semibold">{project.categoryLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{project.clientOrOrg}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-serif font-bold text-[#0A0A0A] dark:text-white group-hover:text-[#C8102E] dark:group-hover:text-[#FF3B56] transition-colors leading-snug">
                  {project.title}
                </h3>

                {/* Short description */}
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {project.shortDescription}
                </p>

                {/* Measurable Impact Highlight (Visible without needing hover) */}
                <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C8102E] dark:text-[#FF3B56] shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-xs text-neutral-800 dark:text-neutral-200 font-medium">
                    {project.measurableResult}
                  </span>
                </div>

                {/* Unboxed Tech List */}
                <div className="pt-2 text-xs text-neutral-500 dark:text-neutral-400 flex flex-wrap items-center gap-x-2 gap-y-1">
                  {project.technologies.slice(0, 4).map((tech, idx) => (
                    <span key={tech} className="inline-flex items-center">
                      <span className="text-neutral-700 dark:text-neutral-300 font-medium">{tech}</span>
                      {idx < Math.min(project.technologies.length, 4) - 1 && (
                        <span aria-hidden="true" className="ml-2 text-neutral-400">·</span>
                      )}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="text-neutral-400 font-mono">+{project.technologies.length - 4} más</span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-6 border-t border-neutral-100 dark:border-neutral-800/80">
                <button
                  type="button"
                  onClick={() => setActiveModalProject(project)}
                  aria-label={`Ver detalles técnicos y arquitectura de ${project.title}`}
                  className="w-full inline-flex items-center justify-between px-4 py-2.5 min-h-[44px] text-xs font-semibold rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-[#0A0A0A] dark:text-white transition-colors focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:outline-none"
                >
                  <span>Ver problema, solución y resultados</span>
                  <ArrowUpRight className="w-4 h-4 text-[#C8102E] dark:text-[#FF3B56]" aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Modal Detail View */}
        <ProjectDetailModal
          project={activeModalProject}
          onClose={() => setActiveModalProject(null)}
        />

        {/* GitHub Repositories Showcase (API + Fallback) */}
        <GitHubShowcase />

      </div>
    </section>
  );
};
