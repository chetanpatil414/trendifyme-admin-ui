import type { HomeBannerResponse, HomePageResponse } from '../types/homeBanner';

const ADMIN_API_URL = 'http://localhost:8080/api/v1/admin/home/banners';
const PUBLIC_API_URL = 'http://localhost:8080/api/v1/home';

export interface HomeBannerCreatePayload {
  section: string;
  title?: string;
  subtitle?: string;
  desktopImageUrl: string;
  mobileImageUrl?: string;
  ctaText?: string;
  redirectUrl?: string;
  displayOrder: number;
  isActive: boolean;
  startDate?: string | null;
  endDate?: string | null;
}

export type HomeBannerUpdatePayload = Partial<HomeBannerCreatePayload>;

// ----- Admin APIs -----

export const getAllBanners = async (): Promise<HomeBannerResponse[]> => {
  const response = await fetch(ADMIN_API_URL, {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.message || `Failed to fetch banners [${response.status}]`);
  }
  return response.json();
};

export const getBannerById = async (id: number): Promise<HomeBannerResponse> => {
  const response = await fetch(`${ADMIN_API_URL}/${id}`, {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.message || `Failed to fetch banner [${response.status}]`);
  }
  return response.json();
};

export const createBanner = async (payload: HomeBannerCreatePayload): Promise<HomeBannerResponse> => {
  const response = await fetch(ADMIN_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.message || `Failed to create banner [${response.status}]`);
  }
  return response.json();
};

export const updateBanner = async (
  id: number,
  payload: HomeBannerUpdatePayload
): Promise<HomeBannerResponse> => {
  const response = await fetch(`${ADMIN_API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.message || `Failed to update banner [${response.status}]`);
  }
  return response.json();
};

export const deleteBanner = async (id: number): Promise<void> => {
  const response = await fetch(`${ADMIN_API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.message || `Failed to delete banner [${response.status}]`);
  }
};

export const updateBannerStatus = async (
  id: number,
  active: boolean
): Promise<HomeBannerResponse> => {
  const response = await fetch(`${ADMIN_API_URL}/${id}/status?active=${active}`, {
    method: 'PATCH',
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.message || `Failed to update banner status [${response.status}]`);
  }
  return response.json();
};

// ----- Public API -----

export const getHomePageData = async (): Promise<HomePageResponse> => {
  const response = await fetch(PUBLIC_API_URL, {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.message || `Failed to fetch home page data [${response.status}]`);
  }
  return response.json();
};
