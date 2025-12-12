import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button, Input, TextArea, Select, ImageUpload } from '../../components/common';
import { useBakery } from '../../context/BakeryContext';
import './AdminPages.css';

const PromotionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { promotions, createPromotion, updatePromotion } = useBakery();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    subtitle: '',
    description: '',
    buttonText: '',
    buttonLink: '',
    image: [],
    backgroundColor: '#f8e8d4',
    textColor: '#5c3d2e',
    startDate: '',
    endDate: '',
    active: true,
    displayLocation: 'homepage_hero',
    order: 1,
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const promotion = promotions.find((p) => p.id === parseInt(id));
      if (promotion) {
        // Handle both camelCase and snake_case from backend
        const buttonText = promotion.buttonText || promotion.button_text;
        const buttonLink = promotion.buttonLink || promotion.button_link;
        const backgroundColor = promotion.backgroundColor || promotion.background_color;
        const textColor = promotion.textColor || promotion.text_color;
        const startDate = promotion.startDate || promotion.start_date;
        const endDate = promotion.endDate || promotion.end_date;
        const displayLocation = promotion.displayLocation || promotion.display_location;

        setFormData({
          name: promotion.name || '',
          title: promotion.title || '',
          subtitle: promotion.subtitle || '',
          description: promotion.description || '',
          buttonText: buttonText || '',
          buttonLink: buttonLink || '',
          image: promotion.image ? [{ url: promotion.image, preview: promotion.image }] : [],
          backgroundColor: backgroundColor || '#f8e8d4',
          textColor: textColor || '#5c3d2e',
          startDate: startDate?.split('T')[0] || '',
          endDate: endDate?.split('T')[0] || '',
          active: promotion.active !== false,
          displayLocation: displayLocation || 'homepage_hero',
          order: promotion.order || 1,
        });
      }
    }
  }, [id, isEditing, promotions]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleImageChange = (images) => {
    setFormData((prev) => ({ ...prev, image: images }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setSaving(true);

    // Transform to snake_case for backend API
    const promotionData = {
      name: formData.name,
      title: formData.title,
      subtitle: formData.subtitle,
      description: formData.description,
      button_text: formData.buttonText,
      button_link: formData.buttonLink,
      image: formData.image?.[0]?.url || formData.image?.[0]?.preview || null,
      background_color: formData.backgroundColor,
      text_color: formData.textColor,
      start_date: new Date(formData.startDate).toISOString(),
      end_date: new Date(formData.endDate + 'T23:59:59').toISOString(),
      active: formData.active,
      display_location: formData.displayLocation,
      order: parseInt(formData.order),
    };

    try {
      if (isEditing) {
        await updatePromotion(parseInt(id), promotionData);
      } else {
        await createPromotion(promotionData);
      }
      navigate('/admin/promotions');
    } catch (error) {
      console.error('Error saving promotion:', error);
    } finally {
      setSaving(false);
    }
  };

  const locationOptions = [
    { value: 'homepage_hero', label: 'Homepage Hero Slider' },
    { value: 'homepage_banner', label: 'Homepage Banner' },
    { value: 'menu_page', label: 'Menu Page Banner' },
    { value: 'checkout', label: 'Checkout Page' },
  ];

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <Link to="/admin/promotions" className="back-link">
            <ArrowLeft size={20} />
            Back to Promotions
          </Link>
          <h1 className="page-title">
            {isEditing ? 'Edit Promotion' : 'Create New Promotion'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-grid">
          {/* Basic Info */}
          <div className="form-section">
            <h2 className="section-title">Promotion Details</h2>
            <div className="form-fields">
              <Input
                label="Internal Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
                placeholder="e.g., Summer Sale Banner"
                helperText="For internal reference only"
              />

              <Input
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={errors.title}
                required
                placeholder="e.g., Summer Sweet Sale"
              />

              <Input
                label="Subtitle"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                placeholder="e.g., Up to 30% off"
              />

              <TextArea
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Describe your promotion..."
              />
            </div>
          </div>

          {/* Call to Action */}
          <div className="form-section">
            <h2 className="section-title">Call to Action</h2>
            <div className="form-fields">
              <div className="form-row">
                <Input
                  label="Button Text"
                  name="buttonText"
                  value={formData.buttonText}
                  onChange={handleChange}
                  placeholder="e.g., Shop Now"
                />
                <Input
                  label="Button Link"
                  name="buttonLink"
                  value={formData.buttonLink}
                  onChange={handleChange}
                  placeholder="e.g., /menu"
                />
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="form-section">
            <h2 className="section-title">Appearance</h2>
            <div className="form-fields">
              <div className="form-row">
                <div className="color-input-group">
                  <label className="input-label">Background Color</label>
                  <div className="color-input-wrapper">
                    <input
                      type="color"
                      name="backgroundColor"
                      value={formData.backgroundColor}
                      onChange={handleChange}
                      className="color-input"
                    />
                    <Input
                      name="backgroundColor"
                      value={formData.backgroundColor}
                      onChange={handleChange}
                      placeholder="#f8e8d4"
                    />
                  </div>
                </div>
                <div className="color-input-group">
                  <label className="input-label">Text Color</label>
                  <div className="color-input-wrapper">
                    <input
                      type="color"
                      name="textColor"
                      value={formData.textColor}
                      onChange={handleChange}
                      className="color-input"
                    />
                    <Input
                      name="textColor"
                      value={formData.textColor}
                      onChange={handleChange}
                      placeholder="#5c3d2e"
                    />
                  </div>
                </div>
              </div>

              <ImageUpload
                images={formData.image}
                onImagesChange={handleImageChange}
                maxImages={1}
                label="Promotional Image (optional)"
              />
            </div>
          </div>

          {/* Display Settings */}
          <div className="form-section">
            <h2 className="section-title">Display Settings</h2>
            <div className="form-fields">
              <div className="form-row">
                <Select
                  label="Display Location"
                  name="displayLocation"
                  value={formData.displayLocation}
                  onChange={handleChange}
                  options={locationOptions}
                  required
                />
                <Input
                  label="Display Order"
                  name="order"
                  type="number"
                  min="1"
                  value={formData.order}
                  onChange={handleChange}
                  placeholder="1"
                />
              </div>

              <div className="form-row">
                <Input
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  error={errors.startDate}
                  required
                />
                <Input
                  label="End Date"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  error={errors.endDate}
                  required
                />
              </div>

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
            </div>
          </div>

          {/* Preview */}
          <div className="form-section">
            <h2 className="section-title">Preview</h2>
            <div
              className="promo-preview"
              style={{
                backgroundColor: formData.backgroundColor,
                color: formData.textColor,
              }}
            >
              {formData.subtitle && <span className="preview-subtitle">{formData.subtitle}</span>}
              <h3 className="preview-title">{formData.title || 'Your Title Here'}</h3>
              {formData.description && <p className="preview-description">{formData.description}</p>}
              {formData.buttonText && (
                <button className="preview-button" style={{ backgroundColor: formData.textColor, color: formData.backgroundColor }}>
                  {formData.buttonText}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/admin/promotions')}
          >
            Cancel
          </Button>
          <Button type="submit" loading={saving} icon={Save}>
            {isEditing ? 'Update Promotion' : 'Create Promotion'}
          </Button>
        </div>
      </form>

      <style>{`
        .color-input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .color-input-wrapper {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .color-input {
          width: 48px;
          height: 48px;
          border: 2px solid #e5d5c5;
          border-radius: 8px;
          cursor: pointer;
          padding: 4px;
        }
        .promo-preview {
          padding: 2rem;
          border-radius: 12px;
          text-align: center;
        }
        .preview-subtitle {
          display: block;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          opacity: 0.8;
          margin-bottom: 0.5rem;
        }
        .preview-title {
          font-size: 1.75rem;
          font-weight: 700;
          margin: 0 0 0.75rem;
        }
        .preview-description {
          font-size: 0.9375rem;
          opacity: 0.9;
          margin: 0 0 1.25rem;
        }
        .preview-button {
          padding: 10px 24px;
          border: none;
          border-radius: 8px;
          font-size: 0.9375rem;
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default PromotionForm;
