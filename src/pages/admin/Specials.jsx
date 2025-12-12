import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Tag, Percent, Gift } from 'lucide-react';
import { Button, DataTable, Modal } from '../../components/common';
import { useBakery } from '../../context/BakeryContext';
import './AdminPages.css';

const Specials = () => {
  const { specials, deleteSpecial, updateSpecial } = useBakery();
  const [deleteModal, setDeleteModal] = useState({ open: false, special: null });
  const [deleting, setDeleting] = useState(false);

  const handleToggleActive = async (special) => {
    await updateSpecial(special.id, { ...special, active: !special.active });
  };

  const handleDelete = async () => {
    if (!deleteModal.special) return;
    setDeleting(true);
    await deleteSpecial(deleteModal.special.id);
    setDeleting(false);
    setDeleteModal({ open: false, special: null });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'discount_percentage':
        return <Percent size={14} />;
      case 'buy_x_get_y':
        return <Gift size={14} />;
      default:
        return <Tag size={14} />;
    }
  };

  const getTypeBadgeClass = (type) => {
    switch (type) {
      case 'discount_percentage':
        return 'percentage';
      case 'buy_x_get_y':
        return 'bogo';
      case 'bundle_discount':
        return 'bundle';
      default:
        return '';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'discount_percentage':
        return 'Percentage';
      case 'buy_x_get_y':
        return 'Buy X Get Y';
      case 'bundle_discount':
        return 'Bundle';
      case 'fixed_price':
        return 'Fixed Price';
      default:
        return type;
    }
  };

  const formatValue = (special) => {
    switch (special.type) {
      case 'discount_percentage':
        return `${special.value}% off`;
      case 'buy_x_get_y':
        return `Buy ${special.value.buyQuantity}, Get ${special.value.getQuantity}`;
      case 'bundle_discount':
        return `$${special.value} off`;
      case 'fixed_price':
        return `$${special.value}`;
      default:
        return special.value;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const columns = [
    {
      header: 'Name',
      accessor: 'name',
      render: (row) => (
        <div className="special-name">
          <span className="name">{row.name}</span>
          {row.code && <span className="code">Code: {row.code}</span>}
        </div>
      ),
    },
    {
      header: 'Type',
      accessor: 'type',
      render: (row) => (
        <span className={`type-badge ${getTypeBadgeClass(row.type)}`}>
          {getTypeIcon(row.type)} {getTypeLabel(row.type)}
        </span>
      ),
      width: '140px',
    },
    {
      header: 'Value',
      accessor: 'value',
      render: (row) => <span className="value">{formatValue(row)}</span>,
      width: '120px',
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
        const isUpcoming = now < start;

        return (
          <span className={`status-badge ${isActive ? 'active' : isExpired ? 'inactive' : ''}`}>
            {isExpired ? 'Expired' : isUpcoming ? 'Upcoming' : isActive ? 'Active' : 'Inactive'}
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
            to={`/admin/specials/${row.id}`}
            className="action-btn edit"
            title="Edit"
          >
            <Edit2 size={18} />
          </Link>
          <button
            className="action-btn delete"
            onClick={() => setDeleteModal({ open: true, special: row })}
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
          <h1 className="page-title">Specials & Deals</h1>
          <p className="page-subtitle">
            Create and manage special offers for your customers
          </p>
        </div>
        <Button icon={Plus}>
          <Link to="/admin/specials/new" style={{ color: 'inherit', textDecoration: 'none' }}>
            Create Special
          </Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={specials}
        searchable={true}
        searchPlaceholder="Search specials..."
        pagination={true}
        pageSize={10}
        emptyMessage="No specials found. Create your first special to attract customers."
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, special: null })}
        title="Delete Special"
        size="small"
      >
        <div className="delete-modal-content">
          <p>
            Are you sure you want to delete <strong>{deleteModal.special?.name}</strong>?
            This action cannot be undone.
          </p>
          <div className="modal-actions">
            <Button
              variant="ghost"
              onClick={() => setDeleteModal({ open: false, special: null })}
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
        .special-name {
          display: flex;
          flex-direction: column;
        }
        .special-name .name {
          font-weight: 500;
          color: #5c3d2e;
        }
        .special-name .code {
          font-size: 0.75rem;
          color: #7a5240;
          font-family: monospace;
        }
        .type-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .value {
          font-weight: 500;
          color: #5c3d2e;
        }
      `}</style>
    </div>
  );
};

export default Specials;
