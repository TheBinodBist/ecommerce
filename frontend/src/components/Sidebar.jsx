import { LayoutDashboard, LogOut, Package } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Col, Nav, Button } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import useAuth from "../hooks/useAuth";
import "../styles/ui.css";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const { auth, setAuth } = useAuth();
  const menuItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/dashboard/orders", icon: Package, label: "My Orders" },
    // { path: "/dashboard/profile", icon: User, label: "Profile Info" },
    // { path: "/dashboard/addresses", icon: MapPin, label: "Addresses" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    setAuth({});
    dispatch({
      type: "SET_CART",
      payload: {
        items: [],
        subtotal: 0,
        total: 0,
        itemCount: 0,
      },
    });

    navigate("/");
  };

  return (
    <Col as="aside" lg={3} className="mb-4">
      <div className="ui-side sticky-top" style={{ top: "90px" }}>
        <div
          className="ui-eyebrow px-3 pt-2 pb-3"
          style={{ color: "rgba(255,255,255,.45)" }}
        >
          My account
        </div>

        <Nav className="flex-column gap-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              className={({ isActive }) =>
                `ui-side-link ${isActive ? "active" : ""}`
              }
            >
              <item.icon size={18} /> {item.label}
            </NavLink>
          ))}
        </Nav>

        <div className="ui-divider-dark my-3" />

        <Button
          variant="link"
          className="ui-side-link danger w-100 text-start"
          onClick={() => handleLogout()}
        >
          <LogOut size={18} /> Logout
        </Button>
      </div>
    </Col>
  );
};

export default Sidebar;
