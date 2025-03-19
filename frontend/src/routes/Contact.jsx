const Contact = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-2xl bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Contact Me</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-4">
          Feel free to reach out through any of the following platforms:
        </p>
        
        <div className="flex flex-col gap-4 mt-6 text-lg">
          <a href="mailto:farzam.valizadeh.2020@gmail.com" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white duration-300">
            <i className="fas fa-envelope"></i> farzam.valizadeh.2020@gmail.com
          </a>
          <a href="https://t.me/farzamv1389" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-500 hover:text-blue-700 duration-300">
            <i className="fab fa-telegram"></i> Telegram
          </a>
          <a href="https://github.com/farzamvalizade" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white duration-300">
            <i className="fab fa-github"></i> GitHub
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;

