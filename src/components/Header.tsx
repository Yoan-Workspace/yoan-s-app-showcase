import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="glass sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-heading text-xl font-bold text-foreground hover:text-primary transition-colors">
          YS<span className="text-primary">.</span>dev
        </Link>
        <nav className="flex items-center gap-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Accueil
          </Link>
          <Link to="/#apps" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Applications
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
