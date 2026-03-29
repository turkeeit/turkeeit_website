import React from "react";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer
      className="pt-4 pb-2 mt-5"
      style={{
        backgroundColor: "#FFC500",
        color: "#0A0A0A",
        textAlign: "left",
      }}
    >
      <div className="container">
        <div className="row">
          {/* Column 1 */}
          <div className="col-12 col-md-4 mb-3">
            <h5>Turkeeit</h5>
            <p className="small">
              Your trusted home service partner for cleaning, plumbing,
              electrician, carpenter, painting and more.
            </p>
          </div>

          {/* Column 2 */}
          <div className="col-6 col-md-2 mb-3">
            <h6>Company</h6>
            <ul className="list-unstyled">
              <li>
                <a
                  href="#"
                  style={{ color: "#0A0A0A", textDecoration: "none" }}
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{ color: "#0A0A0A", textDecoration: "none" }}
                >
                  Careers
                </a>
              </li>
              <li
                onClick={() => navigate("/blogs")}
                style={{ cursor: "pointer" }}
              >
                Blogs
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="col-6 col-md-2 mb-3">
            <h6>Support</h6>
            <ul className="list-unstyled">
              <li>
                <a
                  href="#"
                  style={{ color: "#0A0A0A", textDecoration: "none" }}
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{ color: "#0A0A0A", textDecoration: "none" }}
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{ color: "#0A0A0A", textDecoration: "none" }}
                >
                  Feedback
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="col-12 col-md-4 mb-3">
            <h6>Legal</h6>
            <ul className="list-unstyled">
              <li>
                <a
                  href="#"
                  style={{ color: "#0A0A0A", textDecoration: "none" }}
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{ color: "#0A0A0A", textDecoration: "none" }}
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{ color: "#0A0A0A", textDecoration: "none" }}
                >
                  Refund Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-2">
          <p className="small text-center mb-1 ">
            © {new Date().getFullYear()} Turkeeit. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
