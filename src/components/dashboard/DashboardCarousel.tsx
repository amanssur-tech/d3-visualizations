// src/components/dashboard/DashboardCarousel.tsx
/**
 * DashboardCarousel
 * Extracted from Dashboard.tsx to keep the page lean.
 * Renders the horizontal featured case-study carousel with animations.
 */

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import CaseStudyPreview from './CaseStudyPreview';
import { Badge } from '../../ui/Badge';
import { Surface } from '../../ui/Surface';

import type { CaseStudyId } from './CaseStudyPreview';

interface CarouselProps {
  featured: {
    id: CaseStudyId;
    slug: string;
    path: string;
    titleKey: string;
    subtitleKey: string;
    descriptionKey: string;
    tags: string[];
  }[];
  translate: (key: string) => string;
}

const DashboardCarousel = ({ featured, translate }: CarouselProps) => {
  return (
    <div className="group relative -mx-4 overflow-x-auto px-4">
      <div className="flex min-w-full gap-4 pb-2 md:gap-6">
        {featured.map((study, index) => (
          <Link
            key={study.id}
            to={study.path}
            className="block flex-none focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
          >
            <Surface
              as={motion.div}
              variant="panel"
              padding="md"
              className="w-[310px] flex-none transition hover:-translate-y-1"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                    {translate(study.subtitleKey)}
                  </p>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {translate(study.titleKey)}
                  </h3>
                </div>
                <Badge variant="soft" size="xs">
                  {study.id}
                </Badge>
              </div>

              <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-300">
                {translate(study.descriptionKey)}
              </p>

              <div className="mt-4">
                <CaseStudyPreview id={study.id} />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {study.tags.map((tag) => (
                  <Badge key={`${study.slug}-${tag}`} size="xs">
                    {translate(`caseStudies:tags.${tag}`)}
                  </Badge>
                ))}
              </div>
            </Surface>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardCarousel;
