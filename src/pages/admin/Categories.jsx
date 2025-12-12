import { useState } from 'react';
import { Plus, Edit2, Trash2, GripVertical, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button, Modal, Input, TextArea, ImageUpload } from '../../components/common';
import { useBakery } from '../../context/BakeryContext';
import './AdminPages.css';

const Categories = () => {
  const { categories, createCategory, updateCategory, deleteCategory } = useBakery();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, category: null });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: null,
    active: true,
    order: 0,
  });

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: null,
      active: true,
      order: categories.length + 1,
    });
    setModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      image: category.image ? [{ url: category.image, preview: category.image }] : [],
      active: category.active,
      order: category.order,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
  };

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
      if (name === 'name' && !editingCategory) {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
  };

  const handleImageChange = (images) => {
    setFormData((prev) => ({ ...prev, image: images }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const categoryData = {
      ...formData,
      image: formData.image?.[0]?.url || formData.image?.[0]?.preview || null,
    };

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryData);
      } else {
        await createCategory(categoryData);
      }
      closeModal();
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (category) => {
    await updateCategory(category.id, { ...category, active: !category.active });
  };

  const handleDelete = async () => {
    if (!deleteModal.category) return;
    setDeleting(true);
    await deleteCategory(deleteModal.category.id);
    setDeleting(false);
    setDeleteModal({ open: false, category: null });
  };

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Categories</h1>
          <p className="page-subtitle">
            Organize your products into categories
          </p>
        </div>
        <Button icon={Plus} onClick={openCreateModal}>
          Add Category
        </Button>
      </div>

      <div className="categories-list">
        {sortedCategories.length > 0 ? (
          sortedCategories.map((category) => (
            <div key={category.id} className="category-item">
              <div className="category-drag">
                <GripVertical size={20} />
              </div>
              <div className="category-thumb">
                {category.image ? (
                  <img src={category.image} alt={category.name} />
                ) : (
                  <div className="thumb-placeholder">
                    <span>🗂️</span>
                  </div>
                )}
              </div>
              <div className="category-info">
                <span className="category-name">{category.name}</span>
                <span className="category-slug">/{category.slug}</span>
              </div>
              <span className={`status-badge ${category.active ? 'active' : 'inactive'}`}>
                {category.active ? 'Active' : 'Inactive'}
              </span>
              <div className="table-actions">
                <button
                  className="action-btn toggle"
                  onClick={() => handleToggleActive(category)}
                  title={category.active ? 'Deactivate' : 'Activate'}
                >
                  {category.active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                </button>
                <button
                  className="action-btn edit"
                  onClick={() => openEditModal(category)}
                  title="Edit"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  className="action-btn delete"
                  onClick={() => setDeleteModal({ open: true, category })}
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state-card">
            <Plus size={48} />
            <h3>No categories yet</h3>
            <p>Create your first category to organize your products.</p>
            <Button onClick={openCreateModal}>Add Category</Button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
        size="medium"
      >
        <form onSubmit={handleSubmit} className="modal-form">
          <Input
            label="Category Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., Cookies"
          />

          <Input
            label="URL Slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="cookies"
            helperText="Used in URLs. Auto-generated from name."
          />

          <TextArea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Describe this category..."
          />

          <ImageUpload
            images={formData.image || []}
            onImagesChange={handleImageChange}
            maxImages={1}
            label="Category Image (optional)"
          />

          <label className="checkbox-wrapper">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className="checkbox"
            />
            <span className="checkbox-label">Active (visible on site)</span>
          </label>

          <div className="modal-actions">
            <Button type="button" variant="ghost" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {editingCategory ? 'Update' : 'Create'} Category
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, category: null })}
        title="Delete Category"
        size="small"
      >
        <div className="delete-modal-content">
          <p>
            Are you sure you want to delete <strong>{deleteModal.category?.name}</strong>?
            Products in this category will become uncategorized.
          </p>
          <div className="modal-actions">
            <Button
              variant="ghost"
              onClick={() => setDeleteModal({ open: false, category: null })}
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
        .categories-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .category-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 16px;
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(92, 61, 46, 0.06);
        }

        .category-drag {
          color: #a18072;
          cursor: grab;
        }

        .category-thumb {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          overflow: hidden;
          background-color: #f8e8d4;
          flex-shrink: 0;
        }

        .category-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .category-thumb .thumb-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          font-size: 1.5rem;
        }

        .category-info {
          flex: 1;
          min-width: 0;
        }

        .category-name {
          display: block;
          font-weight: 500;
          color: #5c3d2e;
        }

        .category-slug {
          font-size: 0.75rem;
          color: #7a5240;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .modal-form .modal-actions {
          margin-top: 0.5rem;
          padding-top: 1rem;
          border-top: 1px solid #f0e5d8;
        }
      `}</style>
    </div>
  );
};

export default Categories;
