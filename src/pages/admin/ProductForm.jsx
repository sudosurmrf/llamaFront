import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button, Input, TextArea, Select, ImageUpload } from '../../components/common';
import { useBakery } from '../../context/BakeryContext';
import './AdminPages.css';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, categories, createProduct, updateProduct } = useBakery();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    categoryId: '',
    images: [],
    featured: false,
    active: true,
    allergens: '',
    ingredients: '',
    nutritionInfo: {
      calories: '',
      fat: '',
      carbs: '',
      protein: '',
    },
    servings: '',
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const product = products.find((p) => p.id === parseInt(id));
      if (product) {
        // Handle both camelCase and snake_case from backend
        const categoryId = product.categoryId || product.category_id;
        const nutritionInfo = product.nutritionInfo || product.nutrition_info;

        setFormData({
          name: product.name || '',
          slug: product.slug || '',
          description: product.description || '',
          price: product.price?.toString() || '',
          categoryId: categoryId?.toString() || '',
          images: product.images?.map((url) => ({ url, preview: url })) || [],
          featured: product.featured || false,
          active: product.active !== false,
          allergens: product.allergens?.join(', ') || '',
          ingredients: product.ingredients || '',
          nutritionInfo: {
            calories: nutritionInfo?.calories?.toString() || '',
            fat: nutritionInfo?.fat?.toString() || '',
            carbs: nutritionInfo?.carbs?.toString() || '',
            protein: nutritionInfo?.protein?.toString() || '',
          },
          servings: product.servings || '',
        });
      }
    }
  }, [id, isEditing, products]);

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => {
      const updated = { ...prev, [name]: newValue };

      // Auto-generate slug from name
      if (name === 'name' && !isEditing) {
        updated.slug = generateSlug(value);
      }

      return updated;
    });

    // Clear error when field is modified
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleNutritionChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      nutritionInfo: {
        ...prev.nutritionInfo,
        [name]: value,
      },
    }));
  };

  const handleImagesChange = (newImages) => {
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setSaving(true);

    // Transform to snake_case for backend API
    const productData = {
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      price: parseFloat(formData.price),
      category_id: parseInt(formData.categoryId),
      featured: formData.featured,
      active: formData.active,
      allergens: formData.allergens
        .split(',')
        .map((a) => a.trim().toLowerCase())
        .filter(Boolean),
      ingredients: formData.ingredients,
      servings: formData.servings,
      existingImages: formData.images.map((img) => img.url || img.preview),
      nutrition_info: {
        calories: formData.nutritionInfo.calories ? parseInt(formData.nutritionInfo.calories) : null,
        fat: formData.nutritionInfo.fat ? parseFloat(formData.nutritionInfo.fat) : null,
        carbs: formData.nutritionInfo.carbs ? parseFloat(formData.nutritionInfo.carbs) : null,
        protein: formData.nutritionInfo.protein ? parseFloat(formData.nutritionInfo.protein) : null,
      },
    };

    try {
      if (isEditing) {
        await updateProduct(parseInt(id), productData);
      } else {
        await createProduct(productData);
      }
      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setSaving(false);
    }
  };

  const categoryOptions = categories
    .filter((c) => c.active)
    .map((c) => ({ value: c.id.toString(), label: c.name }));

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <Link to="/admin/products" className="back-link">
            <ArrowLeft size={20} />
            Back to Products
          </Link>
          <h1 className="page-title">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-grid">
          {/* Main Info */}
          <div className="form-section">
            <h2 className="section-title">Basic Information</h2>
            <div className="form-fields">
              <Input
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
                placeholder="e.g., Chocolate Chip Cookie"
              />

              <Input
                label="URL Slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="chocolate-chip-cookie"
                helperText="Auto-generated from name. Customize if needed."
              />

              <TextArea
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={errors.description}
                required
                rows={4}
                placeholder="Describe your product..."
              />

              <div className="form-row">
                <Input
                  label="Price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  error={errors.price}
                  required
                  placeholder="0.00"
                />

                <Select
                  label="Category"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  options={categoryOptions}
                  error={errors.categoryId}
                  required
                  placeholder="Select a category"
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
                  <span className="checkbox-label">Active (visible on menu)</span>
                </label>

                <label className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="checkbox"
                  />
                  <span className="checkbox-label">Featured product</span>
                </label>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="form-section">
            <h2 className="section-title">Product Images</h2>
            <div className="form-fields">
              <ImageUpload
                images={formData.images}
                onImagesChange={handleImagesChange}
                maxImages={5}
                label="Upload product images"
              />
            </div>
          </div>

          {/* Details */}
          <div className="form-section">
            <h2 className="section-title">Additional Details</h2>
            <div className="form-fields">
              <Input
                label="Allergens"
                name="allergens"
                value={formData.allergens}
                onChange={handleChange}
                placeholder="wheat, eggs, dairy (comma separated)"
                helperText="List allergens separated by commas"
              />

              <TextArea
                label="Ingredients"
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                rows={3}
                placeholder="List all ingredients..."
              />

              <Input
                label="Servings"
                name="servings"
                value={formData.servings}
                onChange={handleChange}
                placeholder="e.g., 8-12 servings"
              />
            </div>
          </div>

          {/* Nutrition */}
          <div className="form-section">
            <h2 className="section-title">Nutrition Information</h2>
            <p className="section-subtitle">Per serving (optional)</p>
            <div className="form-fields">
              <div className="form-row four-col">
                <Input
                  label="Calories"
                  name="calories"
                  type="number"
                  value={formData.nutritionInfo.calories}
                  onChange={handleNutritionChange}
                  placeholder="0"
                />
                <Input
                  label="Fat (g)"
                  name="fat"
                  type="number"
                  step="0.1"
                  value={formData.nutritionInfo.fat}
                  onChange={handleNutritionChange}
                  placeholder="0"
                />
                <Input
                  label="Carbs (g)"
                  name="carbs"
                  type="number"
                  step="0.1"
                  value={formData.nutritionInfo.carbs}
                  onChange={handleNutritionChange}
                  placeholder="0"
                />
                <Input
                  label="Protein (g)"
                  name="protein"
                  type="number"
                  step="0.1"
                  value={formData.nutritionInfo.protein}
                  onChange={handleNutritionChange}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/admin/products')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={saving}
            icon={Save}
          >
            {isEditing ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
