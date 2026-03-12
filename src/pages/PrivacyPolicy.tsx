import { useParams, Link } from "react-router-dom";
import { apps } from "@/data/apps";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
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
          to={`/app/${app.id}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à {app.name}
        </Link>

        <h1 className="font-heading text-3xl font-bold mb-2">
          Politique de confidentialité
        </h1>
        <p className="text-primary font-medium mb-8">{app.name}</p>

        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <p><strong className="text-foreground">Dernière mise à jour :</strong> 12 mars 2026</p>

          <h2 className="font-heading text-xl font-semibold text-foreground">1. Introduction</h2>
          <p>
            Cette politique de confidentialité décrit comment {app.name} (« l'Application »), développée par Yoan Soussand, 
            collecte, utilise et protège vos informations personnelles.
          </p>

          <h2 className="font-heading text-xl font-semibold text-foreground">2. Données collectées</h2>
          <p>
            L'Application ne collecte aucune donnée personnelle identifiable. Toutes les données restent stockées 
            localement sur votre appareil et ne sont pas transmises à des serveurs externes.
          </p>

          <h2 className="font-heading text-xl font-semibold text-foreground">3. Services tiers</h2>
          <p>
            L'Application peut utiliser des services tiers (comme l'App Store d'Apple) qui peuvent collecter 
            des informations conformément à leurs propres politiques de confidentialité.
          </p>

          <h2 className="font-heading text-xl font-semibold text-foreground">4. Sécurité</h2>
          <p>
            Nous nous engageons à protéger vos données. Étant donné que nous ne collectons pas de données personnelles, 
            le risque de violation de données est minimal.
          </p>

          <h2 className="font-heading text-xl font-semibold text-foreground">5. Contact</h2>
          <p>
            Pour toute question concernant cette politique de confidentialité, vous pouvez contacter le développeur 
            via la page de l'application sur l'App Store.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
