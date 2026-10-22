const Hero = () => {
  const scrollToProducts = () => {
    const productsSection = document.getElementById("products");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="bg-dark text-light py-5">
      <div className="container py-lg-5">
        <div className="row align-items-center g-5">
          {/* Text */}
          <div className="col-lg-6 fade-in">
            <span className="badge rounded-pill text-bg-warning text-uppercase px-3 py-2 mb-4">
              New season drop
            </span>

            <h1 className="display-3 fw-bold mb-4">
              Discover amazing{" "}
              <span className="fst-italic text-warning">tech products</span>
            </h1>

            <p className="lead text-secondary mb-4">
              Find the latest gadgets and accessories at unbeatable prices.
              Quality guaranteed with fast, secure delivery.
            </p>

            <div className="d-flex flex-wrap gap-3 mb-5">
              <button
                type="button"
                className="btn btn-warning btn-lg rounded-pill px-4 fw-semibold"
                onClick={scrollToProducts}
              >
                <i className="bi bi-bag-plus me-2"></i>
                Shop Now
              </button>
              <button
                type="button"
                className="btn btn-outline-light btn-lg rounded-pill px-4"
              >
                Learn More
                <i className="bi bi-arrow-right ms-2"></i>
              </button>
            </div>

            <div className="row g-4 border-top border-secondary pt-4">
              <div className="col-4">
                <small className="text-uppercase text-secondary d-block">
                  Delivery
                </small>
                <span className="fs-5 fw-semibold">Fast</span>
              </div>
              <div className="col-4">
                <small className="text-uppercase text-secondary d-block">
                  Checkout
                </small>
                <span className="fs-5 fw-semibold">Secure</span>
              </div>
              <div className="col-4">
                <small className="text-uppercase text-secondary d-block">
                  Quality
                </small>
                <span className="fs-5 fw-semibold">Guaranteed</span>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="col-lg-6">
            <div className="position-relative">
              <div className="ratio ratio-4x3 rounded-5 overflow-hidden shadow-lg border border-warning border-2">
                <img
                  src="https://images.pexels.com/photos/129205/pexels-photo-129205.jpeg"
                  alt="Tech Products"
                  className="object-fit-cover"
                />
              </div>
              <div className="position-absolute bottom-0 start-0 translate-middle-y ms-3 bg-light text-dark rounded-4 shadow px-3 py-2">
                <small className="text-uppercase fw-semibold text-secondary d-block">
                  Top rated
                </small>
                <span className="fw-bold">Gear you'll love</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;