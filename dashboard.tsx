import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useGetBrands } from '../helpers/brandsApi';
import { useGetRegionalProfiles } from '../helpers/regionalsApi';
import { useGenerateCreative } from '../helpers/creativesApi';
import { useCreatives } from '../helpers/useCreatives';
import { useAnalyzeCompetitors } from '../helpers/competitorsApi';
import { useUploadManualCreative } from '../helpers/useUploadManualCreative';
import { Selectable } from 'kysely';
import { Brands, RegionalProfiles, PlatformType } from '../helpers/schema';
import { BrandSelector } from '../components/BrandSelector';
import { GenerationConfigurator } from '../components/GenerationConfigurator';
import { CreativeCard } from '../components/CreativeCard';
import { CompetitorInsightsPanel } from '../components/CompetitorInsightsPanel';
import { Skeleton } from '../components/Skeleton';
import { Spinner } from '../components/Spinner';
import { Button } from '../components/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/Tabs';
import { Badge } from '../components/Badge';
import { ManualCreativeUpload } from '../components/ManualCreativeUpload';
import { Bot, Info, Sparkles, TrendingUp } from 'lucide-react';
import { OutputType as GeneratedCreativeOutput } from '../endpoints/generate-creative_POST.schema';
import { useQueryClient } from '@tanstack/react-query';
import { OutputType as CompetitorAnalysisOutput } from '../endpoints/analyze-competitors_POST.schema';
import styles from './dashboard.module.css';

const CreativeCardSkeleton = () => (
  <div className={styles.creativeCard}>
    <Skeleton style={{ aspectRatio: '1 / 1', width: '100%', marginBottom: 'var(--spacing-3)' }} />
    <Skeleton style={{ width: '90%', height: '1rem', marginBottom: 'var(--spacing-2)' }} />
    <Skeleton style={{ width: '50%', height: '1rem' }} />
  </div>
);

