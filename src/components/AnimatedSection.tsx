import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: "fade-in" | "slide-up" | "scale-in" | "slide-left" | "slide-right";
  delay?: number;
  threshold?: number;
}

const AnimatedSection = ({ 
  children, 
  className, 
  animation = "fade-in", 
  delay = 0,
  threshold = 0.1 
}: AnimatedSectionProps) => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold });

  const animationClasses = {
    "fade-in": "opacity-0 translate-y-8",
    "slide-up": "opacity-0 translate-y-16",
    "scale-in": "opacity-0 scale-95",
    "slide-left": "opacity-0 translate-x-8",
    "slide-right": "opacity-0 -translate-x-8"
  };

  const visibleClasses = {
    "fade-in": "opacity-100 translate-y-0",
    "slide-up": "opacity-100 translate-y-0", 
    "scale-in": "opacity-100 scale-100",
    "slide-left": "opacity-100 translate-x-0",
    "slide-right": "opacity-100 translate-x-0"
  };

  return (
    <div
      ref={elementRef}
      className={cn(
        "transition-all duration-700 ease-out",
        isVisible ? visibleClasses[animation] : animationClasses[animation],
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;