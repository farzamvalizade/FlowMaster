const TaskDetailCard = ({ task }) => {
  if (!task) return <p className="text-center text-lg">Loading...</p>;

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <i className="fas fa-tasks text-blue-500"></i> {task.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">{task.description}</p>

        {/* وضعیت و اولویت */}
        <div className="flex items-center gap-4 mt-4">
          <span
            className={`px-4 py-2 text-base font-medium rounded-lg ${
              task.status === "in_progress" ? "bg-yellow-500 text-white" : "bg-gray-400 text-black"
            }`}
          >
            <i className="fas fa-spinner animate-spin mr-1"></i> {task.status.replace("_", " ")}
          </span>
          <span
            className={`px-4 py-2 text-base font-medium rounded-lg ${
              task.priority === "high" ? "bg-red-500 text-white" : "bg-green-500 text-white"
            }`}
          >
            <i className="fas fa-exclamation-circle mr-1"></i> {task.priority}
          </span>
        </div>

        {/* تاریخ‌ها */}
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
      </div>
    </div>
  );
};

export default TaskDetailCard;

