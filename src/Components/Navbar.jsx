import { FaGithub, FaGitlab } from "react-icons/fa";
import { IoIosArrowRoundForward } from "react-icons/io";

const Navbar = () => {
  return (
    <div className="w-full">
      {/* Primary Navbar */}
      <nav className="flex items-center justify-between px-6 py-3 shadow-md bg-white">
        {/* Left Section - Logo & Menu */}
        <div className="flex items-center space-x-4">
          <span className="text-xl font-bold">
            Logo <span className="text-gray-500">GenX</span>
          </span>
          <ul className="hidden md:flex space-x-6 text-gray-600 text-sm">
            <li className="cursor-pointer hover:text-black">File</li>
            <li className="cursor-pointer hover:text-black">Edit</li>
            <li className="cursor-pointer hover:text-black">View</li>
            <li className="cursor-pointer hover:text-black">Run</li>
            <li className="cursor-pointer hover:text-black">Terminal</li>
            <li className="cursor-pointer hover:text-black">Help</li>
          </ul>
        </div>

        {/* Middle Section - Buttons */}
        <div className="flex items-center space-x-3">
          <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
            Run
          </button>
          <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
            &lt;/&gt; Debug
          </button>
          <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
            Deploy
          </button>
          <input
            type="text"
            placeholder="my-genx-project"
            className="px-3 py-1 border rounded text-gray-600 text-sm"
          />
        </div>

        {/* Right Section - AI Assist, Share, and Logins */}
        <div className="flex items-center space-x-4">
          <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
            AI Assist
          </button>
          <button className="px-3 py-1 bg-black text-white rounded flex items-center">
            Share <IoIosArrowRoundForward className="ml-1" />
          </button>
          <button className="flex items-center space-x-1 px-3 py-1 border rounded">
            <FaGithub /> <span>GitHub Login</span>
          </button>
          <button className="flex items-center space-x-1 px-3 py-1 border rounded">
            <FaGitlab /> <span>GitLab Login</span>
          </button>
        </div>
      </nav>

      {/* Secondary Navbar */}
      <nav className="flex items-center justify-between px-6 py-2 bg-gray-100 shadow-sm text-sm text-gray-700">
        {/* Left Section */}
        <div className="flex items-center space-x-3">
          <button className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400">
            Explorer
          </button>
          <button className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400">
            Source Control
          </button>
          <button className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400">
            Extensions
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          <button className="px-3 py-1 border border-gray-400 rounded hover:bg-gray-300">
            Problems
          </button>
          <button className="px-3 py-1 border border-gray-400 rounded hover:bg-gray-300">
            Output
          </button>
          <button className="px-3 py-1 border border-gray-400 rounded hover:bg-gray-300">
            Debug Console
          </button>
          <button className="px-3 py-1 border border-gray-400 rounded hover:bg-gray-300">
            Terminal
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
