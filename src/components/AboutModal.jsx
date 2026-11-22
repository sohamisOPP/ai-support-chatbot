import React, { useState, useEffect } from 'react';
import { 
  BookOpen, ChevronLeft, ChevronRight, X, Search
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
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6 animate-enter">
      <div className="bg-white w-full max-w-5xl h-[94vh] sm:h-[88vh] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Top Header */}
        <div className="px-4 sm:px-6 py-3 bg-white border-b border-slate-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-4 h-4 text-slate-200" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-semibold text-slate-900 truncate">
                  About Soham Chatbot
                </h3>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-mono font-medium border border-slate-200 whitespace-nowrap">
                  Page {currentPage} of 30
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block">
                30-page engineering guide • Architecture, NLP, sentiment telemetry, and CRM
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Jump to page select */}
            <div className="flex items-center rounded-lg px-2 py-1 text-xs border border-slate-200 bg-white">
              <span className="text-slate-500 mr-1.5 font-medium hidden sm:inline">Jump:</span>
              <select
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value))}
                className="bg-transparent text-slate-800 font-medium text-xs focus:outline-none cursor-pointer pr-1"
                title="Select page"
              >
                {ABOUT_PAGES.map((p) => (
                  <option key={p.id} value={p.id} className="bg-white text-slate-900">
                    P.{p.id}: {sanitize(p.title).substring(0, 22)}...
                  </option>
                ))}
              </select>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
              title="Close guide (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content Area: Sidebar + Reader */}
        <div className="flex-1 flex overflow-hidden">
          {/* Table of Contents Sidebar (Desktop) */}
          <aside className="w-68 border-r border-slate-200 bg-slate-50/70 hidden md:flex flex-col">
            {/* Search Bar */}
            <div className="p-3 border-b border-slate-200">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search 30 pages..."
                  className="w-full bg-white border border-slate-200 text-slate-900 placeholder-slate-400 pl-8 pr-2.5 py-1.5 rounded-md text-xs focus:outline-none focus:border-slate-900 transition-colors"
                />
              </div>
            </div>

            {/* TOC Page List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              {filteredPages ? (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 px-2 block mb-1">
                    Search results ({filteredPages.length})
                  </span>
                  <div className="space-y-0.5">
                    {filteredPages.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setCurrentPage(p.id);
                          setSearchTerm('');
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors flex items-center gap-2 ${
                          currentPage === p.id
                            ? 'bg-slate-900 text-white font-medium'
                            : 'hover:bg-slate-200/60 text-slate-700'
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
                          className={`w-full text-left px-2 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between ${
                            currentPage === p.id
                              ? 'bg-slate-900 text-white font-medium'
                              : 'hover:bg-slate-200/60 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="font-mono text-[10px] opacity-70">
                              {p.id.toString().padStart(2, '0')}
                            </span>
                            <span className="truncate">{sanitize(p.title)}</span>
                          </div>
                          {currentPage === p.id && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
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
          <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-white flex flex-col justify-between">
            <div className="max-w-3xl space-y-4 sm:space-y-5 animate-enter" key={activePageData.id}>
              {/* Category & Page Badge */}
              <div className="flex items-center justify-between gap-2">
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                  {sanitize(activePageData.category)}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Document #{activePageData.id}
                </span>
              </div>

              {/* Title without any asterisks */}
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {sanitize(activePageData.title)}
              </h2>

              {/* Summary Box */}
              <div className="p-3.5 sm:p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <span className="font-semibold text-slate-900">Summary: </span>
                {sanitize(activePageData.summary)}
              </div>

              {/* Rendered Content - Completely free of any asterisks */}
              <div className="text-slate-800 text-xs sm:text-sm leading-relaxed space-y-4 pt-1">
                {sanitize(activePageData.content).trim().split('\n\n').map((paragraph, pIdx) => {
                  // Headings
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h4 key={pIdx} className="text-sm sm:text-base font-semibold text-slate-900 pt-2 border-b border-slate-100 pb-1">
                        {paragraph.replace('### ', '')}
                      </h4>
                    );
                  }

                  // Bullet lists
                  if (paragraph.includes('\n- ') || paragraph.startsWith('- ') || paragraph.includes('\n1. ')) {
                    const lines = paragraph.split('\n');
                    return (
                      <ul key={pIdx} className="space-y-1.5 pl-1">
                        {lines.map((line, lIdx) => {
                          const clean = line.replace(/^[-•\d.]\s*/, '')
                            .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-900 font-mono text-xs border border-slate-200">$1</code>');
                          return (
                            <li key={lIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                              <span dangerouslySetInnerHTML={{ __html: clean }} />
                            </li>
                          );
                        })}
                      </ul>
                    );
                  }

                  // Standard paragraph with code tags
                  const parsed = paragraph
                    .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-900 font-mono text-xs border border-slate-200">$1</code>');

                  return (
                    <p key={pIdx} className="text-xs sm:text-sm text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: parsed }} />
                  );
                })}
              </div>
            </div>

            {/* Pagination Progress info */}
            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="text-[11px] hidden sm:inline">
                Navigation: use <kbd className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[10px] border border-slate-200">←</kbd> and <kbd className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[10px] border border-slate-200">→</kbd> to navigate pages
              </span>
              <span className="text-[11px] inline sm:hidden">
                Page {currentPage} of 30
              </span>
              <span className="font-mono text-xs font-medium tabular-nums">
                {Math.round((currentPage / 30) * 100)}% read
              </span>
            </div>
          </main>
        </div>

        {/* Bottom Pagination Bar */}
        <div className="px-4 sm:px-6 py-3 bg-white border-t border-slate-200 flex items-center justify-between gap-3">
          {/* Previous Button */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 sm:px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none text-xs font-medium text-slate-800 flex items-center gap-1 transition-colors flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Progress bar & indicator */}
          <div className="flex-1 max-w-xs flex items-center gap-2 sm:gap-3 mx-2">
            <span className="text-[11px] sm:text-xs font-mono font-medium text-slate-500 whitespace-nowrap tabular-nums">
              {currentPage}/30
            </span>
            <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-slate-900 rounded-full transition-all duration-200"
                style={{ width: `${(currentPage / 30) * 100}%` }}
              />
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(30, prev + 1))}
            disabled={currentPage === 30}
            className="px-3 sm:px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-medium flex items-center gap-1 transition-colors flex-shrink-0"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
