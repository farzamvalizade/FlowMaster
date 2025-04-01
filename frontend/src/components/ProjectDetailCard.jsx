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
  const [show,setShow] = useState(false);
  const [cTask, setCTask] = useState({
    title: "",
    description: "",
    priority: "",
    due_date: "",
    project: project.id,
    assigned_to: "",
    status: "pending",
  });

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
      formData.append("status",status)
      await axios.put(`http://localhost:8000/api/projects/${project.id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      project.description = description;
      project.deadline = deadline;
      project.status = status;
      setShowModal(false);
      setError(null);
    } catch (err) {
      setError("Failed to update project.");
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setCTask((prev) => ({ ...prev, due_date: date?.toISOString().split("T")[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:8000/api/tasks/create/",cTask,{
        headers : { 
          "Content-Type": "application/json",
          Authorization : `Bearer ${accessToken}`,
        }
      });

      setShow(false);
      setError(null);
    } catch (err) {
      setError("Failed to create Task.");
      console.error(err)
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
                  status === "ongoing"
                  ? "bg-yellow-500 text-white"
                  : status === "completed"
                  ? "bg-green-500 text-white"
                  : "bg-red-400 text-white"
              }`}
            >
              {status === "ongoing" ? <i className="fas fa-spinner animate-spin mr-1"></i> : status === "completed" ? <i className="fa-solid fa-check"></i> : <i className="fa-solid fa-xmark"></i> } {status === "ongoing" ? "On Going" : status === "completed" ? "Completed" : status === "Canceled"}
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
          
          <div className="flex flex-row gap-4">
            {/* Create Task Button */}
            <button className="mt-4 flex items-center gap-2 py-2 px-4 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95" onClick={() => setShow(true)}><i className="fa-solid fa-plus"></i> Task</button>

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

              <label className="block text-gray-700 dark:text-gray-200 text-left mt-4 text-center">Project Deadline</label>
              <DatePicker
                selected={deadline ? new Date(deadline) : null}
                onChange={(date) => setDeadline(date?.toISOString().split("T")[0])}
                className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 dark:text-white"
                dateFormat="yyyy-MM-dd"
              />
              {error && (
                <div className="flex items-center gap-2 p-3 mb-4 text-red-500 bg-red-900 bg-opacity-20 rounded-lg animate-shake mt-2">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <span>{error}</span>
                </div>
              )}
              <button type="submit" className="w-full py-2 bg-green-500 text-white font-bold rounded-lg mt-4">
                {loading ? "Updating..." : "Save Changes"}
              </button>
            </form>
            
          </div>
        </div>
      )}

      {show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-gray-400 dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center relative w-1/3 animate-fadeIn">
            <button
              className="absolute top-2 right-2 text-gray-800 hover:text-gray-600 dark:text-gray-400 dark:hover:text-white"
              onClick={() => setShow(false)}
            >
              <i className="fa-solid fa-circle-xmark text-xl"></i>
            </button>

            <form onSubmit={handleSubmit}>
              <label className="block text-gray-700 dark:text-gray-200 text-left">Title</label>
              <input
                type="text"
                name="title"
                value={cTask.title}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 dark:text-white"
                required
              />

              <label className="block text-gray-700 dark:text-gray-200 text-left mt-4">Description</label>
              <textarea
                name="description"
                value={cTask.description}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 dark:text-white"
                required
              />

              <label className="block text-gray-700 dark:text-gray-200 text-left mt-4">Priority</label>
              <select
                name="priority"
                value={cTask.priority}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Select Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <label className="block text-gray-700 dark:text-gray-200 text-left mt-4">Due Date</label>
              <DatePicker
                selected={cTask.due_date ? new Date(cTask.due_date) : null}
                onChange={handleDateChange}
                className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 dark:text-white"
                dateFormat="yyyy-MM-dd"
                required
              />

              <label className="block text-gray-700 dark:text-gray-200 text-left mt-4">Assigned To</label>
              <input
                type="text"
                name="assigned_to"
                value={cTask.assigned_to}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 dark:text-white"
                required
              />

              {error && (
                <div className="flex items-center gap-2 p-3 mb-4 text-red-500 bg-red-900 bg-opacity-20 rounded-lg animate-shake mt-2">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <span>{error}</span>
                </div>
              )}

              <button type="submit" className="w-full py-2 bg-green-500 text-white font-bold rounded-lg mt-4">
                {loading ? "Saving..." : "Create Task"}
              </button>
            </form>
          </div>
        </div>
      ) }  

    </>
  );
};

export default ProjectDetailCard;

