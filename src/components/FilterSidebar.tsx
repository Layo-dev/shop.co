import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronUp, ChevronDown } from "lucide-react";

interface FilterSidebarProps {
  filters: {
    categories: string[];
    priceRange: [number, number];
    colors: string[];
    sizes: string[];
    dressStyles: string[];
  };
  onFiltersChange: (filters: any) => void;
  category: string;
}

const FilterSidebar = ({ filters, onFiltersChange, category }: FilterSidebarProps) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    colors: true,
    size: true,
    dressStyle: true,
  });

  const categories = {
    casual: ["T-shirts", "Shorts", "Shirts", "Hoodies", "Jeans"],
    formal: ["Shirts", "Blazers", "Suits", "Trousers", "Ties"],
    party: ["Dresses", "Blouses", "Skirts", "Heels", "Accessories"],
    gym: ["Activewear", "Sports Bras", "Leggings", "Sneakers", "Tank Tops"],
  };

  const colors = [
    { name: "Green", value: "green", color: "bg-green-500" },
    { name: "Red", value: "red", color: "bg-red-500" },
    { name: "Yellow", value: "yellow", color: "bg-yellow-500" },
    { name: "Orange", value: "orange", color: "bg-orange-500" },
    { name: "Blue", value: "blue", color: "bg-blue-500" },
    { name: "Purple", value: "purple", color: "bg-purple-500" },
    { name: "Pink", value: "pink", color: "bg-pink-500" },
    { name: "White", value: "white", color: "bg-white border border-border" },
    { name: "Black", value: "black", color: "bg-black" },
  ];

  const sizes = ["XX-Small", "X-Small", "Small", "Medium", "Large", "X-Large", "XX-Large", "3X-Large", "4X-Large"];

  const dressStyles = ["Casual", "Formal", "Party", "Gym"];

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateFilter = (filterType: string, value: any) => {
    const newFilters = { ...filters };
    
    if (filterType === 'priceRange') {
      newFilters.priceRange = value;
    } else if (Array.isArray(newFilters[filterType as keyof typeof newFilters])) {
      const currentArray = newFilters[filterType as keyof typeof newFilters] as string[];
      if (currentArray.includes(value)) {
        (newFilters[filterType as keyof typeof newFilters] as string[]) = currentArray.filter(item => item !== value);
      } else {
        (newFilters[filterType as keyof typeof newFilters] as string[]) = [...currentArray, value];
      }
    }
    
    onFiltersChange(newFilters);
  };

  const FilterSection = ({ 
    title, 
    sectionKey, 
    children 
  }: { 
    title: string; 
    sectionKey: keyof typeof expandedSections; 
    children: React.ReactNode;
  }) => (
    <div>
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full py-3 text-lg font-semibold"
      >
        {title}
        {expandedSections[sectionKey] ? (
          <ChevronUp className="h-5 w-5" />
        ) : (
          <ChevronDown className="h-5 w-5" />
        )}
      </button>
      {expandedSections[sectionKey] && (
        <div className="pb-6">
          {children}
        </div>
      )}
      <Separator className="my-2" />
    </div>
  );

  return (
    <div className="glass-card p-6 rounded-2xl sticky top-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Filters</h3>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onFiltersChange({
            categories: [],
            priceRange: [0, 500],
            colors: [],
            sizes: [],
            dressStyles: [],
          })}
        >
          Clear All
        </Button>
      </div>

      <FilterSection title="Categories" sectionKey="categories">
        <div className="space-y-3">
          {categories[category as keyof typeof categories]?.map((cat) => (
            <div key={cat} className="flex items-center space-x-3">
              <Checkbox
                id={cat}
                checked={filters.categories.includes(cat)}
                onCheckedChange={() => updateFilter('categories', cat)}
              />
              <label htmlFor={cat} className="text-sm font-medium cursor-pointer">
                {cat}
              </label>
            </div>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price" sectionKey="price">
        <div className="space-y-4">
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
            max={500}
            min={0}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Colors" sectionKey="colors">
        <div className="grid grid-cols-5 gap-3">
          {colors.map((color) => (
            <button
              key={color.value}
              onClick={() => updateFilter('colors', color.value)}
              className={`w-10 h-10 rounded-full ${color.color} border-2 ${
                filters.colors.includes(color.value) ? 'border-primary' : 'border-transparent'
              } hover:scale-110 transition-transform`}
              title={color.name}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Size" sectionKey="size">
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => updateFilter('sizes', size)}
              className={`py-2 px-3 text-sm rounded-lg border transition-colors ${
                filters.sizes.includes(size)
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border hover:border-primary'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Dress Style" sectionKey="dressStyle">
        <div className="space-y-3">
          {dressStyles.map((style) => (
            <div key={style} className="flex items-center space-x-3">
              <Checkbox
                id={style}
                checked={filters.dressStyles.includes(style)}
                onCheckedChange={() => updateFilter('dressStyles', style)}
              />
              <label htmlFor={style} className="text-sm font-medium cursor-pointer">
                {style}
              </label>
            </div>
          ))}
        </div>
      </FilterSection>

      <Button className="w-full mt-6 glass-button">
        Apply Filter
      </Button>
    </div>
  );
};

export default FilterSidebar;