export default function PriceDetails({
  cartItems,
  subtotal,
  platformFee,
  total,
  onCheckout,
}) {
  return (
    <div className="shadow-sm bg-white p-4">
      <h3
        style={{
          fontWeight: "600",
          fontSize: "20px",
          marginBottom: "16px",
          color: "#1a1a1a",
          lineHeight: "1.3",
        }}
      >
        Price Details
      </h3>

      <div
        style={{
          background: "#f3f3f3",
          borderRadius: "14px",
          padding: "18px",
          marginBottom: "28px",
        }}
      >
        {cartItems.map((item) => (
          <div
            key={item.service_id}
            className="d-flex justify-content-between mb-2"
          >
            <span>{item.name}</span>
            <span>₹ {Number(item.price) * item.qty}</span>
          </div>
        ))}

        <div className="d-flex justify-content-between mb-2">
          <span>Tax</span>
          <span>₹ {platformFee}</span>
        </div>

        <hr />

        <div className="d-flex justify-content-between fw-bold fs-5">
          <span>Total</span>
          <span>₹ {total}</span>
        </div>
      </div>

      <button
        className="btn w-100"
        onClick={onCheckout}
        style={{
          background: "#f4bf00",
          border: "none",
          borderRadius: "16px",
          padding: "14px",
          fontWeight: "700",
          fontSize: "20px",
        }}
      >
        Checkout
      </button>
    </div>
  );
}
