import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="border-t bg-muted/30 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-muted-foreground">
          <p>&copy; 2025 - Sibahle Accessories. All rights reserved.</p>
          <p className="mt-2">Premium quality products with excellent customer service</p>
          <div className="mt-4">
            <Button variant="outline" asChild>
              <Link to="/admin">Admin Panel</Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
