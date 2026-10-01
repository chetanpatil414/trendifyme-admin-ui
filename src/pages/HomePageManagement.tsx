import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import Card, { CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { ToastContainer, ToastData } from '../components/ui/Toast';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import BannerForm from '../components/features/HomeBanner/BannerForm';
import { SECTION_LABELS } from '../components/features/HomeBanner/bannerFormConfig';
import type { BannerFormData } from '../components/features/HomeBanner/bannerFormConfig';
import {
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  updateBannerStatus,
} from '../services/bannerService';
import type { HomeBannerResponse, HomeSection } from '../types/homeBanner';
import {
  Plus,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Image,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

const SECTIONS: HomeSection[] = ['HERO', 'TRENDING', 'CATEGORY', 'NEW_ARRIVALS'];

// -----------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------
function formatDate(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function SectionGroup({
  section,
  banners,
  onEdit,
  onDelete,
  onToggleStatus,
}: {
  section: HomeSection;
  banners: HomeBannerResponse[];
  onEdit: (b: HomeBannerResponse) => void;
  onDelete: (b: HomeBannerResponse) => void;
  onToggleStatus: (b: HomeBannerResponse) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="border border-[rgba(160,180,203,0.2)] rounded-2xl overflow-hidden">
      {/* Section Header */}
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-5 py-4 bg-[#f8fbff] hover:bg-[#edf4ff] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#0058cd]" />
          <span className="text-sm font-bold text-[#213447]">
            {SECTION_LABELS[section]}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-md bg-[#edf4ff] text-[#0058cd] font-semibold">
            {banners.length}
          </span>
        </div>
        {collapsed ? <ChevronRight size={16} className="text-[#697d92]" /> : <ChevronDown size={16} className="text-[#697d92]" />}
      </button>

      {/* Banner Rows */}
      {!collapsed && (
        <div className="divide-y divide-[rgba(160,180,203,0.1)]">
          {banners.length === 0 ? (
            <p className="px-5 py-4 text-xs text-[#4e6175] italic">No banners in this section yet.</p>
          ) : (
            banners.map((banner) => (
              <div
                key={banner.id}
                className="flex items-center gap-4 px-5 py-3 hover:bg-[#f8fbff] transition-colors"
              >
                {/* Thumbnail */}
                <div className="w-16 h-10 rounded-lg overflow-hidden bg-[#edf4ff] flex-shrink-0">
                  {banner.desktopImageUrl ? (
                    <img
                      src={banner.desktopImageUrl}
                      alt={banner.title || 'Banner'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image size={14} className="text-[#a0b4cb]" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#213447] truncate">
                    {banner.title || <span className="text-[#a0b4cb] font-normal">Untitled</span>}
                  </p>
                  <p className="text-xs text-[#697d92] truncate">
                    Order: {banner.displayOrder}
                    {banner.startDate ? ` · From ${formatDate(banner.startDate)}` : ''}
                    {banner.endDate ? ` → ${formatDate(banner.endDate)}` : ''}
                  </p>
                </div>

                {/* Status Badge */}
                <Badge variant={banner.isActive ? 'success' : 'neutral'}>
                  {banner.isActive ? 'Active' : 'Inactive'}
                </Badge>

                {/* Actions */}
                <div className="flex items-center gap-1.5">
                  <button
                    title={banner.isActive ? 'Deactivate' : 'Activate'}
                    onClick={() => onToggleStatus(banner)}
                    className="w-8 h-8 rounded-lg hover:bg-[#edf4ff] flex items-center justify-center text-[#697d92] hover:text-[#0058cd] transition-all"
                  >
                    {banner.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                  </button>
                  <button
                    title="Edit"
                    onClick={() => onEdit(banner)}
                    className="w-8 h-8 rounded-lg hover:bg-[#edf4ff] flex items-center justify-center text-[#697d92] hover:text-[#0058cd] transition-all"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    title="Delete"
                    onClick={() => onDelete(banner)}
                    className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-[#697d92] hover:text-[#a83836] transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------
// Modal wrapper
// -----------------------------------------------------------------------
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(160,180,203,0.2)]">
          <h2 className="text-base font-bold text-[#213447]">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl hover:bg-[#edf4ff] flex items-center justify-center text-[#697d92]">
            ✕
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------
export default function HomePageManagement() {
  const [banners, setBanners] = useState<HomeBannerResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastData[]>([]);

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState<HomeBannerResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<HomeBannerResponse | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
  };
  const removeToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const load = async () => {
    setLoading(true);
    try {
      const data = await getAllBanners();
      setBanners(data);
    } catch (err: any) {
      addToast(err.message || 'Failed to load banners', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (form: BannerFormData) => {
    setIsSubmitting(true);
    try {
      await createBanner({
        section: form.section,
        title: form.title || undefined,
        subtitle: form.subtitle || undefined,
        desktopImageUrl: form.desktopImageUrl,
        mobileImageUrl: form.mobileImageUrl || undefined,
        ctaText: form.ctaText || undefined,
        redirectUrl: form.redirectUrl || undefined,
        displayOrder: form.displayOrder,
        isActive: form.isActive,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
      });
      addToast('Banner created successfully!', 'success');
      setShowAddModal(false);
      await load();
    } catch (err: any) {
      addToast(err.message || 'Failed to create banner', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (form: BannerFormData) => {
    if (!editTarget) return;
    setIsSubmitting(true);
    try {
      await updateBanner(editTarget.id, {
        section: form.section,
        title: form.title || undefined,
        subtitle: form.subtitle || undefined,
        desktopImageUrl: form.desktopImageUrl,
        mobileImageUrl: form.mobileImageUrl || undefined,
        ctaText: form.ctaText || undefined,
        redirectUrl: form.redirectUrl || undefined,
        displayOrder: form.displayOrder,
        isActive: form.isActive,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
      });
      addToast('Banner updated successfully!', 'success');
      setEditTarget(null);
      await load();
    } catch (err: any) {
      addToast(err.message || 'Failed to update banner', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteBanner(deleteTarget.id);
      addToast('Banner deleted.', 'success');
      setDeleteTarget(null);
      await load();
    } catch (err: any) {
      addToast(err.message || 'Failed to delete banner', 'error');
    }
  };

  const handleToggleStatus = async (banner: HomeBannerResponse) => {
    try {
      await updateBannerStatus(banner.id, !banner.isActive);
      addToast(
        `Banner ${!banner.isActive ? 'activated' : 'deactivated'}.`,
        'success'
      );
      await load();
    } catch (err: any) {
      addToast(err.message || 'Failed to update status', 'error');
    }
  };

  const groupedBanners = SECTIONS.reduce<Record<HomeSection, HomeBannerResponse[]>>(
    (acc, section) => {
      acc[section] = banners.filter((b) => b.section === section);
      return acc;
    },
    { HERO: [], TRENDING: [], CATEGORY: [], NEW_ARRIVALS: [] }
  );

  const editInitial = editTarget
    ? {
        section: editTarget.section,
        title: editTarget.title || '',
        subtitle: editTarget.subtitle || '',
        desktopImageUrl: editTarget.desktopImageUrl,
        mobileImageUrl: editTarget.mobileImageUrl || '',
        ctaText: editTarget.ctaText || '',
        redirectUrl: editTarget.redirectUrl || '',
        displayOrder: editTarget.displayOrder,
        isActive: editTarget.isActive,
        startDate: editTarget.startDate
          ? editTarget.startDate.slice(0, 16)
          : '',
        endDate: editTarget.endDate ? editTarget.endDate.slice(0, 16) : '',
      }
    : undefined;

  return (
    <Layout
      breadcrumbs={['Website', 'Home Page']}
      headerActions={
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setShowAddModal(true)}
          id="btn-add-banner"
        >
          Add Banner
        </Button>
      }
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-slide-up">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#213447]">Home Page Management</h1>
          <p className="text-sm text-[#4e6175] mt-1">
            Manage banners displayed across different sections of the home page.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {SECTIONS.map((s) => (
              <div key={s} className="h-24 bg-white rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {SECTIONS.map((section) => (
              <SectionGroup
                key={section}
                section={section}
                banners={groupedBanners[section]}
                onEdit={(b) => setEditTarget(b)}
                onDelete={(b) => setDeleteTarget(b)}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <Modal title="Add Banner" onClose={() => setShowAddModal(false)}>
          <BannerForm
            onSubmit={handleCreate}
            onCancel={() => setShowAddModal(false)}
            isSubmitting={isSubmitting}
            submitLabel="Create Banner"
          />
        </Modal>
      )}

      {/* Edit Modal */}
      {editTarget && (
        <Modal title="Edit Banner" onClose={() => setEditTarget(null)}>
          <BannerForm
            initial={editInitial}
            onSubmit={handleUpdate}
            onCancel={() => setEditTarget(null)}
            isSubmitting={isSubmitting}
            submitLabel="Update Banner"
          />
        </Modal>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <ConfirmationModal
          isOpen={true}
          title="Delete Banner"
          message={`Are you sure you want to delete "${deleteTarget.title || 'this banner'}"? This action cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </Layout>
  );
}
