import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppCard from "@/components/AppCard";
import { apps } from "@/data/apps";
import heroBg from "@/assets/hero-bg.jpg";
import { Smartphone } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section
        className="relative flex items-center justify-center py-24 md:py-36 overflow-hidden"
      >
        <img
          src={heroBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        <div className="relative z-10 container mx-auto px-6 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-muted-foreground mb-6">
            <Smartphone className="w-4 h-4 text-primary" />
            Développeur iOS
          </div>
          <h1 className="font-heading text-4xl md:text-6xl font-bold leading-tight">
            Yoan <span className="text-gradient">Soussand</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Développeur iOS passionné, je crée des applications mobiles intuitives et utiles, disponibles sur l'App Store.
          </p>
        </div>
      </section>

      {/* Apps */}
      <section id="apps" className="container mx-auto px-6 py-16">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-12">
          Mes <span className="text-gradient">Applications</span>
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {apps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      </section>

      <div className="flex-1" />
      <Footer />
    </div>
  );
};

export default Index;
