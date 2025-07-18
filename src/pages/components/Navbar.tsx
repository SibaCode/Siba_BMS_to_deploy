import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useBusinessInfo } from "@/pages/components/BusinessInfoContext";

const Navbar = () => {
  const { itemCount } = useCart();
  const location = useLocation();
  const { businessInfo, loading } = useBusinessInfo();
  console.log(businessInfo)

  if (loading) {
    return (
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Store className="h-8 w-8 text-primary animate-pulse" />
              <h1 className="text-2xl font-bold text-foreground">Loading...</h1>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            {businessInfo?.logo ? (
              <img
                src={businessInfo.logo}
                alt={`${businessInfo.name || "Business"} logo`}
                className="h-8 w-8 object-contain"
              />
            ) : (
              <Store className="h-8 w-8 text-primary" />
            )}
            <h1 className="text-2xl font-bold text-foreground">{businessInfo?.name || "Business"}</h1>
          </div>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link to="/" className={location.pathname === "/" ? "text-primary" : ""}>Home</Link>
            <Link to="/about-us" className={location.pathname === "/about-us" ? "text-primary" : ""}>About Us</Link>
            <Link to="/contact-us" className={location.pathname === "/contact-us" ? "text-primary" : ""}>Contact Us</Link>
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
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
