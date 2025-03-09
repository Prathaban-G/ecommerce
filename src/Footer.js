import { Facebook, Twitter, Instagram } from "lucide-react"; // Install lucide-react if not already

const Footer = () => {
  return (
    <footer className="bg-purple-800 text-white text-center p-4 mt-">
      <div className="container mx-auto flex flex-col items-center">
        <p className="mb-2">&copy; {new Date().getFullYear()} Ballu's Kadai . All rights reserved.</p>
        
        {/* Social Media Links */}
        <div className="flex gap-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <Facebook size={20} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <Twitter size={20} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <Instagram size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
