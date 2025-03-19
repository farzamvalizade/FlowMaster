import { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/Theme";
const Navbar = ({ isLogin }) => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);


  return (
    <nav
      className="bg-[#4cae4f] shadow-md p-3 md:px-40 flex justify-between items-center top-0 left-0 w-full z-10"
      style={{ position: "sticky" }}
    >
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <img
          src="/logo.svg"
          alt="Logo"
          className="h-12 w-12 rounded-full ml-2 transition-transform duration-300 hover:rotate-12"
        />
        <span className="text-xl font-bold text-white">
            FlowMaster
        </span>
      </div>

      {/* Links */}
      <div className="items-center space-x-4 text-white hidden md:flex">
        <Link to="/" className="hover:underline ">Home</Link>
        <Link to="/about" className="hover:underline">About</Link>
        <Link to="/contact" className="hover:underline">Contact</Link>
        <div className={`space-x-2 ${!isLogin ? "flex" : "hidden"} `}>
          <Link to="/login" className="hover:underline">Login</Link>
          <span>|</span>
          <Link to="/register" className="hover:underline">Register</Link>
        </div>
        <Link to="/dashboard" className={`hover:underline ${isLogin ? "table":"hidden"} `}>Dashboard</Link>
      </div>

      {/* Icons */}
      <div className="flex items-center space-x-3">
        {/* Theme Toggle */}
        <button onClick={toggleTheme} className="text-white text-xl hover:cursor-pointer">
          <i className="fa-solid fa-circle-half-stroke"></i>
        </button>
        <Link to="/profile" className={`text-white text-lg ${ !isLogin ? "hidden" : "" }`}>
          <i className="fa-solid fa-user"></i>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
