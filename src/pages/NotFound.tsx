import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error("404: route inexistante:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Seo title={t("seo.notFoundTitle")} description={t("seo.notFoundDescription")} noindex />
      <Header />

      <main id="main-content" className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="text-center max-w-md">
          <p className="font-heading text-7xl md:text-8xl font-extrabold text-gradient">404</p>
          <h1 className="mt-4 font-heading text-2xl md:text-3xl font-bold text-foreground">
            {t("notFound.title")}
          </h1>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            {t("notFound.description")}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("notFound.backHome")}
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
