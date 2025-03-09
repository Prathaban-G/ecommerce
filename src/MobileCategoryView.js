import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

const MobileCategoryView = ({ categories, onSelectCategory, selectedCategory }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [categoryItems, setCategoryItems] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const categoryScrollRef = useRef(null);

  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      // Sort categories by rank and select the highest ranked one by default
      const sortedCategories = [...categories].sort((a, b) => b.rank - a.rank);
      setActiveCategory(sortedCategories[0]);
      fetchCategoryItems(sortedCategories[0]);
    }
  }, [categories]);

  useEffect(() => {
    if (selectedCategory) {
      setActiveCategory(selectedCategory);
      fetchCategoryItems(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchCategoryItems = async (category) => {
    if (!category || categoryItems[category.id]) return;
    
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, `categories/${category.id}/items`));
      const itemsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const sortedItems = itemsData.sort((a, b) => (b.rank - a.rank));
      
      setCategoryItems(prev => ({
        ...prev,
        [category.id]: sortedItems
      }));
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    onSelectCategory(category);
    fetchCategoryItems(category);
    
    // Scroll to the category's carousel section
    const element = document.getElementById(`category-section-${category.id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollCategories = (direction) => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Get stock label styling
  const getStockLabel = (stock) => {
    if (stock === 0) return { text: "Out of Stock", color: "bg-red-500" };
    if (stock < 10) return { text: "Few Left", color: "bg-amber-500" };
    return { text: "In Stock", color: "bg-green-500" };
  };

  // Filter categories based on search query
  const filteredCategories = categories
    .sort((a, b) => b.rank - a.rank)
    .filter(cat => cat.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex flex-col w-full">
      {/* Search Bar (Flipkart Style) */}
      <div className="sticky top-0 z-10 bg-white shadow-md px-4 py-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for products, brands and more"
            className="w-full p-2 pl-10 pr-4 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {/* Horizontal Categories Scroll (Flipkart Style) */}
      <div className="relative bg-white py-3 border-b">
        <button 
          onClick={() => scrollCategories('left')}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-70 rounded-full p-1 shadow-md"
        >
          <ChevronLeft size={20} />
        </button>
        
        <div 
          ref={categoryScrollRef}
          className="flex overflow-x-auto hide-scrollbar py-1 px-10 space-x-5"
        >
          {filteredCategories.map(category => (
            <div
              key={category.id}
              className="flex flex-col items-center space-y-1 min-w-[60px]"
              onClick={() => handleCategoryClick(category)}
            >
              <div className={`w-14 h-14 rounded-full overflow-hidden border-2 ${
                activeCategory?.id === category.id ? 'border-blue-500' : 'border-gray-200'
              }`}>
                <img 
                  src={category.imageUrl} 
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs text-center font-medium text-gray-800 truncate w-16">
                {category.name}
              </span>
              {category.isNew && (
                <span className="bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-sm absolute -top-1 -right-1">
                  NEW
                </span>
              )}
            </div>
          ))}
        </div>
        
        <button 
          onClick={() => scrollCategories('right')}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-70 rounded-full p-1 shadow-md"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Category Carousels */}
      <div className="flex flex-col space-y-6 py-4">
        {filteredCategories.map(category => {
          const items = categoryItems[category.id] || [];
          
          return (
            <div 
              key={category.id} 
              id={`category-section-${category.id}`}
              className="px-4"
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-bold text-gray-800">{category.name}</h2>
                <button 
                  className="text-blue-500 text-sm font-medium"
                  onClick={() => handleCategoryClick(category)}
                >
                  View All
                </button>
              </div>
              
              {items.length > 0 ? (
                <div className="overflow-x-auto hide-scrollbar -mx-4 px-4">
                  <div className="flex space-x-3 py-2">
                    {items.map((item, index) => {
                      const discountedPrice = item.price - (item.price * (item.discount / 100));
                      const stockInfo = getStockLabel(item.stock);
                      
                      return (
                        <div
                          key={item.id}
                          className="flex-shrink-0 w-36 bg-white rounded-lg shadow-sm border p-2 relative"
                          onClick={() => {
                            // Implement your WhatsApp redirect logic here
                            const whatsappBusinessNumber = '+918056511598';
                            const priceMessage = item.discount > 0
                              ? `The discounted price is ₹${discountedPrice.toFixed(2)} (Original: ₹${item.price.toFixed(2)})`
                              : `The price is ₹${item.price.toFixed(2)}`;
                            
                            const message = `Hello, I'm interested in "${item.name}". ${priceMessage}. Is it available?`;
                            const encodedMessage = encodeURIComponent(message);
                            
                            window.open(`https://wa.me/${whatsappBusinessNumber}?text=${encodedMessage}`, '_blank');
                          }}
                        >
                          {/* Discount & New Tags */}
                          <div className="absolute top-2 left-2 flex flex-col space-y-1 z-10">
                            {item.discount > 0 && (
                              <span className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-sm font-medium">
                                {item.discount}% OFF
                              </span>
                            )}
                          </div>
                          
                          {item.isNew && (
                            <span className="absolute top-2 right-2 bg-purple-500 text-white text-xs px-1.5 py-0.5 rounded-sm font-medium z-10">
                              NEW
                            </span>
                          )}
                          
                          {/* Product Image */}
                          <div className="w-full h-32 bg-gray-100 rounded-md overflow-hidden">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          {/* Product Name */}
                          <h3 className="mt-2 text-xs text-gray-800 font-medium line-clamp-2 h-8">
                            {item.name}
                          </h3>
                          
                          {/* Price */}
                          <div className="mt-1 flex items-center space-x-1">
                            {item.discount > 0 ? (
                              <>
                                <span className="text-sm font-bold text-gray-800">₹{discountedPrice.toFixed(2)}</span>
                                <span className="text-xs line-through text-gray-400">₹{item.price.toFixed(2)}</span>
                              </>
                            ) : (
                              <span className="text-sm font-bold text-gray-800">₹{item.price.toFixed(2)}</span>
                            )}
                          </div>
                          
                          {/* Stock Status */}
                          <div className="mt-1">
                            <span className={`${stockInfo.color} text-white text-xs px-1.5 py-0.5 rounded-sm inline-block`}>
                              {stockInfo.text}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="h-40 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    {isLoading ? (
                      <div className="w-8 h-8 border-t-2 border-blue-500 rounded-full animate-spin mx-auto mb-2"></div>
                    ) : (
                      <p>No items in this category</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Loading State */}
      {isLoading && !Object.keys(categoryItems).length && (
        <div className="flex justify-center items-center py-10">
          <div className="w-10 h-10 border-t-4 border-blue-500 rounded-full animate-spin"></div>
        </div>
      )}

      {/* CSS for hiding scrollbars while maintaining functionality */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default MobileCategoryView;