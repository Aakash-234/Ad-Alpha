import React from 'react';
import { Selectable } from 'kysely';
import { Brands } from '../helpers/schema';
import { Skeleton } from './Skeleton';
import { AlertTriangle, Info, ImageIcon } from 'lucide-react';
import styles from './BrandSelector.module.css';

const BrandCardSkeleton = () => (
  <div className={styles.brandCard}>
    <Skeleton style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)' }} />
    <div style={{ flex: 1 }}>
      <Skeleton style={{ width: '80%', height: '1.2rem', marginBottom: 'var(--spacing-2)' }} />
      <Skeleton style={{ width: '60%', height: '0.8rem' }} />
    </div>
  </div>
);

interface BrandSelectorProps {
  brands: Selectable<Brands>[] | undefined;
  isLoading: boolean;
  error: Error | null;
  selectedBrandId: string | null;
  onSelectBrand: (id: string) => void;
  className?: string;
}

export const BrandSelector: React.FC<BrandSelectorProps> = ({
  brands,
  isLoading,
  error,
  selectedBrandId,
  onSelectBrand,
  className,
}) => {
  if (isLoading) {
    return (
      <div className={`${styles.brandGrid} ${className || ''}`}>
        {Array.from({ length: 3 }).map((_, i) => <BrandCardSkeleton key={i} />)}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.errorState} ${className || ''}`}>
        <AlertTriangle /> Failed to load brands.
      </div>
    );
  }

  if (!brands || brands.length === 0) {
    return (
      <div className={`${styles.emptyState} ${className || ''}`}>
        <Info /> No brands found. Please set up a brand first.
      </div>
    );
  }

  return (
    <div className={`${styles.brandGrid} ${className || ''}`}>
      {brands.map((brand) => (
        <button
          key={brand.id}
          className={`${styles.brandCard} ${selectedBrandId === brand.id ? styles.selected : ''}`}
          onClick={() => onSelectBrand(brand.id)}
        >
          {brand.logoUrl ? (
            <img src={brand.logoUrl} alt={`${brand.name} logo`} className={styles.brandLogo} />
          ) : (
            <div className={styles.brandLogoPlaceholder}><ImageIcon /></div>
          )}
          <span className={styles.brandName}>{brand.name}</span>
        </button>
      ))}
    </div>
  );
};