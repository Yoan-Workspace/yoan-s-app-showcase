import { useParams, Link } from "react-router-dom";
import { apps } from "@/data/apps";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";

const TermsOfUse = () => {
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
          Conditions d'utilisation
        </h1>
        <p className="text-primary font-medium mb-8">{app.name}</p>

        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <p><strong className="text-foreground">Dernière mise à jour :</strong> 12 mars 2026</p>

          <h2 className="font-heading text-xl font-semibold text-foreground">1. Acceptation des conditions</h2>
          <p>
            En téléchargeant et en utilisant {app.name} (« l'Application »), vous acceptez d'être lié par les présentes 
            conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser l'Application.
          </p>

          <h2 className="font-heading text-xl font-semibold text-foreground">2. Utilisation de l'Application</h2>
          <p>
            L'Application est fournie « en l'état » à des fins informatives et de divertissement. Vous vous engagez 
            à utiliser l'Application conformément aux lois applicables et de manière responsable.
          </p>

          <h2 className="font-heading text-xl font-semibold text-foreground">3. Propriété intellectuelle</h2>
          <p>
            Tous les contenus de l'Application, y compris les textes, graphiques, logos et logiciels, sont la propriété 
            de Yoan Soussand et sont protégés par les lois sur la propriété intellectuelle.
          </p>

          <h2 className="font-heading text-xl font-semibold text-foreground">4. Limitation de responsabilité</h2>
          <p>
            Le développeur ne saurait être tenu responsable des dommages directs ou indirects résultant de l'utilisation 
            ou de l'impossibilité d'utiliser l'Application.
          </p>

          <h2 className="font-heading text-xl font-semibold text-foreground">5. Modifications</h2>
          <p>
            Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications prendront effet 
            dès leur publication dans l'Application.
          </p>

          <h2 className="font-heading text-xl font-semibold text-foreground">6. Contact</h2>
          <p>
            Pour toute question, contactez le développeur via la page de l'application sur l'App Store.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfUse;
