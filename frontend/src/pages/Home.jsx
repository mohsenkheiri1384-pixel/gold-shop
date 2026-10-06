import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiShoppingBag, FiTrendingUp, FiPlusCircle } from "react-icons/fi";
import { invoiceAPI } from "../api/invoices";

export default function Home() {
  const [stats, setStats] = useState({
    total_invoices: 0,
    today_invoices: 0,
    total_buy: 0,
    total_sell: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    invoiceAPI
      .stats()
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const formatNumber = (num) => Number(num).toLocaleString("fa-IR");

  return (
    <div className="container" style={{ padding: "40px 20px" }}>
      <div className="hero-card fade-in">
        <h1 className="hero-title"> سیستم مدیریت طلافروشی</h1>
      </div>

      <h2 className="section-title">دسترسی سریع</h2>
      <div className="quick-menu">
        <Link to="/buy" className="quick-card quick-card-buy">
          <div className="quick-card-icon">
            <FiShoppingBag size={32} />
          </div>
          <h3 className="quick-card-title">خریدها</h3>
          <p className="quick-card-desc">مشاهده‌ی همه‌ی خریدها</p>
        </Link>
        <Link to="/sell" className="quick-card quick-card-sell">
          <div className="quick-card-icon">
            <FiTrendingUp size={32} />
          </div>
          <h3 className="quick-card-title">فروشها</h3>
          <p className="quick-card-desc">مشاهده‌ی همه‌ی فروشها</p>
        </Link>
        <Link
          to="/invoices/new?type=buy"
          className="quick-card quick-card-new-buy"
        >
          <div className="quick-card-icon">
            <FiPlusCircle size={32} />
          </div>
          <h3 className="quick-card-title">ثبت خرید</h3>
          <p className="quick-card-desc">ثبت فاکتور خرید جدید</p>
        </Link>
        <Link
          to="/invoices/new?type=sell"
          className="quick-card quick-card-new-sell"
        >
          <div className="quick-card-icon">
            <FiPlusCircle size={32} />
          </div>
          <h3 className="quick-card-title">ثبت فروش</h3>
          <p className="quick-card-desc">ثبت فاکتور فروش جدید</p>
        </Link>
      </div>

      <h2 className="section-title" style={{ marginTop: "40px" }}>
        آمار
      </h2>
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">کل فاکتورها</div>
            <div className="stat-value">
              {formatNumber(stats.total_invoices)}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">فاکتورهای امروز</div>
            <div className="stat-value">
              {formatNumber(stats.today_invoices)}
            </div>
          </div>
          <div className="stat-card stat-card-buy">
            <div className="stat-label">جمع خریدها</div>
            <div className="stat-value">{formatNumber(stats.total_buy)}</div>
            <div className="stat-unit">تومان</div>
          </div>
          <div className="stat-card stat-card-sell">
            <div className="stat-label">جمع فروشها</div>
            <div className="stat-value">{formatNumber(stats.total_sell)}</div>
            <div className="stat-unit">تومان</div>
          </div>
        </div>
      )}
    </div>
  );
}
