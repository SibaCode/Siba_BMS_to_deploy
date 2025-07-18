import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useBusinessInfo } from "./components/BusinessInfoContext";
import { Download } from "lucide-react";

export interface Order {
  id: string;
  createdAt: string;
  paymentMethod: string;
  status: string;
  subtotal: number;
  total: number;
  items: Array<{ name: string; price: number; quantity: number }>;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    province: string;
  };
}

export { useCart };

const OrderSuccess = () => {
  const { lastOrder } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);
  const { businessInfo } = useBusinessInfo() || {};

  useEffect(() => {
    if (lastOrder) {
      setOrder(lastOrder);
    } else {
      const savedOrders = localStorage.getItem("orders");
      if (savedOrders) {
        const orders = JSON.parse(savedOrders);
        if (orders.length > 0) setOrder(orders[orders.length - 1]);
      }
    }
  }, [lastOrder]);

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto p-6 border rounded shadow text-center">
          <h2 className="text-xl font-semibold mb-4">No order found</h2>
          <p className="text-gray-600 mb-6">We couldn't find your order details.</p>
          <Button asChild>
            <Link to="/store">Return to Store</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!businessInfo) {
    return <div>Loading business information...</div>;
  }

  const handleDownloadReceipt = async () => {
    if (!receiptRef.current) return;

    const canvas = await html2canvas(receiptRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("receipt.pdf");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 flex flex-col items-center">
      {/* Receipt */}
      <div
        ref={receiptRef}
        className="bg-white w-full max-w-md p-6 shadow-md border border-gray-200 font-mono text-gray-900"
      >
        {/* Business Logo */}
        <div className="flex justify-center mb-6">
          {businessInfo.logo ? (
            <img
              src={businessInfo.logo}
              alt={`${businessInfo.name} Logo`}
              className="h-20 object-contain"
            />
          ) : (
            <div className="h-20 w-40 flex items-center justify-center bg-gray-200 text-gray-500 uppercase tracking-widest font-bold">
              LOGO
            </div>
          )}
        </div>

        {/* Business Info */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold">{businessInfo.name}</h2>
          <div>{businessInfo.addressLine1}</div>
          <div>
            {businessInfo.city}, {businessInfo.postalCode}
          </div>
          <div>{businessInfo.province}</div>
          <div>Phone: {businessInfo.phone}</div>
          <div>Email: {businessInfo.email}</div>
          {businessInfo.website && (
            <div className="underline text-blue-600">
              <a href={businessInfo.website} target="_blank" rel="noopener noreferrer">
                {businessInfo.website}
              </a>
            </div>
          )}
        </div>

        <hr className="border-gray-300 mb-6" />

        {/* Order Summary */}
        <div className="mb-4">
          <div className="flex justify-between">
            <span>Order Number:</span>
            <span>{order.id}</span>
          </div>
          <div className="flex justify-between">
            <span>Order Date:</span>
            <span>{formatDate(order.createdAt)}</span>
          </div>
          <div className="flex justify-between">
            <span>Payment Method:</span>
            <span className="capitalize">{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className="capitalize">{order.status}</span>
          </div>
        </div>

        <hr className="border-gray-300 mb-4" />

        {/* Items Table */}
        <table className="w-full text-left border-collapse mb-4">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-1 px-2 text-sm">Item</th>
              <th className="py-1 px-2 text-sm">Qty</th>
              <th className="py-1 px-2 text-sm">Price</th>
              <th className="py-1 px-2 text-sm">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-200">
                <td className="py-1 px-2 text-sm">{item.name}</td>
                <td className="py-1 px-2 text-sm">{item.quantity}</td>
                <td className="py-1 px-2 text-sm">R {item.price.toFixed(2)}</td>
                <td className="py-1 px-2 text-sm">R {(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-between font-semibold text-sm mb-2">
          <span>Subtotal:</span>
          <span>R {order.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold text-base border-t border-gray-300 pt-2">
          <span>Total:</span>
          <span>R {order.total.toFixed(2)}</span>
        </div>

        <hr className="border-gray-300 my-6" />

        {/* Customer Info */}
        <div>
          <div className="font-semibold mb-1">Customer Information</div>
          <div className="text-sm">
            <div>
              {order.customer.firstName} {order.customer.lastName}
            </div>
            <div>{order.customer.address}</div>
            <div>
              {order.customer.city}, {order.customer.postalCode}
            </div>
            <div>{order.customer.province}</div>
            <div>Phone: {order.customer.phone}</div>
            <div>Email: {order.customer.email}</div>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="mt-6">
        <Button
          onClick={handleDownloadReceipt}
          variant="outline"
          size="lg"
          className="flex items-center space-x-2"
        >
          <Download className="w-5 h-5" />
          <span>Download Receipt (PDF)</span>
        </Button>
      </div>
    </div>
  );
};

export default OrderSuccess;
