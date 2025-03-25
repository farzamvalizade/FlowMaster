const ProjectDetailCard = ({ project }) => {
  if (!project) {
    return <p className="text-center text-gray-500 dark:text-gray-300">Loading...</p>;
  }

  // Calculate task completion percentage
  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter((task) => task.status === "done").length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg my-20">
      {/* Project Title */}
      <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
        {project.title}
      </h2>

      {/* Project Description */}
      <p className="text-gray-700 dark:text-gray-300 mb-4">{project.description}</p>

      {/* Project Status */}
      <p className={`text-sm text-white px-3 py-1 rounded-lg inline-block 
        ${project.status === "ongoing" ? "bg-yellow-500" : 
        project.status === "completed" ? "bg-green-500" : "bg-red-400"}`}>
        Status: {project.status}
      </p>

      {/* Project Deadline */}
      <p className="text-sm text-red-500 dark:text-red-400 mt-2">
        Deadline: {new Date(project.deadline).toLocaleDateString()}
      </p>

      {/* Progress Bar */}
      <div className="w-full mt-4 relative">
        <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-lg h-6 overflow-hidden">
          <div
            className={`h-full ${ completionPercentage ? "bg-green-500" : "bg-[#ed1e24]"} transition-[width] duration-1000 ease-in-out relative flex items-center justify-center animate-[progressMove_2s_infinite_linear]`}
            style={{ width: `${completionPercentage ? completionPercentage+"%" : "100%" }` }}
          >
            <span className="text-white text-sm font-semibold z-10">
              { completionPercentage ? "Compeleted :"+completionPercentage+"%" : "In Progress" }
            </span>
            <div className="absolute top-0 left-0 w-full h-full bg-green-600 opacity-30 bg-[linear-gradient(135deg,rgba(255,255,255,0.2) 25%,transparent 25%,transparent 50%,rgba(255,255,255,0.2) 50%,rgba(255,255,255,0.2) 75%,transparent 75%,transparent)] bg-[size:30px_30px] animate-[moveStripes_2s_linear_infinite]"></div>
          </div>
        </div>
      </div>

      {/* Task List */}
      <h3 className="text-lg font-semibold mt-6 text-gray-900 dark:text-white">Tasks</h3>
      <ul className="mt-2">
        {project.tasks.map((task) => (
          <li
            key={task.id}
            className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md mb-2"
          >
            <h4 className="text-md font-semibold text-gray-900 dark:text-white">
              {task.title}
            </h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{task.description}</p>
            <p className={`text-xs px-2 py-1 rounded-md inline-block mt-1
              ${task.status === "done" ? "bg-green-500 text-white" :
              task.status === "in_progress" ? "bg-yellow-500 text-white" :
              "bg-gray-400 text-black"}`}>
              {task.status === "done" ? <i className="fa-solid fa-check"></i> : task.status === "in_progress" ? "In Progress" : "Pending"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Due: {new Date(task.due_date).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectDetailCard;

