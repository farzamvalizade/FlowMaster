// Input Box 
const InputField = ({ label, type, name, value, onChange }) => (
  <div className="mb-4">
    <label className="block text-sm mb-2">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#9ED5C5] transition-all"
      required
    />
  </div>
);

// Buttom
const FormButton = ({ text }) => {
  return (
    <button
      type="submit"
      className="w-full py-2 bg-[#9ED5C5] text-gray-900 font-bold rounded-lg hover:bg-[#7eb8a5] transition-all"
    >
      {text}
    </button>
  )
}

// Box
const AuthBox = ({ title, children }) => (
  <div className="bg-gray-300 dark:bg-gray-800 p-8 rounded-lg shadow-lg w-96 relative">
    <h2 className="text-2xl font-bold text-center mb-6">{title}</h2>
    {children}
  </div>
);

export { InputField,AuthBox,FormButton };
