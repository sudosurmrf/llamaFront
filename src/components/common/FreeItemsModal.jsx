import { useState, useEffect } from 'react';
import { X, Gift, Plus, Minus, Check, ShoppingBag } from 'lucide-react';
import Button from './Button';
import './FreeItemsModal.css';

const FreeItemsModal = ({
  isOpen,
  onClose,
  onConfirm,
  availableProducts = [],
  totalFreeQty = 0,
  specialName = 'Special Offer',
}) => {
  const [selections, setSelections] = useState({});
  const [selectedCount, setSelectedCount] = useState(0);

  // Reset selections when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelections({});
      setSelectedCount(0);
    }
  }, [isOpen]);

  // Calculate selected count whenever selections change
  useEffect(() => {
    const count = Object.values(selections).reduce((sum, qty) => sum + qty, 0);
    setSelectedCount(count);
  }, [selections]);

  const handleIncrement = (productId) => {
    if (selectedCount >= totalFreeQty) return;

    setSelections((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const handleDecrement = (productId) => {
    if (!selections[productId] || selections[productId] <= 0) return;

    setSelections((prev) => {
      const newQty = prev[productId] - 1;
      if (newQty === 0) {
        const { [productId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: newQty };
    });
  };

  const handleConfirm = () => {
    const selectedItems = Object.entries(selections)
      .filter(([_, qty]) => qty > 0)
      .map(([id, quantity]) => {
        const product = availableProducts.find((p) => p.id === parseInt(id));
        return {
          id: parseInt(id),
          name: product?.name,
          price: product?.price,
          quantity,
        };
      });

    onConfirm(selectedItems);
  };

  const formatPrice = (price) => `$${parseFloat(price).toFixed(2)}`;

  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return null;
  };

  if (!isOpen) return null;

  const remaining = totalFreeQty - selectedCount;

  return (
    <div className="free-items-modal-overlay" onClick={onClose}>
      <div className="free-items-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="modal-header">
          <div className="modal-icon">
            <Gift size={32} />
          </div>
          <h2>Choose Your Free Items!</h2>
          <p className="modal-subtitle">{specialName}</p>
        </div>

        <div className="modal-progress">
          <div className="progress-info">
            <span>
              Selected: <strong>{selectedCount}</strong> of <strong>{totalFreeQty}</strong>
            </span>
            {remaining > 0 && (
              <span className="remaining">
                {remaining} more to choose
              </span>
            )}
            {remaining === 0 && (
              <span className="complete">
                <Check size={16} /> All items selected!
              </span>
            )}
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(selectedCount / totalFreeQty) * 100}%` }}
            />
          </div>
        </div>

        <div className="modal-products">
          {availableProducts.length === 0 ? (
            <div className="no-products">
              <ShoppingBag size={48} />
              <p>No items available for selection</p>
            </div>
          ) : (
            availableProducts.map((product) => {
              const qty = selections[product.id] || 0;
              const image = getProductImage(product);

              return (
                <div key={product.id} className="product-selection-row">
                  <div className="product-image">
                    {image ? (
                      <img src={image} alt={product.name} />
                    ) : (
                      <div className="image-placeholder">
                        <ShoppingBag size={24} />
                      </div>
                    )}
                  </div>
                  <div className="product-info">
                    <h4>{product.name}</h4>
                    <p className="product-value">
                      Value: {formatPrice(product.price)}
                    </p>
                  </div>
                  <div className="quantity-controls">
                    <button
                      className="qty-btn"
                      onClick={() => handleDecrement(product.id)}
                      disabled={qty === 0}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="qty-value">{qty}</span>
                    <button
                      className="qty-btn"
                      onClick={() => handleIncrement(product.id)}
                      disabled={selectedCount >= totalFreeQty}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  {qty > 0 && (
                    <span className="free-badge">FREE</span>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="modal-footer">
          <div className="savings-info">
            {selectedCount > 0 && (
              <p>
                You're saving{' '}
                <strong>
                  {formatPrice(
                    Object.entries(selections).reduce((sum, [id, qty]) => {
                      const product = availableProducts.find((p) => p.id === parseInt(id));
                      return sum + (product ? parseFloat(product.price) * qty : 0);
                    }, 0)
                  )}
                </strong>
              </p>
            )}
          </div>
          <div className="modal-actions">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirm}
              disabled={selectedCount === 0}
            >
              <Check size={18} />
              Confirm Selection ({selectedCount})
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeItemsModal;
