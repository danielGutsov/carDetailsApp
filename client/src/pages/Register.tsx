import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import LanguageToggle from "../components/LanguageToggle";
import { ApiError } from "../lib/api";
import { useAuth } from "../lib/AuthContext";
import { translateError, useLanguage } from "../lib/i18n";

export default function Register() {
  const { register } = useAuth();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register(email, password);
      navigate("/");
    } catch (err) {
      setError(
        err instanceof ApiError ? translateError(err.message, lang) : t("somethingWrong")
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-lang-toggle">
        <LanguageToggle />
      </div>
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>{t("appTitle")}</h1>
        <p className="auth-subtitle">{t("createAccountSubtitle")}</p>

        <label>
          {t("usernameEmail")}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
        </label>
        <label>
          {t("password")}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </label>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? t("creatingAccount") : t("createAccount")}
        </button>

        <p className="auth-switch">
          {t("alreadyHaveAccount")} <Link to="/login">{t("signIn")}</Link>
        </p>
      </form>
    </div>
  );
}
