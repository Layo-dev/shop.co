interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string;
  onSizeSelect: (size: string) => void;
}

const SizeSelector = ({ sizes, selectedSize, onSizeSelect }: SizeSelectorProps) => {
  return (
    <div className="flex gap-2">
      {sizes.map((size) => (
        <button
          key={size}
          onClick={() => onSizeSelect(size)}
          className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 min-w-[50px] ${
            selectedSize === size
              ? "border-primary bg-primary text-primary-foreground"
              : "border-gray-300 hover:border-gray-400 bg-background"
          }`}
        >
          {size}
        </button>
      ))}
    </div>
  );
};

export default SizeSelector;