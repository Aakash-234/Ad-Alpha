import React from 'react';
import { OutputType as GeneratedCreativeOutput } from '../endpoints/generate-creative_POST.schema';
import { Badge } from './Badge';
import { Award, ImageIcon, TrendingUp } from 'lucide-react';
import styles from './CreativeCard.module.css';

interface CreativeCardProps {
  creative: GeneratedCreativeOutput;
  brandName?: string;
  regionalName?: string;
  className?: string;
}

export const CreativeCard: React.FC<CreativeCardProps> = ({ creative, brandName, regionalName, className }) => {
  const getScoreVariant = (score: number) => {
    if (score >= 90) return 'success';
    if (score >= 75) return 'default';
    if (score >= 60) return 'warning';
    return 'destructive';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Work';
  };

  return (
    <div className={`${styles.creativeCard} ${className || ''}`}>
      <div className={styles.creativeImageContainer}>
        {creative.imageUrl ? (
          <img
            src={creative.imageUrl}
            alt="Generated creative"
            className={styles.creativeImage}
            onError={(e) => {
              e.currentTarget.src = `https://picsum.photos/seed/${creative.id}/400/400`;
            }}
          />
        ) : (
          <div className={styles.creativeImagePlaceholder}>
            <ImageIcon size={32} />
            <span>Generating...</span>
          </div>
        )}
        <div className={styles.creativeOverlay}>
          <Badge variant={getScoreVariant(creative.matchScore || 0)} className={styles.matchScore}>
            <Award size={14} />
            {creative.matchScore || 0}% {getScoreLabel(creative.matchScore || 0)}
          </Badge>
        </div>
      </div>
      <div className={styles.creativeContent}>
        <div className={styles.creativeMeta}>
          <span className={styles.creativePlatform}>
            {creative.platform.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
          <span className={styles.creativeRegion}>{regionalName}</span>
        </div>
        {creative.copyText && (
          <p className={styles.creativeCopy}>"{creative.copyText}"</p>
        )}
        {creative.competitorInsights && (
          <div className={styles.competitorIndicator}>
            <TrendingUp size={14} />
            <span>Competitor-optimized</span>
          </div>
        )}
      </div>
    </div>
  );
};