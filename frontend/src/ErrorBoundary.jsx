import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error);
    console.error("Error info:", errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <h1>Something went wrong 😕</h1>

          <p>
            An unexpected error occurred while loading this page.
          </p>

          <button onClick={this.handleReload}>
            Reload Page
          </button>

          {import.meta.env.DEV && (
            <pre
              style={{
                marginTop: "20px",
                maxWidth: "800px",
                overflow: "auto",
                color: "red",
              }}
            >
              {this.state.error?.toString()}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;