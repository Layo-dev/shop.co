interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string;
  onSizeSelect: (size: string) => void;
}
const SizeSelector = ({
  sizes,
  selectedSize,
  onSizeSelect
}: SizeSelectorProps) => {
  return <div className="flex gap-2">
      {sizes.map(size => {})}
    </div>;
};
export default SizeSelector;