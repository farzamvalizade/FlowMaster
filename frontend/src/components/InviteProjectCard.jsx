import { useState } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import Cookies from "js-cookie";

const InviteProjectCard = ({ project, userId }) => {
  const accessToken = Cookies.get("access_token");
  const [showAccept, setShowAccept] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [showModal, setShowModal] = useState(false); 
  const [modalAction, setModalAction] = useState(""); 

  const HandleAcceptClick = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/projects/${project.id}/confirm/${userId}/`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
    window.location.reload(false);
  };

  const HandleRejectClick = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/projects/${project.id}/reject/${userId}/`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
    window.location.reload(false);
  };

  const HandleAccept = () => {
    setModalAction("accept");
    setShowModal(true);
  };

  const HandleReject = () => {
    setModalAction("reject");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const confirmAction = () => {
    if (modalAction === "accept") {
      HandleAcceptClick();
    } else if (modalAction === "reject") {
      HandleRejectClick();
    }
    closeModal();
  };

  return (
    <div className="block p-4 bg-gray-200 dark:bg-gray-700 rounded-xl shadow-lg">
      {/* Project Title */}
      <h4 className="text-lg font-semibold text-blue-600 dark:text-blue-400">{project.title}</h4>
      {/* Projectt Desc */}
      <p className="text-gray-600 dark:text-gray-300">
        {project.description.length > 10
          ? `${project.description.slice(0, 10)}...`
          : project.description}
      </p>
      {/* Create Date */}
      <p className="text-sm text-black dark:text-white bg-blue-400 rounded-lg px-2 py-1 mt-2">
        Created: {new Date(project.created_at).toLocaleDateString()}
      </p>
      {/* Project DeadLine */}
      {project.deadline && (
        <p className="text-sm text-red-500 dark:text-red-400">
          Deadline: {new Date(project.deadline).toLocaleDateString()}
        </p>
      )}
      {/* User Status */}
      <p

        className={`text-sm text-gray-900 dark:text-white mt-2 px-2 py-1 rounded-lg 
        ${
          project.user_status === 'p'
            ? 'bg-yellow-500'
            : project.user_status === 'a'
            ? 'bg-green-500'
            : project.user_status === 'r'
            ? 'bg-red-400'
            : 'bg-gray-300 dark:bg-gray-600'
        }
      `}
      >
        Status: {project.user_status === 'p'
                  ? 'Pending'
                  : project.user_status === 'a'
                  ? 'Accepted'
                  : project.user_status === 'r'
                  ? 'Rejected'
                  : 'No Status'
        }
      </p>
      {/* Button For Accept or Reject */}
      {project.user_status === 'p' ? (
        <div className="mt-2 flex justify-between">
          <button onClick={HandleAccept} className="py-2 px-4 bg-green-500 rounded-3xl text-xs hover:cursor-pointer">Accept</button>
          <button onClick={HandleReject} className="py-2 px-4 bg-red-500 rounded-3xl text-xs hover:cursor-pointer">Reject</button>
        </div>
      ) : (
        <div></div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-600 bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-1/3">
            <h3 className="text-lg font-semibold mb-4 text-center text-black dark:text-white">
              Are You Sure You Want To {modalAction === "accept" ? "Accept" : "Reject"} This Invite Request?
            </h3>
            <div className="flex justify-around">
              <button
                onClick={confirmAction}
                className={`py-2 px-4 text-white rounded-lg ${modalAction === "accept" ? "bg-green-500" : "bg-red-400" }`}
              >
                Yes
              </button>
              <button
                onClick={closeModal}
                className="py-2 px-4 bg-gray-500 text-white rounded-lg"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InviteProjectCard;
