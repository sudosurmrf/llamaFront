import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Eye, Calendar } from 'lucide-react';
import { Button, DataTable, Modal } from '../../components/common';
import { useBakery } from '../../context/BakeryContext';
import './AdminPages.css';

const Promotions = () => {
  const { promotions, deletePromotion, updatePromotion } = useBakery();
  const [deleteModal, setDeleteModal] = useState({ open: false, promotion: null });
  const [deleting, setDeleting] = useState(false);

  const handleToggleActive = async (promotion) => {
    await updatePromotion(promotion.id, { ...promotion, active: !promotion.active });
  };

  const handleDelete = async () => {
    if (!deleteModal.promotion) return;
    setDeleting(true);
    await deletePromotion(deleteModal.promotion.id);
    setDeleting(false);
    setDeleteModal({ open: false, promotion: null });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getLocationLabel = (location) => {
    switch (location) {
      case 'homepage_hero':
        return 'Homepage Hero';
      case 'homepage_banner':
        return 'Homepage Banner';
      case 'menu_page':
        return 'Menu Page';
      case 'checkout':
        return 'Checkout';
      default:
        return location;
    }
  };

  const columns = [
    {
      header: 'Promotion',
      accessor: 'name',
      render: (row) => (
        <div className="promo-cell">
          <div
            className="promo-color-preview"
            style={{ backgroundColor: row.backgroundColor || '#f8e8d4' }}
          />
          <div className="promo-cell-info">
            <span className="promo-name">{row.name}</span>
            <span className="promo-title-preview">{row.title}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Location',
      accessor: 'displayLocation',
      render: (row) => (
        <span className="location-badge">{getLocationLabel(row.displayLocation)}</span>
      ),
      width: '150px',
    },
    {
      header: 'Duration',
      render: (row) => (
        <span className="date-range">
          {formatDate(row.startDate)} - {formatDate(row.endDate)}
        </span>
      ),
      width: '180px',
    },
    {
      header: 'Status',
      accessor: 'active',
      render: (row) => {
        const now = new Date();
        const start = new Date(row.startDate);
        const end = new Date(row.endDate);
        const isActive = row.active && now >= start && now <= end;
        const isExpired = now > end;

        return (
          <span className={`status-badge ${isActive ? 'active' : isExpired ? 'inactive' : ''}`}>
            {isExpired ? 'Expired' : isActive ? 'Active' : 'Inactive'}
          </span>
        );
      },
      width: '100px',
    },
    {
      header: 'Actions',
      sortable: false,
      width: '120px',
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
            to={`/admin/promotions/${row.id}`}
            className="action-btn edit"
            title="Edit"
          >
            <Edit2 size={18} />
          </Link>
          <button
            className="action-btn delete"
            onClick={() => setDeleteModal({ open: true, promotion: row })}
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
          <h1 className="page-title">Promotions</h1>
          <p className="page-subtitle">
            Create eye-catching promotional banners and content
          </p>
        </div>
        <Button icon={Plus}>
          <Link to="/admin/promotions/new" style={{ color: 'inherit', textDecoration: 'none' }}>
            Add Promotion
          </Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={promotions}
        searchable={true}
        searchPlaceholder="Search promotions..."
        pagination={true}
        pageSize={10}
        emptyMessage="No promotions found. Create your first promotion to showcase special offers."
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, promotion: null })}
        title="Delete Promotion"
        size="small"
      >
        <div className="delete-modal-content">
          <p>
            Are you sure you want to delete <strong>{deleteModal.promotion?.name}</strong>?
            This action cannot be undone.
          </p>
          <div className="modal-actions">
            <Button
              variant="ghost"
              onClick={() => setDeleteModal({ open: false, promotion: null })}
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
        .promo-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .promo-color-preview {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          flex-shrink: 0;
          border: 1px solid rgba(0, 0, 0, 0.1);
        }
        .promo-cell-info {
          display: flex;
          flex-direction: column;
        }
        .promo-name {
          font-weight: 500;
          color: #5c3d2e;
        }
        .promo-title-preview {
          font-size: 0.75rem;
          color: #7a5240;
        }
        .location-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 0.75rem;
          background-color: #e0e7ff;
          color: #3730a3;
        }
      `}</style>
    </div>
  );
};

export default Promotions;
