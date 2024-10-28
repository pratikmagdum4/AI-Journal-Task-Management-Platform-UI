import { useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux"; // Import Redux hooks
import { logOut } from "../../redux/authSlice"; // Import updated logOut action
import { useNavigate } from 'react-router-dom'; // For navigation after logout
import "../../components/styles/navbar.css";
import { Link } from "react-router-dom"; // Import Link

function Navbar() {
    const navRef = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Get authentication state from Redux
    // const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    // Toggle Navbar responsiveness
    const showNavbar = () => {
        navRef.current.classList.toggle("responsive_nav");
    };

    // Handle logout
    const handleLogout = () => {
        dispatch(logOut()); // Dispatch the logOut action from authSlice
        navigate('/login'); // Redirect to login after logout
    };

    return (
        <header>
            <h3>LOGO</h3>
            <nav ref={navRef}>
                <Link to="/">Home</Link> {/* Replaced with Link */}
                {/* Conditionally render based on authentication status */}
                {!isAuthenticated ? (
                    <>
                        <Link to="/login">Login</Link> {/* Replaced with Link */}
                        <Link to="/signup">SignUp</Link> {/* Replaced with Link */}
                    </>
                ) : (
                    <>
                        <Link to="/login/u">Dashboard</Link> {/* Replaced with Link */}
                        <Link to="/login/t">Tasks</Link> {/* Replaced with Link */}
                        <button className="logout-btn" onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                )}
                <Link to="/a">About Us</Link> {/* Replaced with Link */}
                <Link to="/c">Contact</Link> {/* Replaced with Link */}
                <button className="nav-btn nav-close-btn" onClick={showNavbar}>
                    <FaTimes />
                </button>
            </nav>
            <button className="nav-btn" onClick={showNavbar}>
                <FaBars />
            </button>
        </header>
    );
}

export default Navbar;


