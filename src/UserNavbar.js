import { Menu, Mail } from "lucide-react";
import { useState } from "react";
import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";
import Logo from "./logo.jpg"; // Ensure correct import path

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMailModal, setShowMailModal] = useState(false);

  const handleContactClick = () => {
    document.getElementById("footer")?.scrollIntoView({ 
      behavior: "smooth",
      block: "start" 
    });
  };

  const handleMailClick = (e) => {
    e.preventDefault();
    setShowMailModal(true);
  };

  const handleSendMail = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(e.target.subject.value);
    const body = encodeURIComponent(e.target.body.value);
    window.open(`mailto:Kidskadai@gmail.com?subject=${subject}&body=${body}`, '_blank');
    setShowMailModal(false);
  };

  return (
    <nav className="bg-gradient-to-r from-purple-700 to-purple-900 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo / Title */}
        <div className="flex items-center">
          <button
            className="p-2 rounded-md transition-transform duration-300 transform hover:rotate-90 hover:bg-purple-600"
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <Menu size={24} color="white" />
          </button>

          {/* Logo with proper styling */}
          <img src={Logo} alt="Logo" className="h-12 w-auto mr-2 rounded-full" />


          <h1 className="text-2xl md:text-3xl font-extrabold tracking-wider text-white transition-all duration-300 transform hover:scale-105">
            Kid's <span className="text-purple-300">Kadai</span>
          </h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <button
            className="px-4 py-2 rounded-md bg-purple-800 hover:bg-purple-600 transition-colors duration-300"
            onClick={handleContactClick}
          >
            Contact
          </button>
          <a href="https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=copy_link&utm_content=l3b6b2h" target="_blank" rel="noopener noreferrer">
            <FaInstagram size={24} className="hover:text-gray-300 transition-colors duration-300" />
          </a>
          <a href="#" onClick={handleMailClick}>
            <Mail size={24} className="hover:text-gray-300 transition-colors duration-300" />
          </a>
          <a href="https://chat.whatsapp.com/BWmlmtKcWGK3ohLwhq3btA" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp size={24} className="hover:text-gray-300 transition-colors duration-300" />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden bg-purple-800 p-2 rounded-md transition-transform duration-300 transform hover:rotate-90 hover:bg-purple-600"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu size={28} color="white" />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden pt-4 pb-2 px-2 transition-all duration-300 flex flex-col space-y-2">
          <button
            className="block text-left px-4 py-2 rounded-md hover:bg-purple-600 transition-colors duration-300"
            onClick={() => {
              setMenuOpen(false);
              handleContactClick();
            }}
          >
            Contact
          </button>
          <div className="flex justify-around">
            <a href="https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=copy_link&utm_content=l3b6b2h" target="_blank" rel="noopener noreferrer">
              <FaInstagram size={24} className="hover:text-gray-300 transition-colors duration-300" />
            </a>
            <a href="#" onClick={(e) => {
              e.preventDefault();
              setMenuOpen(false);
              setShowMailModal(true);
            }}>
              <Mail size={24} className="hover:text-gray-300 transition-colors duration-300" />
            </a>
            <a href="https://chat.whatsapp.com/BWmlmtKcWGK3ohLwhq3btA" target="_blank" rel="noopener noreferrer">
              <FaWhatsapp size={24} className="hover:text-gray-300 transition-colors duration-300" />
            </a>
          </div>
        </div>
      )}
      
      {/* Mail Compose Modal */}
      {showMailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-purple-900">Send Email</h2>
              <button 
                onClick={() => setShowMailModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSendMail}>
              <div className="mb-4">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="body"
                  name="body"
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  onClick={() => setShowMailModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;