import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { z } from 'zod';
import { useForm } from '../components/Form';
import { schema as brandSchema } from '../endpoints/brands_POST.schema';
import { useCreateBrand } from '../helpers/brandsApi';
import { useUploadImage } from '../helpers/uploadApi';
import { useScrapeBrandInfo } from '../helpers/useScrapeBrandInfo';
import { BrandToneArrayValues } from '../helpers/schema';
import { Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '../components/Form';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/Select';
import { FileDropzone } from '../components/FileDropzone';
import { Spinner } from '../components/Spinner';
import { Image, Palette, Type, Globe, UploadCloud, CheckCircle, Search, AlertCircle } from 'lucide-react';
import styles from './brand-setup.module.css';

const BrandSetupPage = () => {
  const navigate = useNavigate();
  const createBrand = useCreateBrand();
  const uploadLogo = useUploadImage();
  const uploadProductImages = useUploadImage();
  const scrapeBrandInfo = useScrapeBrandInfo();

  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [productImageUrls, setProductImageUrls] = useState<string[]>([]);
  const [scrapeMessage, setScrapeMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const form = useForm({
    schema: brandSchema,
    defaultValues: {
      name: '',
      websiteUrl: '',
      primaryColor: '#000000',
      secondaryColor: '#ffffff',
      tone: 'professional',
      logoUrl: null,
      productImages: [],
    },
  });

  const handleLogoSelect = (files: File[]) => {
    if (files.length > 0) {
      uploadLogo.mutate(files[0], {
        onSuccess: (data) => {
          setLogoUrl(data.dataUrl);
          form.setValues((prev) => ({ ...prev, logoUrl: data.dataUrl }));
        },
      });
    }
  };

  const handleProductImagesSelect = (files: File[]) => {
    if (files.length > 0) {
      // For simplicity, handling one upload at a time. A real app might handle parallel uploads.
      uploadProductImages.mutate(files[0], {
        onSuccess: (data) => {
          const newUrls = [...productImageUrls, data.dataUrl];
          setProductImageUrls(newUrls);
          form.setValues((prev) => ({ ...prev, productImages: newUrls }));
        },
      });
    }
  };

  const handleScrapeWebsite = () => {
    const websiteUrl = form.values.websiteUrl;
    if (!websiteUrl) {
      setScrapeMessage({ type: 'error', text: 'Please enter a website URL first.' });
      return;
    }

    setScrapeMessage(null);
    scrapeBrandInfo.mutate({ url: websiteUrl }, {
      onSuccess: (data) => {
        console.log('Scraped brand info:', data);
        
        // Auto-populate form fields with scraped data
        form.setValues((prev) => ({
          ...prev,
          ...(data.name && { name: data.name }),
          ...(data.colors?.primary && { primaryColor: data.colors.primary }),
          ...(data.colors?.secondary && { secondaryColor: data.colors.secondary }),
          ...(data.tone && { tone: data.tone }),
          ...(data.logos?.primary && { logoUrl: data.logos.primary }),
        }));

        // Update logo URL state if scraped
        if (data.logos?.primary) {
          setLogoUrl(data.logos.primary);
        }

        setScrapeMessage({ type: 'success', text: 'Brand information scraped successfully!' });
      },
      onError: (error) => {
        console.error('Error scraping brand info:', error);
        setScrapeMessage({ type: 'error', text: error.message || 'Failed to scrape website. Please try again.' });
      },
    });
  };

  const onSubmit = (values: z.infer<typeof brandSchema>) => {
    createBrand.mutate(values, {
      onSuccess: () => {
        navigate('/dashboard');
      },
    });
  };

  const isSubmitting = createBrand.isPending || uploadLogo.isPending || uploadProductImages.isPending;
  const isScrapingWebsite = scrapeBrandInfo.isPending;

  return (
    <>
      <Helmet>
        <title>Brand Setup | Floot</title>
        <meta name="description" content="Set up your brand profile to start generating ad creatives." />
      </Helmet>
      <div className={styles.pageContainer}>
        <div className={styles.header}>
          <h1 className={styles.title}>Set Up Your Brand</h1>
          <p className={styles.subtitle}>Provide your brand details to generate on-brand creatives.</p>
        </div>

        <div className={styles.formContainer}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
              <FormItem name="name">
                <FormLabel>Brand Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Acme Corporation"
                    value={form.values.name}
                    onChange={(e) => form.setValues((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>

              <FormItem name="websiteUrl">
                <FormLabel>Website URL</FormLabel>
                <div className={styles.websiteUrlWrapper}>
                  <FormControl>
                    <Input
                      placeholder="https://example.com"
                      value={form.values.websiteUrl ?? ''}
                      onChange={(e) => {
                        form.setValues((prev) => ({ ...prev, websiteUrl: e.target.value }));
                        setScrapeMessage(null); // Clear previous messages when URL changes
                      }}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleScrapeWebsite}
                    disabled={isScrapingWebsite || !form.values.websiteUrl}
                    className={styles.scrapeButton}
                  >
                    {isScrapingWebsite ? <Spinner /> : <Search />}
                    {isScrapingWebsite ? 'Scraping...' : 'Scrape Website'}
                  </Button>
                </div>
                {scrapeMessage && (
                  <div className={`${styles.scrapeMessage} ${styles[scrapeMessage.type]}`}>
                    {scrapeMessage.type === 'success' ? (
                      <CheckCircle className={styles.messageIcon} />
                    ) : (
                      <AlertCircle className={styles.messageIcon} />
                    )}
                    <span>{scrapeMessage.text}</span>
                  </div>
                )}
                <FormDescription>We'll scrape your site for brand assets and information.</FormDescription>
                <FormMessage />
              </FormItem>

              <div className={styles.colorPickers}>
                <FormItem name="primaryColor">
                  <FormLabel>Primary Color</FormLabel>
                  <div className={styles.colorInputWrapper}>
                    <FormControl>
                      <input
                        type="color"
                        className={styles.colorSwatch}
                        value={form.values.primaryColor}
                        onChange={(e) => form.setValues((prev) => ({ ...prev, primaryColor: e.target.value }))}
                      />
                    </FormControl>
                    <Input
                      value={form.values.primaryColor}
                      onChange={(e) => form.setValues((prev) => ({ ...prev, primaryColor: e.target.value }))}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
                <FormItem name="secondaryColor">
                  <FormLabel>Secondary Color</FormLabel>
                  <div className={styles.colorInputWrapper}>
                    <FormControl>
                      <input
                        type="color"
                        className={styles.colorSwatch}
                        value={form.values.secondaryColor ?? ''}
                        onChange={(e) => form.setValues((prev) => ({ ...prev, secondaryColor: e.target.value }))}
                      />
                    </FormControl>
                    <Input
                      value={form.values.secondaryColor ?? ''}
                      onChange={(e) => form.setValues((prev) => ({ ...prev, secondaryColor: e.target.value }))}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              </div>

              <FormItem name="tone">
                <FormLabel>Brand Tone</FormLabel>
                <Select
                  onValueChange={(value) => form.setValues((prev) => ({ ...prev, tone: value as any }))}
                  defaultValue={form.values.tone}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a tone" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {BrandToneArrayValues.map((tone) => (
                      <SelectItem key={tone} value={tone} className={styles.selectItem}>
                        {tone.charAt(0).toUpperCase() + tone.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>

              <FormItem name="logoUrl">
                <FormLabel>Brand Logo</FormLabel>
                {logoUrl ? (
                  <div className={styles.uploadSuccess}>
                    <CheckCircle className={styles.successIcon} />
                    <span>Logo uploaded!</span>
                    <Button variant="link" onClick={() => setLogoUrl(null)}>Replace</Button>
                  </div>
                ) : (
                  <FileDropzone
                    onFilesSelected={handleLogoSelect}
                    accept="image/png, image/jpeg, image/svg+xml"
                    maxFiles={1}
                    disabled={uploadLogo.isPending}
                    title={uploadLogo.isPending ? <Spinner /> : "Drop your logo here"}
                  />
                )}
                <FormMessage />
              </FormItem>

              <FormItem name="productImages">
                <FormLabel>Product Images</FormLabel>
                <div className={styles.productImagesGrid}>
                  {productImageUrls.map((url, index) => (
                    <div key={index} className={styles.productImagePreview}>
                      <img src={url} alt={`Product ${index + 1}`} />
                    </div>
                  ))}
                </div>
                {productImageUrls.length < 3 && (
                  <FileDropzone
                    onFilesSelected={handleProductImagesSelect}
                    accept="image/png, image/jpeg"
                    maxFiles={1}
                    disabled={uploadProductImages.isPending || productImageUrls.length >= 3}
                    title={uploadProductImages.isPending ? <Spinner /> : "Upload a product image"}
                    subtitle={`You can add up to ${3 - productImageUrls.length} more images.`}
                  />
                )}
                <FormMessage />
              </FormItem>

              <Button type="submit" size="lg" disabled={isSubmitting} className={styles.submitButton}>
                {isSubmitting ? <Spinner /> : 'Create Brand & Go to Dashboard'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default BrandSetupPage;