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
        size="sm"
        onClick={handleDecrease}
        disabled={quantity <= min}
        className="h-10 w-10 p-0"
      >
        <Minus className="w-4 h-4" />
      </Button>
      
      <input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        className="w-16 h-10 text-center border-0 bg-transparent focus:outline-none"
        min={min}
        max={max}
      />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleIncrease}
        disabled={quantity >= max}
        className="h-10 w-10 p-0"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default QuantitySelector;