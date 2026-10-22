import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const response = await api.get("/products/");

        console.log("Products API response:", response.data);

        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.results || [];

        setProducts(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-5 bg-body-tertiary">
        <div className="container d-flex justify-content-center py-5">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-5 bg-body-tertiary">
        <div className="container text-center py-4">
          <div className="alert alert-danger d-inline-block" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </div>
          <div>
            <button
              className="btn btn-dark rounded-pill px-4"
              onClick={() => window.location.reload()}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-5 bg-body-tertiary">
      <div className="container py-lg-4">
        {/* Section Header */}
        <div className="row align-items-end g-3 mb-5">
          <div className="col-md-7">
            <span className="text-uppercase fw-bold small text-warning-emphasis">
              The collection
            </span>
            <h2 className="display-5 fw-bold mt-2 mb-0">Featured products</h2>
          </div>
          <div className="col-md-5">
            <p className="text-muted mb-0">
              Discover our curated selection of premium tech products and
              accessories.
            </p>
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
            {products.map((product) => {
              const outOfStock = !(product.stock > 0);

              return (
                <div className="col" key={product.id}>
                  <article className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                    {/* Image */}
                    <div className="position-relative">
                      <div className="ratio ratio-4x3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="object-fit-cover"
                        />
                      </div>
                      <span
                        className={`badge rounded-pill position-absolute top-0 start-0 m-3 ${
                          outOfStock ? "text-bg-danger" : "text-bg-success"
                        }`}
                      >
                        {outOfStock
                          ? "Out of stock"
                          : `${product.stock} in stock`}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="card-body d-flex flex-column p-4">
                      <h5
                        className="fw-bold mb-2 text-truncate"
                        title={product.name}
                      >
                        {product.name}
                      </h5>

                      <p className="text-muted small flex-grow-1 mb-3">
                        {typeof product.description === "string" &&
                        product.description.length > 0
                          ? product.description.length > 80
                            ? `${product.description.substring(0, 80)}...`
                            : product.description
                          : "No description available"}
                      </p>

                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="h4 fw-bold mb-0">
                          ${product.price}
                        </span>
                      </div>

                      <Link
                        to={`/product/${product.id}`}
                        className={`btn btn-dark rounded-pill w-100 ${
                          product.stock === 0 ? "disabled" : ""
                        }`}
                        aria-disabled={product.stock === 0}
                        tabIndex={product.stock === 0 ? -1 : undefined}
                      >
                        View Details
                        <i className="bi bi-arrow-right ms-2"></i>
                      </Link>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center border border-2 rounded-4 py-5 text-muted">
            <p className="mb-0">No products found.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;