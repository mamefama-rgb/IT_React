// client/src/components/layout/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>
          &copy; {new Date().getFullYear()} Ticket It - Système de gestion de tickets
        </p>
      </div>
    </footer>
  );
};

export default Footer;