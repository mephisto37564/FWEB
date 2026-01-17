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

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `${API_URL}/users?email=${email}&password=${password}`
      );
      const users = await res.json();

      if (users.length === 0) {
        setError("Invalid email or password");
        return;
      }

      localStorage.setItem("userId", users[0]._id);
      localStorage.setItem("role", users[0].role);
      navigate("/dashboard");
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <FormCard
        title="Welcome Back"
        subtitle="Log in to your account"
      >
        <form onSubmit={login} className="auth-form">
          <div style={fieldStyle}>
            <label className="form-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
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
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={inputStyle}
              className="form-input"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button type="submit" style={primaryBtn} disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/register")}
              style={secondaryBtn}
            >
              Register
            </button>
          </div>
        </form>
      </FormCard>
    </PageWrapper>
  );
}