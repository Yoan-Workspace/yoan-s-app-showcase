import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppData } from "@/data/types";
import { ExternalLink } from "lucide-react";

interface AppCardProps {
  app: AppData;
}

const AppCard = ({ app }: AppCardProps) => {
  const { t } = useTranslation();

  return (
    <Link
      to={`/app/${app.id}`}
      className="group glass rounded-xl p-6 card-glow transition-all duration-300 hover:border-primary/40 block"
    >
      <div className="flex items-start gap-5">
        <img
          src={app.icon}
          alt={app.name}
          className="w-20 h-20 rounded-2xl shadow-lg flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {app.name}
          </h3>
          <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
            {t(`apps.${app.id}.category`)}
          </span>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {t(`apps.${app.id}.tagline`)}
          </p>
        </div>
        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
      </div>
    </Link>
  );
};

export default AppCard;
