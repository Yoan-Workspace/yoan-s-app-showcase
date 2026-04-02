import { useTranslation } from "react-i18next";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
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

  return (
    <header className="glass sticky top-0 z-50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={yoanLogo}
            alt="Yoan Soussand"
            className="h-8 w-auto object-contain"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks}
          <button
            onClick={toggleLang}
            className="text-sm font-bold px-4 py-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-all"
          >
            🌐 {i18n.language === "en" ? "FR" : "EN"}
          </button>
        </nav>

        {/* Mobile — lang + burger */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggleLang}
            className="text-xs font-semibold px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground transition-all"
          >
            {i18n.language === "en" ? "FR" : "EN"}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-muted-foreground hover:text-foreground"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-border px-6 py-4 flex flex-col gap-4 bg-card/95 backdrop-blur-xl">
          {navLinks}
        </nav>
      )}
    </header>
  );
};

export default Header;