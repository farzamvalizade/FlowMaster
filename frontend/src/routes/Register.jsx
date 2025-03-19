import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputField,AuthBox,FormButton } from "../components/Form.jsx";
import axios from "axios";
import Cookies from "js-cookie";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username:"",email:"",password1:"",password2:"" });
  const [error, setError] = useState(null)
  const [show,setShow] = useState(false)
  const HandleChange = (e) => {

    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const HandleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post("http://localhost:8000/api/account/create/", formData);
      
      if (response.status === 201) {
        setShow(true)
      }

    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed! Please try again.");
    }
  };
  
  return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900 dark:text-white px-4">
      <AuthBox title="Register">
        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 text-red-500 bg-red-900 bg-opacity-20 rounded-lg animate-shake">
            <i className="fa-solid fa-circle-exclamation"></i>
            <span>{error}</span>
          </div>
        )}
        <form onSubmit={HandleSubmit}>
          <InputField label="Username" type="text" name="username" value={formData.username} onChange={HandleChange} />
          <InputField label="Email" type="email" name="email" value={formData.email} onChange={HandleChange} />
          <InputField label="Password" type="password" name="password1" value={formData.password1} onChange={HandleChange} />
          <InputField label="Confrim Password" type="password" name="password2" value={formData.password2} onChange={HandleChange} />
          <FormButton text="Register" />
        </form>
      </AuthBox>
      {/* Modal */}
      {show && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 dark:bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center relative animate-fadeIn w-full md:w-1/3">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={() => {navigate("/loign");}}
            >
              <i className="fa-solid fa-circle-xmark text-xl"></i>
            </button>
            <p className="text-lg font-semibold text-[#9ED5C5]">Your Account Created SecussFully!</p>
            <p className="text-lg font-semibold text-[#9ED5C5]">You Can Login Now.</p>
          </div>
        </div>
      )}
    </div> 
  )
}

export default Register;
