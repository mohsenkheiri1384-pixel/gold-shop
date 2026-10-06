import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiLock, FiLogIn } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      setError("نام کاربری یا رمز اشتباهه");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <div
        className="card fade-in"
        style={{ maxWidth: "440px", width: "100%" }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1
            style={{ fontSize: "24px", fontWeight: "800", marginBottom: "8px" }}
          >
            ورود به سیستم
          </h1>
          <p style={{ color: "var(--gray-500)", fontSize: "14px" }}>
            سیستم مدیریت طلافروشی
          </p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">نام کاربری</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              placeholder="admin"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">رمز عبور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: "100%" }}
          >
            <FiLogIn /> {loading ? "در حال ورود..." : "ورود"}
          </button>
        </form>
      </div>
    </div>
  );
}
