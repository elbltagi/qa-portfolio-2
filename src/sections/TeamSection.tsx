import React, { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../lib/gsap';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import type { TeamIntroductionData } from '../types';

interface TeamSectionProps {
  team: TeamIntroductionData;
}

export const TeamSection: React.FC<TeamSectionProps> = ({ team }) => {
  const [hoveredMemberId, setHoveredMemberId] = useState<string | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  const headingTitleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Desktop: Woonpact Signature Reveal Timeline
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        if (!sectionRef.current) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            end: 'top 35%',
            scrub: 1,
          },
        });

        // 1. Heading scales down, rotates counter-clockwise slightly (-2deg), and moves into position
        if (headingTitleRef.current) {
          tl.fromTo(
            headingTitleRef.current,
            { scale: 1.25, rotate: 2, transformOrigin: 'left bottom', opacity: 0.7 },
            { scale: 1, rotate: 0, opacity: 1, ease: 'power2.out' },
            0
          );
        }

        // 2. All 6 team portraits reveal together with expanding masks and subtle scale
        if (cardsContainerRef.current) {
          tl.fromTo(
            cardsContainerRef.current.children,
            { opacity: 0, y: 50, scale: 0.94, clipPath: 'inset(10% 0% 10% 0% round 24px)' },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              clipPath: 'inset(0% 0% 0% 0% round 24px)',
              stagger: 0.06,
              ease: 'power2.out',
            },
            0.15
          );
        }
      });

      // Mobile & Tablet: Lightweight responsive entrance
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        if (!sectionRef.current) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        });

        if (headerRef.current) {
          tl.fromTo(
            headerRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
          );
        }

        if (cardsContainerRef.current) {
          tl.fromTo(
            cardsContainerRef.current.children,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.08,
              ease: 'power2.out',
            },
            "-=0.4"
          );
        }
      });

      // Reduced motion fallback
      mm.add("(prefers-reduced-motion: reduce)", () => {
        if (headerRef.current) gsap.set(headerRef.current, { opacity: 1, y: 0 });
        if (headingTitleRef.current) gsap.set(headingTitleRef.current, { opacity: 1, scale: 1, rotate: 0 });
        if (cardsContainerRef.current) {
          gsap.set(cardsContainerRef.current.children, { opacity: 1, y: 0, scale: 1, clipPath: 'none' });
        }
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="team"
      className="section-padding bg-canvas bg-canvas-texture border-b border-canvas-border relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row md:items-end justify-between gap-5 section-header-spacing border-b border-canvas-border"
        >
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-tech text-xs tracking-widest uppercase text-accent font-bold">
                03 / Curators of Quality
              </span>
              <span className="text-ink-ghost">•</span>
              <span className="text-xs font-tech text-ink-subtle uppercase">
                6 Verified Trainees
              </span>
            </div>
            <h2
              ref={headingTitleRef}
              className="text-fluid-section-title font-display font-black text-ink uppercase"
            >
              The Team<span className="text-accent">.</span>
            </h2>
          </div>

          <div className="max-w-md space-y-2">
            <p className="text-ink-muted text-sm sm:text-base leading-relaxed font-light">
              {team.subtitle}
            </p>
            <div className="flex items-center gap-2 text-xs font-tech text-ink-subtle">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>Collaborative QA Execution for DEPI 2026</span>
            </div>
          </div>
        </div>

        {/* Prominent Editorial 3-Column Gallery (Large, Beautiful Portraits) */}
        <div
          ref={cardsContainerRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-12"
        >
          {team.members.map((member, index) => {
            const isHovered = hoveredMemberId === member.id;
            const isAnyHovered = hoveredMemberId !== null;

            return (
              <div
                key={member.id}
                onMouseEnter={() => setHoveredMemberId(member.id)}
                onMouseLeave={() => setHoveredMemberId(null)}
                className={`group relative rounded-3xl bg-canvas-surface border border-canvas-border p-4 sm:p-5 flex flex-col justify-between transition-all duration-500 cursor-pointer ${
                  isHovered
                    ? 'border-accent shadow-2xl -translate-y-2'
                    : isAnyHovered
                    ? 'opacity-65 scale-[0.99]'
                    : 'hover:border-accent/40 shadow-xs'
                }`}
              >
                {/* Large Editorial Portrait Frame */}
                <div className="relative aspect-[4/4.8] w-full rounded-2xl overflow-hidden bg-charcoal-900 mb-5 shadow-sm">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    loading="lazy"
                    style={{ objectPosition: member.objectPosition || '50% 25%' }}
                    className={`w-full h-full object-cover transition-all duration-700 ease-out ${
                      isHovered
                        ? 'scale-105 grayscale-0'
                        : 'grayscale contrast-105'
                    }`}
                  />

                  {/* Top Identifier Pill */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-ink/80 backdrop-blur-md text-canvas-surface text-xs font-tech flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    <span className="uppercase tracking-wider">Curator 0{index + 1}</span>
                  </div>

                  {/* Top Right Hover Arrow */}
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-canvas-surface/90 backdrop-blur-md text-ink flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm">
                    <ArrowUpRight className="w-4 h-4 text-accent" />
                  </div>
                </div>

                {/* Member Information (Always visible, prominent typography) */}
                <div className="space-y-2 px-1 pb-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-tech uppercase text-accent font-semibold tracking-wider">
                      {member.track}
                    </span>
                    <span className="text-xs font-tech text-ink-ghost font-bold">
                      {member.initials}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-display font-bold text-ink group-hover:text-accent transition-colors leading-snug">
                    {member.name}
                  </h3>

                  {/* Cobalt Blue Animated Line */}
                  <div
                    className={`h-[2px] rounded-full transition-all duration-400 ${
                      isHovered ? 'w-full bg-accent' : 'w-8 bg-canvas-muted'
                    }`}
                  />

                  <p className="text-xs text-ink-muted font-light pt-1">
                    Quality Assurance Contributor • Automation Test Store
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
