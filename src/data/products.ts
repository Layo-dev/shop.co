export interface Product {
  id: number;
  title: string;
  image: string;
  images?: string[];
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  discount?: number;
  category: string;
  subcategory: string;
  color: string;
  colors?: { name: string; value: string }[];
  sizes: string[];
  style: string;
  createdAt: string;
  description?: string;
  material?: string;
  care?: string[];
  inStock?: boolean;
  shippingFee?: number;
}

export interface Review {
  id: number;
  productId: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export const products: Product[] = [
  // Casual Products
  {
    id: 1,
    title: "Gradient Graphic T-shirt",
    image: "/src/assets/product-tshirt.jpg",
    price: 232000, // ₦145 * 1600
    rating: 3.5,
    reviews: 120,
    category: "Casual",
    subcategory: "T-shirts",
    color: "blue",
    sizes: ["Small", "Medium", "Large", "X-Large"],
    style: "Casual",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    title: "Polo with Contrast Trims",
    image: "/src/assets/product-shirt.jpg",
    price: 339200, // ₦212 * 1600
    originalPrice: 387200, // ₦242 * 1600
    rating: 4.0,
    reviews: 95,
    discount: 20,
    category: "Casual",
    subcategory: "Shirts",
    color: "red",
    sizes: ["Medium", "Large", "X-Large"],
    style: "Casual",
    createdAt: "2024-01-20",
  },
  {
    id: 3,
    title: "Black Striped T-shirt",
    image: "/src/assets/product-tshirt.jpg",
    price: 192000, // ₦120 * 1600
    originalPrice: 240000, // ₦150 * 1600
    rating: 5.0,
    reviews: 200,
    discount: 30,
    category: "Casual",
    subcategory: "T-shirts",
    color: "black",
    sizes: ["Small", "Medium", "Large"],
    style: "Casual",
    createdAt: "2024-01-25",
  },
  {
    id: 4,
    title: "Skinny Fit Jeans",
    image: "/src/assets/product-jeans.jpg",
    price: 384000, // ₦240 * 1600
    originalPrice: 416000, // ₦260 * 1600
    rating: 3.5,
    reviews: 85,
    discount: 20,
    category: "Casual",
    subcategory: "Jeans",
    color: "blue",
    sizes: ["Small", "Medium", "Large", "X-Large"],
    style: "Casual",
    createdAt: "2024-02-01",
  },
  {
    id: 5,
    title: "Checkered Shirt",
    image: "/src/assets/product-shirt.jpg",
    price: 288000, // ₦180 * 1600
    rating: 4.5,
    reviews: 150,
    category: "Casual",
    subcategory: "Shirts",
    color: "green",
    sizes: ["Medium", "Large", "X-Large", "XX-Large"],
    style: "Casual",
    createdAt: "2024-02-05",
  },
  {
    id: 6,
    title: "Sleeve Striped T-shirt",
    image: "/src/assets/product-orange.jpg",
    price: 208000, // ₦130 * 1600
    originalPrice: 256000, // ₦160 * 1600
    rating: 4.5,
    reviews: 175,
    discount: 30,
    category: "Casual",
    subcategory: "T-shirts",
    color: "orange",
    sizes: ["Small", "Medium", "Large"],
    style: "Casual",
    createdAt: "2024-02-10",
  },
  {
    id: 7,
    title: "Casual Hoodie",
    image: "/src/assets/product-tshirt.jpg",
    price: 152000, // ₦95 * 1600
    rating: 4.2,
    reviews: 110,
    category: "Casual",
    subcategory: "Hoodies",
    color: "gray",
    sizes: ["Medium", "Large", "X-Large"],
    style: "Casual",
    createdAt: "2024-02-15",
  },
  {
    id: 8,
    title: "Denim Shorts",
    image: "/src/assets/product-jeans.jpg",
    price: 136000, // ₦85 * 1600
    rating: 3.8,
    reviews: 90,
    category: "Casual",
    subcategory: "Shorts",
    color: "blue",
    sizes: ["Small", "Medium", "Large"],
    style: "Casual",
    createdAt: "2024-02-20",
  },
  {
    id: 9,
    title: "Cotton Blend T-shirt",
    image: "/src/assets/product-orange.jpg",
    price: 120000, // ₦75 * 1600
    rating: 4.0,
    reviews: 125,
    category: "Casual",
    subcategory: "T-shirts",
    color: "white",
    sizes: ["Small", "Medium", "Large", "X-Large"],
    style: "Casual",
    createdAt: "2024-02-25",
  },

  // Formal Products
  {
    id: 10,
    title: "Business Dress Shirt",
    image: "/src/assets/product-shirt.jpg",
    price: 296000, // ₦185 * 1600
    rating: 4.5,
    reviews: 145,
    category: "Formal",
    subcategory: "Shirts",
    color: "white",
    sizes: ["Small", "Medium", "Large", "X-Large"],
    style: "Formal",
    createdAt: "2024-01-10",
  },
  {
    id: 11,
    title: "Classic Navy Blazer",
    image: "/src/assets/product-shirt.jpg",
    price: 472000, // ₦295 * 1600
    rating: 4.8,
    reviews: 85,
    category: "Formal",
    subcategory: "Blazers",
    color: "blue",
    sizes: ["Medium", "Large", "X-Large"],
    style: "Formal",
    createdAt: "2024-01-12",
  },
  {
    id: 12,
    title: "Formal Trousers",
    image: "/src/assets/product-jeans.jpg",
    price: 232000, // ₦145 * 1600
    rating: 4.2,
    reviews: 105,
    category: "Formal",
    subcategory: "Trousers",
    color: "black",
    sizes: ["Small", "Medium", "Large", "X-Large"],
    style: "Formal",
    createdAt: "2024-01-18",
  },
  {
    id: 13,
    title: "Silk Tie Collection",
    image: "/src/assets/product-orange.jpg",
    price: 104000, // ₦65 * 1600
    rating: 4.6,
    reviews: 75,
    category: "Formal",
    subcategory: "Ties",
    color: "red",
    sizes: ["One Size"],
    style: "Formal",
    createdAt: "2024-01-22",
  },
  {
    id: 14,
    title: "Premium Suit Set",
    image: "/src/assets/product-shirt.jpg",
    price: 792000, // ₦495 * 1600
    originalPrice: 952000, // ₦595 * 1600
    rating: 4.9,
    reviews: 55,
    discount: 25,
    category: "Formal",
    subcategory: "Suits",
    color: "gray",
    sizes: ["Medium", "Large", "X-Large"],
    style: "Formal",
    createdAt: "2024-01-28",
  },
  {
    id: 15,
    title: "Executive Shirt",
    image: "/src/assets/product-shirt.jpg",
    price: 200000, // ₦125 * 1600
    rating: 4.3,
    reviews: 95,
    category: "Formal",
    subcategory: "Shirts",
    color: "blue",
    sizes: ["Small", "Medium", "Large"],
    style: "Formal",
    createdAt: "2024-02-03",
  },

  // Party Products
  {
    id: 16,
    title: "Sequin Party Dress",
    image: "/src/assets/product-orange.jpg",
    price: 248000, // ₦225 * 1600
    rating: 4.7,
    reviews: 165,
    category: "Party",
    subcategory: "Dresses",
    color: "gold",
    sizes: ["Small", "Medium", "Large"],
    style: "Party",
    createdAt: "2024-01-08",
  },
  {
    id: 17,
    title: "Satin Blouse",
    image: "/src/assets/product-shirt.jpg",
    price: 278000, // ₦155 * 1600
    rating: 4.4,
    reviews: 125,
    category: "Party",
    subcategory: "Blouses",
    color: "purple",
    sizes: ["Small", "Medium", "Large", "X-Large"],
    style: "Party",
    createdAt: "2024-01-14",
  },
  {
    id: 18,
    title: "Mini Party Skirt",
    image: "/src/assets/product-orange.jpg",
    price: 152000, // ₦95 * 1600
    rating: 4.1,
    reviews: 88,
    category: "Party",
    subcategory: "Skirts",
    color: "black",
    sizes: ["Small", "Medium", "Large"],
    style: "Party",
    createdAt: "2024-01-19",
  },
  {
    id: 19,
    title: "Statement Heels",
    image: "/src/assets/product-orange.jpg",
    price: 296000, // ₦185 * 1600
    originalPrice: 360000, // ₦225 * 1600
    rating: 4.6,
    reviews: 142,
    discount: 20,
    category: "Party",
    subcategory: "Heels",
    color: "red",
    sizes: ["6", "7", "8", "9", "10"],
    style: "Party",
    createdAt: "2024-01-24",
  },
  {
    id: 20,
    title: "Party Accessories Set",
    image: "/src/assets/product-orange.jpg",
    price: 120000, // ₦75 * 1600
    rating: 4.2,
    reviews: 98,
    category: "Party",
    subcategory: "Accessories",
    color: "silver",
    sizes: ["One Size"],
    style: "Party",
    createdAt: "2024-01-30",
  },

  // Gym Products
  {
    id: 21,
    title: "Performance Activewear Set",
    image: "/src/assets/product-tshirt.jpg",
    price: 216000, // ₦135 * 1600
    rating: 4.5,
    reviews: 185,
    category: "Gym",
    subcategory: "Activewear",
    color: "black",
    sizes: ["Small", "Medium", "Large", "X-Large"],
    style: "Gym",
    createdAt: "2024-01-05",
  },
  {
    id: 22,
    title: "Sports Bra Collection",
    image: "/src/assets/product-tshirt.jpg",
    price: 88000, // ₦55 * 1600
    rating: 4.3,
    reviews: 155,
    category: "Gym",
    subcategory: "Sports Bras",
    color: "pink",
    sizes: ["Small", "Medium", "Large"],
    style: "Gym",
    createdAt: "2024-01-11",
  },
  {
    id: 23,
    title: "High-Waist Leggings",
    image: "/src/assets/product-jeans.jpg",
    price: 136000, // ₦85 * 1600
    rating: 4.6,
    reviews: 210,
    category: "Gym",
    subcategory: "Leggings",
    color: "black",
    sizes: ["Small", "Medium", "Large", "X-Large"],
    style: "Gym",
    createdAt: "2024-01-17",
  },
  {
    id: 24,
    title: "Running Sneakers",
    image: "/src/assets/product-orange.jpg",
    price: 264000, // ₦165 * 1600
    originalPrice: 312000, // ₦195 * 1600
    rating: 4.8,
    reviews: 275,
    discount: 15,
    category: "Gym",
    subcategory: "Sneakers",
    color: "white",
    sizes: ["6", "7", "8", "9", "10", "11"],
    style: "Gym",
    createdAt: "2024-01-23",
  },
  {
    id: 25,
    title: "Athletic Tank Top",
    image: "/src/assets/product-tshirt.jpg",
    price: 72000, // ₦45 * 1600
    rating: 4.2,
    reviews: 135,
    category: "Gym",
    subcategory: "Tank Tops",
    color: "gray",
    sizes: ["Small", "Medium", "Large", "X-Large"],
    style: "Gym",
    createdAt: "2024-01-29",
  },
];