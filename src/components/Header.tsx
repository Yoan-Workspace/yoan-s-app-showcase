import { useTranslation } from "react-i18next";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === "en" ? "fr" : "en");
  };

  const navItems = (
    <>
      <Link
        to="/"
        onClick={() => setMobileOpen(false)}
        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        {t("header.home")}
      </Link>
      <button
        onClick={() => scrollToSection("apps")}
        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        {t("header.apps")}
      </button>
      <button
        onClick={() => scrollToSection("sites")}
        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        {t("header.websites")}
      </button>
      <button
        onClick={() => scrollToSection("contact")}
        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        {t("header.contact")}
      </button>
    </>
  );

  return (
    <header className="glass sticky top-0 z-50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-heading text-xl font-bold text-foreground tracking-tight">
          YS<span className="text-gradient">.</span>dev
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems}
          <button
            onClick={toggleLang}
            className="text-xs font-semibold px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
          >
            {i18n.language === "en" ? "FR" : "EN"}
          </button>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-muted-foreground hover:text-foreground"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-border px-6 py-4 flex flex-col gap-4 bg-card/95 backdrop-blur-xl">
          {navItems}
          <button
            onClick={toggleLang}
            className="text-xs font-semibold px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground w-fit"
          >
            {i18n.language === "en" ? "FR" : "EN"}
          </button>
        </nav>
      )}
    </header>
  );
};

export default Header;
