import { Link } from 'react-router-dom';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import styles from './Footer.styles.module.css';
import React from 'react';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <section className={styles['footer-nav']}>
        <p className={`text-uppercase ${styles['footer-side-heading']}`}>get help</p>
        <Link to="#">Frequently Asked Questions</Link>
        <Link to="orders">Orders Status</Link>
        <Link to="#">Returns</Link>
        <Link to="#">Feedback</Link>
      </section>
      <section className={styles['footer-contact']}>
        <p className={`text-uppercase ${styles['footer-side-heading']}`}>connect with us</p>
        <div className={styles['footer-contact-icons']}>
          <a href="https://www.linkedin.com/in/muralidhar-akkireddy-91b673158/" target="_blank" rel="noreferrer">
            <FaLinkedin />
          </a>
          <a href="https://github.com/Muralidhar22" target="_blank" rel="noreferrer">
            <FaGithub />
          </a>
        </div>
      </section>
      <div className={styles['footer-note']}>
        <div className="logo-container">
          &#169;
          <span
            className={`text-uppercase logo-text`}
            style={
              {
                '--fs-logo-text': '1rem',
              } as React.CSSProperties
            }
          >
            Game
          </span>
          <span
            className={`logo-x ${styles['footer-logo-x-mark']}`}
            style={
              {
                '--logo-x-mark-width': '1rem',
                '--logo-x-mark-height': '1rem',
                '--logo-strike-width': '2px',
                '--logo-strike-height': '12px',
              } as React.CSSProperties
            }
          ></span>
        </div>
        <span>2000 - 2022 Online store of digital goods. All rights reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;
