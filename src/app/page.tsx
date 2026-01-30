'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Palette, Sparkles, Zap, Heart, Shield } from 'lucide-react';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Palette size={32} />,
      title: 'Intuitive Editor',
      description: 'Drag, drop, and design with our powerful yet simple canvas editor'
    },
    {
      icon: <BookOpen size={32} />,
      title: 'Premium Quality',
      description: 'Professional-grade printing on premium paper stock'
    },
    {
      icon: <Sparkles size={32} />,
      title: 'Custom Layouts',
      description: 'Choose from dozens of templates or create your own unique design'
    },
    {
      icon: <Zap size={32} />,
      title: 'Fast Delivery',
      description: 'Your photobook printed and shipped within 48 hours'
    },
    {
      icon: <Heart size={32} />,
      title: 'Made with Love',
      description: 'Every photobook is crafted with attention to detail'
    },
    {
      icon: <Shield size={32} />,
      title: 'Secure & Private',
      description: 'Your photos are encrypted and never shared'
    }
  ];

  return (
    <main className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title animate-slide-up">
              Your memories deserve
              <br />
              <span className="gradient-text">something beautiful</span>
            </h1>
            <p className="hero-subtitle animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Create stunning photobooks that tell your story.
              <br />
              Professional quality, effortlessly designed.
            </p>
            <div className="hero-cta animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <a href="/signup" className="btn btn-primary btn-large">
                Get Started
              </a>
              <a href="/login" className="btn btn-outline btn-large">
                Log In
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why choose us</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to get started?</h2>
            <p className="cta-subtitle">
              Join thousands of happy customers creating beautiful photobooks
            </p>
            <a href="/signup" className="btn btn-primary btn-large">
              Create Your Photobook
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
