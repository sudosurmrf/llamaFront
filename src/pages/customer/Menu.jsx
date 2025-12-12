import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { ProductCard, Loading } from '../../components/common';
import { useBakery } from '../../context/BakeryContext';
import './Menu.css';

const Menu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, categories, loading } = useBakery();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('name');

  const selectedCategory = searchParams.get('category') || 'all';

  const handleCategoryChange = (slug) => {
    if (slug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products].filter((p) => p.active);

    // Filter by category
    if (selectedCategory !== 'all') {
      const category = categories.find((c) => c.slug === selectedCategory);
      if (category) {
        result = result.filter((p) => p.categoryId === category.id);
      }
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term)
      );
    }

    // Sort
    switch (sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    return result;
  }, [products, categories, selectedCategory, searchTerm, sortBy]);

  const activeCategories = categories.filter((c) => c.active);

  if (loading) {
    return <Loading fullScreen text="Loading menu..." />;
  }

  return (
    <div className="menu-page">
      <div className="menu-header">
        <div className="container">
          <h1 className="menu-title">Our Menu</h1>
          <p className="menu-description">
            Explore our selection of freshly baked goods, made with love every day.
          </p>
        </div>
      </div>

      <div className="container">
        <div className="menu-content">
          {/* Sidebar */}
          <aside className={`menu-sidebar ${showFilters ? 'open' : ''}`}>
            <div className="sidebar-header">
              <h3>Filters</h3>
              <button
                className="sidebar-close"
                onClick={() => setShowFilters(false)}
              >
                <X size={24} />
              </button>
            </div>

            <div className="filter-section">
              <h4 className="filter-title">Categories</h4>
              <ul className="category-list">
                <li>
                  <button
                    className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                    onClick={() => handleCategoryChange('all')}
                  >
                    All Items
                  </button>
                </li>
                {activeCategories.map((category) => (
                  <li key={category.id}>
                    <button
                      className={`category-btn ${selectedCategory === category.slug ? 'active' : ''}`}
                      onClick={() => handleCategoryChange(category.slug)}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="filter-section">
              <h4 className="filter-title">Sort By</h4>
              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Name (A-Z)</option>
                <option value="price-low">Price (Low to High)</option>
                <option value="price-high">Price (High to Low)</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </aside>

          {/* Main Content */}
          <div className="menu-main">
            {/* Search and Filter Bar */}
            <div className="menu-toolbar">
              <div className="search-box">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Search our menu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="search-clear"
                    onClick={() => setSearchTerm('')}
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
              <button
                className="filter-toggle"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal size={20} />
                Filters
              </button>
            </div>

            {/* Results Info */}
            <div className="results-info">
              <span>
                Showing {filteredProducts.length}{' '}
                {filteredProducts.length === 1 ? 'item' : 'items'}
                {selectedCategory !== 'all' && (
                  <> in <strong>{activeCategories.find(c => c.slug === selectedCategory)?.name}</strong></>
                )}
              </span>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="menu-grid">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={() => {}}
                    onAddToCart={() => {}}
                  />
                ))}
              </div>
            ) : (
              <div className="no-results">
                <h3>No items found</h3>
                <p>Try adjusting your search or filters to find what you're looking for.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      {showFilters && (
        <div
          className="filter-overlay"
          onClick={() => setShowFilters(false)}
        />
      )}
    </div>
  );
};

export default Menu;
