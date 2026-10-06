import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiPlus, FiAlertCircle } from "react-icons/fi";
import { invoiceAPI } from "../api/invoices";

export default function InvoiceList({ invoiceType }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [ordering, setOrdering] = useState("-created_at");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const params = { type: invoiceType, ordering };
    if (search) params.search = search;

    invoiceAPI
      .getAll(params)
      .then((res) => setInvoices(res.data.results || res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [invoiceType, search, ordering]);

  const isBuy = invoiceType === "buy";
  const formatNumber = (num) => Number(num).toLocaleString("fa-IR");

  return (
    <div className="container" style={{ padding: "30px 20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <h1
          className="section-title"
          style={{
            color: isBuy ? "var(--success)" : "var(--danger)",
            margin: 0,
          }}
        >
          {isBuy ? "🟢 خریدها" : "🔴 فروشها"}
        </h1>
        <Link
          to={`/invoices/new?type=${invoiceType}`}
          className="btn btn-primary"
        >
          <FiPlus /> {isBuy ? "ثبت خرید" : "ثبت فروش"}
        </Link>
      </div>

      <div
        className="card"
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ position: "relative", flex: 1, minWidth: "250px" }}>
          <FiSearch
            style={{
              position: "absolute",
              right: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--gray-400)",
            }}
          />
          <input
            type="text"
            placeholder="جستجو (شماره فاکتور، نام مشتری، تلفن)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingRight: "44px" }}
          />
        </div>
        <select
          value={ordering}
          onChange={(e) => setOrdering(e.target.value)}
          className="form-select"
          style={{ width: "200px" }}
        >
          <option value="-created_at">جدیدترین</option>
          <option value="created_at">قدیمی‌ترین</option>
          <option value="-total_price">گران‌ترین</option>
          <option value="total_price">ارزان‌ترین</option>
          <option value="-weight">سنگین‌ترین</option>
        </select>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : invoices.length === 0 ? (
        <div className="card empty-state">
          <h3>هیچ فاکتوری ثبت نشده</h3>
          <p>اولین فاکتور رو ثبت کن</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>شماره فاکتور</th>
                <th>نام مشتری</th>
                <th>شماره تماس</th>
                <th>تاریخ</th>
                <th>عیار</th>
                <th>وزن (گرم)</th>
                <th>قیمت هر گرم</th>
                <th>جمع کل</th>
              </tr>
            </thead>
            <tbody>
              هیچ{" "}
              {invoices.map((inv) => (
                <tr
                  key={inv.id}
                  onClick={() => navigate(`/invoices/${inv.id}`)}
                  style={{
                    cursor: "pointer",
                    background: inv.is_demo ? "#fef3c7" : "white",
                  }}
                >
                  <td>
                    <strong>{inv.invoice_number}</strong>
                    {inv.is_demo && (
                      <span
                        style={{
                          marginRight: "8px",
                          fontSize: "11px",
                          background: "#f59e0b",
                          color: "white",
                          padding: "2px 8px",
                          borderRadius: "999px",
                        }}
                      >
                        دمو
                      </span>
                    )}
                  </td>
                  <td>{inv.customer_name}</td>
                  <td>{inv.customer_phone}</td>
                  <td>{inv.jalali_date}</td>
                  <td>{inv.karat}</td>
                  <td>{formatNumber(inv.weight)}</td>
                  <td>{formatNumber(inv.price_per_gram)}</td>
                  <td>
                    <strong
                      style={{
                        color: isBuy ? "var(--success)" : "var(--danger)",
                      }}
                    >
                      {formatNumber(inv.total_price)}
                    </strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
