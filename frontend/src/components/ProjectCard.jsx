import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  return (
    <Link
      to={`/project/${project.slug}`}
      className="block p-4 bg-gray-200 dark:bg-gray-700 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
    >
      {/* Project Title */}
      <h4 className="text-lg font-semibold text-blue-600 dark:text-blue-400">{project.title}</h4>
      {/* Project Desc */}
      <p className="text-gray-600 dark:text-gray-300">
        {project.description.length > 10
          ? `${project.description.slice(0, 10)}...`
          : project.description}
      </p>
      {/* Project Status */}
      <p
        className={`text-sm text-gray-900 dark:text-white mt-2 px-2 py-1 rounded-lg 
        ${
          project.status === 'ongoing'
            ? 'bg-yellow-500'
            : project.status === 'completed'
            ? 'bg-green-500'
            : project.status === 'canceled'
            ? 'bg-red-400'
            : 'bg-gray-300 dark:bg-gray-600'
        }
      `}
      >
        Status: {project.status}
      </p>
      {/* Prpject Created Date */}
      <p className="text-sm text-black dark:text-white bg-blue-400 rounded-lg px-2 py-1 mt-2">
        Created: {new Date(project.created_at).toLocaleDateString()}
      </p>
      {/* Project DeadLine */}
      {project.deadline && (
        <p className="text-sm text-red-500 dark:text-red-600 mt-2 bg-gray-300 rounded-lg px-2 py-1 font-semibold">
          Deadline: {new Date(project.deadline).toLocaleDateString()}
        </p>
      )}
    </Link>
  );
};

export default ProjectCard;
