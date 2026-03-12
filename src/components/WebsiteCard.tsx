import { ExternalLink } from "lucide-react";

interface WebsiteCardProps {
  name: string;
  description: string;
  url: string;
  screenshot: string;
}

const WebsiteCard = ({ name, description, url, screenshot }: WebsiteCardProps) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group rounded-xl overflow-hidden border border-border bg-card card-glow transition-all duration-300 hover:border-primary/40 block"
    >
      <div className="aspect-video overflow-hidden">
        <img
          src={screenshot}
          alt={`Capture d'écran de ${name}`}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {name}
          </h3>
          <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </a>
  );
};

export default WebsiteCard;
