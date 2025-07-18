import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Printer, Download, FileText } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useBusinessInfo } from "@/pages/components/BusinessInfoContext";

interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface CustomerInfo {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  firstName:string;
  createdAt:string;

}

interface InvoiceData {
  orderId: string;
  invoiceNumber: string;
  orderDate: string;
  dueDate: string;
  customer: CustomerInfo;
  items: InvoiceItem[];
  subtotal: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  createdAt:string;

}

const AdminInvoice = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
console.log(invoice)
const { businessInfo } = useBusinessInfo();
// console.log(businessInfo)
  // const [businessInfo, setBusinessInfo] = useState([]);

  // Helper to safely format currency numbers
  const formatCurrency = (num?: number) =>
    typeof num === "number" ? num.toFixed(2) : "0.00";

  // Ref for the invoice DOM element we want to export
  const invoiceRef = document.getElementById("invoice-content");


  const handleDownload = () => {
    const input = document.getElementById("invoice-content");
    if (!input) return;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      // A4 size in mm: 210 x 297
      const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice-${invoice?.orderId || "unknown"}.pdf`);
    });
  };

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!id) return;

      try {
        const docRef = doc(db, "orders", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as InvoiceData;
          setInvoice(data);
          console.log(data)
        } else {
          console.error("Invoice not found for orderId:", id);
        }
      } catch (error) {
        console.error("Error fetching invoice:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  if (loading) return <div className="text-center mt-20">Loading invoice...</div>;
  if (!invoice) return <div className="text-center mt-20 text-red-500">Invoice not found.</div>;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="border-b bg-white print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/orders">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <FileText className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">
              Invoice #{invoice.orderId}
            </h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>

      {/* Invoice Content */}
      <div
        id="invoice-content"
        className="max-w-4xl mx-auto px-4 py-8 bg-white"
        style={{ color: "#000" }}
      >
        <Card>
          <CardContent className="p-8">
            {/* Header */}
            <div className="flex justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-primary">{businessInfo.name}</h2>
                <div className="text-sm text-muted-foreground">
                  <p>{businessInfo.address}</p>
                  <p>{businessInfo.phone}</p>
                  <p>{businessInfo.email}</p>
                </div>
              </div>
              <div className="text-right text-sm">
                <p><strong>Invoice #:</strong> {invoice.orderId}</p>
                <p><strong>Order Date:</strong> {invoice.createdAt || "N/A"}</p>
                <p><strong>Due Date:</strong> {invoice.createdAt || "N/A"}</p>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Customer */}
            <div className="mb-8">
              <h3 className="font-semibold mb-2">Billed To:</h3>
              <div className="bg-muted p-4 rounded">
                <p className="font-medium">{invoice.customer?.firstName || "N/A"}</p>
                <p className="text-sm text-muted-foreground">{invoice.customer?.address || "N/A"}</p>
                <p className="text-sm">{invoice.customer?.phone || "N/A"}</p>
                <p className="text-sm">{invoice.customer?.email || "N/A"}</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <h3 className="font-semibold mb-4">Items</h3>
              <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-2 border">Item</th>
                    <th className="text-center p-2 border">Qty</th>
                    <th className="text-right p-2 border">Price</th>
                    <th className="text-right p-2 border">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items?.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-2 border">{item.name}</td>
                      <td className="text-center p-2 border">{item.quantity}</td>
                      <td className="text-right p-2 border">R{formatCurrency(item.price)}</td>
                      <td className="text-right p-2 border">R{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-6">
              <div className="w-64 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>R{formatCurrency(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>R{formatCurrency(invoice.total)}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Payment Info</h3>
              <div className="flex justify-between items-center bg-muted p-4 rounded">
                <div>
                  <p><strong>Method:</strong> {invoice.paymentMethod || "N/A"}</p>
                </div>
                <Badge variant={invoice.paymentStatus === "Paid" ? "default" : "secondary"}>
                  {invoice.paymentStatus || "Pending"}
                </Badge>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-muted-foreground border-t pt-4">
              <p>Thanks for shopping with us!</p>
              <p>Need help? Contact {businessInfo.email}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminInvoice;
