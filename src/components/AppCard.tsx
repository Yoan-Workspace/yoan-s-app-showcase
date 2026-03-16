import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppData } from "@/data/types";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface AppCardProps {
  app: AppData;
  index?: number;
}

const AppCard = ({ app, index = 0 }: AppCardProps) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={`/app/${app.id}`}
        className="group flex items-center gap-5 p-5 rounded-2xl bg-card border border-border card-elevated block"
      >
        <img
          src={app.icon}
          alt={app.name}
          className="w-16 h-16 rounded-xl shadow-md flex-shrink-0 group-hover:shadow-lg transition-shadow duration-300"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-heading text-base font-semibold text-foreground group-hover:text-primary transition-colors">
            {app.name}
          </h3>
          <span className="inline-block mt-1 text-[11px] px-2.5 py-0.5 rounded-full bg-primary/8 text-primary font-medium tracking-wide uppercase">
            {t(`apps.${app.id}.category`)}
          </span>
          <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {t(`apps.${app.id}.tagline`)}
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
      </Link>
    </motion.div>
  );
};

export default AppCard;
