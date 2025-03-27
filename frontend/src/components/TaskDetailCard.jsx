import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const TaskDetailCard = ({ task }) => {
  if (!task) return <p className="text-center text-lg">Loading...</p>;

  const accessToken = Cookies.get("access_token");

  const [userId, setUserId] = useState(null);
  const [status, setStatus] = useState(task.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/account/profile/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUserId(response.data.id);
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  },[]);

  const handleStatusChange = async (newStatus) => {
    if (status === newStatus) return; 

    const previousStatus = status; // Save current status in case of rollback
    setStatus(newStatus); // Optimistically update the UI
    setLoading(true);
    setError(null);

    const formData = new FormData();

    formData.append("status",newStatus);

    try {
      await axios.patch(
        `http://localhost:8000/api/task/status/${task.id}/`,
        formData,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
    } catch (err) {
      setStatus(previousStatus); // Rollback on failure
      setError("Failed to update task status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 w-full max-w-lg">
        {/* Task Title */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <i className="fas fa-tasks text-blue-500"></i> {task.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">{task.description}</p>

        {/* Task Status and Priority */}
        <div className="flex items-center gap-4 mt-4">
          <span
            className={`px-4 py-2 text-base font-medium rounded-lg ${
              status === "done"
                ? "bg-green-500 text-white"
                : status === "in_progress"
                ? "bg-yellow-500 text-white"
                : "bg-gray-400 text-black"
            }`}
          >
            {status === "done" ? (
              <i className="fas fa-check-circle mr-1"></i>
            ) : status === "in_progress" ? (
              <i className="fas fa-spinner animate-spin mr-1"></i>
            ) : (
              <i className="fa-solid fa-hourglass animate-hourglass"></i>
            )}
            {status.replace("_", " ")}
          </span>

          <span
            className={`px-4 py-2 text-base font-medium rounded-lg text-white ${
              task.priority === "high" ? "bg-red-500" : task.priority === "medium" ? "bg-yellow-500" : "bg-gray-400"
            }`}
          >
            <i className="fas fa-exclamation-circle mr-1"></i> {task.priority}
          </span>
        </div>

        {/* Task Dates */}
        <div className="mt-6 text-lg text-gray-500 dark:text-gray-400">
          <p>
            <i className="fas fa-calendar-alt mr-2"></i> 
            Due: <span className="font-semibold">{task.due_date}</span>
          </p>
          <p>
            <i className="fas fa-clock mr-2"></i> 
            Created: <span className="font-semibold">{new Date(task.created_at).toLocaleDateString()}</span>
          </p>
          {task.completed_at && (
            <p>
              <i className="fas fa-check-circle text-green-500 mr-2"></i> 
              Completed: <span className="font-semibold">{new Date(task.completed_at).toLocaleDateString()}</span>
            </p>
          )}
        </div>

        {/* Show status update buttons only if the logged-in user is assigned to the task */}
        {userId === task.assigned_to && (
          <div className="mt-6">
            <div className="flex gap-2 mt-2">
              {status === "pending" ? (
                <>
                              <button
                className={`px-4 py-2 rounded-lg transition ${
                  status === "in_progress" ? "bg-yellow-400 text-white" : "bg-yellow-500 text-white hover:bg-yellow-600"
                }`}
                onClick={() => handleStatusChange("in_progress")}
                disabled={loading}
              >
                {loading && status === "in_progress" ? "Updating..." : "In Progress"}
              </button>
                <button
                className={`px-4 py-2 rounded-lg transition ${
                  status === "done" ? "bg-green-400 text-white" : "bg-green-500 text-white hover:bg-green-600"
                }`}
                onClick={() => handleStatusChange("done")}
                disabled={loading}
              >
                {loading && status === "done" ? "Updating..." : "Mark as Done"}
              </button>
                </>
              ) : status === "in_progress" ? (
                                  <>
                              <button
                className={`px-4 py-2 rounded-lg transition bg-gray-400 hover:bg-gray-500 text-white`}
                onClick={() => handleStatusChange("pending")}
                disabled={loading}
              >
                {loading && status === "pending" ? "Updating..." : "Pending"}
              </button>
                <button
                className={`px-4 py-2 rounded-lg transition ${
                  status === "done" ? "bg-green-400 text-white" : "bg-green-500 text-white hover:bg-green-600"
                }`}
                onClick={() => handleStatusChange("done")}
                disabled={loading}
              >
                {loading && status === "done" ? "Updating..." : "Mark as Done"}
              </button>
                </>
              ) : <></> }
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetailCard;

