import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-80 bg-red-100 dark:bg-red-800 mt-32 mb-40 rounded-lg m-8 p-6">
      <h1 className="text-6xl font-bold text-red-700 dark:text-red-400 animate-bounce">404</h1>
      <p className="text-xl text-red-600 dark:text-red-300 mt-2">Oops! Page Not Found</p>
      <p className="text-gray-600 dark:text-gray-300 mt-2">The page you are looking for doesn’t exist.</p>
      <Link 
        to="/" 
        className="mt-6 px-6 py-2 bg-[#8EC3B0] dark:bg-[#5A8F7B] text-white rounded-lg shadow-md hover:bg-[#9ED5C5] dark:hover:bg-[#70A18B] transition"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
