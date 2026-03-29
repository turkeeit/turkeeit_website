// src/pages/CartPage.js

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CartItem from "../components/CartItem";
import PriceDetails from "../components/PriceDetails";
import Header from "../components/Header";

const FONT_FAMILY = "'Inter', 'Segoe UI', sans-serif";

export default function CartPage() {
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.items || []);

  const subtotal = cartItems.reduce((sum, item) => {
    const price = Number(item.price || 0);
    const qty = Number(item.qty || 1);
    return sum + price * qty;
  }, 0);

  const platformFee = cartItems.length > 0 ? 100 : 0;
  const total = subtotal + platformFee;

  return (
    <>
      <Header />

      <div
        className="container-fluid px-4 px-md-5 mt-4"
        style={{ fontFamily: FONT_FAMILY }}
      >
        <div className="row g-4">
          {/* Left */}
          <div className="col-lg-7">
            <div className="shadow-sm bg-white">
              {/* Header strip */}
              <div
                style={{
                  background: "#e6cc6b",
                  padding: "8px 8px",
                  textAlign: "center",
                  fontWeight: "600",
                  fontSize: "20px",
                  color: "#222",
                  letterSpacing: "0.3px",
                }}
              >
                My Cart
              </div>

              <div className="p-3 p-md-4">
                {cartItems.length === 0 ? (
                  <div
                    className="text-center py-5"
                    style={{
                      fontWeight: "500",
                      fontSize: "18px",
                      color: "#777",
                    }}
                  >
                    Your cart is empty
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <CartItem key={item.service_id} item={item} />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="col-lg-5">
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
