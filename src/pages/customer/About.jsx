import { Users, Award, Heart, Leaf } from 'lucide-react';
import './About.css';

const About = () => {
  const values = [
    {
      icon: Heart,
      title: 'Made with Love',
      description: 'Every item is crafted with care and attention to detail, as if we were baking for our own family.',
    },
    {
      icon: Leaf,
      title: 'Quality Ingredients',
      description: 'We source the finest ingredients, supporting local farms and sustainable suppliers whenever possible.',
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'We believe in building relationships with our customers and giving back to our community.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We strive for perfection in every batch, constantly improving our recipes and techniques.',
    },
  ];

  const team = [
    {
      name: 'Leslie Eleiott',
      role: 'Head Baker & Founder',
      bio: 'With over 20 years of baking experience, Leslie brings traditional techniques from her grandmother combined with modern innovation.',
    },
    {
    name: 'Jonathan Eleiott',
    role: 'Head Pastry Consumer',
    bio: 'Trained extensively at the counter, Jonathan specializes in quality control through enthusiastic sampling. Responsible for approving croissants, danishes, and anything with butter.',
    },
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <h1 className="about-title">Our Story</h1>
          <p className="about-subtitle">
            A passion for baking that started in a small kitchen has grown into
            a beloved neighborhood bakery.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="about-story">
        <div className="container">
          <div className="story-content">
            <div className="story-text">
              <h2>How It All Began</h2>
              <p>
                Llama Treats Bakery was born in 2018 from a simple dream: to create
                a place where the aroma of freshly baked goods fills the air and
                every bite brings joy. What started as a small operation in founder
                Leslie's home kitchen quickly grew as word spread about our
                delicious cookies and pastries.
              </p>
              <p>
                Our name comes from Leslie's favorite animal. The llama, a symbol of hard work
                and endurance in Peruvian culture, perfectly represents our
                dedication to our craft.
              </p>
              <p>
                Today, we operate from our cozy bakery in our home, but our
                philosophy remains the same: use the best ingredients, honor
                traditional techniques, and always bake with love.
              </p>
            </div>
            <div className="story-image">
              <div className="image-placeholder">
                <span>🦙</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-values">
        <div className="container">
          <h2 className="section-title">Our Values</h2>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">
                  <value.icon size={28} />
                </div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-team">
        <div className="container">
          <h2 className="section-title">Meet Our Team</h2>
          <p className="section-subtitle">
            The talented people behind your favorite treats
          </p>
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-avatar">
                  <span>{member.name.charAt(0)}</span>
                </div>
                <h3 className="team-name">{member.name}</h3>
                <span className="team-role">{member.role}</span>
                <p className="team-bio">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="about-timeline">
        <div className="container">
          <h2 className="section-title">Our Journey</h2>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-year">2018</div>
              <div className="timeline-content">
                <h3>The Beginning</h3>
                <p>Started baking from home, selling at local farmers markets.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-year">2019</div>
              <div className="timeline-content">
                <h3>First Storefront</h3>
                <p>Opened our first small bakery location on Oak Street.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-year">2021</div>
              <div className="timeline-content">
                <h3>Expansion</h3>
                <p>Moved to our current larger location with a full production kitchen.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-year">2023</div>
              <div className="timeline-content">
                <h3>Award Winner</h3>
                <p>Recognized as "Best Local Bakery" by the City Food Awards.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-year">Today</div>
              <div className="timeline-content">
                <h3>Growing Strong</h3>
                <p>Continuing to serve our community with fresh, delicious baked goods daily.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
