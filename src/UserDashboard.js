import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import Footer from "./Footer";
import Main from "./UserMain";
import Navbar from "./UserNavbar";
import Sidebar from "./UserSidebar";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchCategories();
    
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "categories"));
      const categoriesData = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      setCategories(categoriesData);
      
      if (categoriesData.length > 0 && !selectedCategory) {
        setSelectedCategory(categoriesData[0]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogout = () => {
    console.log("User logged out");
    navigate("/login");
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
      <Navbar 
        onLogout={handleLogout} 
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />
      
      <div className="flex flex-grow relative">
        {/* Sidebar */}
        <div 
          className={`
            fixed lg:relative z-40 h-[calc(100vh-4rem)] overflow-hidden
            transition-all duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-0 lg:w-16'}
            lg:translate-x-0
          `}
        >
          <div className={`
            h-full w-64 bg-white shadow-lg rounded-r-xl
            border-r border-gray-100
            transition-all duration-300
            ${isSidebarOpen ? 'translate-x-0' : 'lg:-translate-x-48'}
          `}>
            <Sidebar
              categories={categories}
              onSelectCategory={setSelectedCategory}
              selectedCategory={selectedCategory}
              isLoading={isLoading}
              isCollapsed={!isSidebarOpen}
            />
          </div>
        </div>
        
        {/* Main Content */}
        <main className={`
          flex-grow transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'lg:ml-0' : 'ml-0 lg:ml-16'}
          p-4 md:p-6 lg:p-8 relative z-10
        `}>
          <div className="bg-white rounded-xl shadow-sm p-6 min-h-[calc(100vh-10rem)]">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-t-4 border-r-4 border-indigo-600 animate-spin"></div>
                  <div className="w-12 h-12 rounded-full border-b-4 border-l-4 border-purple-500 animate-spin absolute top-0 animate-[spin_1s_linear_infinite_0.2s]"></div>
                </div>
              </div>
            ) : (
              <Main category={selectedCategory} />
            )}
          </div>
        </main>
      </div>
      
      <Footer />
      
      {/* Backdrop overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm z-30 transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default UserDashboard;