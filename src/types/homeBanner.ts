export type HomeSection = 'HERO' | 'TRENDING' | 'CATEGORY' | 'NEW_ARRIVALS';

export const HOME_SECTIONS: { value: HomeSection; label: string }[] = [
  { value: 'HERO', label: 'Hero' },
  { value: 'TRENDING', label: 'Trending' },
  { value: 'CATEGORY', label: 'Category' },
  { value: 'NEW_ARRIVALS', label: 'New Arrivals' },
];

export interface HomeBannerResponse {
  id: number;
  section: HomeSection;
  title?: string;
  subtitle?: string;
  desktopImageUrl: string;
  mobileImageUrl?: string;
  ctaText?: string;
  redirectUrl?: string;
  displayOrder: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PublicBannerResponse {
  id: number;
  title?: string;
  subtitle?: string;
  desktopImageUrl: string;
  mobileImageUrl?: string;
  ctaText?: string;
  redirectUrl?: string;
  displayOrder: number;
}

export interface HomePageResponse {
  hero: PublicBannerResponse[];
  trending: PublicBannerResponse[];
  category: PublicBannerResponse[];
  newArrivals: PublicBannerResponse[];
}
