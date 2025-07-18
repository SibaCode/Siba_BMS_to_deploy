import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings } from "lucide-react";
import AdminBusinessInfo from "@/pages/AdminBusinessInfo";

const AdminBusinessInfoPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <Settings className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Business Information</h1>
            </div>
            <Button asChild variant="outline">
              <Link to="/admin">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminBusinessInfo />
      </div>
    </div>
  );
};

export default AdminBusinessInfoPage;