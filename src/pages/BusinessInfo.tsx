import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useCart } from "@/contexts/CartContext";
import { Checkbox } from "@/components/ui/checkbox";
import VariantsSection from "./VariantsSection"
import CategoriesSection from "./CategoriesSection"
import {
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  AlertTriangle,
  Package
} from "lucide-react";

const BusinessInfo = () => {
  const [businessInfo, setBusinessInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    description: "",
  });
  const [modalOpen, setModalOpen] = useState(false);

  const collectionRef = collection(db, "businessInfo");

  const fetchBusinessInfo = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collectionRef);
      setBusinessInfo(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Failed to fetch business info:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinessInfo();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: "", address: "", phone: "", email: "", description: "" });
    setModalOpen(true);
  };

  const openEditModal = info => {
    setEditingId(info.id);
    setFormData({
      name: info.name || "",
      address: info.address || "",
      phone: info.phone || "",
      email: info.email || "",
      description: info.description || "",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setFormData({ name: "", address: "", phone: "", email: "", description: "" });
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingId) {
        const docRef = doc(db, "businessInfo", editingId);
        await updateDoc(docRef, formData);
      } else {
        await addDoc(collectionRef, formData);
      }
      fetchBusinessInfo();
      closeModal();
    } catch (error) {
      console.error("Failed to save business info:", error);
    }
  };

  const handleDelete = async id => {
    try {
      await deleteDoc(doc(db, "businessInfo", id));
      fetchBusinessInfo();
    } catch (error) {
      console.error("Failed to delete business info:", error);
    }
  };

  const totalBusinesses = businessInfo.length;
  const totalCategories = new Set(businessInfo.map(b => b.category)).size;
  const pendingCount = businessInfo.filter(b => b.status === "pending").length;
  const activeCount = businessInfo.filter(b => b.isActive).length;
  return (
    <div className="min-h-screen bg-background">
        <div className="border-b bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="sm" asChild>
                                <Link to="/admin">
                                <ArrowLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                            <Package className="h-8 w-8 text-primary" />
                            <h1 className="text-2xl font-bold text-foreground">Business Management</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                        <Button onClick={openAddModal} className="mb-4">Add Business Info</Button>
                            {/* Modal */}
                            {modalOpen && (
                            <div
                                className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                                onClick={closeModal} // close modal on backdrop click
                            >
                                <div
                                className="bg-white p-6 rounded shadow-lg w-full max-w-md"
                                onClick={e => e.stopPropagation()} // prevent closing when clicking inside modal
                                >
                                <h2 className="text-xl font-semibold mb-4">
                                    {editingId ? "Edit Business Info" : "Add Business Info"}
                                </h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <input
                                    type="text"
                                    name="name"
                                    placeholder="Business Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="input input-bordered w-full"
                                    />
                                    <input
                                    type="text"
                                    name="address"
                                    placeholder="Address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                    />
                                    <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                    />
                                    <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="input input-bordered w-full"
                                    />
                                    <textarea
                                    name="description"
                                    placeholder="Business Description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={3}
                                    className="textarea textarea-bordered w-full"
                                    />

                                    <div className="flex justify-end space-x-2">
                                    <Button type="submit">{editingId ? "Update" : "Add"}</Button>
                                    <Button variant="outline" type="button" onClick={closeModal}>
                                        Cancel
                                    </Button>
                                    </div>
                                </form>
                                </div>
                            </div>
                            )}
                        </div>
                </div>
            </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Total businessInfo */}
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{businessInfo.length}</div>
                <div className="text-sm text-muted-foreground">Total businessInfo</div>
              </CardContent>
            </Card>

            {/* Active Listings */}
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">
                  {businessInfo.filter(b => b.isActive).length}
                </div>
                <div className="text-sm text-muted-foreground">Active Listings</div>
              </CardContent>
            </Card>

            {/* Categories (if applicable) */}
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">
                  {new Set(businessInfo.map(b => b.category)).size}
                </div>
                <div className="text-sm text-muted-foreground">Business Categories</div>
              </CardContent>
            </Card>

            {/* Pending Reviews */}
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-orange-500">
                  {businessInfo.filter(b => b.status === "pending").length}
                </div>
                <div className="text-sm text-muted-foreground">Pending Approvals</div>
              </CardContent>
            </Card>
          </div>

             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
              <h2 className="text-2xl font-bold mb-6">Business Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {businessInfo.length === 0 ? (
                  <Card className="col-span-full text-center p-6">
                    <p className="text-muted-foreground">No business info found.</p>
                  </Card>
                ) : (
                  businessInfo.map(info => (
                    <Card key={info.id} className="flex flex-col justify-between">
                      <CardHeader>
                        <CardTitle className="text-lg">{info.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground space-y-1">
                        <p><strong>Address:</strong> {info.address}</p>
                        <p><strong>Phone:</strong> {info.phone}</p>
                        <p><strong>Email:</strong> {info.email}</p>
                        {info.description && (
                          <p className="italic text-sm pt-2 border-t mt-2">{info.description}</p>
                        )}
                      </CardContent>
                      <div className="flex justify-between items-center px-4 pb-4 mt-auto">
                        <Button size="sm" onClick={() => openEditModal(info)}>Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(info.id)}>
                          Delete
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>

        </div>

 
</div>
);
};

export default BusinessInfo;
