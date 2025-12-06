import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  category?: string;
}

const Breadcrumb = ({ items, category }: BreadcrumbProps) => {
  // Support legacy single category prop
  const breadcrumbItems: BreadcrumbItem[] = items || [
    { label: category || "", href: undefined }
  ];

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
      <Link to="/" className="hover:text-foreground transition-colors">
        Home
      </Link>
      {breadcrumbItems.map((item, index) => (
        <span key={index} className="flex items-center space-x-2">
          <ChevronRight className="h-4 w-4" />
          {item.href ? (
            <Link to={item.href} className="hover:text-foreground transition-colors capitalize">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium capitalize">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumb;