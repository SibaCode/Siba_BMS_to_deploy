import React, { useState, useEffect } from "react";

type Order = {
  id: string;
  paymentMethod: string;
  paymentStatus: string;
  deliveryStatus: string;
};

type EditOrderModalProps = {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  order: Order | null;
  onSave: (updatedFields: {
    paymentMethod: string;
    paymentStatus: string;
    deliveryStatus: string;
  }) => Promise<void>;
};

const EditOrderModal: React.FC<EditOrderModalProps> = ({
  open,
  onOpenChange,
  order,
  onSave,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState("");

  useEffect(() => {
    if (order) {
      setPaymentMethod(order.paymentMethod || "");
      setPaymentStatus(order.paymentStatus || "");
      setDeliveryStatus(order.deliveryStatus || "");
    }
  }, [order]);

  const handleSubmit = async () => {
    await onSave({ paymentMethod, paymentStatus, deliveryStatus });
    onOpenChange(false);
  };

  if (!open || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md w-full max-w-md space-y-4 shadow-lg">
        <h2 className="text-xl font-semibold mb-2">Edit Order #{order.id}</h2>

        <div>
          <label className="block text-sm font-medium mb-1">Payment Method</label>
          <select
            className="w-full border px-2 py-1 rounded"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)} >
            <option value="">Select method</option>
            <option value="cash">cash</option>
            <option value="yoco">yoco</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Payment Status</label>
          <select
            className="w-full border px-2 py-1 rounded"
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
          >
            <option value="">Select status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Paid</option>

          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Delivery Status</label>
          <select
            className="w-full border px-2 py-1 rounded"
            value={deliveryStatus}
            onChange={(e) => setDeliveryStatus(e.target.value)}
          >
            <option value="">Select status</option>
            <option value="not delivered">Not delivered</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            className="px-4 py-1 bg-gray-300 rounded"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-1 bg-blue-600 text-white rounded"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditOrderModal;
