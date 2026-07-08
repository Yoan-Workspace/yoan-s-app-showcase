import { useParams, Link } from "react-router-dom";
import { apps } from "@/data/apps";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";

const TermsOfUse = () => {
  const { appId } = useParams();
  const { t } = useTranslation();
  const app = apps.find((a) => a.id === appId);

  if (!app) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">{t("appDetail.appNotFound")}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Seo
        title={t("seo.termsTitle", { name: app.name })}
        description={t("seo.termsDescription", { name: app.name })}
        path={`/app/${app.id}/terms`}
      />
      <Header />

      <main id="main-content" className="container mx-auto px-6 py-12 max-w-3xl flex-1">
        <Link
          to={`/app/${app.id}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("appDetail.back")} {app.name}
        </Link>

        <h1 className="font-heading text-3xl font-bold mb-2">
          {t("appDetail.termsOfUse")}
        </h1>
        <p className="text-primary font-medium mb-8">{app.name}</p>

        <div className="space-y-6 text-muted-foreground">
          <p>{t("terms.leacDescription", { appName: app.name })}</p>

          <a
            href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-3 bg-muted/30 border border-border rounded-xl hover:bg-muted/50 transition-colors text-sm font-medium text-primary"
          >
            <ExternalLink className="w-4 h-4" />
            {t("terms.leacLink")}
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfUse;