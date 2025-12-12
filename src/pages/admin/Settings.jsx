import { useState } from 'react';
import { Save, Store, Clock, Bell, Palette } from 'lucide-react';
import { Button, Input, TextArea } from '../../components/common';
import './AdminPages.css';

const Settings = () => {
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const [settings, setSettings] = useState({
    // General
    bakeryName: 'Llama Treats Bakery',
    tagline: 'Handcrafted baked goods made with love',
    email: 'hello@llamatreats.com',
    phone: '(555) 123-4567',
    address: '123 Bakery Lane\nSweet Town, ST 12345',

    // Hours
    mondayHours: '7:00 AM - 7:00 PM',
    tuesdayHours: '7:00 AM - 7:00 PM',
    wednesdayHours: '7:00 AM - 7:00 PM',
    thursdayHours: '7:00 AM - 7:00 PM',
    fridayHours: '7:00 AM - 7:00 PM',
    saturdayHours: '7:00 AM - 7:00 PM',
    sundayHours: '8:00 AM - 2:00 PM',

    // Social
    instagram: '',
    facebook: '',
    twitter: '',

    // Notifications
    emailNotifications: true,
    orderAlerts: true,
    lowStockAlerts: true,

    // Theme
    primaryColor: '#5c3d2e',
    secondaryColor: '#f8e8d4',
    accentColor: '#7a5240',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    // Simulate saving
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    alert('Settings saved successfully!');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Store },
    { id: 'hours', label: 'Business Hours', icon: Clock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'theme', label: 'Theme', icon: Palette },
  ];

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your bakery settings and preferences</p>
        </div>
      </div>

      <div className="settings-layout">
        <nav className="settings-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`settings-nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </nav>

        <form onSubmit={handleSubmit} className="settings-content">
          {activeTab === 'general' && (
            <div className="settings-section">
              <h2>General Information</h2>
              <div className="settings-fields">
                <Input
                  label="Bakery Name"
                  name="bakeryName"
                  value={settings.bakeryName}
                  onChange={handleChange}
                />
                <Input
                  label="Tagline"
                  name="tagline"
                  value={settings.tagline}
                  onChange={handleChange}
                />
                <div className="form-row">
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={settings.email}
                    onChange={handleChange}
                  />
                  <Input
                    label="Phone"
                    name="phone"
                    value={settings.phone}
                    onChange={handleChange}
                  />
                </div>
                <TextArea
                  label="Address"
                  name="address"
                  value={settings.address}
                  onChange={handleChange}
                  rows={3}
                />
                <h3>Social Media</h3>
                <Input
                  label="Instagram URL"
                  name="instagram"
                  value={settings.instagram}
                  onChange={handleChange}
                  placeholder="https://instagram.com/llamatreats"
                />
                <Input
                  label="Facebook URL"
                  name="facebook"
                  value={settings.facebook}
                  onChange={handleChange}
                  placeholder="https://facebook.com/llamatreats"
                />
                <Input
                  label="Twitter URL"
                  name="twitter"
                  value={settings.twitter}
                  onChange={handleChange}
                  placeholder="https://twitter.com/llamatreats"
                />
              </div>
            </div>
          )}

          {activeTab === 'hours' && (
            <div className="settings-section">
              <h2>Business Hours</h2>
              <div className="settings-fields hours-grid">
                <Input
                  label="Monday"
                  name="mondayHours"
                  value={settings.mondayHours}
                  onChange={handleChange}
                />
                <Input
                  label="Tuesday"
                  name="tuesdayHours"
                  value={settings.tuesdayHours}
                  onChange={handleChange}
                />
                <Input
                  label="Wednesday"
                  name="wednesdayHours"
                  value={settings.wednesdayHours}
                  onChange={handleChange}
                />
                <Input
                  label="Thursday"
                  name="thursdayHours"
                  value={settings.thursdayHours}
                  onChange={handleChange}
                />
                <Input
                  label="Friday"
                  name="fridayHours"
                  value={settings.fridayHours}
                  onChange={handleChange}
                />
                <Input
                  label="Saturday"
                  name="saturdayHours"
                  value={settings.saturdayHours}
                  onChange={handleChange}
                />
                <Input
                  label="Sunday"
                  name="sundayHours"
                  value={settings.sundayHours}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2>Notification Preferences</h2>
              <div className="settings-fields">
                <label className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={settings.emailNotifications}
                    onChange={handleChange}
                    className="checkbox"
                  />
                  <span className="checkbox-label">
                    <strong>Email Notifications</strong>
                    <br />
                    <small>Receive important updates via email</small>
                  </span>
                </label>
                <label className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    name="orderAlerts"
                    checked={settings.orderAlerts}
                    onChange={handleChange}
                    className="checkbox"
                  />
                  <span className="checkbox-label">
                    <strong>Order Alerts</strong>
                    <br />
                    <small>Get notified when new orders come in</small>
                  </span>
                </label>
                <label className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    name="lowStockAlerts"
                    checked={settings.lowStockAlerts}
                    onChange={handleChange}
                    className="checkbox"
                  />
                  <span className="checkbox-label">
                    <strong>Low Stock Alerts</strong>
                    <br />
                    <small>Get notified when inventory is running low</small>
                  </span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="settings-section">
              <h2>Theme Colors</h2>
              <p className="section-hint">
                Customize the colors used throughout your bakery website.
              </p>
              <div className="settings-fields color-settings">
                <div className="color-input-group">
                  <label className="input-label">Primary Color</label>
                  <div className="color-input-wrapper">
                    <input
                      type="color"
                      name="primaryColor"
                      value={settings.primaryColor}
                      onChange={handleChange}
                      className="color-input"
                    />
                    <Input
                      name="primaryColor"
                      value={settings.primaryColor}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="color-input-group">
                  <label className="input-label">Secondary Color</label>
                  <div className="color-input-wrapper">
                    <input
                      type="color"
                      name="secondaryColor"
                      value={settings.secondaryColor}
                      onChange={handleChange}
                      className="color-input"
                    />
                    <Input
                      name="secondaryColor"
                      value={settings.secondaryColor}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="color-input-group">
                  <label className="input-label">Accent Color</label>
                  <div className="color-input-wrapper">
                    <input
                      type="color"
                      name="accentColor"
                      value={settings.accentColor}
                      onChange={handleChange}
                      className="color-input"
                    />
                    <Input
                      name="accentColor"
                      value={settings.accentColor}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="settings-actions">
            <Button type="submit" loading={saving} icon={Save}>
              Save Settings
            </Button>
          </div>
        </form>
      </div>

      <style>{`
        .settings-layout {
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 1.5rem;
        }
        .settings-nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .settings-nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border: none;
          border-radius: 8px;
          background: none;
          font-size: 0.9375rem;
          color: #5c3d2e;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
        }
        .settings-nav-item:hover {
          background-color: #f8e8d4;
        }
        .settings-nav-item.active {
          background-color: #5c3d2e;
          color: white;
        }
        .settings-content {
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(92, 61, 46, 0.06);
        }
        .settings-section {
          padding: 1.5rem;
        }
        .settings-section h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #5c3d2e;
          margin: 0 0 0.5rem;
        }
        .settings-section h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #5c3d2e;
          margin: 1.5rem 0 0.75rem;
        }
        .section-hint {
          font-size: 0.875rem;
          color: #7a5240;
          margin: 0 0 1.5rem;
        }
        .settings-fields {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1rem;
        }
        .hours-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        .color-settings {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
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
        .settings-actions {
          padding: 1.5rem;
          border-top: 1px solid #f0e5d8;
          background-color: #fdfbf9;
          border-radius: 0 0 12px 12px;
          display: flex;
          justify-content: flex-end;
        }
        @media (max-width: 768px) {
          .settings-layout {
            grid-template-columns: 1fr;
          }
          .settings-nav {
            flex-direction: row;
            overflow-x: auto;
            padding-bottom: 8px;
          }
          .settings-nav-item {
            white-space: nowrap;
          }
          .hours-grid,
          .color-settings {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Settings;
