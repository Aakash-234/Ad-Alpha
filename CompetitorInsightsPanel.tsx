import React from 'react';
import { OutputType as GeneratedCreativeOutput } from '../endpoints/generate-creative_POST.schema';
import { Badge } from './Badge';
import { Target, Palette, MessageSquare, TrendingUp, Award, ImageIcon } from 'lucide-react';
import styles from './CompetitorInsightsPanel.module.css';

interface CompetitorInsightsPanelProps {
  insights: GeneratedCreativeOutput['competitorInsights'];
  className?: string;
}

export const CompetitorInsightsPanel: React.FC<CompetitorInsightsPanelProps> = ({ insights, className }) => {
  if (!insights) {
    return (
      <div className={`${styles.emptyState} ${className || ''}`}>
        <Target size={48} className={styles.emptyIcon} />
        <h3 className={styles.emptyTitle}>No competitor analysis available</h3>
        <p className={styles.emptyText}>Generate a creative to see competitor insights and analysis.</p>
      </div>
    );
  }

  return (
    <div className={`${styles.insightsPanel} ${className || ''}`}>
      <div className={styles.insightCard}>
        <div className={styles.insightHeader}>
          <Palette className={styles.insightIcon} />
          <h3 className={styles.insightTitle}>Color Trends</h3>
        </div>
        <div className={styles.colorTrends}>
          {insights.analysis.colorPalette.map((color, index) => (
            <div key={index} className={styles.colorTrendItem}>
              <div
                className={styles.colorSwatch}
                style={{ backgroundColor: color }}
                title={color}
              />
              <span className={styles.colorValue}>{color}</span>
            </div>
          ))}
        </div>
        <p className={styles.insightDescription}>
          These colors are trending in competitor creatives and can improve engagement.
        </p>
      </div>

      <div className={styles.insightCard}>
        <div className={styles.insightHeader}>
          <MessageSquare className={styles.insightIcon} />
          <h3 className={styles.insightTitle}>Copy Strategy</h3>
        </div>
        <Badge variant="secondary" className={styles.copyToneBadge}>
          {insights.analysis.copyTone}
        </Badge>
        <p className={styles.insightDescription}>
          {insights.analysis.copyTone === 'emotional'
            ? 'Competitors are using emotional appeals to connect with audiences.'
            : insights.analysis.copyTone === 'direct'
            ? 'Successful competitors use direct, clear messaging with strong calls-to-action.'
            : insights.analysis.copyTone === 'playful'
            ? 'Top performers use playful, engaging copy that resonates with the target demographic.'
            : 'Competitor copy analysis indicates this tone performs well in this market.'}
        </p>
      </div>

      <div className={styles.insightCard}>
        <div className={styles.insightHeader}>
          <Target className={styles.insightIcon} />
          <h3 className={styles.insightTitle}>Regional Preferences</h3>
        </div>
        <p className={styles.regionalInsight}>
          {insights.analysis.regionalPreferences}
        </p>
      </div>

      <div className={styles.insightCard}>
        <div className={styles.insightHeader}>
          <TrendingUp className={styles.insightIcon} />
          <h3 className={styles.insightTitle}>Platform Optimizations</h3>
        </div>
        <div className={styles.optimizationList}>
          {Object.entries(insights.actionableRecommendations.platformOptimizations).flatMap(([platform, optimizations]) =>
            optimizations.map((optimization: string, index: number) => (
              <Badge key={`${platform}-${index}`} variant="outline" className={styles.optimizationBadge}>
                <span className={styles.platformLabel}>{platform}:</span> {optimization}
              </Badge>
            ))
          )}
        </div>
      </div>

      <div className={styles.insightCard}>
        <div className={styles.insightHeader}>
          <Award className={styles.insightIcon} />
          <h3 className={styles.insightTitle}>Success Metrics</h3>
        </div>
        <p className={styles.insightDescription}>
          {insights.analysis.successMetrics}
        </p>
      </div>

      {insights.analysis.sampleAds && insights.analysis.sampleAds.length > 0 && (
        <div className={styles.insightCard}>
          <div className={styles.insightHeader}>
            <ImageIcon className={styles.insightIcon} />
            <h3 className={styles.insightTitle}>Competitor Examples</h3>
          </div>
          <div className={styles.sampleAds}>
            {insights.analysis.sampleAds.slice(0, 3).map((ad, index) => (
              <div key={index} className={styles.sampleAd}>
                <img
                  src={ad.imageUrl}
                  alt={`Competitor ad ${index + 1}`}
                  className={styles.sampleAdImage}
                  onError={(e) => {
                    e.currentTarget.src = `https://picsum.photos/seed/competitor-${index}/200/200`;
                  }}
                />
                <div className={styles.sampleAdMeta}>
                  <Badge variant="success" size="sm">
                    {ad.engagement}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};