import { useState,useEffect } from "react";
import axios from "axios";
import  Cookies from "js-cookie";

import ProjectStatusCard from "../components/ProjectStatus.jsx";

const Dashboard = () => {
  const accessToken = Cookies.get("access_token");
  
  const [projects,setProjects] = useState({});

  const getProjects = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/api/account/profile/projects/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } 
  };
  
  useEffect(() => {
    getProjects();
  }, [])
  

  return (
    <div className="p-4 mx-4 mt-40 mb-40 border border-gray-800 dark:border-gray-400 rounded-lg">
      <h1 className="text-2xl dark:text-white text-center">Projects Status</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {projects.length > 0 ? (
            projects.map((project) => <ProjectStatusCard key={project.id} project={project} />)
              ) : (
            <p className="p-2 bg-red-400 text-red-700 rounded-xl border border-red-800 text-center">No Projects Found!</p>
          )}
        </div> 
    </div>
  )
};

export default Dashboard;
