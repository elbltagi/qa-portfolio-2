import React, { useRef } from 'react';
import { ArrowDownRight, Compass, Calendar, ShieldCheck, Sparkles } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../lib/gsap';
import type { ProjectMeta } from '../types';

interface HeroSectionProps {
  meta: ProjectMeta;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ meta }) => {
  const containerRef = useRef<HTMLElement>(null);
  const headlineLine1Ref = useRef<HTMLDivElement>(null);
  const headlineLine2Ref = useRef<HTMLDivElement>(null);
  const curiosityCharsRef = useRef<HTMLSpanElement[]>([]);
  const metaBadgeRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaGroupRef = useRef<HTMLDivElement>(null);
  const footerNoticeRef = useRef<HTMLDivElement>(null);
  const primaryBtnRef = useRef<HTMLAnchorElement>(null);

  const curiosityWord = "CURIOSITY.";
  curiosityCharsRef.current = [];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Fluid, confident editorial entrance
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: 'power4.out' },
        });

        // 1. Top bar & status badge enter swiftly
        tl.fromTo(
          topBarRef.current,
          { opacity: 0, y: -12 },
          { opacity: 1, y: 0, duration: 0.6 }
        )
        .fromTo(
          metaBadgeRef.current,
          { opacity: 0, scale: 0.96, y: 10 },
          { opacity: 1, scale: 1, y: 0, duration: 0.5 },
          "-=0.4"
        );

        // 2. Headline masked lines reveal together with slight stagger (clearProps prevents Chrome subpixel transform clipping)
        tl.fromTo(
          [headlineLine1Ref.current, headlineLine2Ref.current],
          { yPercent: 115 },
          { yPercent: 0, duration: 0.85, stagger: 0.12, clearProps: 'transform' }
        );

        // 3. Staggered character reveal of "CURIOSITY."
        if (curiosityCharsRef.current.length > 0) {
          tl.fromTo(
            curiosityCharsRef.current,
            { yPercent: 115, opacity: 0, rotate: 3 },
            {
              yPercent: 0,
              opacity: 1,
              rotate: 0,
              duration: 0.65,
              stagger: 0.03,
              ease: 'power3.out',
              clearProps: 'transform',
            },
            "-=0.55"
          );
        }

        // 4. Description, CTAs, and notice enter smoothly
        tl.fromTo(
          descRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.4"
        )
        .fromTo(
          ctaGroupRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.4"
        )
        .fromTo(
          footerNoticeRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.5 },
          "-=0.3"
        );
      });

      // Reduced motion fallback
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          [
            topBarRef.current,
            metaBadgeRef.current,
            headlineLine1Ref.current,
            headlineLine2Ref.current,
            curiosityCharsRef.current,
            descRef.current,
            ctaGroupRef.current,
            footerNoticeRef.current,
          ],
          { opacity: 1, yPercent: 0, y: 0, scale: 1, rotate: 0 }
        );
      });

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  // Magnetic interaction on desktop pointer
  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!primaryBtnRef.current || window.matchMedia('(pointer: coarse)').matches) return;
    const rect = primaryBtnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(primaryBtnRef.current, {
      x: x * 0.18,
      y: y * 0.18,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    if (!primaryBtnRef.current) return;
    gsap.to(primaryBtnRef.current, {
      x: 0,
      y: 0,
      duration: 0.45,
      ease: 'elastic.out(1, 0.4)',
    });
  };

  return (
    <section
      ref={containerRef}
      id="project-name"
      className="relative min-h-[70vh] lg:min-h-[74vh] 2xl:min-h-[82vh] pt-18 sm:pt-20 lg:pt-22 pb-7 sm:pb-9 flex flex-col justify-between bg-canvas bg-canvas-texture border-b border-canvas-border overflow-hidden"
    >
      {/* Decorative architectural grid lines */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 xl:px-12 grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-4">
          <div className="border-r border-ink/5 h-full" />
          <div className="border-r border-ink/5 h-full hidden sm:block" />
          <div className="border-r border-ink/5 h-full hidden lg:block" />
          <div className="border-r border-ink/5 h-full hidden lg:block" />
          <div className="border-r border-ink/5 h-full hidden lg:block" />
          <div className="border-r border-ink/5 h-full hidden lg:block" />
          <div className="border-r border-ink/5 h-full hidden lg:block" />
          <div className="border-r border-ink/5 h-full hidden lg:block" />
          <div className="border-r border-ink/5 h-full hidden sm:block" />
          <div className="border-r border-ink/5 h-full" />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 w-full flex-1 flex flex-col justify-between">
        {/* Top Metadata Row */}
        <div
          ref={topBarRef}
          className="flex flex-wrap items-center justify-between gap-3 pt-1 pb-3 sm:pb-4 border-b border-canvas-border"
        >
          <div className="flex items-center gap-3">
            <span className="font-tech text-xs tracking-widest uppercase bg-ink text-canvas-surface px-2.5 py-1 rounded-sm">
              EXHIBITION 01 / V2
            </span>
            <span className="text-xs font-semibold tracking-wider uppercase text-ink-muted">
              {meta.initiative}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-5 text-[11px] sm:text-xs text-ink-muted font-tech">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />
              <span>{meta.track}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-accent" />
              <span>Duration: {meta.duration}</span>
            </div>
          </div>
        </div>

        {/* Hero Editorial Headline - Balanced Fluid Typography Scale */}
        <div className="my-auto py-3 sm:py-5 lg:py-6">
          <div
            ref={metaBadgeRef}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-canvas-muted border border-canvas-border text-xs font-tech text-ink mb-3 sm:mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span className="font-semibold uppercase tracking-wider">{meta.status}</span>
            <span className="text-ink-ghost">•</span>
            <span>Proposed 9-Week Horizon</span>
          </div>

          {/* Masked Headline Lines with balanced fluid typography */}
          <h1 className="text-fluid-hero font-display font-black tracking-tighter text-ink uppercase mb-3.5 sm:mb-5">
            <span className="overflow-clip-mask block">
              <span ref={headlineLine1Ref} className="block text-ink">
                Quality
              </span>
            </span>
            <span className="overflow-clip-mask block">
              <span ref={headlineLine2Ref} className="block text-ink">
                Starts with
              </span>
            </span>
            <span className="overflow-clip-mask block text-accent font-display">
              <span className="inline-flex flex-wrap text-[#315BFA]">
                {curiosityWord.split('').map((char, i) => (
                  <span
                    key={i}
                    ref={(el) => {
                      if (el) curiosityCharsRef.current[i] = el;
                    }}
                    className="inline-block text-[#315BFA]"
                  >
                    {char}
                  </span>
                ))}
              </span>
            </span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-end">
            <div className="lg:col-span-7">
              <p ref={descRef} className="text-sm sm:text-base md:text-base lg:text-lg text-ink-muted font-light leading-relaxed max-w-2xl">
                Exploring software quality through our DEPI graduation project. Our team plans to systematically evaluate{' '}
                <strong className="font-semibold text-ink">{meta.name}</strong> through structured test engineering across 9 rigorous weeks.
              </p>
            </div>

            <div
              ref={ctaGroupRef}
              className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center lg:items-stretch xl:items-center gap-2.5 sm:gap-3 w-full"
            >
              <a
                ref={primaryBtnRef}
                href="#overview"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="group relative inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-ink text-white font-medium text-xs sm:text-sm hover:bg-accent transition-colors duration-300 shadow-sm hover:shadow-md text-center"
              >
                <Compass className="w-4 h-4 text-accent group-hover:text-white transition-colors" />
                <span className="tracking-wide">Explore the Project</span>
                <ArrowDownRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
              </a>

              <a
                href="#user-stories"
                className="inline-flex items-center justify-center gap-2 px-4.5 sm:px-5 py-2.5 sm:py-3 rounded-full border border-canvas-border text-ink text-xs sm:text-sm font-medium hover:bg-canvas-muted transition-colors text-center"
              >
                <span>View Proposed Stories</span>
                <span className="text-xs font-tech text-ink-subtle">→</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Planning Notice */}
        <div
          ref={footerNoticeRef}
          className="pt-4 sm:pt-5 border-t border-canvas-border flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-3 text-xs font-tech text-ink-muted"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
            <span className="font-semibold text-ink shrink-0">PROPOSAL NOTICE:</span>
            <span className="leading-relaxed">{meta.testingStatusNotice}</span>
          </div>

          <div className="text-ink-subtle shrink-0">
            Target Application: <span className="text-ink underline font-medium">{meta.liveAppUrl}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
