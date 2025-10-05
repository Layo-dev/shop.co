import ProductCard from "./ProductCard";

interface RelatedProductsProps {
  products: any[];
}

const RelatedProducts = ({ products }: RelatedProductsProps) => {
  if (products.length === 0) return null;

  return (
    <section className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground">You Might Also Like</h2>
        <p className="text-muted-foreground mt-2">Discover similar products that other customers loved</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            image={product.image_url || product.images?.[0] || ''}
            title={product.title}
            price={Number(product.price)}
            originalPrice={product.original_price ? Number(product.original_price) : undefined}
            rating={Number(product.rating)}
            reviews={product.reviews}
            discount={product.discount}
          />
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;