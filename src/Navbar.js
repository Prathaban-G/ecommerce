import { LogOut, Menu } from "lucide-react";
import { useState } from "react";

const Navbar = ({ onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-purple-800 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo / Title */}
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="text-purple-300">Kids's</span> Kadai
        </h1>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden hover:bg-purple-700 p-2 rounded-md transition-colors duration-200" 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu size={24} />
        </button>

        {/* Navbar Links - Desktop */}
        <div className={`absolute md:relative top-16 left-0 right-0 md:top-0 z-50 
                        bg-purple-800 md:bg-transparent p-4 md:p-0 md:flex gap-8 items-center
                        ${menuOpen ? "block" : "hidden"} md:block
                        transition-all duration-300 ease-in-out`}>
          <a href="#" className="block py-2 md:py-0 hover:text-purple-300 transition-colors duration-200 font-medium">Home</a>
          <a href="#" className="block py-2 md:py-0 hover:text-purple-300 transition-colors duration-200 font-medium">Menu</a>
          <a href="#" className="block py-2 md:py-0 hover:text-purple-300 transition-colors duration-200 font-medium">Contact</a>
          
          {/* Logout Button */}
          <button 
            onClick={onLogout}
            className="mt-4 md:mt-0 bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-200 font-medium shadow-md"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;