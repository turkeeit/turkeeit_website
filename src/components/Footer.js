import React from "react";

export default function Footer() {
  return (
    <>
      <footer className="bg-dark text-light pt-4 pb-2 mt-5">
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
                  <a href="#" className="text-light text-decoration-none">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-light text-decoration-none">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-light text-decoration-none">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="col-6 col-md-2 mb-3">
              <h6>Support</h6>
              <ul className="list-unstyled">
                <li>
                  <a href="#" className="text-light text-decoration-none">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-light text-decoration-none">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-light text-decoration-none">
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
                  <a href="#" className="text-light text-decoration-none">
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="text-light text-decoration-none">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-light text-decoration-none">
                    Refund Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-3">
            <p className="small mb-0">
              © {new Date().getFullYear()} Turkeeit. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
