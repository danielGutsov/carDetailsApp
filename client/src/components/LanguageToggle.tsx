import { useLanguage } from "../lib/i18n";

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="lang-toggle">
      <button className={lang === "bg" ? "active" : ""} onClick={() => setLang("bg")}>
        БГ
      </button>
      <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>
        EN
      </button>
    </div>
  );
}
