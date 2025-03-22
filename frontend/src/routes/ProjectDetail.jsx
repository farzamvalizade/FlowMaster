import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import ProjectDetailCard from "../components/ProjectDetailCard.jsx";

const ProjectDetail = () => {
  const { id } = useParams();
  const accessToken = Cookies.get("access_token");
  
  const [project, setProject] = useState(null);

  const getProjectDetail = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setProject(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getProjectDetail();
  }, []);

  return <ProjectDetailCard project={project} />;
};

export default ProjectDetail;
