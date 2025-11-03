import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/orderUtils";

interface MobileProductCardProps {
  product: any;
  onEdit: (product: any) => void;
  onDelete: (productId: string) => void;
}

export const MobileProductCard = ({
  product,
  onEdit,
  onDelete,
}: MobileProductCardProps) => {
  return (
    <Card className="flex gap-3 p-3">
      {product.image_url && (
        <img 
          src={product.image_url} 
          alt={product.title}
          className="w-20 h-20 rounded object-cover flex-shrink-0"
        />
      )}
      <div className="flex-1 min-w-0 space-y-1">
        <p className="font-medium text-sm truncate">{product.title}</p>
        <p className="text-xs text-muted-foreground">{product.category}</p>
        <div className="flex gap-2 items-center flex-wrap">
          <span className="font-semibold text-sm">{formatCurrency(product.price)}</span>
          <Badge variant={product.in_stock ? "default" : "secondary"} className="text-xs">
            {product.in_stock ? 'In Stock' : 'Out of Stock'}
          </Badge>
        </div>
        {product.shipping_fee && (
          <p className="text-xs text-muted-foreground">
            Shipping: {formatCurrency(product.shipping_fee)}
          </p>
        )}
        <div className="flex gap-2 mt-2">
          <Button 
            size="sm" 
            variant="outline"
            className="flex-1"
            onClick={() => onEdit(product)}
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button 
            size="sm" 
            variant="destructive"
            className="flex-1"
            onClick={() => onDelete(product.id)}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
};
