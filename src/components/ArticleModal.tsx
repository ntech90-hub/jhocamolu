import React, { useEffect, useRef } from 'react';
import { X, Calendar, Clock, Tag, ArrowLeft, Copy, Check } from 'lucide-react';
import { Article } from '../data/articles';
import { useA11yAnnouncer } from './A11yAnnouncer';

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const [copiedCode, setCopiedCode] = React.useState(false);
  const [readingProgress, setReadingProgress] = React.useState(0);
  const { announce } = useA11yAnnouncer();

  const handleContentScroll = () => {
    if (contentContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentContainerRef.current;
      const total = scrollHeight - clientHeight;
      if (total > 0) {
        setReadingProgress(Math.min(100, Math.max(0, (scrollTop / total) * 100)));
      }
    }
  };

  useEffect(() => {
    if (article) {
      setReadingProgress(0);
      previousFocusRef.current = document.activeElement as HTMLElement;
      setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 50);
      announce(`Abriendo artículo: ${article.title}`);

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
  }, [article, announce]);

  const handleClose = () => {
    onClose();
    announce('Lectura de artículo cerrada');
    setTimeout(() => {
      previousFocusRef.current?.focus();
    }, 50);
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedCode(true);
    announce('Enlace del artículo copiado al portapapeles');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (!article) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="article-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-xs"
    >
      <div
        className="fixed inset-0"
        aria-hidden="true"
        onClick={handleClose}
      />

      <article className="relative w-full max-w-3xl bg-white dark:bg-[#111111] border border-neutral-300 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-6 z-10 max-h-[92vh] flex flex-col">
        
        {/* Reader Top Action Bar */}
        <div className="p-4 sm:p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-4 bg-white/95 dark:bg-[#111111]/95 sticky top-0 z-20 backdrop-blur-sm">
          <button
            ref={closeBtnRef}
            type="button"
            onClick={handleClose}
            aria-label="Volver al listado de artículos (tecla Escape)"
            className="inline-flex items-center gap-2 px-3 py-2 min-h-[44px] text-xs font-semibold rounded-lg text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:outline-none"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Volver al blog</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copyUrl}
              aria-label="Copiar enlace de este artículo"
              className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:outline-none"
            >
              {copiedCode ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Compartir</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleClose}
              aria-label="Cerrar artículo"
              className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:outline-none"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Modal Reading Progress Bar */}
          <div
            role="progressbar"
            aria-label="Progreso de lectura del artículo"
            aria-valuenow={Math.round(readingProgress)}
            aria-valuemin={0}
            aria-valuemax={100}
            className="absolute bottom-0 left-0 right-0 h-[3px] bg-neutral-200/50 dark:bg-neutral-800/50 pointer-events-none"
          >
            <div
              className="h-full bg-gradient-to-r from-[#C8102E] via-[#E02947] to-[#FF3B56] dark:from-[#FF3B56] dark:via-[#FF6B81] dark:to-[#FFA0B0] shadow-[0_0_8px_rgba(200,16,46,0.6)] dark:shadow-[0_0_10px_rgba(255,59,86,0.8)] transition-[width] duration-75 ease-out motion-reduce:transition-none"
              style={{ width: `${readingProgress}%` }}
            />
          </div>
        </div>

        {/* Scrollable Long-form Content */}
        <div
          ref={contentContainerRef}
          onScroll={handleContentScroll}
          className="p-6 sm:p-10 overflow-y-auto space-y-6"
        >
          
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
            <span className="text-[#C8102E] dark:text-[#FF3B56] font-semibold">{article.category}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{article.date}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{article.readTime}</span>
            </span>
          </div>

          {/* Title */}
          <h1
            id="article-modal-title"
            className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#0A0A0A] dark:text-white leading-tight"
            style={{ textWrap: 'balance' }}
          >
            {article.title}
          </h1>

          {/* Lead Excerpt */}
          <p className="text-base sm:text-lg text-neutral-700 dark:text-neutral-300 italic border-l-2 border-[#C8102E] dark:border-[#FF3B56] pl-4 py-1 leading-relaxed">
            {article.excerpt}
          </p>

          {/* Optional Hero Image */}
          {article.image && (
            <div className="w-full aspect-16/9 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
              <img
                src={article.image}
                alt={`Ilustración conceptual para ${article.title}`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          {/* Article Markdown Body */}
          <div className="prose prose-neutral dark:prose-invert max-w-none text-neutral-800 dark:text-neutral-200 text-base leading-[1.7] space-y-6 font-sans">
            {article.content.split('\n\n').map((paragraph, idx) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;

              if (trimmed.startsWith('### ')) {
                return (
                  <h3
                    key={idx}
                    className="text-xl sm:text-2xl font-serif font-bold text-[#0A0A0A] dark:text-white mt-8 mb-3"
                  >
                    {trimmed.replace('### ', '')}
                  </h3>
                );
              }

              if (trimmed.startsWith('#### ')) {
                return (
                  <h4
                    key={idx}
                    className="text-base sm:text-lg font-serif font-bold text-[#0A0A0A] dark:text-white mt-6 mb-2"
                  >
                    {trimmed.replace('#### ', '')}
                  </h4>
                );
              }

              if (trimmed.startsWith('```')) {
                const codeLines = trimmed.split('\n');
                const lang = codeLines[0].replace('```', '') || 'code';
                const codeContent = codeLines.slice(1, -1).join('\n');
                return (
                  <div key={idx} className="my-4 rounded-xl overflow-hidden border border-neutral-300 dark:border-neutral-800 bg-neutral-900 text-neutral-100 font-mono text-xs">
                    <div className="px-4 py-2 bg-neutral-950/90 border-b border-neutral-800 flex items-center justify-between text-neutral-400">
                      <span>{lang}</span>
                    </div>
                    <pre className="p-4 overflow-x-auto whitespace-pre leading-relaxed">
                      <code>{codeContent}</code>
                    </pre>
                  </div>
                );
              }

              if (trimmed.startsWith('- ')) {
                const items = trimmed.split('\n');
                return (
                  <ul key={idx} className="space-y-2 list-none my-4">
                    {items.map((it, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="text-[#C8102E] dark:text-[#FF3B56] font-bold mt-1" aria-hidden="true">•</span>
                        <span>{it.replace(/^- /, '')}</span>
                      </li>
                    ))}
                  </ul>
                );
              }

              if (trimmed.startsWith('1. ') || trimmed.startsWith('2. ')) {
                const items = trimmed.split('\n');
                return (
                  <ol key={idx} className="space-y-2 list-decimal list-inside my-4">
                    {items.map((it, i) => (
                      <li key={i} className="leading-relaxed">
                        <span>{it.replace(/^\d+\.\s*/, '')}</span>
                      </li>
                    ))}
                  </ol>
                );
              }

              return (
                <p key={idx} className="leading-relaxed text-neutral-700 dark:text-neutral-300">
                  {trimmed}
                </p>
              );
            })}
          </div>

          {/* Tags */}
          <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400 mb-3 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" aria-hidden="true" />
              Temas relacionados
            </h4>
            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
              {article.tags.map((tag, i) => (
                <React.Fragment key={tag}>
                  <span>#{tag}</span>
                  {i < article.tags.length - 1 && <span aria-hidden="true">·</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex justify-between items-center">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Por Jhonatan Camilo Moreno Luna
          </p>
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2.5 min-h-[44px] text-xs font-semibold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 transition-colors focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:outline-none"
          >
            Volver al listado
          </button>
        </div>

      </article>
    </div>
  );
};
