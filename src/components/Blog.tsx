import React, { useState, useEffect } from 'react';
import { Search, Calendar, Clock, ArrowRight, BookOpen, X } from 'lucide-react';
import { ARTICLES_DATA, BLOG_CATEGORIES, Article } from '../data/articles';
import { ArticleModal } from './ArticleModal';
import { useA11yAnnouncer } from './A11yAnnouncer';

export const Blog: React.FC = () => {
  const [articlesList, setArticlesList] = useState<Article[]>(ARTICLES_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const { announce } = useA11yAnnouncer();

  // Load dynamically from MySQL API endpoint
  useEffect(() => {
    let isMounted = true;
    async function loadArticles() {
      try {
        const res = await fetch('/api/articulos');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data) && data.length > 0) {
            setArticlesList(data);
          }
        }
      } catch (err) {
        // Fallback already in place
      }
    }
    loadArticles();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredArticles = articlesList.filter((article) => {
    const matchesCategory =
      selectedCategory === 'Todas' || article.category === selectedCategory;
    
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === '' ||
      article.title.toLowerCase().includes(query) ||
      article.excerpt.toLowerCase().includes(query) ||
      article.tags.some((t) => t.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    announce(`Categoría de blog seleccionada: ${category}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
    announce('Búsqueda limpiada');
  };

  return (
    <section
      id="blog"
      aria-labelledby="blog-title"
      className="py-16 md:py-24 border-b border-neutral-200 dark:border-neutral-900"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs uppercase tracking-wider font-semibold text-[#C8102E] dark:text-[#FF3B56]">
              Pensamiento técnico & Docencia
            </p>
            <h2
              id="blog-title"
              className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#0A0A0A] dark:text-white tracking-tight"
            >
              Blog & Publicaciones
            </h2>
            <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
              Artículos técnicos sobre arquitectura de software, lecciones de rendimiento en bases de datos y metodologías para la formación de programadores.
            </p>
          </div>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800">
          
          {/* Search Field */}
          <div className="relative flex-1 max-w-md">
            <label htmlFor="blog-search" className="sr-only">
              Buscar artículos por título, tema o tecnología
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" aria-hidden="true" />
              <input
                id="blog-search"
                type="search"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Buscar por tema, tecnología (.NET, SQL, SENA)..."
                className="w-full pl-10 pr-9 py-2.5 min-h-[44px] text-xs sm:text-sm bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-[#0A0A0A] dark:text-white placeholder:text-neutral-400 focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Limpiar término de búsqueda"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-white rounded-md"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs */}
          <div
            role="tablist"
            aria-label="Filtrar por categoría de artículo"
            className="flex flex-wrap items-center gap-1.5 text-xs font-medium"
          >
            {BLOG_CATEGORIES.map((cat) => (
              <button
                key={cat}
                role="tab"
                type="button"
                aria-selected={selectedCategory === cat}
                onClick={() => handleCategoryClick(cat)}
                className={`px-3 py-2 min-h-[40px] rounded-lg transition-colors whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:outline-none ${
                  selectedCategory === cat
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold shadow-xs'
                    : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Cards Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/20">
            <BookOpen className="w-10 h-10 mx-auto text-neutral-400 mb-3" aria-hidden="true" />
            <h3 className="text-base font-serif font-semibold text-[#0A0A0A] dark:text-white">
              No se encontraron artículos
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
              No hay publicaciones que coincidan con &ldquo;{searchQuery}&rdquo; en la categoría seleccionada.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Todas');
              }}
              className="mt-4 px-4 py-2 min-h-[44px] text-xs font-semibold text-[#C8102E] dark:text-[#FF3B56] hover:underline"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                className="group flex flex-col justify-between bg-white dark:bg-neutral-900/40 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 overflow-hidden transition-all duration-200 shadow-xs hover:shadow-md"
              >
                {/* Optional Top Visual Asset */}
                {article.image && (
                  <div className="w-full aspect-16/9 overflow-hidden bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-800">
                    <img
                      src={article.image}
                      alt={`Miniatura de ${article.title}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
                    />
                  </div>
                )}

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Unboxed metadata line with typographic separators */}
                    <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                      <span className="text-[#C8102E] dark:text-[#FF3B56] font-semibold">{article.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{article.readTime}</span>
                      </span>
                    </div>

                    {/* Article Title */}
                    <h3 className="text-lg font-serif font-bold text-[#0A0A0A] dark:text-white group-hover:text-[#C8102E] dark:group-hover:text-[#FF3B56] transition-colors leading-snug">
                      <button
                        type="button"
                        onClick={() => setSelectedArticle(article)}
                        className="text-left w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8102E] rounded-xs"
                      >
                        {article.title}
                      </button>
                    </h3>

                    {/* Excerpt */}
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>

                  {/* Date & Read Trigger */}
                  <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs">
                    <span className="text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{article.date}</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => setSelectedArticle(article)}
                      aria-label={`Leer artículo completo: ${article.title}`}
                      className="inline-flex items-center gap-1 font-semibold text-[#C8102E] dark:text-[#FF3B56] hover:underline min-h-[44px] py-2 focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:outline-none rounded-xs"
                    >
                      <span>Leer artículo</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Long-form Article Modal Reader */}
        <ArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />

      </div>
    </section>
  );
};
