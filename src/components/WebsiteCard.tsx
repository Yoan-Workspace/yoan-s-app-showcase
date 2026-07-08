import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

interface WebsiteCardProps {
  name: string;
  description: string;
  url: string;
  screenshot: string;
  index?: number;
}

const WebsiteCard = ({ name, description, url, screenshot, index = 0 }: WebsiteCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: EASE_OUT }}
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group rounded-2xl overflow-hidden border border-border bg-card card-elevated block"
      >
        <div className="aspect-video overflow-hidden bg-muted">
          <img
            src={screenshot}
            alt={`Aperçu du site ${name}`}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-semibold text-foreground group-hover:text-primary transition-colors">
              {name}
            </h3>
            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </a>
    </motion.div>
  );
};

export default WebsiteCard;
