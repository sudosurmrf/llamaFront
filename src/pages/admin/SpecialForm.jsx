import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button, Input, TextArea, Select, ImageUpload } from '../../components/common';
import { useBakery } from '../../context/BakeryContext';
import './AdminPages.css';

const SpecialForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { specials, products, categories, createSpecial, updateSpecial } = useBakery();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'discount_percentage',
    value: '',
    buyQuantity: '',
    getQuantity: '',
    buyCategoryIds: [],
    getCategoryIds: [],
    productIds: [],
    categoryIds: [],
    startDate: '',
    endDate: '',
    active: true,
    minPurchase: '',
    maxUses: '',
    code: '',
    image: [],
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const special = specials.find((s) => s.id === parseInt(id));
      if (special) {
        // Handle both camelCase and snake_case from backend
        const productIds = special.productIds || special.product_ids;
        const categoryIds = special.categoryIds || special.category_ids;
        const startDate = special.startDate || special.start_date;
        const endDate = special.endDate || special.end_date;
        const minPurchase = special.minPurchase || special.min_purchase;
        const maxUses = special.maxUses || special.max_uses;
        const buyQuantity = special.value?.buyQuantity || special.value?.buy_quantity;
        const getQuantity = special.value?.getQuantity || special.value?.get_quantity;
        const buyCategoryIds = special.value?.buyCategoryIds || special.value?.buy_category_ids || [];
        const getCategoryIds = special.value?.getCategoryIds || special.value?.get_category_ids || [];

        setFormData({
          name: special.name || '',
          description: special.description || '',
          type: special.type || 'discount_percentage',
          value: special.type === 'buy_x_get_y' ? '' : special.value?.toString() || '',
          buyQuantity: special.type === 'buy_x_get_y' ? buyQuantity?.toString() || '' : '',
          getQuantity: special.type === 'buy_x_get_y' ? getQuantity?.toString() || '' : '',
          buyCategoryIds: buyCategoryIds,
          getCategoryIds: getCategoryIds,
          productIds: productIds || [],
          categoryIds: categoryIds || [],
          startDate: startDate?.split('T')[0] || '',
          endDate: endDate?.split('T')[0] || '',
          active: special.active !== false,
          minPurchase: minPurchase?.toString() || '',
          maxUses: maxUses?.toString() || '',
          code: special.code || '',
          image: special.image ? [{ url: special.image, preview: special.image }] : [],
        });
      }
    }
  }, [id, isEditing, specials]);

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

    // Promo code is required for all specials
    if (!formData.code.trim()) {
      newErrors.code = 'Promo code is required';
    } else if (!/^[A-Z0-9_-]+$/i.test(formData.code.trim())) {
      newErrors.code = 'Promo code can only contain letters, numbers, hyphens, and underscores';
    }

    if (formData.type === 'buy_x_get_y') {
      if (!formData.buyQuantity || parseInt(formData.buyQuantity) <= 0) {
        newErrors.buyQuantity = 'Buy quantity is required';
      }
      if (!formData.getQuantity || parseInt(formData.getQuantity) <= 0) {
        newErrors.getQuantity = 'Get quantity is required';
      }
    } else {
      if (!formData.value || parseFloat(formData.value) <= 0) {
        newErrors.value = 'Value is required';
      }
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setSaving(true);

    let value;
    if (formData.type === 'buy_x_get_y') {
      value = {
        buy_quantity: parseInt(formData.buyQuantity),
        get_quantity: parseInt(formData.getQuantity),
        buy_category_ids: formData.buyCategoryIds,
        get_category_ids: formData.getCategoryIds,
      };
    } else {
      value = parseFloat(formData.value);
    }

    // Transform to snake_case for backend API
    const specialData = {
      name: formData.name,
      description: formData.description,
      type: formData.type,
      value,
      product_ids: formData.productIds,
      category_ids: formData.categoryIds,
      start_date: new Date(formData.startDate).toISOString(),
      end_date: new Date(formData.endDate + 'T23:59:59').toISOString(),
      active: formData.active,
      min_purchase: formData.minPurchase ? parseFloat(formData.minPurchase) : null,
      max_uses: formData.maxUses ? parseInt(formData.maxUses) : null,
      code: formData.code.trim().toUpperCase(),
      image: formData.image?.[0]?.url || formData.image?.[0]?.preview || null,
    };

    try {
      if (isEditing) {
        await updateSpecial(parseInt(id), specialData);
      } else {
        await createSpecial(specialData);
      }
      navigate('/admin/specials');
    } catch (error) {
      console.error('Error saving special:', error);
    } finally {
      setSaving(false);
    }
  };

  const typeOptions = [
    { value: 'discount_percentage', label: 'Percentage Discount (% off)' },
    { value: 'bundle_discount', label: 'Bundle Discount ($ off)' },
    { value: 'buy_x_get_y', label: 'Buy X, Get Y Free' },
    { value: 'fixed_price', label: 'Fixed Price' },
  ];

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <Link to="/admin/specials" className="back-link">
            <ArrowLeft size={20} />
            Back to Specials
          </Link>
          <h1 className="page-title">
            {isEditing ? 'Edit Special' : 'Create New Special'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-grid">
          {/* Basic Info */}
          <div className="form-section">
            <h2 className="section-title">Special Details</h2>
            <div className="form-fields">
              <Input
                label="Special Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
                placeholder="e.g., Holiday Sale"
              />

              <TextArea
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Describe the special offer..."
              />

              <Select
                label="Discount Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                options={typeOptions}
                required
              />

              {formData.type === 'buy_x_get_y' ? (
                <>
                  <div className="form-row">
                    <Input
                      label="Buy Quantity"
                      name="buyQuantity"
                      type="number"
                      min="1"
                      value={formData.buyQuantity}
                      onChange={handleChange}
                      error={errors.buyQuantity}
                      required
                      placeholder="1"
                    />
                    <Input
                      label="Get Free Quantity"
                      name="getQuantity"
                      type="number"
                      min="1"
                      value={formData.getQuantity}
                      onChange={handleChange}
                      error={errors.getQuantity}
                      required
                      placeholder="6"
                    />
                  </div>

                  <div className="form-subsection">
                    <h3 className="subsection-title">Buy Category (required items)</h3>
                    <p className="subsection-description">
                      Select the category of items customers must purchase
                    </p>
                    <div className="checkbox-grid">
                      {categories.map((category) => (
                        <label key={category.id} className="checkbox-wrapper">
                          <input
                            type="checkbox"
                            checked={formData.buyCategoryIds.includes(category.id)}
                            onChange={(e) => {
                              const newIds = e.target.checked
                                ? [...formData.buyCategoryIds, category.id]
                                : formData.buyCategoryIds.filter((id) => id !== category.id);
                              setFormData((prev) => ({ ...prev, buyCategoryIds: newIds }));
                            }}
                            className="checkbox"
                          />
                          <span className="checkbox-label">{category.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-subsection">
                    <h3 className="subsection-title">Get Free Category (free items)</h3>
                    <p className="subsection-description">
                      Select the category of items customers can get for free
                    </p>
                    <div className="checkbox-grid">
                      {categories.map((category) => (
                        <label key={category.id} className="checkbox-wrapper">
                          <input
                            type="checkbox"
                            checked={formData.getCategoryIds.includes(category.id)}
                            onChange={(e) => {
                              const newIds = e.target.checked
                                ? [...formData.getCategoryIds, category.id]
                                : formData.getCategoryIds.filter((id) => id !== category.id);
                              setFormData((prev) => ({ ...prev, getCategoryIds: newIds }));
                            }}
                            className="checkbox"
                          />
                          <span className="checkbox-label">{category.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <Input
                  label={formData.type === 'discount_percentage' ? 'Percentage Off' : 'Amount'}
                  name="value"
                  type="number"
                  step={formData.type === 'discount_percentage' ? '1' : '0.01'}
                  min="0"
                  value={formData.value}
                  onChange={handleChange}
                  error={errors.value}
                  required
                  placeholder={formData.type === 'discount_percentage' ? '20' : '5.00'}
                />
              )}

              <Input
                label="Promo Code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                error={errors.code}
                required
                placeholder="e.g., SAVE20"
                helperText="Unique code customers enter at checkout"
              />
            </div>
          </div>

          {/* Duration */}
          <div className="form-section">
            <h2 className="section-title">Duration</h2>
            <div className="form-fields">
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

          {/* Restrictions */}
          <div className="form-section">
            <h2 className="section-title">Restrictions (Optional)</h2>
            <div className="form-fields">
              <div className="form-row">
                <Input
                  label="Minimum Purchase ($)"
                  name="minPurchase"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.minPurchase}
                  onChange={handleChange}
                  placeholder="0.00"
                />
                <Input
                  label="Maximum Uses"
                  name="maxUses"
                  type="number"
                  min="1"
                  value={formData.maxUses}
                  onChange={handleChange}
                  placeholder="Unlimited"
                />
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="form-section">
            <h2 className="section-title">Promotional Image (Optional)</h2>
            <div className="form-fields">
              <ImageUpload
                images={formData.image}
                onImagesChange={handleImageChange}
                maxImages={1}
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/admin/specials')}
          >
            Cancel
          </Button>
          <Button type="submit" loading={saving} icon={Save}>
            {isEditing ? 'Update Special' : 'Create Special'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SpecialForm;
