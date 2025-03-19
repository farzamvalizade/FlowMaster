import { Link } from "react-router-dom";

export default function Footer({ isLogin }) {
  return (
  <>
    {/* Footer Section */} 
    <footer className="w-full bg-white p-8 dark:bg-gray-800 dark:text-white">
      {/* Logo & Links */}
      <div className="flex flex-col md:flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 text-center md:justify-between">
        {/* Logo */}
        <img
          src="/logo.svg"
          alt="Flow Master Logo"
          className="w-12 transition-transform duration-300 hover:rotate-12"
        />
        {/* Link */}
        <ul className="flex flex-wrap items-center gap-y-2 gap-x-8">
          {[
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
            { name: "Contact", path: "/contact" },
            ...(isLogin ? [{ name: "Dashboard", path: "/dashboard" }] : []),
          ].map(({ name, path }) => (
            <li key={name}>
              <Link
                to={path}
                className="font-medium text-gray-600 dark:text-gray-300 transition-colors hover:text-blue-500 focus:text-blue-500"
              >
                {name}
              </Link>
            </li>
          ))}
          <div className={`items-center ${!isLogin ? "flex" : "hidden"}`}>
            <li>
              <Link
                to="/login"
                className="font-medium text-gray-600 dark:text-gray-300 transition-colors hover:text-blue-500 focus:text-blue-500 mx-2"
              >
                Login
              </Link>
            </li>
            <span className="text-gray-400">|</span>
            <li>
              <Link
                to="/register"
                className="font-medium text-gray-600 dark:text-gray-300 transition-colors hover:text-blue-500 focus:text-blue-500 mx-2"
              >
                Register
              </Link>
            </li>
          </div>
        </ul>
      </div>

      <hr className="my-8 border-gray-300 dark:border-gray-600" />
      
      {/* Creator & SiteName*/}
      <div className="flex items-center justify-around text-xl font-semibold tracking-wide">
        <span className="bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent">
          Flow Master
        </span>
        <a className="relative text-blue-500 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-blue-500 after:transition-transform after:duration-300 hover:after:scale-x-100" href="https://github.com/farzamvalizade">Farzam</a>
      </div>
    </footer>
  </>
  );
}
