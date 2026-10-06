import { Link, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiShoppingBag,
  FiTrendingUp,
  FiPlusCircle,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <div className="navbar-brand-icon">🪙</div>
          <span className="navbar-brand-text">MERSEDEH</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className="navbar-link">
            <FiHome /> داشبورد
          </Link>
          <Link to="/buy" className="navbar-link">
            <FiShoppingBag /> خریدها
          </Link>
          <Link to="/sell" className="navbar-link">
            <FiTrendingUp /> فروشها
          </Link>
          <Link to="/invoices/new" className="btn btn-primary">
            <FiPlusCircle /> فاکتور جدید
          </Link>

          {user ? (
            <>
              <span className="navbar-link">
                <FiUser /> {user.username}
              </span>
              <button onClick={handleLogout} className="navbar-link">
                <FiLogOut /> خروج
              </button>
            </>
          ) : (
            <Link to="/login" className="navbar-link">
              <FiUser /> ورود ادمین
            </Link>
          )}
        </div>

        <button className="navbar-toggle" onClick={() => setOpen(!open)}>
          {open ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {open && (
        <div className="navbar-mobile">
          <Link
            to="/"
            className="navbar-mobile-link"
            onClick={() => setOpen(false)}
          >
            <FiHome /> داشبورد
          </Link>
          <Link
            to="/buy"
            className="navbar-mobile-link"
            onClick={() => setOpen(false)}
          >
            <FiShoppingBag /> خریدها
          </Link>
          <Link
            to="/sell"
            className="navbar-mobile-link"
            onClick={() => setOpen(false)}
          >
            <FiTrendingUp /> فروشها
          </Link>
          <Link
            to="/invoices/new"
            className="navbar-mobile-link"
            onClick={() => setOpen(false)}
          >
            <FiPlusCircle /> فاکتور جدید
          </Link>
          {user ? (
            <button onClick={handleLogout} className="navbar-mobile-link">
              <FiLogOut /> خروج
            </button>
          ) : (
            <Link
              to="/login"
              className="navbar-mobile-link"
              onClick={() => setOpen(false)}
            >
              ورود
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
