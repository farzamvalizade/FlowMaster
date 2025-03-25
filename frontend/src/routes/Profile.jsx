import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

import UserProfile from "../components/UserProfile.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import InviteProjectCard from "../components/InviteProjectCard.jsx"; 

const Profile = () => {
  const accessToken = Cookies.get("access_token");
  const [userDetail, setUserDetail] = useState(null);
  const [projects, setProjects] = useState([]);
  const [inviteProject, setInviteProject] = useState([]);
  const [skill, setSkill] = useState(null);
  const [newSkill, setNewSkill] = useState(null);
  const [showSkillOptions, setShowSkillOptions] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);

  const getUserDetail = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/api/account/profile/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUserDetail(data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const getUserProjects = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/api/account/profile/projects/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const getUserInviteProjects = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/api/account/profile/invite-projects-status/",{
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setInviteProject(data);
    } catch (error) {
      console.error("Error fetching invite projects:", error);
    }
  };

  const getSkills = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/account/skill/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setSkill(response.data);
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  useEffect(() => {
    getUserDetail();
    getUserProjects();
    getUserInviteProjects();
    getSkills();
  }, []);
  
  useEffect(() => {
    if (skill && userDetail) {
      let allSkill = skill;
      let usedSkill = userDetail.skills;
      let notUsedSkill = allSkill.filter(item => 
        !usedSkill.some(skill => skill.name === item.name)
      );
      setNewSkill(notUsedSkill);
    }
  }, [skill, userDetail]);

  const handleAddSkill = async () => {
    if (!selectedSkill) return;
    try {
      await axios.post("http://localhost:8000/api/account/skill/add/",
        { name: selectedSkill }, 
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      getUserDetail();
      getSkills();
      setShowSkillOptions(false);
      setSelectedSkill(null);
    } catch(err){
      console.log(err);
      getUserDetail();
      getSkills();
      setShowSkillOptions(false);
      setSelectedSkill(null);
    }
  };

  if (!userDetail) {
    return <div className="text-center bg-gray-300 text-gray-600 border border-gray-600 text-2xl rounded-lg p-8 my-60 mx-8">Loading... Something Went Wrong. Please Refresh The Page or Login.</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white flex justify-center items-center p-6">
      <div className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        {/* Logout & DashBoard */} 
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <Link
            to="/dashboard"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-500 text-xl duration-300"
          >
            <i className="fa-solid fa-house"></i>
          </Link>

          <button
            onClick={() => {
              axios.post("http://localhost:8000/api/auth/logout/", {}, {
                headers: { Authorization: `Bearer ${accessToken}` },
              });
              Cookies.remove("access_token");
              Cookies.remove("refresh_token");
              window.location.reload(false);
            }}
            className="text-gray-600 dark:text-gray-300 hover:text-red-500 text-xl duration-300"
          >
            <Link to="/">
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
            </Link>
          </button>
        </div>
        {/* UserProfile */}
        <UserProfile userDetail={userDetail} />

        {/* Skills Section */}
        <div className="mt-6 border border-gray-600 dark:border-gray-300 p-6 rounded-xl">
          <h3 className="text-lg font-semibold uppercase text-center mb-2">Skills</h3>

          {/* Display Existing Skills */}
          <div className="flex flex-wrap gap-2 mt-2">
            {userDetail.skills.map((skill, index) => (
              <span key={index} className="bg-[#BCEAD5] text-xs text-black py-1 px-3 rounded-full uppercase">
                {skill.name}
              </span>
            ))}

            {/* Button to show add skill options */}
            <button 
              onClick={() => setShowSkillOptions(!showSkillOptions)}
              className="px-2 py-1 text-sm bg-gray-200 dark:bg-gray-600 rounded-full shadow-md transition duration-300 hover:bg-gray-300 dark:hover:bg-gray-700"
            >
              {!showSkillOptions ? <i className="fa-solid fa-plus"></i> : <i className="fa-solid fa-minus"></i>}
            </button>
          </div>

          {/* Skill Selection & Creation */}
          {showSkillOptions && (
            <div className="mt-3 flex gap-2 relative">
              {/* Input Field */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="New skill"
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="p-1 text-sm border rounded-md w-32 dark:bg-gray-700 dark:text-white"
                />

                {/* Suggestions Dropdown */}
                {selectedSkill && (
                  <div className={`absolute top-full left-0 mt-1 w-32 bg-white dark:bg-gray-800 border rounded-md shadow-md z-10`}>
                    {newSkill
                      .filter(skill => skill.name.toLowerCase().includes(selectedSkill.toLowerCase()))
                      .map((skill, index) => (
                        <div
                          key={index}
                          onClick={() => setSelectedSkill(skill.name)}
                          className="px-2 py-1 text-sm cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          {skill.name}
                        </div>
                      ))
                    }
                  </div>
                )}
              </div>

              {/* Add Button */}
              <button 
                onClick={handleAddSkill}
                className="w-32 bg-blue-500 text-white text-sm py-1 px-2 rounded-md hover:bg-blue-600 transition"
              >
                Add
              </button>
            </div>
          )}
        </div>

        {/* Projects Section */}
        <div className="mt-6 border border-gray-600 dark:border-gray-300 p-8 rounded-xl">
          <h3 className="text-xl font-semibold uppercase text-center">Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {projects.length > 0 ? (
              projects.map((project) => <ProjectCard key={project.id} project={project} />)
            ) : (
              <p className="p-2 bg-red-400 text-red-700 rounded-xl border border-red-800 text-center">No Projects Found!</p>
            )}
          </div>
        </div>

        {/* Invite Projects Section */}
        <div className="mt-6 border border-gray-600 dark:border-gray-300 p-8 rounded-xl">
          <h3 className="text-xl font-semibold uppercase text-center">Invite Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {inviteProject.length > 0 ? (
              inviteProject.map(project => <InviteProjectCard key={project.id} project={project} userId={userDetail.id} />)
            ) : (
              <p className="p-2 bg-red-400 text-red-700 rounded-xl border border-red-800 text-center">No Invite Project Found!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
