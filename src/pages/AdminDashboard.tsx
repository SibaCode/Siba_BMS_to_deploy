import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import {
  Store,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
} from "lucide-react"; // or your icon lib
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"; 
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// or wherever your UI components live
import { Link } from "react-router-dom"; // or your router

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const productsCol = collection(db, "products");
        const ordersCol = collection(db, "orders");
        const customersCol = collection(db, "customers");

        const [productsSnap, ordersSnap, customersSnap] = await Promise.all([
          getDocs(productsCol),
          getDocs(ordersCol),
          getDocs(customersCol),
        ]);

        setProducts(productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setOrders(ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setCustomers(customersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching collections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) return <div>Loading all data...</div>;

  // Calculate stats dynamically
  const totalProducts = products.length;

  // Assuming each product has a `stock` property (number)
  const lowStockItems = products.filter(p => p.stock !== undefined && p.stock <= 5).length;

  const totalOrders = orders.length;
  // Assuming orders have a `status` field
  const pendingOrders = orders.filter(order => order.status === "pending").length;

  const totalCustomers = customers.length;

  // Assuming orders have an `amount` field (number) and a `date` field (timestamp or ISO string)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyRevenue = orders
    .filter(order => {
      const orderDate = new Date(order.date);
      return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
    })
    .reduce((acc, order) => acc + (order.amount || 0), 0);

  // Top products - naive: top by sales field if exists, else empty array
  // Assuming products have `sales` and `revenue` fields
  const topProducts = [...products]
    .filter(p => p.sales && p.revenue)
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Store className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button asChild variant="outline">
                <Link to="/store">View Store</Link>
              </Button>
              <Button asChild>
                <Link to="/admin/inventory">Manage Inventory</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>Low stock:</span>
                <Badge variant={lowStockItems > 5 ? "destructive" : "secondary"}>
                  {lowStockItems}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>Pending:</span>
                <Badge variant="secondary">{pendingOrders}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCustomers}</div>
              <p className="text-sm text-muted-foreground">+5 this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R{monthlyRevenue.toLocaleString()}</div>
              <div className="flex items-center space-x-1 text-sm text-success">
                <TrendingUp className="h-3 w-3" />
                <span>+12% from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-primary" />
                <span>Inventory Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Add, edit, and manage your product inventory
              </p>
              <Button asChild className="w-full">
                <Link to="/admin/inventory">Manage Inventory</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                <span>Order Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Track and manage customer orders
              </p>
              <Button asChild className="w-full">
                <Link to="/admin/orders">View Orders</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <span>Customer Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                View and manage customer information
              </p>
              <Button asChild className="w-full">
                <Link to="/admin/customers">View Customers</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <span>Low Stock Alert</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* List actual low stock products */}
                {products
                  .filter(p => p.stock !== undefined && p.stock <= 5)
                  .map(product => (
                    <div
                      key={product.id}
                      className="flex justify-between items-center"
                    >
                      <span className="text-sm">{product.name || "Unnamed"}</span>
                      <Badge variant="destructive">{product.stock} left</Badge>
                    </div>
                  ))}
                {lowStockItems === 0 && <p className="text-sm text-muted-foreground">No low stock items!</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-success" />
                <span>Top Products</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topProducts.length > 0 ? (
                topProducts.map(product => (
                  <div
                    key={product.id}
                    className="flex justify-between items-center mb-2"
                  >
                    <span>{product.name}</span>
                    <span className="font-semibold">Sold: {product.sales}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No sales data available.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
