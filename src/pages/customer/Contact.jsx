import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { Button, Input, TextArea } from '../../components/common';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSubmitting(false);
    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Us',
      lines: ['123 Bakery Lane', 'Sweet Town, ST 12345'],
    },
    {
      icon: Phone,
      title: 'Call Us',
      lines: ['(555) 123-4567', 'Mon-Sat: 7am-7pm'],
    },
    {
      icon: Mail,
      title: 'Email Us',
      lines: ['hello@llamatreats.com', 'orders@llamatreats.com'],
    },
    {
      icon: Clock,
      title: 'Hours',
      lines: ['Mon-Sat: 7am - 7pm', 'Sunday: 8am - 2pm'],
    },
  ];

  return (
    <div className="contact-page">
      {/* Header */}
      <section className="contact-hero">
        <div className="container">
          <h1 className="contact-title">Get in Touch</h1>
          <p className="contact-subtitle">
            Have questions about custom orders, catering, or just want to say hello?
            We'd love to hear from you!
          </p>
        </div>
      </section>

      <div className="container">
        <div className="contact-content">
          {/* Contact Form */}
          <div className="contact-form-section">
            <h2>Send Us a Message</h2>
            {submitted ? (
              <div className="form-success">
                <div className="success-icon">
                  <Send size={32} />
                </div>
                <h3>Message Sent!</h3>
                <p>
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
                <Button onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <Input
                    label="Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                  />
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                  />
                </div>
                <div className="form-row">
                  <Input
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(555) 123-4567"
                  />
                  <Input
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Custom Order Inquiry"
                  />
                </div>
                <TextArea
                  label="Your Message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Tell us what you're looking for..."
                />
                <Button
                  type="submit"
                  loading={submitting}
                  icon={Send}
                  iconPosition="right"
                >
                  Send Message
                </Button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="contact-info-section">
            <h2>Contact Information</h2>
            <div className="contact-info-grid">
              {contactInfo.map((info, index) => (
                <div key={index} className="contact-info-card">
                  <div className="info-icon">
                    <info.icon size={24} />
                  </div>
                  <div>
                    <h3>{info.title}</h3>
                    {info.lines.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Map Placeholder */}
            <div className="map-section">
              <h3>Find Us</h3>
              <div className="map-placeholder">
                <MapPin size={48} />
                <p>Interactive map will be displayed here</p>
                <span>123 Bakery Lane, Sweet Town, ST 12345</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>Do you accept custom orders?</h3>
              <p>
                Yes! We love creating custom cakes and treats for special occasions.
                Please contact us at least 2 weeks in advance for custom orders.
              </p>
            </div>
            <div className="faq-item">
              <h3>Do you offer delivery?</h3>
              <p>
                We offer free local delivery on orders over $35 within 10 miles of our
                bakery. Additional delivery options are available for larger orders.
              </p>
            </div>
            <div className="faq-item">
              <h3>Can you accommodate dietary restrictions?</h3>
              <p>
                We offer gluten-free and vegan options for many of our items. Please
                let us know your dietary needs when ordering, and we'll do our best
                to accommodate.
              </p>
            </div>
            <div className="faq-item">
              <h3>Do you provide catering?</h3>
              <p>
                Yes! We cater events of all sizes, from office meetings to weddings.
                Contact us to discuss your catering needs and get a custom quote.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