const DashboardPage = () => {
  const queryClient = useQueryClient();
  const { data: brands, isLoading: isLoadingBrands, error: brandsError } = useGetBrands();
  const { data: regionalProfiles, isLoading: isLoadingRegionalProfiles, error: regionalProfilesError } = useGetRegionalProfiles();
  const generateCreative = useGenerateCreative();
  const analyzeCompetitors = useAnalyzeCompetitors();

  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [selectedRegionalProfileId, setSelectedRegionalProfileId] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>('instagram_post');
  const [standaloneCompetitorInsights, setStandaloneCompetitorInsights] = useState<CompetitorAnalysisOutput | null>(null);

  // Fetch creatives for the selected brand
  const { 
    data: allCreatives = [], 
    isLoading: isLoadingCreatives, 
    error: creativesError 
  } = useCreatives({
    brandId: selectedBrandId || undefined,
    platform: selectedPlatform,
  });


  const selectedBrand = useMemo(() => {
    return brands?.find(b => b.id === selectedBrandId);
  }, [brands, selectedBrandId]);

  const selectedRegionalProfile = useMemo(() => {
    return regionalProfiles?.find(rp => rp.id === selectedRegionalProfileId);
  }, [regionalProfiles, selectedRegionalProfileId]);

  const latestCompetitorInsights = useMemo(() => {
    // Find the most recent AI-generated creative (non-manual upload)
    const aiCreatives = allCreatives.filter(creative => !creative.isManualUpload);
    const latestAiCreative = aiCreatives[aiCreatives.length - 1];
    // Note: Manual uploads don't have competitor insights, so we only look at AI-generated ones
    return latestAiCreative ? null : null; // Competitor insights are embedded in generate response but not stored in DB
  }, [allCreatives]);

  const displayedCompetitorInsights = useMemo(() => {
    return standaloneCompetitorInsights || latestCompetitorInsights;
  }, [standaloneCompetitorInsights, latestCompetitorInsights]);

  const handleGenerate = () => {
    if (selectedBrandId && selectedRegionalProfileId && selectedPlatform) {
      generateCreative.mutate({
        brandId: selectedBrandId,
        regionalProfileId: selectedRegionalProfileId,
        platform: selectedPlatform,
      }, {
        onSuccess: (newCreative) => {
          // Invalidate the creatives query to refresh the list
          queryClient.invalidateQueries({ queryKey: ['creatives'] });
        }
      });
    }
  };

  const handleAnalyzeCompetitors = () => {
    if (selectedBrand && selectedRegionalProfile) {
      // Use brand name as category for now - in a real app, you might have a separate category field
      const brandCategory = selectedBrand.name;
      const region = selectedRegionalProfile.name;
      
      analyzeCompetitors.mutate({
        brandCategory,
        region,
      }, {
        onSuccess: (insights) => {
          setStandaloneCompetitorInsights(insights);
        }
      });
    }
  };



  return (
    <>
      <Helmet>
        <title>Dashboard | Floot</title>
        <meta name="description" content="Generate and manage your ad creatives." />
      </Helmet>
      <div className={styles.pageContainer}>
        <div className={styles.header}>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Select a brand and region to start generating creatives.</p>
        </div>

        <div className={styles.contentGrid}>
          <aside className={styles.sidebar}>
            <section className={styles.sidebarSection}>
              <div className={styles.stepHeader}>
                <div className={`${styles.stepNumber} ${selectedBrandId ? styles.stepCompleted : styles.stepActive}`}>1</div>
                <h2 className={styles.sectionTitle}>Select Brand</h2>
              </div>
              {!selectedBrandId && (
                <p className={styles.stepHint}>Choose a brand to get started with creative generation</p>
              )}
              <BrandSelector
                brands={brands}
                isLoading={isLoadingBrands}
                error={brandsError}
                selectedBrandId={selectedBrandId}
                onSelectBrand={setSelectedBrandId}
              />
            </section>

            <section className={styles.sidebarSection}>
              <div className={styles.stepHeader}>
                <div className={`${styles.stepNumber} ${!selectedBrandId ? styles.stepDisabled : (selectedRegionalProfileId && selectedPlatform) ? styles.stepCompleted : styles.stepActive}`}>2</div>
                <h2 className={styles.sectionTitle}>Configure Generation</h2>
              </div>
              {!selectedBrandId && (
                <p className={styles.stepHint}>Select a brand first to configure generation settings</p>
              )}
              <GenerationConfigurator
                regionalProfiles={regionalProfiles}
                isLoadingRegionalProfiles={isLoadingRegionalProfiles}
                selectedRegionalProfileId={selectedRegionalProfileId}
                onSelectRegionalProfile={setSelectedRegionalProfileId}
                selectedPlatform={selectedPlatform}
                onSelectPlatform={setSelectedPlatform}
                isBrandSelected={!!selectedBrandId}
              />
            </section>

            <section className={styles.sidebarSection}>
              <div className={styles.stepHeader}>
                <div className={`${styles.stepNumber} ${(!selectedBrandId || !selectedRegionalProfileId) ? styles.stepDisabled : styles.stepActive}`}>3</div>
                <h2 className={styles.sectionTitle}>Generate</h2>
              </div>
              {(!selectedBrandId || !selectedRegionalProfileId) && (
                <p className={styles.stepHint}>
                  {!selectedBrandId ? "Complete steps 1-2 to enable generation" : "Select a regional profile to generate creatives"}
                </p>
              )}
              <div className={styles.actionButtons}>
                <Button
                  size="lg"
                  onClick={handleGenerate}
                  disabled={!selectedBrandId || !selectedRegionalProfileId || generateCreative.isPending}
                  className={styles.generateButton}
                >
                  {generateCreative.isPending ? <Spinner /> : <><Sparkles size={18} /> Generate Creatives</>}
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleAnalyzeCompetitors}
                  disabled={!selectedBrandId || !selectedRegionalProfileId || analyzeCompetitors.isPending}
                  className={styles.analyzeButton}
                >
                  {analyzeCompetitors.isPending ? <Spinner /> : <><TrendingUp size={18} /> Analyze Competitors</>}
                </Button>
              </div>
            </section>

            <section className={styles.sidebarSection}>
              <div className={styles.stepHeader}>
                <div className={`${styles.stepNumber} ${(!selectedBrandId || !selectedRegionalProfileId) ? styles.stepDisabled : styles.stepActive}`}>4</div>
                <h2 className={styles.sectionTitle}>Upload Manual</h2>
              </div>
              {(!selectedBrandId || !selectedRegionalProfileId) && (
                <p className={styles.stepHint}>Complete steps 1-2 to enable manual upload</p>
              )}
              {selectedBrandId && selectedRegionalProfileId && (
                <ManualCreativeUpload
                  brandId={selectedBrandId}
                  regionalProfileId={selectedRegionalProfileId}
                  platform={selectedPlatform}
                  onUploadSuccess={() => {
                    // Invalidate the creatives query to refresh the list
                    queryClient.invalidateQueries({ queryKey: ['creatives'] });
                  }}
                />
              )}
            </section>
          </aside>

          <main className={styles.mainContent}>
            <Tabs defaultValue="generated" className={styles.tabs}>
              <TabsList>
                <TabsTrigger value="generated">
                  All Creatives
                  {allCreatives.length > 0 && (
                    <Badge variant="secondary" className={styles.countBadge}>
                      {allCreatives.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="competitors">
                  Competitor Analysis
                  {displayedCompetitorInsights && (
                    <div className={styles.insightIndicator} />
                  )}
                </TabsTrigger>
                <TabsTrigger value="brandInfo">Brand Info</TabsTrigger>
                <TabsTrigger value="regionalInfo">Regional Info</TabsTrigger>
              </TabsList>
              
              <TabsContent value="generated" className={styles.tabContent}>
                {(isLoadingCreatives || generateCreative.isPending) && (
                  <div className={styles.creativeGrid}>
                    {Array.from({ length: 4 }).map((_, i) => <CreativeCardSkeleton key={i} />)}
                  </div>
                )}
                
                {creativesError && (
                  <div className={styles.errorState}>
                    <p>Failed to load creatives: {creativesError.message}</p>
                  </div>
                )}
                
                {!isLoadingCreatives && !generateCreative.isPending && !creativesError && allCreatives.length === 0 && (
                  <div className={styles.emptyState}>
                    <Bot size={48} className={styles.emptyIcon} />
                    <h3 className={styles.emptyTitle}>Your creatives will appear here</h3>
                    <p className={styles.emptyText}>
                      {selectedBrandId 
                        ? "Generate AI creatives or upload manual creatives to get started." 
                        : "Select a brand and configuration, then generate or upload creatives to begin."
                      }
                    </p>
                  </div>
                )}
                
                {!isLoadingCreatives && !generateCreative.isPending && !creativesError && allCreatives.length > 0 && (
                  <>
                    <div className={styles.creativesHeader}>
                      <h3 className={styles.creativesTitle}>All Creatives ({allCreatives.length})</h3>
                      <p className={styles.creativesSubtitle}>
                        AI-generated and manually uploaded creatives for your selected brand and platform
                      </p>
                    </div>
                    <div className={styles.creativeGrid}>
                      {allCreatives.map((creative) => (
                        <CreativeCard 
                          key={creative.id} 
                          creative={creative}
                          brandName={brands?.find(b => b.id === creative.brandId)?.name}
                          regionalName={regionalProfiles?.find(rp => rp.id === creative.regionalProfileId)?.name}
                        />
                      ))}
                    </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="competitors" className={styles.tabContent}>
                {analyzeCompetitors.isPending && (
                  <div className={styles.loadingState}>
                    <Spinner size="lg" />
                    <h3 className={styles.loadingTitle}>Analyzing Competitors...</h3>
                    <p className={styles.loadingText}>Gathering insights from competitor creatives in your selected region.</p>
                  </div>
                )}
                
                {!analyzeCompetitors.isPending && (
                  <CompetitorInsightsPanel insights={displayedCompetitorInsights} />
                )}
              </TabsContent>
              
              <TabsContent value="brandInfo" className={styles.tabContent}>
                {selectedBrand ? (
                  <div className={styles.infoCard}>
                    <h3 className={styles.infoTitle}>{selectedBrand.name}</h3>
                    <p><strong>Website:</strong> {selectedBrand.websiteUrl || 'N/A'}</p>
                    <p><strong>Tone:</strong> <Badge>{selectedBrand.tone}</Badge></p>
                    <div className={styles.colorInfo}>
                      <strong>Colors:</strong>
                      <div style={{ backgroundColor: selectedBrand.primaryColor }} className={styles.colorSwatch} />
                      {selectedBrand.secondaryColor && <div style={{ backgroundColor: selectedBrand.secondaryColor }} className={styles.colorSwatch} />}
                    </div>
                  </div>
                ) : (
                  <div className={styles.emptyState}><Info /> Select a brand to see its information.</div>
                )}
              </TabsContent>
              
              <TabsContent value="regionalInfo" className={styles.tabContent}>
                {selectedRegionalProfile ? (
                  <div className={styles.infoCard}>
                    <h3 className={styles.infoTitle}>{selectedRegionalProfile.name}</h3>
                    <p>{selectedRegionalProfile.description}</p>
                    <p><strong>Trending Colors:</strong></p>
                    <div className={styles.badgeGroup}>
                      {selectedRegionalProfile.trendingColors.map(c => <Badge key={c} style={{ backgroundColor: c, color: '#fff' }}>{c}</Badge>)}
                    </div>
                    <p><strong>Cultural Motifs:</strong></p>
                    <div className={styles.badgeGroup}>
                      {selectedRegionalProfile.culturalMotifs.map(m => <Badge key={m} variant="secondary">{m}</Badge>)}
                    </div>
                    <p><strong>Slang:</strong></p>
                    <div className={styles.badgeGroup}>
                      {selectedRegionalProfile.slangPhrases.map(s => <Badge key={s} variant="outline">{s}</Badge>)}
                    </div>
                  </div>
                ) : (
                  <div className={styles.emptyState}><Info /> Select a regional profile to see its details.</div>
                )}
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;