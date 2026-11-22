import React, { useState, useEffect } from 'react';
import { 
  BookOpen, ChevronLeft, ChevronRight, X, Search, 
  Layers, Cpu, Database, Shield, Globe, Award, Sparkles, Check
} from 'lucide-react';
import { ABOUT_PAGES } from '../data/aboutPages';

export default function AboutModal({ isOpen, onClose }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Keyboard navigation (Arrow keys + Esc)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        setCurrentPage((prev) => Math.min(30, prev + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setCurrentPage((prev) => Math.max(1, prev - 1));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const activePageData = ABOUT_PAGES.find((p) => p.id === currentPage) || ABOUT_PAGES[0];

  // Helper to remove any literal asterisk characters from text
  const sanitize = (text) => {
    if (!text) return '';
    return text.replaceAll('*', '');
  };

  // Group pages by category for table of contents
  const categories = [
    { name: '1. Overview & Strategy', pages: ABOUT_PAGES.slice(0, 5) },
    { name: '2. Natural Language Processing', pages: ABOUT_PAGES.slice(5, 10) },
    { name: '3. Sentiment Analysis', pages: ABOUT_PAGES.slice(10, 15) },
    { name: '4. CRM & Escalation', pages: ABOUT_PAGES.slice(15, 20) },
    { name: '5. Tech Stack & Engineering', pages: ABOUT_PAGES.slice(20, 25) },
    { name: '6. Infrastructure & Deployment', pages: ABOUT_PAGES.slice(25, 30) },
  ];

  // Search filter
  const filteredPages = searchTerm.trim()
    ? ABOUT_PAGES.filter(
        (p) =>
          sanitize(p.title).toLowerCase().includes(searchTerm.toLowerCase()) ||
          sanitize(p.summary).toLowerCase().includes(searchTerm.toLowerCase()) ||
          sanitize(p.content).toLowerCase().includes(searchTerm.toLowerCase())
      )
    : null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 animate-fade-in">
      <div className="glass-panel w-full max-w-5xl h-[94vh] sm:h-[88vh] rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/80">
        {/* Top Header - Mobile friendly and spacious */}
        <div className="px-4 sm:px-6 py-3.5 glass-header border-b border-white/60 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-600/90 text-white flex items-center justify-center shadow-md shadow-blue-600/20 ring-1 ring-white/40 flex-shrink-0">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                  About SentiDesk
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] sm:text-[11px] font-mono font-semibold whitespace-nowrap">
                  Page {currentPage} of 30
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block">
                30-Page Reference Guide • Architecture, NLP, Sentiment &amp; Tech Stack
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Jump to page select (Visible on both mobile & desktop!) */}
            <div className="flex items-center glass-pill rounded-xl px-2 py-1 text-xs">
              <span className="text-slate-500 mr-1.5 font-medium hidden sm:inline">Jump:</span>
              <select
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value))}
                className="bg-transparent text-slate-800 font-bold text-xs focus:outline-none cursor-pointer pr-1"
                title="Select Page"
              >
                {ABOUT_PAGES.map((p) => (
                  <option key={p.id} value={p.id} className="bg-white text-slate-900">
                    P.{p.id}: {sanitize(p.title).substring(0, 20)}...
                  </option>
                ))}
              </select>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl glass-pill hover:bg-white text-slate-500 hover:text-slate-800 transition-colors"
              title="Close Guide (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content Area: Sidebar + Reader */}
        <div className="flex-1 flex overflow-hidden">
          {/* Table of Contents Sidebar (Desktop) */}
          <aside className="w-72 border-r border-white/60 bg-white/40 backdrop-blur-md hidden md:flex flex-col">
            {/* Search Bar */}
            <div className="p-3 border-b border-white/60">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search 30 pages..."
                  className="w-full glass-input text-slate-900 placeholder-slate-400 pl-8 pr-3 py-1.5 rounded-lg text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* TOC Page List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              {filteredPages ? (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 px-2 block mb-1">
                    Search Results ({filteredPages.length})
                  </span>
                  <div className="space-y-1">
                    {filteredPages.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setCurrentPage(p.id);
                          setSearchTerm('');
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-2 ${
                          currentPage === p.id
                            ? 'bg-blue-600 text-white font-semibold shadow-xs'
                            : 'hover:bg-white/60 text-slate-700'
                        }`}
                      >
                        <span className="font-mono text-[10px] opacity-75">#{p.id}</span>
                        <span className="truncate">{sanitize(p.title)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                categories.map((cat, idx) => (
                  <div key={idx} className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-2 block">
                      {cat.name}
                    </span>
                    <div className="space-y-0.5">
                      {cat.pages.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setCurrentPage(p.id)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all flex items-center justify-between ${
                            currentPage === p.id
                              ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-600/20'
                              : 'hover:bg-white/60 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="font-mono text-[10px] opacity-70">
                              {p.id.toString().padStart(2, '0')}
                            </span>
                            <span className="truncate">{sanitize(p.title)}</span>
                          </div>
                          {currentPage === p.id && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>

          {/* Reader Body */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-white/30 backdrop-blur-xs flex flex-col justify-between">
            <div className="max-w-3xl space-y-4 sm:space-y-5 animate-fade-in" key={activePageData.id}>
              {/* Category & Page Badge */}
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-full glass-pill text-blue-700 text-xs font-semibold">
                  {sanitize(activePageData.category)}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Documentation Page #{activePageData.id}
                </span>
              </div>

              {/* Title without any asterisks */}
              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {sanitize(activePageData.title)}
              </h2>

              {/* Summary Highlight Box */}
              <div className="p-3.5 sm:p-4 rounded-2xl glass-card border border-blue-200/50 bg-blue-50/40 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <strong>Overview:</strong> {sanitize(activePageData.summary)}
              </div>

              {/* Rendered Content - Completely free of any asterisks */}
              <div className="text-slate-800 text-xs sm:text-sm leading-relaxed space-y-4 pt-1">
                {sanitize(activePageData.content).trim().split('\n\n').map((paragraph, pIdx) => {
                  // Headings
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h4 key={pIdx} className="text-sm sm:text-base font-bold text-slate-900 pt-2 border-b border-white/60 pb-1">
                        {paragraph.replace('### ', '')}
                      </h4>
                    );
                  }

                  // Bullet lists
                  if (paragraph.includes('\n- ') || paragraph.startsWith('- ') || paragraph.includes('\n1. ')) {
                    const lines = paragraph.split('\n');
                    return (
                      <ul key={pIdx} className="space-y-2 pl-2">
                        {lines.map((line, lIdx) => {
                          const clean = line.replace(/^[-•\d.]\s*/, '')
                            .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 rounded bg-black/5 text-blue-700 font-mono text-xs border border-black/10">$1</code>');
                          return (
                            <li key={lIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                              <span dangerouslySetInnerHTML={{ __html: clean }} />
                            </li>
                          );
                        })}
                      </ul>
                    );
                  }

                  // Standard paragraph with code tags
                  const parsed = paragraph
                    .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 rounded bg-black/5 text-blue-700 font-mono text-xs border border-black/10">$1</code>');

                  return (
                    <p key={pIdx} className="text-xs sm:text-sm text-slate-700" dangerouslySetInnerHTML={{ __html: parsed }} />
                  );
                })}
              </div>
            </div>

            {/* Pagination Progress info */}
            <div className="mt-6 pt-3 border-t border-white/60 flex items-center justify-between text-xs text-slate-500">
              <span className="text-[11px] hidden sm:inline">
                Tip: Use <kbd className="px-1.5 py-0.5 rounded glass-pill font-mono text-[10px]">←</kbd> and <kbd className="px-1.5 py-0.5 rounded glass-pill font-mono text-[10px]">→</kbd> keys to flip pages
              </span>
              <span className="text-[11px] inline sm:hidden">
                Page {currentPage} of 30
              </span>
              <span className="font-mono text-xs font-semibold">
                {Math.round((currentPage / 30) * 100)}% Complete
              </span>
            </div>
          </main>
        </div>

        {/* Bottom Pagination Bar - Un-pinched on mobile */}
        <div className="px-3 sm:px-6 py-3 glass-header border-t border-white/60 flex items-center justify-between gap-2 sm:gap-4">
          {/* Previous Button */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 sm:px-4 py-2 rounded-xl glass-pill hover:bg-white disabled:opacity-30 disabled:pointer-events-none text-xs font-semibold text-slate-800 flex items-center gap-1 transition-all shadow-xs flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden xs:inline">Prev</span>
            <span className="hidden sm:inline">Page</span>
          </button>

          {/* Progress bar & indicator */}
          <div className="flex-1 max-w-md flex items-center gap-2 sm:gap-3 mx-2">
            <span className="text-[11px] sm:text-xs font-mono font-medium text-slate-600 whitespace-nowrap">
              {currentPage}/30
            </span>
            <div className="flex-1 bg-slate-200/70 h-2 rounded-full overflow-hidden p-0.5 border border-white/60">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300 shadow-xs"
                style={{ width: `${(currentPage / 30) * 100}%` }}
              />
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(30, prev + 1))}
            disabled={currentPage === 30}
            className="px-3 sm:px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-semibold flex items-center gap-1 transition-all shadow-md shadow-blue-600/20 ring-1 ring-white/30 flex-shrink-0"
          >
            <span className="hidden xs:inline">Next</span>
            <span className="hidden sm:inline">Page</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
