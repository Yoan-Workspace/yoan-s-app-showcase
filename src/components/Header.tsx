import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { t, i18n } = useTranslation();

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === "en" ? "fr" : "en");
  };

  return (
    <header className="glass sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-heading text-xl font-bold text-foreground hover:text-primary transition-colors">
          YS<span className="text-primary">.</span>dev
        </Link>
        <nav className="flex items-center gap-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {t("header.home")}
          </Link>
          <Link to="/#apps" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {t("header.apps")}
          </Link>
          <Link to="/#sites" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {t("header.websites")}
          </Link>
          <button
            onClick={toggleLang}
            className="text-xs px-2 py-1 rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
          >
            {i18n.language === "en" ? "FR" : "EN"}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
