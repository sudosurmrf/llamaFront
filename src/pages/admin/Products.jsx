import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Eye, ToggleLeft, ToggleRight, ShoppingBag } from 'lucide-react';
import { Button, DataTable, Modal } from '../../components/common';
import { useBakery } from '../../context/BakeryContext';
import './AdminPages.css';

const Products = () => {
  const { products, categories, deleteProduct, updateProduct } = useBakery();
  const [deleteModal, setDeleteModal] = useState({ open: false, product: null });
  const [deleting, setDeleting] = useState(false);

  const handleToggleActive = async (product) => {
    await updateProduct(product.id, { ...product, active: !product.active });
  };

  const handleDelete = async () => {
    if (!deleteModal.product) return;
    setDeleting(true);
    await deleteProduct(deleteModal.product.id);
    setDeleting(false);
    setDeleteModal({ open: false, product: null });
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || 'Uncategorized';
  };

  const columns = [
    {
      header: 'Product',
      accessor: 'name',
      render: (row) => (
        <div className="table-product">
          <div className="product-thumb">
            {row.images?.[0] ? (
              <img src={row.images[0]} alt={row.name} />
            ) : (
              <div className="thumb-placeholder">
                <ShoppingBag size={18} />
              </div>
            )}
          </div>
          <div className="product-info">
            <span className="product-name">{row.name}</span>
            <span className="product-category">{getCategoryName(row.categoryId || row.category_id)}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Price',
      accessor: 'price',
      render: (row) => <span className="price">${parseFloat(row.price).toFixed(2)}</span>,
      width: '100px',
    },
    {
      header: 'Status',
      accessor: 'active',
      render: (row) => (
        <span className={`status-badge ${row.active ? 'active' : 'inactive'}`}>
          {row.active ? 'Active' : 'Inactive'}
        </span>
      ),
      width: '100px',
    },
    {
      header: 'Featured',
      accessor: 'featured',
      render: (row) => (
        <span className={`status-badge ${row.featured ? 'featured' : ''}`}>
          {row.featured ? 'Yes' : 'No'}
        </span>
      ),
      width: '100px',
    },
    {
      header: 'Actions',
      sortable: false,
      width: '150px',
      render: (row) => (
        <div className="table-actions">
          <button
            className="action-btn toggle"
            onClick={() => handleToggleActive(row)}
            title={row.active ? 'Deactivate' : 'Activate'}
          >
            {row.active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
          </button>
          <Link
            to={`/admin/products/${row.id}`}
            className="action-btn edit"
            title="Edit"
          >
            <Edit2 size={18} />
          </Link>
          <button
            className="action-btn delete"
            onClick={() => setDeleteModal({ open: true, product: row })}
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-subtitle">
            Manage your bakery's product catalog
          </p>
        </div>
        <Button icon={Plus}>
          <Link to="/admin/products/new" style={{ color: 'inherit', textDecoration: 'none' }}>
            Add Product
          </Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={products}
        searchable={true}
        searchPlaceholder="Search products..."
        pagination={true}
        pageSize={10}
        emptyMessage="No products found. Add your first product to get started."
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, product: null })}
        title="Delete Product"
        size="small"
      >
        <div className="delete-modal-content">
          <p>
            Are you sure you want to delete <strong>{deleteModal.product?.name}</strong>?
            This action cannot be undone.
          </p>
          <div className="modal-actions">
            <Button
              variant="ghost"
              onClick={() => setDeleteModal({ open: false, product: null })}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              loading={deleting}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Products;
