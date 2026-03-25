// src/pages/CartPage.js

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CartItem from "../components/CartItem";
import PriceDetails from "../components/PriceDetails";
import Header from "../components/Header";

// ADDED: typography constant for whole page
const FONT_FAMILY = "'Inter', 'Segoe UI', sans-serif";

export default function CartPage() {
  const navigate = useNavigate();

  // ✅ Safe fallback
  const cartItems = useSelector((state) => state.cart.items || []);

  // ✅ Safe subtotal
  const subtotal = cartItems.reduce((sum, item) => {
    const price = Number(item.price || 0);
    const qty = Number(item.qty || 1);
    return sum + price * qty;
  }, 0);

  // ✅ Platform fee only when items exist
  const platformFee = cartItems.length > 0 ? 100 : 0;

  // ✅ Final total
  const total = subtotal + platformFee;

  return (
    <>
      <Header />

      <div className="container mt-4">
        <div className="row">
          {/* Left side */}
          <div className="col-lg-7 mb-4">
            <div className="p-3 shadow-sm bg-white">
              <div
                style={{
                  background: "#efd36d",
                  padding: "8px",
                  textAlign: "center",
                  fontWeight: "700",
                  fontSize: "18px",
                  marginBottom: "20px",
                }}
              >
                My Cart
              </div>

              {/* ✅ Empty cart message */}
              {cartItems.length === 0 ? (
                <div className="text-center py-5 fw-semibold text-muted">
                  Your cart is empty
                </div>
              ) : (
                cartItems.map((item) => (
                  <CartItem key={item.service_id} item={item} />
                ))
              )}
            </div>
          </div>

          {/* Right side */}
          <div className="col-lg-5 mb-4">
            <PriceDetails
              cartItems={cartItems}
              subtotal={subtotal}
              platformFee={platformFee}
              total={total}
              onCheckout={() => navigate("/order/details")}
            />
          </div>
        </div>
      </div>
    </>
  );
}
