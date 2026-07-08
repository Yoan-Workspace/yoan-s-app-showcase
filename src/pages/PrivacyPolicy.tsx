import { useParams, Link } from "react-router-dom";
import { apps } from "@/data/apps";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

const PrivacyPolicy = () => {
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

  const lastUpdated = t(`apps.${appId}.privacy.lastUpdated`);
  const sections = t(`apps.${appId}.privacy.sections`, {
    returnObjects: true,
  }) as { title: string; content: string }[];

  return (
    <div className="min-h-screen flex flex-col">
      <Seo
        title={t("seo.privacyTitle", { name: app.name })}
        description={t("seo.privacyDescription", { name: app.name })}
        path={`/app/${app.id}/privacy`}
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
          {t("appDetail.privacyPolicy")}
        </h1>
        <p className="text-primary font-medium mb-2">{app.name}</p>
        <p className="text-sm text-muted-foreground mb-8">
          {t("lastUpdated")} : {lastUpdated}
        </p>

        <div className="space-y-8">
          {Array.isArray(sections) &&
            sections.map((section, index) => (
              <div key={index}>
                <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
                  {section.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;