import { useState } from "react";
import { useNavigate } from "react-router";
import API_URL from "../config";
import PageWrapper from "../components/PageWrapper";
import FormCard, {
  fieldStyle,
  inputStyle,
  primaryBtn,
  secondaryBtn
} from "../components/FormCard";
import "../styles/Auth.css";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });
  const [loading, setLoading] = useState(false);

  const register = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        throw new Error("Registration failed");
      }

      alert("✅ Account created successfully!");
      navigate("/");
    } catch (err) {
      alert("❌ Registration failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <FormCard title="Create Account">
        <form onSubmit={register} className="auth-form">
          <div style={fieldStyle}>
            <label className="form-label">Full Name</label>
            <input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
              style={inputStyle}
              className="form-input"
              placeholder="John Doe"
            />
          </div>

          <div style={fieldStyle}>
            <label className="form-label">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              style={inputStyle}
              className="form-input"
              placeholder="your@email.com"
            />
          </div>

          <div style={fieldStyle}>
            <label className="form-label">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              style={inputStyle}
              className="form-input"
              placeholder="••••••••"
            />
          </div>

          <div style={fieldStyle}>
            <label className="form-label">Account Type</label>
            <select
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
              required
              style={inputStyle}
              className="form-input"
            >
              <option value="">Select role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button type="submit" style={primaryBtn} disabled={loading}>
              {loading ? "Creating..." : "Register"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              style={secondaryBtn}
            >
              Back to Login
            </button>
          </div>
        </form>
      </FormCard>
    </PageWrapper>
  );
}