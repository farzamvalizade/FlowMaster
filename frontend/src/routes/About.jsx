
const About = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      {/* FLow Master Section */}
      <div className="max-w-2xl bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">About Flow Master</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-4 text-xl">
          Flow Master is a task management project developed by Farzam Valizade.
          This tool helps you manage your projects efficiently.
        </p>        
        {/* Creator Section  */}
        <div className="mt-6">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white">About Me</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg md:text-xl">
            I'm Farzam Valizade, a Programmer skilled in Python, JS, Django, PHP ,REST API, React, and Vue.
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <a href="https://github.com/farzamvalizade" target="_blank" rel="noopener noreferrer" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white text-2xl duration-300">
              <i className="fab fa-github"></i>
            </a>
            <a href="https://t.me/Debug_Zone" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 text-2xl duration-300">
              <i className="fab fa-telegram"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

