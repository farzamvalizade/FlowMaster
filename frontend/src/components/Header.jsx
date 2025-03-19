import { Typewriter } from "react-simple-typewriter";
import { Link } from "react-router-dom";
import useAuth from "../hooks/auth.jsx";

const Header = () => {
    const isLogin = useAuth()  
    return (

    <div className="flex flex-col items-center justify-center h-screen bg-white dark:bg-gray-900 dark:text-white">
        {/* Text */}
        <h1 className="text-4xl md:text-6xl font-bold mb-6 typing-text text-center break-all">
          <span className="typewriter-text dark:text-[#9ED5C5] text-[#30a48d]">
            <Typewriter
              words={["Flow Master", "Simplify Your Workflow", "From Chaos to Clarity"]}
              loop={0}
              typeSpeed={100}
              deleteSpeed={50}
              delaySpeed={1000}
            />
          </span>
        </h1>
        {/* Buttom */}
        <button className="relative px-6 py-2 text-lg font-semibold text-white bg-[#9ED5C5] rounded-lg shadow-lg transition-all duration-300 neon-button">
          <Link to={`${ isLogin ? "/dashboard" : "/register" }`}>
            { isLogin ? "Dashboard" :  "Get Strat" }
          </Link>    
        </button>
    </div>
    )
}
export default Header;
