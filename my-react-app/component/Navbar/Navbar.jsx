import { useState, useEffect } from "react";
import {
  Navbar,
  Nav,
  NavDropdown,
  Container,
  Button,
  Badge,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../../component/ShopContext/UseCartContext"; // Context untuk keranjang
import logo from "../../src/assets/logo.png";
import cart_icon from "../../src/assets/cart_icon.png";

const CustomNavbar = () => {
  const { totalItems, setCartItems } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  // Fetch profil user
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoggedIn(false);
        return;
      }
      try {
        const response = await axios.get("http://localhost:8080/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setIsLoggedIn(false);
      }
    };
    fetchUserProfile();
  }, []);

  // Fetch data keranjang
  useEffect(() => {
    const fetchCartData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setCartItems([]);
        return;
      }
      try {
        const response = await axios.get("http://localhost:8080/api/carts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart data:", error);
        setCartItems([]);
      }
    };
    fetchCartData();
  }, [setCartItems]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setCartItems([]);
    navigate("/login");
  };

  const handleCartClick = () => {
    if (!isLoggedIn) {
      alert("Silakan login terlebih dahulu untuk mengakses keranjang.");
      navigate("/login");
    } else {
      navigate("/carts");
    }
  };

  return (
    <Navbar bg="light" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        {/* Logo */}
        <Navbar.Brand as={Link} to="/home">
          <img
            src={logo}
            alt="Logo"
            height="40"
            className="d-inline-block align-top"
          />{" "}
          <span className="fw-bold">Happy Food</span>
        </Navbar.Brand>

        {/* Toggle button untuk mobile */}
        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav">
          {/* Links di tengah */}
          <Nav className="mx-auto d-flex justify-content-center align-items-center">
            <Nav.Link as={Link} to="/home">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/">
              Menu
            </Nav.Link>
            <Nav.Link as={Link} to="/contact-us">
              Contact Us
            </Nav.Link>
          </Nav>

          {/* Bagian kanan: Login & Cart */}
          <Nav className="align-items-center">
            {isLoggedIn ? (
              <NavDropdown
                title={`Hello, ${user.full_name || "User"}`}
                id="user-dropdown"
              >
                <NavDropdown.Item as={Link} to="/me">
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Button
                as={Link}
                to="/login"
                variant="outline-primary"
                className="me-3"
              >
                Login
              </Button>
            )}

            {/* Cart */}
            <Nav.Link className="position-relative" onClick={handleCartClick}>
              <img src={cart_icon} alt="Cart Icon" height="35" />
              {totalItems > 0 && (
                <Badge
                  bg="danger"
                  className="position-absolute top-30 start-100 translate-middle"
                >
                  {totalItems}
                </Badge>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
