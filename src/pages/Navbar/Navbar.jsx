import { useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../redux/authSlice";
import { useNavigate } from 'react-router-dom';
import "../../components/styles/navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
    const navRef = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated ?? false);

    const showNavbar = () => {
        navRef.current.classList.toggle("responsive_nav");
    };

    const handleLogout = () => {
        dispatch(logOut());
        navigate('/login');
    };

    return (
        <header>
            <h3>LOGO</h3>
            <nav ref={navRef}>
                <Link to="/">Home</Link>
                {/* Conditionally render based on authentication status */}
                {!isAuthenticated ? (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">SignUp</Link>
                    </>
                ) : (
                    <>
                        <Link to="/login/u">Dashboard</Link>
                        <Link to="/login/t">Tasks</Link>
                        <button className="logout-btn" onClick={handleLogout}>Logout</button>
                    </>
                )}
<<<<<<< HEAD
                <Link to="/about">About Us</Link> {/* Ensure this is correctly pointing to About Us */}
                <Link to="/c">Contact</Link>
=======
                <Link to="/a">About Us</Link> {/* Replaced with Link */}
                <Link to="/c">Contact</Link> {/* Replaced with Link */}
>>>>>>> master
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
