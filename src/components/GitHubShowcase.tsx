import React, { useState, useEffect } from 'react';
import { Star, GitFork, ArrowUpRight, FolderGit2, AlertCircle } from 'lucide-react';
import { SocialSvgIcon } from './SocialIcons';

interface Repository {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
}

// Fallback curated repositories if GitHub API is rate-limited or offline
const FALLBACK_REPOSITORIES: Repository[] = [
  {
    id: 101,
    name: 'historia-clinica-blazor-core',
    description: 'Motor genérico de formularios dinámicos médicos en Blazor WebAssembly y .NET 6 con arquitectura en capas.',
    html_url: 'https://github.com/jhocamolu/',
    language: 'C#',
    stargazers_count: 14,
    forks_count: 5,
    updated_at: '2026-08-15T00:00:00Z',
  },
  {
    id: 102,
    name: 'sqlserver-query-optimizer-scripts',
    description: 'Scripts avanzados de T-SQL, diagnóstico de Execution Plans, DMV y eliminación de deadlocks en salud.',
    html_url: 'https://github.com/jhocamolu/',
    language: 'T-SQL',
    stargazers_count: 22,
    forks_count: 8,
    updated_at: '2026-07-28T00:00:00Z',
  },
  {
    id: 103,
    name: 'ghestik-payroll-generator',
    description: 'Generador dinámico de procedimientos almacenados de nómina y módulo de auditoría con .NET y MongoDB.',
    html_url: 'https://github.com/jhocamolu/',
    language: 'C# / TypeScript',
    stargazers_count: 9,
    forks_count: 3,
    updated_at: '2026-05-19T00:00:00Z',
  },
  {
    id: 104,
    name: 'sena-algoritmia-pensamiento-computacional',
    description: 'Guías didácticas, pruebas de escritorio y talleres de lógica de programación para aprendices SENA.',
    html_url: 'https://github.com/jhocamolu/',
    language: 'JavaScript / Pseudocódigo',
    stargazers_count: 18,
    forks_count: 12,
    updated_at: '2026-09-02T00:00:00Z',
  },
];

export const GitHubShowcase: React.FC = () => {
  const [repos, setRepos] = useState<Repository[]>(FALLBACK_REPOSITORIES);
  const [loading, setLoading] = useState<boolean>(true);
  const [isUsingFallback, setIsUsingFallback] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchRepos() {
      try {
        const res = await fetch('https://api.github.com/users/jhocamolu/repos?sort=updated&per_page=6', {
          headers: {
            Accept: 'application/vnd.github.v3+json',
          },
        });

        if (!res.ok) {
          throw new Error(`GitHub API HTTP ${res.status}`);
        }

        const data = await res.json();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setRepos(data);
          setIsUsingFallback(false);
        } else if (isMounted) {
          setIsUsingFallback(true);
        }
      } catch (err) {
        if (isMounted) {
          setIsUsingFallback(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchRepos();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="mt-16 pt-12 border-t border-neutral-200 dark:border-neutral-800 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#C8102E] dark:text-[#FF3B56]">
            <FolderGit2 className="w-4 h-4" aria-hidden="true" />
            <span>Código Abierto & Repositorios</span>
          </div>
          <h3 className="text-xl font-serif font-bold text-[#0A0A0A] dark:text-white mt-1">
            Actividad en GitHub (@jhocamolu)
          </h3>
        </div>

        <a
          href="https://github.com/jhocamolu/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Ver todos los repositorios en GitHub de Camilo, se abre en una pestaña nueva"
          className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 min-h-[44px] rounded-lg border border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-white text-neutral-800 dark:text-neutral-200 transition-colors focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:outline-none"
        >
          <SocialSvgIcon type="github" className="w-4 h-4" />
          <span>Ver perfil en GitHub</span>
          <ArrowUpRight className="w-4 h-4 text-[#C8102E] dark:text-[#FF3B56]" aria-hidden="true" />
        </a>
      </div>

      {isUsingFallback && !loading && (
        <div className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#C8102E] dark:text-[#FF3B56] shrink-0" aria-hidden="true" />
          <span>
            Mostrando selección destacada de repositorios (respaldo activo).
          </span>
        </div>
      )}

      {/* Grid of repositories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {repos.slice(0, 4).map((repo) => (
          <article
            key={repo.id}
            className="p-5 rounded-xl bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 hover:border-[#C8102E] dark:hover:border-[#FF3B56] transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-mono font-bold text-[#0A0A0A] dark:text-white truncate">
                  {repo.name}
                </h4>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Abrir repositorio ${repo.name} en GitHub en una pestaña nueva`}
                  className="p-1 text-neutral-400 hover:text-[#C8102E] dark:hover:text-[#FF3B56] transition-colors focus-visible:ring-2 focus-visible:ring-[#C8102E] rounded-xs"
                >
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>

              <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                {repo.description || 'Repositorio de software e ingeniería de Jhonatan Moreno.'}
              </p>
            </div>

            <div className="pt-4 mt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 font-mono">
              <span className="text-neutral-800 dark:text-neutral-200 font-medium">
                {repo.language || 'Software'}
              </span>

              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
                  <span className="tabular-nums">{repo.stargazers_count}</span>
                </span>
                <span className="flex items-center gap-1">
                  <GitFork className="w-3.5 h-3.5 text-neutral-400" aria-hidden="true" />
                  <span className="tabular-nums">{repo.forks_count}</span>
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

    </div>
  );
};
