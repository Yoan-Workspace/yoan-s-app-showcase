import { useTranslation } from "react-i18next";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Globe } from "lucide-react";
import yoanLogo from "@/assets/yoanLogo.png";

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

  const navLinks = (
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
        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-left"
      >
        {t("header.apps")}
      </button>
      <button
        onClick={() => scrollToSection("sites")}
        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-left"
      >
        {t("header.websites")}
      </button>
      <button
        onClick={() => scrollToSection("contact")}
        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-left"
      >
        {t("header.contact")}
      </button>
    </>
  );

  const nextLang = i18n.language === "en" ? "FR" : "EN";

  return (
    <header className="glass sticky top-0 z-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
      >
        {t("a11y.skipToContent")}
      </a>
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2" aria-label="Yoan Soussand — accueil">
          <img
            src={yoanLogo}
            alt="Yoan Soussand"
            width={32}
            height={32}
            className="h-8 w-auto object-contain"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Navigation principale">
          {navLinks}
          <button
            onClick={toggleLang}
            aria-label={t("a11y.toggleLanguage")}
            className="inline-flex items-center gap-1.5 text-sm font-bold px-4 py-1.5 rounded-full bg-primary text-primary-foreground shadow-md hover:opacity-90 transition-opacity"
          >
            <Globe className="w-4 h-4" aria-hidden="true" />
            {nextLang}
          </button>
        </nav>

        {/* Mobile — lang + burger */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggleLang}
            aria-label={t("a11y.toggleLanguage")}
            className="inline-flex items-center gap-1.5 text-sm font-bold px-4 py-1.5 rounded-full bg-primary text-primary-foreground shadow-md hover:opacity-90 transition-opacity"
          >
            <Globe className="w-4 h-4" aria-hidden="true" />
            {nextLang}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? t("a11y.closeMenu") : t("a11y.openMenu")}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            className="p-2 text-muted-foreground hover:text-foreground"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav
          id="mobile-nav"
          aria-label="Navigation principale"
          className="md:hidden border-t border-border px-6 py-4 flex flex-col gap-4 bg-card/95 backdrop-blur-xl"
        >
          {navLinks}
        </nav>
      )}
    </header>
  );
};

export default Header;