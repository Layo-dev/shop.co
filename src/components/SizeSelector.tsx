interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string;
  onSizeSelect: (size: string) => void;
}

const SizeSelector = ({ sizes, selectedSize, onSizeSelect }: SizeSelectorProps) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {sizes.map((size) => (
        <button
          key={size}
          onClick={() => onSizeSelect(size)}
          className={`px-4 py-3 rounded-lg border-2 transition-all duration-200 min-w-[50px] min-h-[44px] touch-target touch-feedback mobile-text font-medium ${
            selectedSize === size
              ? "border-primary bg-primary text-primary-foreground shadow-md"
              : "border-border hover:border-primary bg-background hover:bg-accent"
          }`}
        >
          {size}
        </button>
      ))}
    </div>
  );
};

export default SizeSelector;