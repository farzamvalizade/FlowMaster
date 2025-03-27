import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ProjectDetailCard = ({ project }) => {
  if (!project) return <p className="text-center text-lg">Loading...</p>;

  const accessToken = Cookies.get("access_token");

  // Task Completion Percentage
  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter((task) => task.status === "done").length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState(project.description);
  const [status, setStatus] = useState(project.status);
  const [deadline, setDeadline] = useState(project.deadline);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to update project details
  const handleUpdateProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("description", description);
      formData.append("deadline", deadline);

      await axios.patch(`http://localhost:8000/api/projects/${project.id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (project.status != status ) {
        const formsData = new FormData();

        try {
          await axios.put(`http://localhost:8000/api/project/status/${project.id}/`,formsData,{
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${accessToken}`,
            },
          });
          project.status = status;
        } catch (err) {
          setError("Failed to update project.")
        }
      }

      project.description = description;
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 w-full max-w-lg">
          {/* Project Title */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <i className="fa-solid fa-diagram-project"></i> {project.title}
          </h2>

          {/* Project Description */}
          <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">{project.description}</p>

          {/* Status */}
          <div className="flex items-center gap-4 mt-4">
            <span
              className={`px-4 py-2 text-base font-medium rounded-lg ${
                project.status === "ongoing"
                  ? "bg-yellow-500 text-white"
                  : project.status === "completed"
                  ? "bg-green-500 text-white"
                  : "bg-red-400 text-white"
              }`}
            >
              {project.status === "ongoing" ? <i className="fas fa-spinner animate-spin mr-1"></i> : project.status === "completed" ? <i className="fa-solid fa-check"></i> : <i className="fa-solid fa-xmark"></i> } {project.status === "ongoing" ? "On Going" : project.status === "completed" ? "Completed" : "Canceled"}
            </span>

            {/* Completion Percentage */}
            <span className={`px-4 py-2 text-base font-medium ${completionPercentage ? "bg-blue-500" : "bg-red-400" } text-white rounded-lg ${project.status === "canceled" ? "hidden" : ""}`}>
              <i className="fas fa-tasks mr-1"></i> {completionPercentage ? completionPercentage+"% Completed" : "In progress" }
            </span>
          </div>

          {/* Project Dates */}
          <div className="mt-6 text-lg text-gray-500 dark:text-gray-400">
            <p>
              <i className="fas fa-calendar-alt mr-2"></i> 
              Deadline: <span className="font-semibold">{new Date(project.deadline).toLocaleDateString()}</span>
            </p>
            <p>
              <i className="fas fa-clock mr-2"></i> 
              Created: <span className="font-semibold">{new Date(project.created_at).toLocaleDateString()}</span>
            </p>
          </div>

          {/* Task List */}
          <h3 className="text-lg font-semibold mt-6 text-gray-900 dark:text-white flex items-center gap-2">
            <i className="fa-solid fa-list-check"></i> Tasks
          </h3>

          <ul className="mt-4 space-y-3">
            {project.tasks.map((task) => (
              <Link to={`/task/${task.slug}`} key={task.id} className="block">
                <li className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all">
                  {/* Task Title */}
                  <div className="flex items-center justify-between">
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <i className="fa-solid fa-clipboard-check"></i> {task.title}
                    </h4>
                    
                    {/* Status Badge */}
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-lg ${
                        task.status === "done"
                          ? "bg-green-500 text-white"
                          : task.status === "in_progress"
                          ? "bg-yellow-500 text-white"
                          : "bg-gray-400 text-black"
                      }`}
                    >
                      {task.status === "done" ? <><i className="fa-solid fa-check"></i><span>Done</span></> : task.status === "in_progress" ? <><i className="fas fa-spinner animate-spin mr-1"></i><span>In Progress</span></> : <><i className="fa-solid fa-hourglass animate-hourglass"></i><span> Pending</span></> }
                    </span>
                  </div>

                  {/* Task Description */}
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{task.description}</p>

                  {/* Due Date */}
                  <p className="text-xs text-red-500 dark:text-red-400 font-semibold mt-2 flex items-center gap-2">
                    <i className="fa-solid fa-clock"></i> Due: {new Date(task.due_date).toLocaleDateString()}
                  </p>
                </li>
              </Link>
            ))}
          </ul>



          {/* Edit Button */}
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-500 hover:shadow-lg transition-all active:scale-95"
          >
            <i className="fa-solid fa-pen-to-square"></i>
            <span>Edit Project</span>
          </button>

        </div>
      </div>

      {/* Modal for Editing Project */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-gray-400 dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center relative w-1/3 animate-fadeIn">
            <button
              className="absolute top-2 right-2 text-gray-800 hover:text-gray-600 dark:text-gray-400 dark:hover:text-white"
              onClick={() => setShowModal(false)}
            >
              <i className="fa-solid fa-circle-xmark text-xl"></i>
            </button>

            {error && (
              <div className="flex items-center gap-2 p-3 mb-4 text-red-500 bg-red-900 bg-opacity-20 rounded-lg animate-shake">
                <i className="fa-solid fa-circle-exclamation"></i>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProject}>
              <label className="block text-gray-700 dark:text-gray-200 text-left">Project Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 dark:text-white"
              />

              <label className="block text-gray-700 dark:text-gray-200 text-left mt-4">Project Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 dark:text-white"
              >
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

              <button type="submit" className="w-full py-2 bg-green-500 text-white font-bold rounded-lg mt-4">
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

