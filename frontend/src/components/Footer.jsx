import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-dark text-light border-top border-warning border-3">
      <div className="container py-5">
        <div className="row g-4">
          {/* Brand */}
          <div className="col-lg-5">
            <div className="d-flex align-items-center fs-4 fw-bold mb-3">
              <i className="bi bi-bag-heart-fill text-warning me-2"></i>
              Easy<span className="text-warning">Shop</span>
            </div>
            <p className="text-secondary mb-4 col-lg-9 px-0">
              Quality tech and accessories, delivered fast and paid for
              securely.
            </p>
            <div className="d-flex gap-2">
              <a
                href="#"
                className="btn btn-outline-light rounded-circle"
                aria-label="Facebook"
              >
                <i className="bi bi-facebook"></i>
              </a>
              <a
                href="#"
                className="btn btn-outline-light rounded-circle"
                aria-label="Instagram"
              >
                <i className="bi bi-instagram"></i>
              </a>
              <a
                href="#"
                className="btn btn-outline-light rounded-circle"
                aria-label="Twitter"
              >
                <i className="bi bi-twitter-x"></i>
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="col-6 col-lg-3 offset-lg-1">
            <h6 className="text-uppercase text-warning small fw-bold mb-3">
              Shop
            </h6>
            <ul className="list-unstyled mb-0">
              <li className="mb-2">
                <Link
                  to="/"
                  className="link-light link-opacity-75 link-opacity-100-hover text-decoration-none"
                >
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/cart"
                  className="link-light link-opacity-75 link-opacity-100-hover text-decoration-none"
                >
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-6 col-lg-3">
            <h6 className="text-uppercase text-warning small fw-bold mb-3">
              Account
            </h6>
            <ul className="list-unstyled mb-0">
              <li className="mb-2">
                <Link
                  to="/login"
                  className="link-light link-opacity-75 link-opacity-100-hover text-decoration-none"
                >
                  Login
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/signup"
                  className="link-light link-opacity-75 link-opacity-100-hover text-decoration-none"
                >
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-top border-secondary">
        <div className="container py-3 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 small text-secondary">
          <span>© {new Date().getFullYear()} EasyShop. All rights reserved.</span>
          <span>
            Made with <i className="bi bi-heart-fill text-warning"></i> in Nepal
          </span>
        </div>
      </div>
    </footer>
  );
}