import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Developer",
      content: "SkillHub transformed my career. The hands-on approach and expert guidance helped me land my dream job in just 6 months!",
      avatar: "👩‍💻"
    },
    {
      name: "Michael Chen",
      role: "UX Designer",
      content: "The design courses here are incredible. I learned industry-standard tools and techniques that I use every day at work.",
      avatar: "👨‍🎨"
    },
    {
      name: "Emily Rodriguez",
      role: "Marketing Manager",
      content: "The marketing courses gave me the confidence to lead my team and implement strategies that actually work.",
      avatar: "👩‍💼"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">✨</span>
            <span>Trusted by 10,000+ learners worldwide</span>
          </div>
          <h1 className="hero-title">
            Master New Skills with
                    <span className="gradient-text"> SkillHub</span>
          </h1>
          <p className="hero-description">
            Join thousands of learners in our comprehensive skill development platform. 
            From programming to design, marketing to management - unlock your potential today.
          </p>
          <div className="hero-buttons">
            {!isAuthenticated() ? (
              <>
                <Link to="/register" className="btn btn-primary btn-large">
                  <span className="btn-icon">🚀</span>
                  Get Started Free
                </Link>
                <Link to="/login" className="btn btn-secondary btn-large">
                  <span className="btn-icon">🔑</span>
                  Sign In
                </Link>
              </>
            ) : (
              <Link to={user?.role === 'student' ? '/student-dashboard' : '/faculty-dashboard'} className="btn btn-primary btn-large">
                <span className="btn-icon">📊</span>
                Go to Dashboard
              </Link>
            )}
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Students</div>
            </div>
            <div className="hero-stat">
              <div className="stat-number">500+</div>
              <div className="stat-label">Courses</div>
            </div>
            <div className="hero-stat">
              <div className="stat-number">95%</div>
              <div className="stat-label">Success Rate</div>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <div className="floating-cards">
            <div className="card card-1">
              <div className="card-icon">📚</div>
              <div className="card-text">Learn</div>
            </div>
            <div className="card card-2">
              <div className="card-icon">💻</div>
              <div className="card-text">Code</div>
            </div>
            <div className="card card-3">
              <div className="card-icon">🎨</div>
              <div className="card-text">Design</div>
            </div>
            <div className="card card-4">
              <div className="card-icon">📊</div>
              <div className="card-text">Analyze</div>
            </div>
            <div className="card card-5">
              <div className="card-icon">🚀</div>
              <div className="card-text">Launch</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose SkillHub?</h2>
            <p className="section-subtitle">Everything you need to succeed in your learning journey</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">🎯</div>
              </div>
              <h3>Expert-Led Courses</h3>
              <p>Learn from industry professionals with years of real-world experience and proven track records.</p>
              <div className="feature-highlight">Industry Experts</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">📱</div>
              </div>
              <h3>Flexible Learning</h3>
              <p>Study at your own pace with mobile-friendly, on-demand content that fits your schedule.</p>
              <div className="feature-highlight">Self-Paced</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">🏆</div>
              </div>
              <h3>Certification</h3>
              <p>Earn recognized certificates upon course completion that boost your professional profile.</p>
              <div className="feature-highlight">Verified Certificates</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">👥</div>
              </div>
              <h3>Community</h3>
              <p>Connect with fellow learners and industry experts in our vibrant learning community.</p>
              <div className="feature-highlight">Active Community</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">💡</div>
              </div>
              <h3>Hands-On Projects</h3>
              <p>Apply your knowledge through real-world projects and build an impressive portfolio.</p>
              <div className="feature-highlight">Project-Based</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">🔄</div>
              </div>
              <h3>Lifetime Access</h3>
              <p>Keep access to your courses forever and stay updated with the latest content.</p>
              <div className="feature-highlight">Forever Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What Our Students Say</h2>
            <p className="section-subtitle">Real stories from real learners</p>
          </div>
          <div className="testimonials-container">
            <div className="testimonial-card active">
              <div className="testimonial-content">
                <div className="testimonial-avatar">{testimonials[currentTestimonial].avatar}</div>
                <blockquote className="testimonial-quote">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>
                <div className="testimonial-author">
                  <div className="author-name">{testimonials[currentTestimonial].name}</div>
                  <div className="author-role">{testimonials[currentTestimonial].role}</div>
                </div>
              </div>
            </div>
            <div className="testimonial-indicators">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentTestimonial ? 'active' : ''}`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Active Students</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Expert Instructors</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1,200+</div>
              <div className="stat-label">Courses Available</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">95%</div>
              <div className="stat-label">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Learning Journey?</h2>
            <p>Join our community of learners and start building the skills you need for tomorrow.</p>
            {!isAuthenticated() && (
              <Link to="/register" className="btn btn-primary btn-large">
                Start Learning Today
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

