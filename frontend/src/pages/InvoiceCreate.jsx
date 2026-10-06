import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiSave, FiX } from "react-icons/fi";
import { invoiceAPI } from "../api/invoices";

export default function InvoiceCreate() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    invoice_type: searchParams.get("type") || "buy",
    customer_name: "",
    customer_phone: "",
    jalali_date: "",
    karat: 18,
    weight: "",
    price_per_gram: "",
    wage: 0,
    total_price: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await invoiceAPI.create(form);
      navigate(form.invoice_type === "buy" ? "/buy" : "/sell");
    } catch (err) {
      setError(err.response?.data?.message || "خطا در ثبت فاکتور");
    } finally {
      setLoading(false);
    }
  };

  const isBuy = form.invoice_type === "buy";

  return (
    <div
      className="container"
      style={{ padding: "30px 20px", maxWidth: "900px" }}
    >
      <div className="card fade-in">
        <h1
          className="section-title"
          style={{ color: isBuy ? "var(--success)" : "var(--danger)" }}
        >
          {isBuy ? "🟢 ثبت خرید جدید" : "🔴 ثبت فروش جدید"}
        </h1>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* نوع فاکتور */}
          <div className="form-group">
            <label className="form-label">نوع فاکتور *</label>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="button"
                onClick={() => setForm({ ...form, invoice_type: "buy" })}
                className={`btn ${isBuy ? "btn-success" : "btn-outline"}`}
                style={{ flex: 1 }}
              >
                🟢 خرید
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, invoice_type: "sell" })}
                className={`btn ${!isBuy ? "btn-danger" : "btn-outline"}`}
                style={{ flex: 1 }}
              >
                🔴 فروش
              </button>
            </div>
          </div>

          {/* نام و تلفن */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">نام مشتری *</label>
              <input
                type="text"
                value={form.customer_name}
                onChange={(e) =>
                  setForm({ ...form, customer_name: e.target.value })
                }
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">شماره تماس *</label>
              <input
                type="text"
                value={form.customer_phone}
                onChange={(e) =>
                  setForm({ ...form, customer_phone: e.target.value })
                }
                className="form-input"
                required
              />
            </div>
          </div>

          {/* تاریخ */}
          <div className="form-group">
            <label className="form-label">تاریخ معامله (شمسی) *</label>
            <input
              type="text"
              value={form.jalali_date}
              onChange={(e) =>
                setForm({ ...form, jalali_date: e.target.value })
              }
              placeholder="1405/07/15"
              className="form-input"
              required
            />
          </div>

          {/* عیار و وزن */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">عیار *</label>
              <select
                value={form.karat}
                onChange={(e) => setForm({ ...form, karat: e.target.value })}
                className="form-select"
                required
              >
                <option value="18">۱۸ عیار</option>
                <option value="21">۲۱ عیار</option>
                <option value="24">۲۴ عیار</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">وزن (گرم) *</label>
              <input
                type="number"
                step="0.001"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                className="form-input"
                required
              />
            </div>
          </div>

          {/* قیمت هر گرم */}
          <div className="form-group">
            <label className="form-label">
              قیمت هر گرم طلا در زمان معامله *
            </label>
            <input
              type="number"
              value={form.price_per_gram}
              onChange={(e) =>
                setForm({ ...form, price_per_gram: e.target.value })
              }
              className="form-input"
              required
            />
          </div>

          {/* اجرت */}
          <div className="form-group">
            <label className="form-label">اجرت</label>
            <input
              type="number"
              value={form.wage}
              onChange={(e) => setForm({ ...form, wage: e.target.value })}
              className="form-input"
            />
          </div>

          {/* قیمت انجام شده معامله */}
          <div className="form-group">
            <label className="form-label">قیمت انجام شده معامله *</label>
            <input
              type="number"
              value={form.total_price}
              onChange={(e) =>
                setForm({ ...form, total_price: e.target.value })
              }
              className="form-input"
              required
            />
          </div>

          {/* توضیحات */}
          <div className="form-group">
            <label className="form-label">توضیحات</label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="form-textarea"
              rows="3"
            />
          </div>

          {/* دکمه‌ها */}
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              <FiSave /> {loading ? "در حال ثبت..." : "ثبت فاکتور"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-outline"
            >
              <FiX /> انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
