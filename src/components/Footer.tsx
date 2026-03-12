import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border py-8 mt-20">
      <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Yoan Soussand. Tous droits réservés.</p>
        <div className="mt-2 flex justify-center gap-4">
          <Link to="/" className="hover:text-foreground transition-colors">Accueil</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
