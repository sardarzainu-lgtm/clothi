import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaHome,
  FaShoppingBag,
  FaShoppingCart,
  FaTag,
  FaShieldAlt,
  FaFileContract,
  FaEnvelope,
  FaPhone,
} from 'react-icons/fa';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-background-dark text-slate-100 pt-16 pb-8 px-6 md:px-12 lg:px-20 border-t border-primary/10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-start md:justify-between gap-12 md:gap-16">
        {/* Brand / About */}
        <div className="space-y-4">
          <h3 className="text-2xl font-light tracking-[0.35em] uppercase text-[#cfaf3a]">MAKHMAL JAN</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Your one-stop destination for premium fashion. Discover the latest trends and timeless classics.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.3em] mb-6 text-[#cfaf3a]">Quick Links</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/" className="flex items-center gap-2 text-slate-300 hover:text-primary transition-colors">
                <FaHome className="text-xs opacity-70 text-[#cfaf3a]" />
                <span className="text-slate-400">Home</span>
              </Link>
            </li>
            <li>
              <Link to="/shop" className="flex items-center gap-2 text-slate-300 hover:text-primary transition-colors">
                <FaShoppingBag className="text-xs opacity-70 text-[#cfaf3a]" />
                <span className="text-slate-400">Shop</span>
              </Link>
            </li>
            <li>
              <Link to="/cart" className="flex items-center gap-2 text-slate-300 hover:text-[#cfaf3a] transition-colors">
                <FaShoppingCart className="text-xs opacity-70 text-[#cfaf3a]" />
                <span className="text-slate-400">Cart</span>
              </Link>
            </li>
            <li>
              <Link
                to="/daily-deals"
                className="flex items-center gap-2 text-slate-300 hover:text-[#cfaf3a] transition-colors"
              >
                <FaTag className="text-xs opacity-70 text-[#cfaf3a]" />
                <span className="text-slate-400">Daily Deals</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.3em] mb-6 text-[#cfaf3a]">Legal</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link
                to="/privacy-policy"
                className="flex items-center gap-2 text-slate-300 hover:text-[#cfaf3a] transition-colors"
              >
                <FaShieldAlt className="text-xs opacity-70 text-[#cfaf3a]" />
                <span className="text-slate-400">Privacy Policy</span>
              </Link>
            </li>
            <li>
              <Link
                to="/terms-and-conditions"
                className="flex items-center gap-2 text-slate-300 hover:text-[#cfaf3a] transition-colors"
              >
                <FaFileContract className="text-xs opacity-70 text-[#cfaf3a]" />
                <span className="text-slate-400">Terms &amp; Conditions</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.3em] mb-6 text-[#cfaf3a]">Contact</h4>
          <div className="flex flex-col gap-3 text-sm text-slate-300">
            <span className="flex items-center gap-2">
              <FaEnvelope className="text-xs opacity-70 text-[#cfaf3a]" />
              <span className="text-slate-400">Email: officialmakhmal@gmail.com</span>
            </span>
            <span className="flex items-center gap-2">
              <FaPhone className="text-xs opacity-70 text-[#cfaf3a]" />
              <span className="text-slate-400">Phone: +92 315-1327729</span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-primary/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500 text-center md:text-left">
          Copyright &copy; {year} MAKHMAL JAN. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

