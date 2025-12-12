import { useState } from 'react';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Info, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { Button, Modal, Input, TextArea, Select } from '../../components/common';
import { useBakery } from '../../context/BakeryContext';
import './AdminPages.css';

const Banners = () => {
  const { banners, createBanner, updateBanner, deleteBanner } = useBakery();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, banner: null });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    dismissible: true,
    active: true,
    startDate: '',
    endDate: '',
    displayLocation: 'site_wide',
    link: '',
    linkText: '',
  });

  const openCreateModal = () => {
    setEditingBanner(null);
    const today = new Date().toISOString().split('T')[0];
    const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    setFormData({
      title: '',
      message: '',
      type: 'info',
      dismissible: true,
      active: true,
      startDate: today,
      endDate: nextMonth,
      displayLocation: 'site_wide',
      link: '',
      linkText: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (banner) => {
    setEditingBanner(banner);
    // Handle both camelCase and snake_case from backend
    const startDate = banner.startDate || banner.start_date;
    const endDate = banner.endDate || banner.end_date;
    const displayLocation = banner.displayLocation || banner.display_location;
    const linkText = banner.linkText || banner.link_text;

    setFormData({
      title: banner.title || '',
      message: banner.message || '',
      type: banner.type || 'info',
      dismissible: banner.dismissible !== false,
      active: banner.active !== false,
      startDate: startDate?.split('T')[0] || '',
      endDate: endDate?.split('T')[0] || '',
      displayLocation: displayLocation || 'site_wide',
      link: banner.link || '',
      linkText: linkText || '',
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingBanner(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    // Transform to snake_case for backend API
    const bannerData = {
      title: formData.title,
      message: formData.message,
      type: formData.type,
      dismissible: formData.dismissible,
      active: formData.active,
      start_date: new Date(formData.startDate).toISOString(),
      end_date: new Date(formData.endDate + 'T23:59:59').toISOString(),
      display_location: formData.displayLocation,
      link: formData.link || null,
      link_text: formData.linkText || null,
    };

    try {
      if (editingBanner) {
        await updateBanner(editingBanner.id, bannerData);
      } else {
        await createBanner(bannerData);
      }
      closeModal();
    } catch (error) {
      console.error('Error saving banner:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (banner) => {
    // Only send the active field for toggle
    await updateBanner(banner.id, { active: !banner.active });
  };

  const handleDelete = async () => {
    if (!deleteModal.banner) return;
    setDeleting(true);
    await deleteBanner(deleteModal.banner.id);
    setDeleting(false);
    setDeleteModal({ open: false, banner: null });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'info':
        return <Info size={18} />;
      case 'warning':
        return <AlertTriangle size={18} />;
      case 'success':
        return <CheckCircle size={18} />;
      case 'error':
        return <AlertCircle size={18} />;
      default:
        return <Info size={18} />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'info':
        return { bg: '#dbeafe', color: '#1e40af' };
      case 'warning':
        return { bg: '#fef3c7', color: '#92400e' };
      case 'success':
        return { bg: '#dcfce7', color: '#166534' };
      case 'error':
        return { bg: '#fee2e2', color: '#991b1b' };
      default:
        return { bg: '#dbeafe', color: '#1e40af' };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const typeOptions = [
    { value: 'info', label: 'Information' },
    { value: 'warning', label: 'Warning' },
    { value: 'success', label: 'Success' },
    { value: 'error', label: 'Error/Alert' },
  ];

  const locationOptions = [
    { value: 'site_wide', label: 'Site-wide (all pages)' },
    { value: 'homepage', label: 'Homepage only' },
    { value: 'menu', label: 'Menu page only' },
    { value: 'checkout', label: 'Checkout only' },
  ];

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Announcements & Banners</h1>
          <p className="page-subtitle">
            Create site-wide announcements and notification banners
          </p>
        </div>
        <Button icon={Plus} onClick={openCreateModal}>
          Create Banner
        </Button>
      </div>

      <div className="banners-list">
        {banners.length > 0 ? (
          banners.map((banner) => {
            const typeColors = getTypeColor(banner.type);
            const now = new Date();
            const startDate = banner.startDate || banner.start_date;
            const endDate = banner.endDate || banner.end_date;
            const start = new Date(startDate);
            const end = new Date(endDate);
            const isActive = banner.active && now >= start && now <= end;

            return (
              <div key={banner.id} className="banner-item">
                <div
                  className="banner-preview"
                  style={{ backgroundColor: typeColors.bg, color: typeColors.color }}
                >
                  {getTypeIcon(banner.type)}
                  <div className="banner-text">
                    {banner.title && <strong>{banner.title}</strong>}
                    {banner.title && banner.message && ' - '}
                    {banner.message}
                  </div>
                </div>
                <div className="banner-meta">
                  <span className="banner-dates">
                    {formatDate(startDate)} - {formatDate(endDate)}
                  </span>
                  <span className={`status-badge ${isActive ? 'active' : 'inactive'}`}>
                    {isActive ? 'Active' : 'Inactive'}
                  </span>
                  <div className="table-actions">
                    <button
                      className="action-btn toggle"
                      onClick={() => handleToggleActive(banner)}
                      title={banner.active ? 'Deactivate' : 'Activate'}
                    >
                      {banner.active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                    </button>
                    <button
                      className="action-btn edit"
                      onClick={() => openEditModal(banner)}
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => setDeleteModal({ open: true, banner })}
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-state-card">
            <Info size={48} />
            <h3>No banners yet</h3>
            <p>Create announcement banners to keep your customers informed.</p>
            <Button onClick={openCreateModal}>Create Banner</Button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingBanner ? 'Edit Banner' : 'Create Banner'}
        size="medium"
      >
        <form onSubmit={handleSubmit} className="modal-form">
          <Input
            label="Title (optional)"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., New Hours"
          />

          <TextArea
            label="Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={2}
            placeholder="e.g., We're now open Sundays from 8am to 2pm!"
          />

          <div className="form-row">
            <Select
              label="Banner Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={typeOptions}
            />
            <Select
              label="Display Location"
              name="displayLocation"
              value={formData.displayLocation}
              onChange={handleChange}
              options={locationOptions}
            />
          </div>

          <div className="form-row">
            <Input
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
            <Input
              label="End Date"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <Input
              label="Link URL (optional)"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="/contact"
            />
            <Input
              label="Link Text"
              name="linkText"
              value={formData.linkText}
              onChange={handleChange}
              placeholder="Learn More"
            />
          </div>

          <div className="form-row checkboxes">
            <label className="checkbox-wrapper">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
                className="checkbox"
              />
              <span className="checkbox-label">Active</span>
            </label>
            <label className="checkbox-wrapper">
              <input
                type="checkbox"
                name="dismissible"
                checked={formData.dismissible}
                onChange={handleChange}
                className="checkbox"
              />
              <span className="checkbox-label">Allow users to dismiss</span>
            </label>
          </div>

          <div className="modal-actions">
            <Button type="button" variant="ghost" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {editingBanner ? 'Update' : 'Create'} Banner
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, banner: null })}
        title="Delete Banner"
        size="small"
      >
        <div className="delete-modal-content">
          <p>Are you sure you want to delete this banner? This action cannot be undone.</p>
          <div className="modal-actions">
            <Button
              variant="ghost"
              onClick={() => setDeleteModal({ open: false, banner: null })}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={deleting}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      <style>{`
        .banners-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .banner-item {
          background-color: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(92, 61, 46, 0.06);
        }
        .banner-preview {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
        }
        .banner-text {
          flex: 1;
          font-size: 0.9375rem;
          line-height: 1.5;
        }
        .banner-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 16px;
          background-color: #fdfbf9;
          border-top: 1px solid #f0e5d8;
        }
        .banner-dates {
          flex: 1;
          font-size: 0.8125rem;
          color: #7a5240;
        }
        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .modal-form .form-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        .modal-form .modal-actions {
          margin-top: 0.5rem;
          padding-top: 1rem;
          border-top: 1px solid #f0e5d8;
        }
        @media (max-width: 640px) {
          .modal-form .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Banners;
