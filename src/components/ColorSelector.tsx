import { Check } from "lucide-react";

interface Color {
  name: string;
  value: string;
}

interface ColorSelectorProps {
  colors: Color[];
  selectedColor?: Color;
  onColorSelect: (color: Color) => void;
}

const ColorSelector = ({ colors, selectedColor, onColorSelect }: ColorSelectorProps) => {
  return (
    <div className="flex gap-3">
      {colors.map((color) => (
        <button
          key={color.name}
          onClick={() => onColorSelect(color)}
          className={`w-10 h-10 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
            selectedColor?.name === color.name
              ? "border-primary scale-110 shadow-lg"
              : "border-gray-300 hover:border-gray-400"
          }`}
          style={{ backgroundColor: color.value }}
          title={color.name}
        >
          {selectedColor?.name === color.name && (
            <Check 
              className={`w-4 h-4 ${
                color.value === "#FFFFFF" || color.value === "#ffffff" 
                  ? "text-black" 
                  : "text-white"
              }`} 
            />
          )}
        </button>
      ))}
    </div>
  );
};

export default ColorSelector;