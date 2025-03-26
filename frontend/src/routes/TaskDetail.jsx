import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

import TaskDetailCard from "../components/TaskDetailCard.jsx";

const TaskDetail = () => {
  const { slug } = useParams();
  const accessToken = Cookies.get("access_token");

  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);

  const getTaskDetail = async () => {
    try {
      const taskRes = await axios.get(`http://localhost:8000/api/tasks/${slug}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setTask(taskRes.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load task details.");
    }
  };

  useEffect(() => {
    getTaskDetail();
  }, []);

  if (error) {
    return (
      <div className="text-center p-8 mx-8 bg-red-400 border border-red-800 text-red-800 my-60 rounded-lg text-xl">
        {error}
      </div>
    );
  }

  return task ? <TaskDetailCard task={task} /> : <div>Loading...</div>;
};

export default TaskDetail;

