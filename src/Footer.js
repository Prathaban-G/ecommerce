
import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";
const Footer = () => {
  return (
    <footer className="bg-purple-800 text-white text-center p-4 mt-">
      <div className="container mx-auto flex flex-col items-center">
        <p className="mb-2">&copy; {new Date().getFullYear()} Kid's Kadai . All rights reserved.</p>
        
        {/* Social Media Links */}
        <div className="flex gap-4">
          <a href="https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=copy_link&utm_content=l3b6b2h" target="_blank" rel="noopener noreferrer">
            <FaInstagram size={24} className="hover:text-gray-300 transition-colors duration-300" />
          </a>
         
          <a href="https://chat.whatsapp.com/BWmlmtKcWGK3ohLwhq3btA" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp size={24} className="hover:text-gray-300 transition-colors duration-300" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
