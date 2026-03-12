import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppCard from "@/components/AppCard";
import WebsiteCard from "@/components/WebsiteCard";
import { apps } from "@/data/apps";
import heroBg from "@/assets/hero-bg-light.jpg";
import sitePytheas from "@/assets/site-pytheas.png";
import siteNgClim from "@/assets/site-ng-clim.png";
import siteJuliePhoto from "@/assets/site-julie-photo.png";
import { Smartphone, Globe } from "lucide-react";

const websites = [
  {
    name: "Pythéas de Massalia",
    description: "Site historique et culturel dédié à Pythéas, explorateur marseillais du IVe siècle av. J.-C.",
    url: "https://www.marseille-pytheas.eu/",
    screenshot: sitePytheas,
  },
  {
    name: "NG Climatisation",
    description: "Site vitrine pour un professionnel de l'entretien et du nettoyage de climatisation dans les Alpes-Maritimes.",
    url: "https://www.ng-climatisation.fr/",
    screenshot: siteNgClim,
  },
  {
    name: "Julie Montbeyre Photographie",
    description: "Portfolio d'une photographe professionnelle spécialisée en danse et moments de vie.",
    url: "https://www.juliemontbeyre-photographie.com/",
    screenshot: siteJuliePhoto,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="relative flex items-center justify-center py-24 md:py-36 overflow-hidden">
        <img
          src={heroBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
        <div className="relative z-10 container mx-auto px-6 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-muted-foreground mb-6">
            <Smartphone className="w-4 h-4 text-primary" />
            Développeur iOS & Web
          </div>
          <h1 className="font-heading text-4xl md:text-6xl font-bold leading-tight">
            Yoan <span className="text-gradient">Soussand</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Développeur passionné, je crée des applications mobiles et des sites web intuitifs et performants.
          </p>
        </div>
      </section>

      {/* Apps */}
      <section id="apps" className="container mx-auto px-6 py-16">
        <div className="flex items-center justify-center gap-3 mb-12">
          <Smartphone className="w-6 h-6 text-primary" />
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-center">
            Mes <span className="text-gradient">Applications</span>
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {apps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      </section>

      {/* Websites */}
      <section id="sites" className="container mx-auto px-6 py-16">
        <div className="flex items-center justify-center gap-3 mb-12">
          <Globe className="w-6 h-6 text-accent" />
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-center">
            Mes <span className="text-gradient">Sites Web</span>
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {websites.map((site) => (
            <WebsiteCard key={site.url} {...site} />
          ))}
        </div>
      </section>

      <div className="flex-1" />
      <Footer />
    </div>
  );
};

export default Index;
