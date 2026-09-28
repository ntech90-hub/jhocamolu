import React, { useEffect, useRef } from 'react';
import { X, CheckCircle2, AlertCircle, Cpu, Building2, Calendar } from 'lucide-react';
import { Project } from '../data/projects';
import { useA11yAnnouncer } from './A11yAnnouncer';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const { announce } = useA11yAnnouncer();

  useEffect(() => {
    if (project) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      // Focus close button on open
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
      announce(`Mostrando detalles del proyecto: ${project.title}`);

      // Lock body scroll
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
  }, [project, announce]);

  const handleClose = () => {
    onClose();
    announce('Ventana modal de proyecto cerrada');
    setTimeout(() => {
      previousFocusRef.current?.focus();
    }, 50);
  };

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-xs"
    >
      <div
        className="fixed inset-0"
        aria-hidden="true"
        onClick={handleClose}
      />

      <div
        ref={modalContentRef}
        className="relative w-full max-w-3xl bg-white dark:bg-[#121212] border border-neutral-300 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-8 z-10 max-h-[90vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-neutral-500 dark:text-neutral-400 mb-1">
              <span className="text-[#C8102E] dark:text-[#FF3B56] font-semibold">{project.categoryLabel}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" aria-hidden="true" />
                {project.clientOrOrg}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                {project.period}
              </span>
            </div>
            <h3
              id="modal-project-title"
              className="text-xl sm:text-2xl font-serif font-bold text-[#0A0A0A] dark:text-white"
            >
              {project.title}
            </h3>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={handleClose}
            aria-label="Cerrar modal de detalles del proyecto (tecla Escape)"
            className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:outline-none"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          
          {/* Highlight Banner */}
          <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#C8102E] dark:text-[#FF3B56] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="font-semibold text-neutral-900 dark:text-white block">Resultado Clave Medible:</span>
              <span className="text-neutral-700 dark:text-neutral-300">{project.measurableResult}</span>
            </div>
          </div>

          {/* Problem */}
          <div className="space-y-2">
            <h4 className="text-base font-serif font-bold text-[#0A0A0A] dark:text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-500" aria-hidden="true" />
              El Desafío / Problema
            </h4>
            <p className="text-neutral-700 dark:text-neutral-300">{project.problem}</p>
          </div>

          {/* Solution */}
          <div className="space-y-2">
            <h4 className="text-base font-serif font-bold text-[#0A0A0A] dark:text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#C8102E] dark:text-[#FF3B56]" aria-hidden="true" />
              Solución Técnica y Arquitectura
            </h4>
            <p className="text-neutral-700 dark:text-neutral-300">{project.solution}</p>
          </div>

          {/* Results achieved */}
          <div className="space-y-2">
            <h4 className="text-base font-serif font-bold text-[#0A0A0A] dark:text-white">
              Logros e Impacto Obtenido
            </h4>
            <ul className="space-y-2">
              {project.results.map((res, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm">
                  <span className="text-[#C8102E] dark:text-[#FF3B56] font-bold" aria-hidden="true">✔</span>
                  <span>{res}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack Metadata without pills */}
          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400 mb-2">
              Stack Tecnológico Empleado
            </h4>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-800 dark:text-neutral-200 font-mono">
              {project.technologies.map((tech, idx) => (
                <React.Fragment key={tech}>
                  <span>{tech}</span>
                  {idx < project.technologies.length - 1 && <span aria-hidden="true" className="text-neutral-400">·</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2.5 min-h-[44px] text-sm font-semibold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 transition-colors focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:outline-none"
          >
            Cerrar detalle
          </button>
        </div>

      </div>
    </div>
  );
};
