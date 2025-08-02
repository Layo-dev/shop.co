import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface BreadcrumbProps {
  category: string;
}

const Breadcrumb = ({ category }: BreadcrumbProps) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
      <Link to="/" className="hover:text-foreground transition-colors">
        Home
      </Link>
      <ChevronRight className="h-4 w-4" />
      <span className="text-foreground font-medium capitalize">
        {category}
      </span>
    </nav>
  );
};

export default Breadcrumb;