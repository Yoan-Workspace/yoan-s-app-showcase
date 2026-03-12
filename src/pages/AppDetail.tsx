import { useParams, Link } from "react-router-dom";
import { apps } from "@/data/apps";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, ExternalLink, Shield, FileText } from "lucide-react";

const AppDetail = () => {
  const { appId } = useParams();
  const app = apps.find((a) => a.id === appId);

  if (!app) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Application non trouvée.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="container mx-auto px-6 py-12 max-w-3xl flex-1">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>

        <div className="flex items-start gap-6 mb-8">
          <img
            src={app.icon}
            alt={`Icône ${app.name}`}
            className="w-24 h-24 rounded-2xl shadow-lg flex-shrink-0"
          />
          <div>
            <h1 className="font-heading text-3xl font-bold">{app.name}</h1>
            <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
              {app.category}
            </span>
            <p className="mt-1 text-sm text-muted-foreground">{app.tagline}</p>
          </div>
        </div>

        <p className="text-muted-foreground leading-relaxed mb-8">
          {app.description}
        </p>

        {app.features.length > 0 && (
          <div className="mb-8">
            <h2 className="font-heading text-xl font-semibold mb-4">Fonctionnalités</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {app.features.map((f, i) => (
                <li key={i} className="glass rounded-lg px-4 py-3 text-sm text-foreground">
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap gap-4">
          <a
            href={app.appStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
          >
            <ExternalLink className="w-4 h-4" />
            Voir sur l'App Store
          </a>
          <Link
            to={`/app/${app.id}/privacy`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg glass text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Shield className="w-4 h-4" />
            Politique de confidentialité
          </Link>
          <Link
            to={`/app/${app.id}/terms`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg glass text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <FileText className="w-4 h-4" />
            Conditions d'utilisation
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AppDetail;
