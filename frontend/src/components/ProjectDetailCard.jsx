import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const ProjectDetailCard = ({ project }) => {
  if (!project) {
    return <p className="text-center text-gray-500 dark:text-gray-300">Loading...</p>;
  }

  const accessToken = Cookies.get("access_token");

  // Task Completion Percentage
  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter((task) => task.status === "done").length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState(project.description);
  const [status, setStatus] = useState(project.status);
  const [deadline,setDeadline] = useState(project.deadline);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to update project details
  const handleUpdateProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("description",description);
      formData.append("status",status);
      formData.append("deadline",deadline)
      await axios.patch(
        `http://localhost:8000/api/projects/${project.id}/`,
        formData,
        { 
          headers: 
            { 
              "Content-Type": "multipart/form-data",
              Authorization:`Bearer ${accessToken}` 
            } 
        }
      );
      project.description = description;
      project.status = status;
      project.deadline = deadline;
      setShowModal(false);
      setError(null);
    } catch (err) {
      setError("Failed to update project.");
    }
    setLoading(false);
  };

  return (
    <>
      <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg my-20">
        <div className="group relative">
          {/* Project Title */}
          <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">{project.title}</h2>

          {/* Project Description */}
          <p className="text-gray-700 dark:text-gray-300 mb-4">{project.description}</p>

          {/* Project Status */}
          <p className={`text-sm text-white px-3 py-1 rounded-lg inline-block 
            ${project.status === "ongoing" ? "bg-yellow-500" : 
            project.status === "completed" ? "bg-green-500" : "bg-red-400"}`}>
            Status: {project.status === "ongoing" ? "On Going" :
                     project.status === "completed" ? "Completed" :
                     project.status === "canceled" ? "Canceled" : ""
                    }
          </p>
          <br />
          {/* Project Deadline */}
          <p className="text-sm text-red-400 dark:text-red-600 mt-2 font-semibold bg-gray-300 px-3 py-1 rounded-lg inline-block">
            Deadline: {new Date(project.deadline).toLocaleDateString()}
          </p>
          
          {/* Progress Bar */}
          <div className="w-1/2 mt-4 relative">
            <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-lg h-6 overflow-hidden">
              <div
                className={`h-full transition-[width] duration-1000 ease-in-out relative flex items-center justify-center animate-[progressMove_2s_infinite_linear]  ${completionPercentage ? "bg-green-500" : "bg-[#ed1e24]"}  `}
                style={{ width: `${completionPercentage ? completionPercentage+"%" : "100%"}` }}
              >
                <span className="text-white text-sm font-semibold z-10">
                  {completionPercentage ?  "Completed:" : ""} {completionPercentage ? completionPercentage+"%" : "In Progress" }
                </span>
                {/* Striped effect for continuous movement */}
                <div className="absolute top-0 left-0 w-full h-full bg-green-600 opacity-30 bg-[linear-gradient(135deg,rgba(255,255,255,0.2) 25%,transparent 25%,transparent 50%,rgba(255,255,255,0.2) 50%,rgba(255,255,255,0.2) 75%,transparent 75%,transparent)] bg-[size:30px_30px] animate-[moveStripes_2s_linear_infinite]"></div>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => setShowModal(true)}
            className="absolute bottom-0 right-0 p-2 opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition duration-300 bg-white dark:bg-gray-400 rounded-full shadow-md"
          >
            <i className="fa-regular fa-pen-to-square"></i>
          </button>
        </div>



        {/* Task List */}
        <h3 className="text-lg font-semibold mt-6 text-gray-900 dark:text-white">Tasks</h3>
        <ul className="mt-2">
          {project.tasks.map((task) => (
            <li key={task.id} className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md mb-2">
              <h4 className="text-md font-semibold text-gray-900 dark:text-white">{task.title}</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{task.description}</p>
              <p className={`text-xs px-2 py-1 rounded-md inline-block mt-1
                ${task.status === "done" ? "bg-green-500 text-white" :
                task.status === "in_progress" ? "bg-yellow-500 text-white" : "bg-gray-400 text-black"}`}>
                {task.status === "done" ? <i className="fa-solid fa-check"></i> : task.status === "in_progress" ? "In Progress" : "Pending"}
              </p>
              <br />
              <p className="text-xs text-red-400 text-red-600 px-3 py-1 bg-gray-300 font-semibold rounded-lg mt-1 inline-block">
                Due: {new Date(task.due_date).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal for Editing Project */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-gray-400 dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center relative w-1/3 animate-fadeIn">
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-gray-800 hover:text-gray-600 dark:text-gray-400 dark:hover:text-white"
              onClick={() => setShowModal(false)}
            >
              <i className="fa-solid fa-circle-xmark text-xl"></i>
            </button>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 mb-4 text-red-500 bg-red-900 bg-opacity-20 rounded-lg animate-shake">
                <i className="fa-solid fa-circle-exclamation"></i>
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleUpdateProject}>
              <label className="block text-gray-700 dark:text-gray-200 text-left">Project Description</label>
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 dark:text-white" />
              <label className="block text-gray-700 dark:text-gray-200 text-left mt-4">Project Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 dark:text-white">
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="canceled">Canceled</option>
              </select>
              <label className="block text-gray-700 dark:text-gray-200 text-left mt-4">Project Deadline</label>
              <DatePicker
                selected={deadline ? new Date(deadline) : null}
                onChange={(date) => setDeadline(date?.toISOString().split("T")[0])}
                className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 dark:text-white"
                dateFormat="yyyy-MM-dd"
              />

              <button
                type="submit"
                className="w-full py-2 bg-[#9ED5C5] text-gray-900 font-bold rounded-lg hover:bg-[#7eb8a5] transition-all mt-4"
                disabled={loading}
              >
                {loading ? "Updating..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectDetailCard;


