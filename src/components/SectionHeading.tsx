import React from 'react';
import { Reveal } from './Reveal';
import { BlurTextReveal } from './BlurTextReveal';
import { Parallax, ScrollLine } from './Parallax';

interface SectionHeadingProps {
  /** Two-digit chapter number, e.g. "05". */
  index: string;
  /** Small uppercase kicker beside the chapter number. */
  eyebrow: string;
  /** Large display title. A trailing period is appended in accent colour. */
  title: string;
  /** Optional supporting paragraph shown on the right. */
  description?: React.ReactNode;
  /** Optional node rendered under the description. */
  aside?: React.ReactNode;
  /** Render light-on-dark for inverted sections. */
  tone?: 'light' | 'dark';
}

/**
 * The shared editorial section header: chapter rule, oversized title on the
 * left, supporting copy on the right. Keeps every chapter on the same grid.
 */
export const SectionHeading: React.FC<SectionHeadingProps> = ({
  index,
  eyebrow,
  title,
  description,
  aside,
  tone = 'light',
}) => {
  const isDark = tone === 'dark';

  return (
    <div className="section-header-spacing">
      <Reveal>
        <div className="pb-5 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-tech text-[11px] tracking-ultra uppercase text-accent">
              {index}
            </span>
            <span
              className={`h-px flex-1 max-w-[40px] ${
                isDark ? 'bg-white/20' : 'bg-ink/15'
              }`}
            />
            <span
              className={`font-tech text-[11px] tracking-widest uppercase ${
                isDark ? 'text-white/55' : 'text-ink-subtle'
              }`}
            >
              {eyebrow}
            </span>
          </div>
          {/* Draws itself across as the chapter scrolls into place. */}
          <ScrollLine tone={tone} />
        </div>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-end">
        <BlurTextReveal
          as="h2"
          text={title}
          accentSuffix="."
          tone={tone}
          className={`lg:col-span-6 text-fluid-section-title font-display font-black uppercase tracking-tight ${
            isDark ? 'text-white' : 'text-ink'
          }`}
        />

        {(description || aside) && (
          <Parallax className="lg:col-span-6 lg:pb-1" distance={18}>
            <Reveal delay={0.12}>
              {description && (
                <p
                  className={`text-fluid-body font-light leading-relaxed max-w-xl ${
                    isDark ? 'text-white/65' : 'text-ink-muted'
                  }`}
                >
                  {description}
                </p>
              )}
              {aside && <div className="mt-4">{aside}</div>}
            </Reveal>
          </Parallax>
        )}
      </div>
    </div>
  );
};
