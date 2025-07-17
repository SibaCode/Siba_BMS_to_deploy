import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/contexts/CartContext";
import { 
  Search, 
  ShoppingCart, 
  Plus, 
  Store,
  Filter
} from "lucide-react";

const PublicStore = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { addItem, itemCount } = useCart();

  // Mock data - in real app this would come from backend
  const products = [
    {
      id: 1,
      name: "Premium Apron",
      category: "Aprons",
      price: 45.99,
      image: "/api/placeholder/300/300",
      description: "High-quality cotton apron perfect for cooking and crafting",
      inStock: true,
      stock: 23
    },
    {
      id: 2,
      name: "Coffee Mug Set",
      category: "Mugs",
      price: 29.99,
      image: "/api/placeholder/300/300",
      description: "Set of 2 ceramic mugs with beautiful design",
      inStock: true,
      stock: 15
    },
    {
      id: 3,
      name: "Travel Umbrella",
      category: "Umbrellas",
      price: 59.99,
      image: "/api/placeholder/300/300",
      description: "Compact travel umbrella with wind resistance",
      inStock: true,
      stock: 8
    },
    {
      id: 4,
      name: "Limited Edition Mug",
      category: "Mugs",
      price: 35.99,
      image: "/api/placeholder/300/300",
      description: "Special edition mug with unique artwork",
      inStock: false,
      stock: 0
    },
    {
      id: 5,
      name: "Chef's Apron",
      category: "Aprons",
      price: 52.99,
      image: "/api/placeholder/300/300",
      description: "Professional chef's apron with multiple pockets",
      inStock: true,
      stock: 12
    },
    {
      id: 6,
      name: "Storm Umbrella",
      category: "Umbrellas",
      price: 75.99,
      image: "/api/placeholder/300/300",
      description: "Heavy-duty umbrella for extreme weather conditions",
      inStock: true,
      stock: 6
    }
  ];

  const categories = ["all", "Aprons", "Mugs", "Umbrellas"];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Store className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Your Store</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link to="/admin">Admin Panel</Link>
              </Button>
              <Button asChild className="relative">
                <Link to="/store/cart">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart
                  {itemCount > 0 && (
                    <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs">
                      {itemCount}
                    </Badge>
                  )}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Welcome to Our Store</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Discover premium aprons, mugs, and umbrellas for every occasion
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Aprons">Aprons</SelectItem>
                <SelectItem value="Mugs">Mugs</SelectItem>
                <SelectItem value="Umbrellas">Umbrellas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold">Our Products</h3>
          <p className="text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow group">
              <CardHeader className="pb-4">
                <div className="aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <Store className="h-16 w-16 text-primary/50" />
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">{product.name}</CardTitle>
                    <Badge variant="secondary" className="mb-2">{product.category}</Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">R{product.price}</div>
                    <div className="text-sm text-muted-foreground">
                      {product.inStock ? `${product.stock} in stock` : "Out of stock"}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {product.description}
                </p>
                <Button 
                  className="w-full" 
                  disabled={!product.inStock}
                  onClick={() => handleAddToCart(product)}
                >
                  {product.inStock ? (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add to Cart
                    </>
                  ) : (
                    "Out of Stock"
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <Card className="py-12">
            <CardContent className="text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground">
                {searchTerm || categoryFilter !== "all" 
                  ? "Try adjusting your search or filter criteria"
                  : "No products available at the moment"
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 Your Store. All rights reserved.</p>
            <p className="mt-2">Premium quality products with excellent customer service</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicStore;
