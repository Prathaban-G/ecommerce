import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import UserSidebar from './UserSidebar';
import UserMain from './UserMain';
import MobileCategoryView from './MobileCategoryView';

const AppLayout = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

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
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'categories'));
      const categoriesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCategories(categoriesData);
      
      // Set the highest ranked category as default selected
      if (categoriesData.length > 0) {
        const sortedCategories = [...categoriesData].sort((a, b) => b.rank - a.rank);
        setSelectedCategory(sortedCategories[0]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Mobile View */}
      {isMobile && (
        <MobileCategoryView 
          categories={categories}
          onSelectCategory={handleSelectCategory}
          selectedCategory={selectedCategory}
        />
      )}
      
      {/* Desktop View */}
      {!isMobile && (
        <div className="flex flex-1 overflow-hidden">
          <UserSidebar 
            categories={categories}
            onSelectCategory={handleSelectCategory}
            selectedCategory={selectedCategory}
            isLoading={loading}
          />
          <main className="flex-1 overflow-y-auto p-6">
            <UserMain category={selectedCategory} />
          </main>
        </div>
      )}
    </div>
  );
};

export default AppLayout;