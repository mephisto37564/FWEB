import { useState } from "react";
import { useNavigate } from "react-router";
import PageWrapper from "../components/PageWrapper";
import FormCard, {
  fieldStyle,
  inputStyle,
  primaryBtn,
  secondaryBtn
} from "../components/FormCard";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch(
      `http://localhost:3000/users?email=${email}&password=${password}`
    );
    const users = await res.json();

    if (users.length === 0) {
      setError("Invalid email or password");
      return;
    }

    localStorage.setItem("userId", users[0]._id);
    localStorage.setItem("role", users[0].role);
    navigate("/dashboard");
  };

  return (
    <PageWrapper>
      <FormCard
        title="Welcome Back"
        subtitle="Log in to continue"
      >
        <form onSubmit={login}>
          <div style={fieldStyle}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button type="submit" style={primaryBtn}>
              Login
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