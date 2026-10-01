import type { HomeSection } from '../../../types/homeBanner';

export interface BannerFormData {
  section: HomeSection;
  title: string;
  subtitle: string;
  desktopImageUrl: string;
  mobileImageUrl: string;
  ctaText: string;
  redirectUrl: string;
  displayOrder: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
}

export const SECTION_OPTIONS = [
  { value: 'HERO', label: 'Hero' },
  { value: 'TRENDING', label: 'Trending' },
  { value: 'CATEGORY', label: 'Category' },
  { value: 'NEW_ARRIVALS', label: 'New Arrivals' },
];

export const SECTION_LABELS: Record<HomeSection, string> = {
  HERO: 'Hero',
  TRENDING: 'Trending',
  CATEGORY: 'Category',
  NEW_ARRIVALS: 'New Arrivals',
};

export const IMAGE_LAYOUT: Record<HomeSection, { desktop: string; mobile: string }> = {
  HERO: {
    desktop: 'Recommended: 1920×1080px (16:9)',
    mobile: 'Recommended: 390×844px (portrait)',
  },
  TRENDING: {
    desktop: 'Recommended: 1440×600px (wide)',
    mobile: 'Recommended: 390×500px',
  },
  CATEGORY: {
    desktop: 'Recommended: 800×900px (portrait)',
    mobile: 'Recommended: 390×500px',
  },
  NEW_ARRIVALS: {
    desktop: 'Recommended: 600×750px (4:5)',
    mobile: 'Recommended: 390×500px',
  },
};
