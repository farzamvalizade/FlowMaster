import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { InputField,FormButton } from "../components/Form.jsx";

const UserProfile = ({ userDetail }) => {

  const accessToken = Cookies.get("access_token");

  const [profileImage, setProfileImage] = useState(userDetail.profile_picture);
  const [show, setShow] = useState(false);
  const [data,setData] = useState({ email:userDetail.email,bio:userDetail.bio })
  const [error, setError] = useState(null); 

  const HandleProfileImageChange = async (e) => {
    const filePath = e.target.files[0]
    if (!filePath) return;
    
    try {
      const formData = new FormData();
      formData.append("profile_picture", filePath);

      const response = await axios.patch("http://localhost:8000/api/account/profile/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}` 
        },
      });

      setProfileImage(response.data.profile_picture);
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  const HandleClick = () => {
    setShow(pervState => setShow(!pervState));
  };

  const HandleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  
  const HandleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    
    try {
      const formData = new FormData();
      formData.append("email",data.email)
      formData.append("bio",data.bio)
      const response = await axios.patch("http://localhost:8000/api/account/profile/", formData , {        
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}` 
        },  
      });
      
      setData({ ...data,[response.data.name]: response.data.value })

    } catch (err) {
      setError(err.response?.data?.detail || "Login failed! Please try again.");
    }
  };


  return (
    <div className="flex justify-center items-center space-x-4 md:space-x-16 mt-8 md:mt-4">
      {/*Profile Image Sectiom*/}
      <div className="relative group">
        {/* Profile Image */}
        <img 
          src={profileImage ? profileImage : "https://placehold.co/130x95/png"} 
          alt="Profile" 
          className="w-32 h-24 rounded-full border-4 border-blue-500" 
        />
        {/* Edit Button For Edit Profile Image */}
        <label className="absolute bottom-0 right-0 p-2 opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition duration-300 bg-white dark:bg-gray-800 rounded-full shadow-md">
          <i className="fa-regular fa-pen-to-square"></i>
          <input type="file" className="hidden" accept="image/*" onChange={HandleProfileImageChange}  />
        </label>
      </div>
      {/* Profile Detail */}
      <div className="relative group">
        {/* Detail */}
        <h2 className="text-4xl font-bold mb-1 text-blue-600 dark:text-blue-400 uppercase">{userDetail.username}</h2>
        <p className="text-gray-600 dark:text-gray-300">{data.email}</p>
    <p className="mt-2 mr-8 md:mr-12 italic text-gray-500 dark:text-gray-400">"{data.bio ? data.bio : "No Bio x" }"</p>
        {/* Edit Button For Email and Bio */}
        <button onClick={HandleClick} className="absolute bottom-0 right-0 p-2 opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition duration-300 bg-white dark:bg-gray-800 rounded-full shadow-md">
          <i className="fa-regular fa-pen-to-square"></i>
        </button>
      </div>
      {/* Modal */}
      {show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-gray-400 dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center relative animate-fadeIn w-1/3">
            <button
              className="absolute top-2 right-2 text-gray-800 hover:text-gray-600 dark:text-gray-400 dark:hover:text-white"
              onClick={HandleClick}
            >
              <i className="fa-solid fa-circle-xmark text-xl"></i>
            </button>
            <div>
              {error && (
                <div className="flex items-center gap-2 p-3 mb-4 text-red-500 bg-red-900 bg-opacity-20 rounded-lg animate-shake">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <span>{error}</span>
                </div>
              )}
              <form onSubmit={HandleSubmit}>
                <InputField label="Email" type="email" name="email" value={data.email} onChange={HandleChange} />
                <InputField label="Bio" type="text" name="bio" value={data.bio} onChange={HandleChange} />
                <button
                  type="submit"
                  className="w-full py-2 bg-[#9ED5C5] text-gray-900 font-bold rounded-lg hover:bg-[#7eb8a5] transition-all"
                  onClick={HandleClick}
                >
                  Edit
                </button>
              </form>
            </div>
          </div>
        </div>
      )} 
    </div>
  )
};

export default UserProfile;
