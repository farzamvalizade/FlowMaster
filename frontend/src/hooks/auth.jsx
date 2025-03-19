import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const useAuth = () => {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const accessToken = Cookies.get("access_token");
      const refreshToken = Cookies.get("refresh_token");

      if (!accessToken) {
        setIsLogin(false);
        return;
      }

      try {
        await axios.post("http://localhost:8000/api/auth/token/verify/", {
          token: accessToken,
        });
        setIsLogin(true);
      } catch (err) {
        if (err.response?.status === 401 && refreshToken) {
          try {
            const response = await axios.post("http://localhost:8000/api/auth/token/refresh/", {
              refresh: refreshToken,
            });

            Cookies.set("access_token", response.data.access, { expires: 1 });
            setIsLogin(true);
          } catch (refreshErr) {
            if (refreshErr.response?.status === 401) {
              setIsLogin(false);
            }
          }
        } else {
          setIsLogin(false);
        }
      }
    };

    verifyToken();
  }, []);

  return isLogin;
};

export default useAuth;
