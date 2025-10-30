import React from "react";

export function EmailTemplate({
  orderId,
  name,
  address,
  phone,
  city,
  state,
  pincode,
  shippingMethod,
  total,
  items
}) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f4f7fa", padding: "30px" }}>
      <div
        style={{
          maxWidth: "600px",
          margin: "auto",
          background: "#ffffff",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 15px rgba(0,0,0,0.06)"
        }}
      >
        {/* ✅ Header */}
        <div style={{ background: "#10b981", padding: "25px", textAlign: "center", color: "#fff" }}>
          <h2 style={{ margin: 0, fontSize: "26px", fontWeight: "700" }}>
            ✅ New Order Received
          </h2>
          <p style={{ margin: "6px 0 0", fontSize: "14px", opacity: 0.9 }}>
            You have 1 new order at Medsonline4U
          </p>
        </div>

        {/* ✅ Body */}
        <div style={{ padding: "28px" }}>
          <p style={{ fontSize: "15px", margin: "0 0 5px" }}>Hi Admin 👋,</p>
          <p style={{ fontSize: "15px", margin: "0 0 18px" }}>
            A customer has successfully placed an order on{" "}
            <strong>Medsonline4U</strong>.
          </p>

          {/* ✅ Order Details Card */}
          <div
            style={{
              background: "#eef2f5",
              padding: "18px",
              borderRadius: "10px",
              marginTop: "10px",
              fontSize: "14px"
            }}
          >
            <h4 style={{ margin: "0 0 10px", fontWeight: "700", fontSize: "15px" }}>
              📌 Order Details:
            </h4>
            <p style={{ margin: "4px 0" }}>
              Order ID: <strong>{orderId}</strong>
            </p>
            <p style={{ margin: "4px 0" }}>
              Shipping Method: <strong>{shippingMethod}</strong>
            </p>
            <p style={{ margin: "4px 0" }}>
              Total Amount: <strong>${total}</strong>
            </p>

            <h4 style={{ margin: "14px 0 8px", fontWeight: "700", fontSize: "15px" }}>
              👤 Customer Details:
            </h4>
            <p style={{ margin: "4px 0" }}>
              Name: <strong>{name}</strong>
            </p>
            <p style={{ margin: "4px 0" }}>
              Phone: <strong>{phone}</strong>
            </p>
            <p style={{ margin: "4px 0" }}>
              Address: <strong>{address}, {city}, {state} - {pincode}</strong>
            </p>
          </div>

          {/* ✅ Items Table */}
          <h4 style={{ margin: "25px 0 12px", fontSize: "16px", fontWeight: "700" }}>
            📦 Items Ordered
          </h4>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th
                  align="left"
                  style={{ padding: "10px 0", borderBottom: "2px solid #e5e7eb", fontSize: "14px" }}
                >
                  Product
                </th>
                <th
                  align="center"
                  style={{ padding: "10px 0", borderBottom: "2px solid #e5e7eb", fontSize: "14px" }}
                >
                  Qty
                </th>
                <th
                  align="right"
                  style={{ padding: "10px 0", borderBottom: "2px solid #e5e7eb", fontSize: "14px" }}
                >
                  Price
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i}>
                  <td style={{ padding: "10px 0", borderBottom: "1px solid #e5e7eb" }}>
                    {item.name} {item.variation ? `(${item.variation})` : ""}
                  </td>
                  <td
                    align="center"
                    style={{ padding: "10px 0", borderBottom: "1px solid #e5e7eb" }}
                  >
                    {item.qty}
                  </td>
                  <td
                    align="right"
                    style={{ padding: "10px 0", borderBottom: "1px solid #e5e7eb" }}
                  >
                    ${item.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ✅ Footer Message */}
          <p style={{ marginTop: "30px", fontSize: "14px", color: "#6b7280" }}>
            If you have any questions, reply to this email — we’ll assist ASAP.
          </p>

          <p style={{ marginTop: "10px", fontSize: "14px" }}>
            Best regards,<br />
            <strong>Medsonline4U Team</strong>
          </p>
        </div>

        {/* ✅ Footer */}
        <div
          style={{
            background: "#f1f5f9",
            padding: "15px",
            textAlign: "center",
            fontSize: "12px",
            color: "#6b7280"
          }}
        >
          © {new Date().getFullYear()} Medsonline4U. All rights reserved.
        </div>
      </div>
    </div>
  );
}
