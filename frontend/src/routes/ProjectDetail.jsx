import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import ProjectDetailCard from "../components/ProjectDetailCard.jsx";

const ProjectDetail = () => {
  const { slug } = useParams();
  const accessToken = Cookies.get("access_token");

  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);

  const getProjectDetail = async () => {
    try {
      const project = await axios.get(`http://localhost:8000/api/projects/?slug=${slug}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      const response = await axios.get(`http://localhost:8000/api/projects/${project.data[0].id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setProject(response.data);
      setError(null);
    } catch (err) {
      if (err.response && [401, 403, 404].includes(err.response.status)) {
        setError("Not Found or Access Denied");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  useEffect(() => {
    getProjectDetail();
  }, []);

  if (error) {
    return <div className="text-center bg-red-300 text-red-800 text-xl py-8 my-60 mx-8 rounded-lg">{error}</div>;
  }

  return project ? <ProjectDetailCard project={project} /> : <div>Loading...</div>;
};

export default ProjectDetail;
