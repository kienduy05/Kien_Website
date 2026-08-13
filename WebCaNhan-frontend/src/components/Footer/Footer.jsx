import React from 'react';
import './Footer.css';

// SVG Icons
const GithubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.5-1.4 6.5-7a4.6 4.6 0 0 0-1.3-3.2 4 4 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4 4 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5.6 3.3 6.6 6.5 7a4.8 4.8 0 0 0-1 3.02V22"></path>
  </svg>
);

const LinkedinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const ArrowUpIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m18 15-6-6-6 6"></path>
  </svg>
);

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '6px' }}>
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('hello@kien.dev');
    alert('Email copied to clipboard!');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="client-footer">
      <div className="footer-container">

        {/* Top Section: 4-Column Layout */}
        <div className="footer-top">

          {/* Col 1: Brand & Bio */}
          <div className="footer-col brand-col">
            <h3 className="footer-logo">
              Kien<span className="logo-dot">.</span>
            </h3>
            <p className="footer-bio">
              Building software systems that solve real-world problems. Full-stack Developer & BA.
            </p>
            <div className="footer-socials">
              <a href="#" className="social-icon-wrapper" title="GitHub">
                <GithubIcon />
              </a>
              <a href="#" className="social-icon-wrapper" title="LinkedIn">
                <LinkedinIcon />
              </a>
              <a href="#" className="social-icon-wrapper" title="Email">
                <MailIcon />
              </a>
              <a href="#" className="social-icon-wrapper" title="Facebook">
                <FacebookIcon />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="footer-col">
            <h4 className="footer-heading">Navigation</h4>
            <ul className="footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#experience">Experience</a></li>
              <li><a href="#projects">Projects</a></li>
              <li><a href="#blog">Blog</a></li>
            </ul>
          </div>

          {/* Col 3: Academic & Skills */}
          <div className="footer-col">
            <h4 className="footer-heading">Explore</h4>
            <ul className="footer-links">
              <li><a href="#university">University Projects</a></li>
              <li><a href="#skills">Skills</a></li>
              <li><a href="#lab">Lab / Experiments</a></li>
              <li><a href="#notes">Notes</a></li>
            </ul>
          </div>

          {/* Col 4: Status & Contact */}
          <div className="footer-col status-col">
            <h4 className="footer-heading">Status</h4>

            <div className="status-indicator">
              <div className="pulse-dot"></div>
              <span>Open for Intern / Full-time roles</span>
            </div>

            <div className="contact-quick">
              <p className="contact-label">Get in touch</p>
              <button className="copy-email-btn" onClick={handleCopyEmail}>
                hello@kien.dev <CopyIcon />
              </button>
            </div>

            <button className="back-to-top" onClick={scrollToTop}>
              Back to Top <ArrowUpIcon />
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="copyright">
            &copy; {currentYear} Nguyen Duy Kien. Designed & Built with passion.
          </p>
          <div className="system-status">
            System Status: Online 🟢
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
