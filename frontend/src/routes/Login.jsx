import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputField,AuthBox,FormButton } from "../components/Form.jsx";
import axios from "axios";
import Cookies from "js-cookie";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post("http://localhost:8000/api/auth/login/", formData);
      const { access, refresh, user } = response.data;
      
      Cookies.set("access_token", access, { expires: 1 }); 
      Cookies.set("refresh_token", refresh, { expires: 7 });
      Cookies.set("user", JSON.stringify(user), { expires: 1 });
      
      setUser(user);
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed! Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900 dark:text-white px-4">
      <AuthBox title="Login">
        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 text-red-500 bg-red-900 bg-opacity-20 rounded-lg animate-shake">
            <i className="fa-solid fa-circle-exclamation"></i>
            <span>{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <InputField label="Username" type="text" name="username" value={formData.username} onChange={handleChange} />
          <InputField label="Password" type="password" name="password" value={formData.password} onChange={handleChange} />
          <FormButton text="Login" />
        </form>
      </AuthBox>
      {/* Modal */}
      {user && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-gray-400 dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center relative animate-fadeIn w-1/3">
            <button
              className="absolute top-2 right-2 text-gray-800 hover:text-gray-600 dark:text-gray-400 dark:hover:text-white"
              onClick={() => {navigate("/"); window.location.reload(false);}}
            >
              <i className="fa-solid fa-circle-xmark text-xl"></i>
            </button>
            <p className="text-lg font-semibold text-[#00FFB5]">Welcome, {user.username}!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;

