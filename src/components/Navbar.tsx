import React, { useState, useEffect } from 'react';
import { Menu, X, ExternalLink } from 'lucide-react';

interface NavbarProps {
  targetUrl: string;
}

export const Navbar: React.FC<NavbarProps> = ({ targetUrl }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('project-name');

  const navLinks = [
    { label: '01. Vision', id: 'project-name', href: '#project-name' },
    { label: '02. Mission', id: 'overview', href: '#overview' },
    { label: '03. Curators', id: 'team', href: '#team' },
    { label: '04. Stories', id: 'user-stories', href: '#user-stories' },
    { label: '05. Strategy', id: 'testing-types', href: '#testing-types' },
    { label: '06. Activities', id: 'testing-activities', href: '#testing-activities' },
    { label: '07. Levels', id: 'test-levels', href: '#test-levels' },
    { label: '08. Timeline', id: 'timeline', href: '#timeline' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 35);

      // Scroll-spy active section detection
      const scrollPosition = window.scrollY + 180;
      for (let i = navLinks.length - 1; i >= 0; i--) {
        const sectionEl = document.getElementById(navLinks[i].id);
        if (sectionEl) {
          const top = sectionEl.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(navLinks[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open & handle Escape key
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-canvas/92 backdrop-blur-md border-b border-canvas-border py-2.5 sm:py-3 shadow-xs'
            : 'bg-transparent py-3.5 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo / Brand mark */}
          <a
            href="#project-name"
            className="group flex items-center gap-2.5 sm:gap-3 focus:outline-hidden shrink-0"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-ink text-canvas-surface flex items-center justify-center font-display font-bold text-xs sm:text-sm tracking-tighter group-hover:bg-accent transition-colors duration-300">
              Q
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-[11px] sm:text-xs tracking-widest uppercase text-ink">
                The Quality Journey
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-wider text-ink-subtle uppercase font-tech">
                DEPI '26 / Software Testing
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links with animated hover line & active highlight */}
          <nav className="hidden xl:flex items-center gap-2 xl:gap-2.5 2xl:gap-4">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`text-[10.5px] 2xl:text-xs uppercase tracking-wider relative py-1 transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'text-accent font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-accent'
                      : 'text-ink-muted font-medium hover:text-accent after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-accent hover:after:w-full after:transition-all after:duration-300'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right Action */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full bg-ink text-white hover:bg-accent transition-colors tracking-wide shadow-xs hover:shadow-md"
            >
              <span>Test Store</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            className="xl:hidden p-2 rounded-lg text-ink hover:bg-canvas-muted transition-colors focus:outline-hidden focus:ring-2 focus:ring-accent"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="fixed inset-0 z-40 bg-canvas/98 backdrop-blur-lg pt-24 px-6 sm:px-8 pb-8 flex flex-col justify-between overflow-y-auto xl:hidden animate-in fade-in duration-200"
        >
          <nav className="flex flex-col space-y-4">
            <span className="text-[11px] font-tech tracking-widest uppercase text-ink-ghost mb-2">
              Exhibition Navigation
            </span>
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-2xl font-display font-semibold transition-colors py-1 border-b border-canvas-border flex items-center justify-between ${
                    isActive ? 'text-accent font-bold' : 'text-ink hover:text-accent'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {isActive && <span className="w-2 h-2 rounded-full bg-accent inline-block" />}
                    <span>{link.label}</span>
                  </span>
                  <span className="text-sm font-tech text-accent">→</span>
                </a>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-canvas-border flex flex-col gap-4">
            <div className="flex items-center justify-between text-xs font-tech text-ink-muted">
              <span className="font-semibold text-ink">Graduation Project V2</span>
              <span>DEPI 2026</span>
            </div>
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-ink text-white rounded-xl font-medium text-sm hover:bg-accent transition-colors"
            >
              <span>Visit Automation Test Store</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </>
  );
};
