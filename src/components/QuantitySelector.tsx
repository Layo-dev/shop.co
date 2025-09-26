import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  min?: number;
  max?: number;
}

const QuantitySelector = ({ 
  quantity, 
  onQuantityChange, 
  min = 1, 
  max = 99 
}: QuantitySelectorProps) => {
  const handleDecrease = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= min && value <= max) {
      onQuantityChange(value);
    }
  };

  return (
    <div className="flex items-center border rounded-lg glass-card">
      <Button
        variant="ghost"
        size="touch-icon"
        onClick={handleDecrease}
        disabled={quantity <= min}
        className="h-12 w-12 p-0 touch-target"
        aria-label="Decrease quantity"
      >
        <Minus className="w-5 h-5" />
      </Button>
      
      <input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        className="w-16 h-12 text-center border-0 bg-transparent focus:outline-none mobile-text font-medium"
        min={min}
        max={max}
        aria-label="Product quantity"
      />
      
      <Button
        variant="ghost"
        size="touch-icon"
        onClick={handleIncrease}
        disabled={quantity >= max}
        className="h-12 w-12 p-0 touch-target"
        aria-label="Increase quantity"
      >
        <Plus className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default QuantitySelector;