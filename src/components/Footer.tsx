import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border py-8 mt-20">
      <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Yoan Soussand. {t("footer.rights")}</p>
        <div className="mt-2 flex justify-center gap-4">
          <Link to="/" className="hover:text-foreground transition-colors">{t("footer.home")}</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
