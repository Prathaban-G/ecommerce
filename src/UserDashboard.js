import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import Footer from "./Footer";
import Main from "./UserMain";
import Navbar from "./UserNavbar";
import Sidebar from "./UserSidebar";
import { useNavigate } from "react-router-dom";
import MobileCategoryView from "./MobileCategoryView";

const UserDashboard = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchCategories();
    
    // Check if device is mobile
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
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
      
      // Set the highest ranked category as default selected
      if (categoriesData.length > 0) {
        const sortedCategories = [...categoriesData].sort((a, b) => b.rank - a.rank);
        setSelectedCategory(sortedCategories[0]);
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
  
  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Always show navbar */}
      <Navbar onLogout={handleLogout} />
      
      {/* Mobile View */}
      {isMobile && (
        <div className="flex-1">
          <MobileCategoryView 
            categories={categories}
            onSelectCategory={handleSelectCategory}
            selectedCategory={selectedCategory}
          />
          <div className="p-4">
            <Main category={selectedCategory} />
          </div>
        </div>
      )}
      
      {/* Desktop View */}
      {!isMobile && (
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            categories={categories}
            onSelectCategory={handleSelectCategory}
            selectedCategory={selectedCategory}
            isLoading={isLoading}
          />
          <main className="flex-1 overflow-y-auto p-6">
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
      )}
      
      <Footer />
    </div>
  );
};

export default UserDashboard;