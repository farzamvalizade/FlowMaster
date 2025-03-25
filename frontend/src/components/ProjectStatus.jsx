import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const ProjectStatusCard = ({ project }) => {
  const accessToken = Cookies.get("access_token");
  const [projectDetail, setProjectDetail] = useState({ tasks: [] });

  const getProjectDetail = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/projects/${project.id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setProjectDetail(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getProjectDetail();
  }, []);

  // Calculate completion percentage
  const completedTasks = projectDetail.tasks?.filter(task => task.status === "done").length || 0;
  const totalTasks = projectDetail.tasks?.length || 1; // Avoid division by zero
  const completionPercentage = Math.round((completedTasks / totalTasks) * 100);

  return (
    <Link
      to={`/project/${project.slug}`}
      className="flex flex-col items-center p-4 bg-gray-200 dark:bg-gray-700 rounded-xl shadow-lg transition-transform duration-300"
    >
      {/* Project Title */}
      <h4 className="text-lg font-semibold text-blue-600 dark:text-blue-400">{project.title}</h4>
      
      {/* Project Description */}
      <p className="text-gray-600 dark:text-gray-300">
        {project.description.length > 10 ? `${project.description.slice(0, 10)}...` : project.description}
      </p>
      
      {/* Project Status */}
      <p
        className={`w-2/3 text-center text-sm text-gray-900 dark:text-white mt-2 px-2 py-1 rounded-lg 
        ${
          project.status === "ongoing" ? "bg-yellow-500" :
          project.status === "completed" ? "bg-green-500" :
          project.status === "canceled" ? "bg-red-400" : "bg-gray-300 dark:bg-gray-600"
        }`}
      >
        Status: {project.status}
      </p>
      
      {/* Project Created Date */}
      <p className="w-2/3 text-center text-sm text-black dark:text-white bg-blue-400 rounded-lg px-2 py-1 mt-2">
        Created: {new Date(project.created_at).toLocaleDateString()}
      </p>
      
      {/* Project Deadline */}
      {project.deadline && (
        <p className="w-2/3 text-center text-sm text-red-500 dark:text-red-400 mt-2">
          Deadline: {new Date(project.deadline).toLocaleDateString()}
        </p>
      )}
      
      {/* Progress Bar */}
      <div className="w-2/3 mt-4 relative">
        <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-lg h-6 overflow-hidden">
          <div
            className={`h-full transition-[width] duration-1000 ease-in-out relative flex items-center justify-center animate-[progressMove_2s_infinite_linear]  ${completionPercentage ? "bg-green-500" : "bg-[#ed1e24]"}  `}
            style={{ width: `${completionPercentage ? completionPercentage+"%" : "100%"}` }}
          >
            <span className={`text-white text-sm font-semibold z-10`}>
              {completionPercentage ?  "Completed:" : ""} {completionPercentage ? completionPercentage+"%" : "In Progress" }
            </span>
            {/* Striped effect for continuous movement */}
            <div className="absolute top-0 left-0 w-full h-full bg-green-600 opacity-30 bg-[linear-gradient(135deg,rgba(255,255,255,0.2) 25%,transparent 25%,transparent 50%,rgba(255,255,255,0.2) 50%,rgba(255,255,255,0.2) 75%,transparent 75%,transparent)] bg-[size:30px_30px] animate-[moveStripes_2s_linear_infinite]"></div>
          </div>
        </div>
      </div>

    </Link>
  );
};

export default ProjectStatusCard;
