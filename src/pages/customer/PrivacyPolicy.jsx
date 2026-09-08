import './Legal.css';

const PrivacyPolicy = () => (
  <div className="legal-page">
    <section className="legal-hero">
      <div className="container">
        <h1>Privacy Policy</h1>
        <p>Effective September 8, 2026</p>
      </div>
    </section>

    <main className="legal-content">
      <section>
        <h2>Our Commitment to Your Privacy</h2>
        <p>
          Llama Treats Bakery respects your privacy. This policy explains the information we
          collect when you use our website or place an order, how we use it, and the choices
          available to you.
        </p>
      </section>

      <section>
        <h2>Information We Collect</h2>
        <p>We may collect information you provide directly, including your name, email address, phone number, delivery or pickup details, and order information. We also collect information needed to process payments; payment card details are handled by our payment processor rather than stored by us.</p>
      </section>

      <section>
        <h2>How We Use Your Information</h2>
        <ul>
          <li>Process, fulfill, and communicate with you about your order.</li>
          <li>Provide customer support and respond to your questions.</li>
          <li>Maintain and improve our website, products, and services.</li>
          <li>Meet legal, accounting, and fraud-prevention obligations.</li>
        </ul>
      </section>

      <section>
        <h2>When We Share Information</h2>
        <p>We share information only as needed to run our business, such as with payment processors, delivery providers, and service providers that support our website. We may also disclose information when required by law or to protect our rights, customers, or business.</p>
      </section>

      <section>
        <h2>Cookies and Website Data</h2>
        <p>Our site may use browser storage or similar technologies to remember items in your cart and support site functionality. You can manage these through your browser settings, though doing so may affect some features.</p>
      </section>

      <section>
        <h2>Your Choices and Contact</h2>
        <p>You may contact us to ask about the personal information we hold about you or to request a correction or deletion where applicable. Email us at <a href="mailto:llamatreatsbakery@gmail.com">llamatreatsbakery@gmail.com</a>. We may update this policy from time to time and will post the revised version here.</p>
      </section>
    </main>
  </div>
);

export default PrivacyPolicy;
