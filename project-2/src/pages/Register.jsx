import { useState } from "react";
import { useNavigate } from "react-router";
import PageWrapper from "../components/PageWrapper";
import FormCard, {
  fieldStyle,
  inputStyle,
  primaryBtn,
  secondaryBtn
} from "../components/FormCard";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });

  const register = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    navigate("/");
  };

  return (
    <PageWrapper>
      <FormCard title="Create Account">
        <form onSubmit={register}>
          <div style={fieldStyle}>
            <label>Full Name</label>
            <input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label>Account Type</label>
            <select
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
              required
              style={inputStyle}
            >
              <option value="">Select role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button type="submit" style={primaryBtn}>
              Register
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