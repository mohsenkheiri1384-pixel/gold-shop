import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowRight, FiTrash2, FiPrinter } from "react-icons/fi";
import { invoiceAPI } from "../api/invoices";

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    invoiceAPI
      .getOne(id)
      .then((res) => setInvoice(res.data))
      .catch((err) => {
        console.error(err);
        navigate("/");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm("مطمئنی می‌خوای این فاکتور رو حذف کنی؟")) return;

    try {
      await invoiceAPI.delete(id);
      navigate(invoice.invoice_type === "buy" ? "/buy" : "/sell");
    } catch (err) {
      alert("خطا در حذف فاکتور");
    }
  };

  const formatNumber = (num) => Number(num).toLocaleString("fa-IR");

  if (loading) return <div className="spinner"></div>;
  if (!invoice) return null;

  const isBuy = invoice.invoice_type === "buy";

  return (
    <div
      className="container"
      style={{ padding: "30px 20px", maxWidth: "900px" }}
    >
      {/* دکمه بازگشت */}
      <button
        onClick={() => navigate(-1)}
        className="navbar-link"
        style={{ marginBottom: "20px" }}
      >
        <FiArrowRight /> بازگشت
      </button>

      <div className="card fade-in">
        {/* هدر */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: "800",
                marginBottom: "8px",
              }}
            >
              فاکتور {invoice.invoice_number}
            </h1>
            <span
              className={`badge ${isBuy ? "badge-success" : "badge-danger"}`}
            >
              {invoice.invoice_type_display}
            </span>
            {invoice.is_demo && (
              <span
                style={{
                  background: "#f59e0b",
                  color: "white",
                  padding: "5px 12px",
                  borderRadius: "999px",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                ⚠️ دمو (موقت)
              </span>
            )}
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={() => window.print()} className="btn btn-outline">
              <FiPrinter /> چاپ
            </button>
            <button onClick={handleDelete} className="btn btn-danger">
              <FiTrash2 /> حذف
            </button>
          </div>
        </div>

        {/* اطلاعات */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
          }}
        >
          <InfoRow label="نام مشتری" value={invoice.customer_name} />
          <InfoRow label="شماره تماس" value={invoice.customer_phone} />
          <InfoRow label="تاریخ معامله" value={invoice.jalali_date} />
          <InfoRow label="عیار" value={`${invoice.karat} عیار`} />
          <InfoRow label="وزن" value={`${formatNumber(invoice.weight)} گرم`} />
          <InfoRow
            label="قیمت هر گرم"
            value={`${formatNumber(invoice.price_per_gram)} تومان`}
          />
          <InfoRow label="اجرت" value={`${formatNumber(invoice.wage)} `} />
        </div>

        {/* جمع کل */}
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            background: isBuy ? "#d1fae5" : "#fee2e2",
            borderRadius: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: "700", fontSize: "18px" }}>
            قیمت انجام شده معامله:
          </span>
          <span
            style={{
              fontWeight: "800",
              fontSize: "24px",
              color: isBuy ? "var(--success)" : "var(--danger)",
            }}
          >
            {formatNumber(invoice.total_price)} تومان
          </span>
        </div>

        {/* توضیحات */}
        {invoice.description && (
          <div style={{ marginTop: "20px" }}>
            <h3 style={{ fontWeight: "700", marginBottom: "10px" }}>
              توضیحات:
            </h3>
            <p style={{ color: "var(--gray-600)" }}>{invoice.description}</p>
          </div>
        )}
        {/* زمان ثبت */}
        <div
          style={{
            marginTop: "20px",
            paddingTop: "20px",
            borderTop: "1px solid var(--gray-100)",
            color: "var(--gray-500)",
            fontSize: "13px",
          }}
        >
          زمان ثبت در سیستم:{" "}
          {new Date(invoice.created_at).toLocaleString("fa-IR")}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <div
        style={{
          fontSize: "13px",
          color: "var(--gray-500)",
          marginBottom: "4px",
        }}
      >
        {label}
      </div>
      <div style={{ fontWeight: "600", fontSize: "16px" }}>{value}</div>
    </div>
  );
}
