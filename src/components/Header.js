import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../assets/app-icon.png"; // update path

export default function Header() {
  return (
    <>
      <nav className="navbar bg-white shadow-sm px-3">
        <div className="container-fluid">
          {/* Logo (col-2) */}
          <div className="col-2 d-flex align-items-center">
            <img src={logo} alt="Turkeeit" style={{ height: "45px" }} />
            <span className="ms-2 logo fw-bold">Turkeeit</span>
          </div>

          {/* Search Bar (col-7) */}
          <div className="col-7 d-flex justify-content-center ">
            <input
              type="text"
              className="form-control"
              placeholder="Search services..."
            />
            <button className="btn btn-primary search-btn">Search</button>
          </div>

          {/* Sign In (col-3) */}
          <div className="col-3 d-flex justify-content-end">
            <button className="btn">
              Location <i className="bi bi-caret-down"></i>
            </button>
            <button className="btn ">Sign In</button>
          </div>
        </div>
      </nav>
      <nav class="navbar navbar-expand-lg bg-white border-top border-bottom">
        <div class="container-fluid justify-content-start">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link px-3" href="#">
                Cleaning
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link px-3" href="#">
                Electrician
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link px-3" href="#">
                Plumber
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link px-3" href="#">
                Carpenter
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link px-3" href="#">
                Painting
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link px-3" href="#">
                AC Service
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
