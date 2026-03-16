import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppCard from "@/components/AppCard";
import WebsiteCard from "@/components/WebsiteCard";
import { apps } from "@/data/apps";
import sitePytheas from "@/assets/site-pytheas.png";
import siteNgClim from "@/assets/site-ng-clim.png";
import siteJuliePhoto from "@/assets/site-julie-photo.png";
import { Smartphone, Globe, Code2, Layers, Zap, Mail, ArrowRight } from "lucide-react";

const websiteKeys = [
  { key: "pytheas", url: "https://www.marseille-pytheas.eu/", screenshot: sitePytheas },
  { key: "ng-clim", url: "https://www.ng-climatisation.fr/", screenshot: siteNgClim },
  { key: "julie-photo", url: "https://www.juliemontbeyre-photographie.com/", screenshot: siteJuliePhoto },
];

const skills = [
  { icon: Smartphone, labelKey: "hero.skills.ios" },
  { icon: Globe, labelKey: "hero.skills.web" },
  { icon: Code2, labelKey: "hero.skills.swift" },
  { icon: Layers, labelKey: "hero.skills.react" },
  { icon: Zap, labelKey: "hero.skills.performance" },
];

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
};

const Index = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 section-pattern" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative container mx-auto px-6 py-24 md:py-40">
          <div className="max-w-3xl">
            <motion.div {...fadeUp}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 text-primary text-sm font-medium mb-8">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                {t("hero.badge")}
              </span>
            </motion.div>

            <motion.h1
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.1 }}
              className="font-heading text-4xl sm:text-5xl md:text-7xl font-extrabold leading-[1.08] tracking-tight"
            >
              {t("hero.greeting")}{" "}
              <span className="text-gradient">Yoan Soussand</span>
            </motion.h1>

            <motion.p
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.2 }}
              className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed"
            >
              {t("hero.subtitle")}
            </motion.p>

            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.3 }}
              className="mt-10 flex flex-wrap gap-3"
            >
              {skills.map((skill) => (
                <span
                  key={skill.labelKey}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border text-sm text-foreground font-medium shadow-sm"
                >
                  <skill.icon className="w-4 h-4 text-primary" />
                  {t(skill.labelKey)}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-border bg-card/50">
        <div className="container mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {[
              { value: "4", label: t("stats.apps") },
              { value: "3", label: t("stats.websites") },
              { value: "iOS", label: t("stats.platform") },
              { value: "2025", label: t("stats.since") },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-heading text-2xl md:text-3xl font-bold text-gradient">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Apps */}
      <section id="apps" className="container mx-auto px-6 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-12"
        >
          <span className="inline-flex items-center gap-2 text-primary text-sm font-semibold uppercase tracking-wider mb-3">
            <Smartphone className="w-4 h-4" />
            {t("sections.appsLabel")}
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold leading-tight">
            {t("sections.myApps")} <span className="text-gradient">{t("sections.myAppsHighlight")}</span>
          </h2>
          <p className="mt-3 text-muted-foreground">{t("sections.appsDescription")}</p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 max-w-4xl">
          {apps.map((app, i) => (
            <AppCard key={app.id} app={app} index={i} />
          ))}
        </div>
      </section>

      {/* Websites */}
      <section id="sites" className="section-pattern">
        <div className="container mx-auto px-6 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mb-12"
          >
            <span className="inline-flex items-center gap-2 text-accent text-sm font-semibold uppercase tracking-wider mb-3">
              <Globe className="w-4 h-4" />
              {t("sections.websitesLabel")}
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold leading-tight">
              {t("sections.myWebsites")} <span className="text-gradient-accent">{t("sections.myWebsitesHighlight")}</span>
            </h2>
            <p className="mt-3 text-muted-foreground">{t("sections.websitesDescription")}</p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl">
            {websiteKeys.map((site, i) => (
              <WebsiteCard
                key={site.url}
                name={t(`websites.${site.key}.name`)}
                description={t(`websites.${site.key}.description`)}
                url={site.url}
                screenshot={site.screenshot}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section id="contact" className="container mx-auto px-6 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/8 mb-6">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold">
            {t("contact.title")}
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            {t("contact.description")}
          </p>
          <a
            href="mailto:contact@ysdev.fr"
            className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
          >
            {t("contact.cta")}
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
