"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from "@/components/ui/select";
import { useParams } from "next/navigation";

export default function OrderDetails() {
  const router = useRouter();
const params = useParams();
  const { id } = params;

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`)
      .then(res => res.json())
      .then(data => {
        setOrder(data);
        setLoading(false);
      });
  }, [id]);

  const handleSave = async () => {
    setUpdateLoading(true);
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });

    setUpdateLoading(false);

    if (!res.ok) {
      alert("Update failed. Fix your backend.");
      return;
    }

    alert("Order updated!");
    router.refresh();
  };

  if (loading) return <div className="p-6">Loading order...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Order #{id} Details</h1>

      {/* CUSTOMER DETAILS */}
      <Card>
        <CardHeader><CardTitle>Customer Details</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Name</Label>
            <Input
              value={order.customer_name}
              onChange={(e) => setOrder({ ...order, customer_name: e.target.value })}
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              value={order.customer_email}
              onChange={(e) => setOrder({ ...order, customer_email: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <Label>Address</Label>
            <Input
              value={order.customer_address}
              onChange={(e) => setOrder({ ...order, customer_address: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* ORDER STATUS */}
      <Card>
        <CardHeader><CardTitle>Status</CardTitle></CardHeader>
        <CardContent>
          <Select
            value={order.status}
            onValueChange={(value) => setOrder({ ...order, status: value })}
          >
            <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="PROCESSING">Processing</SelectItem>
              <SelectItem value="SHIPPED">Shipped</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
              <SelectItem value="CANCELED">Canceled</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* ITEMS */}
      <Card>
        <CardHeader><CardTitle>Items</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {order.items.map((item, index) => (
            <div key={index} className="grid grid-cols-4 items-center gap-3 border p-3 rounded-md">
              <span className="col-span-2">{item.name}</span>
              <Input
                type="number"
                value={item.quantity}
                className="w-20"
                onChange={(e) => {
                  const updatedItems = [...order.items];
                  updatedItems[index].quantity = Number(e.target.value);
                  setOrder({ ...order, items: updatedItems });
                }}
              />
              <span>${item.price}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button disabled={updateLoading} onClick={handleSave}>
          {updateLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
