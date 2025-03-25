import "./assets/style.css";
import "./assets/custom.css";
import "./assets/fonts.css";
import { ThemeProvider } from "./context/Theme";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React,{ Suspense,useEffect } from "react";

import useAuth from "./hooks/auth.jsx";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer.jsx";
import routes from "./routes/routes.jsx";

const App = () => {
  const isLogin = useAuth();

  return (
    <Router>
      <ThemeProvider>
        <Navbar isLogin={isLogin} />
        <Suspense fallback={<div className="text-center mt-20 text-xl">Loading...</div>}>
          <Routes>
            {routes.map(({ path, element }, index) => (
              <Route key={index} path={path} element={element} />
            ))}
          </Routes>
        </Suspense>

      </ThemeProvider>
      <Footer isLogin={isLogin} />
    </Router>
  );
};

export default App;

