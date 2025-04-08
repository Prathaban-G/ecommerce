import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

const MobileCategoryView = ({ categories, onSelectCategory, selectedCategory }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [categoryItems, setCategoryItems] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const categoryScrollRef = useRef(null);
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemImage, setSelectedItemImage] = useState('imageUrl'); // Track which image is selected in modal

  useEffect(() => {
    if (categories.length > 0) {
      // Sort categories by rank
      const sortedCategories = [...categories].sort((a, b) => b.rank - a.rank);
      // Set highest ranked one as active for highlighting purposes
      setActiveCategory(sortedCategories[0]);
      
      // Fetch items for ALL categories
      sortedCategories.forEach(category => {
        fetchCategoryItems(category);
      });
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

  // Function to handle item click and open modal
  const handleItemClick = (item) => {
    setSelectedItem(item);
    setSelectedItemImage('imageUrl'); // Reset to first image when opening modal
    setModalOpen(true);
  };

  // Function to handle WhatsApp redirect
  const handleWhatsAppRedirect = () => {
    if (selectedItem) {
      const whatsappBusinessNumber = '+918056511598';
      const discountedPrice = selectedItem.price - (selectedItem.price * (selectedItem.discount / 100));
      const priceMessage = selectedItem.discount > 0
        ? `The discounted price is ₹${discountedPrice.toFixed(2)} (Original: ₹${selectedItem.price.toFixed(2)})`
        : `The price is ₹${selectedItem.price.toFixed(2)}`;
      
      const message = `Hello, I'm interested in "${selectedItem.name}". ${priceMessage}. Is it available?`;
      const encodedMessage = encodeURIComponent(message);
      
      window.open(`https://wa.me/${whatsappBusinessNumber}?text=${encodedMessage}`, '_blank');
      setModalOpen(false);
    }
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
                    {items.map((item) => {
                      const discountedPrice = item.price - (item.price * (item.discount / 100));
                      const stockInfo = getStockLabel(item.stock);
                      
                      return (
                        <div
                          key={item.id}
                          className="flex-shrink-0 w-36 bg-white rounded-lg shadow-sm border p-2 relative item-card"
                          onClick={() => handleItemClick(item)}
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
                          
                          {/* Product Image with Hover Effect */}
                          <div className="w-full h-32 bg-gray-100 rounded-md overflow-hidden relative">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover transition-opacity duration-300 absolute image-primary"
                            />
                            {item.imageUrl2 && (
                              <img
                                src={item.imageUrl2}
                                alt={`${item.name} alternate view`}
                                className="w-full h-full object-cover transition-opacity duration-300 opacity-0 absolute image-secondary transform scale-105"
                              />
                            )}
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

      {/* Enhanced Product Modal */}
      {modalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg shadow-lg">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-medium text-lg">Product Details</h3>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4">
              {/* Image Gallery */}
              <div className="mb-4">
                {/* Main Product Image */}
                <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden mb-2">
                  <img 
                    src={selectedItem[selectedItemImage]} 
                    alt={selectedItem.name} 
                    className="w-full h-full object-contain"
                  />
                </div>
                
                {/* Image Selector */}
                <div className="flex space-x-2">
                  <div 
                    className={`w-16 h-16 rounded-md overflow-hidden cursor-pointer border-2 ${selectedItemImage === 'imageUrl' ? 'border-blue-500' : 'border-gray-200'}`}
                    onClick={() => setSelectedItemImage('imageUrl')}
                  >
                    <img 
                      src={selectedItem.imageUrl} 
                      alt={`${selectedItem.name} main view`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {selectedItem.imageUrl2 && (
                    <div 
                      className={`w-16 h-16 rounded-md overflow-hidden cursor-pointer border-2 ${selectedItemImage === 'imageUrl2' ? 'border-blue-500' : 'border-gray-200'}`}
                      onClick={() => setSelectedItemImage('imageUrl2')}
                    >
                      <img 
                        src={selectedItem.imageUrl2} 
                        alt={`${selectedItem.name} alternate view`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Product Details */}
              <div className="mb-4">
                <h2 className="text-xl font-medium mb-2">{selectedItem.name}</h2>
                
                {/* Price Details */}
                <div className="mb-3">
                  {selectedItem.discount > 0 ? (
                    <div className="flex items-center">
                      <span className="text-xl font-bold text-gray-800">
                        ₹{(selectedItem.price - (selectedItem.price * (selectedItem.discount / 100))).toFixed(2)}
                      </span>
                      <span className="text-sm line-through text-gray-400 ml-2">
                        ₹{selectedItem.price.toFixed(2)}
                      </span>
                      <span className="ml-2 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-sm">
                        {selectedItem.discount}% OFF
                      </span>
                    </div>
                  ) : (
                    <span className="text-xl font-bold text-gray-800">₹{selectedItem.price.toFixed(2)}</span>
                  )}
                </div>
                
                {/* Stock Status */}
                <div className="mb-3">
                  <span className={`${getStockLabel(selectedItem.stock).color} text-white text-xs px-2 py-1 rounded inline-block`}>
                    {getStockLabel(selectedItem.stock).text}
                  </span>
                </div>
                
                {/* Description */}
                {selectedItem.description && (
                  <div className="mb-3 text-sm text-gray-600">
                    <p>{selectedItem.description}</p>
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Modify
                </button>
                <button
                  onClick={handleWhatsAppRedirect}
                  className="px-4 py-2 bg-green-500 rounded text-sm font-medium text-white hover:bg-green-600"
                >
                  Interested
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS for hiding scrollbars and image hover effects */}
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
        
        /* Image hover effect */
        .item-card:hover .image-primary {
          opacity: 0;
        }
        
        .item-card:hover .image-secondary {
          opacity: 1;
        }
        
        .image-primary, .image-secondary {
          transition: opacity 0.3s ease;
        }
        
        .image-primary {
          opacity: 1;
        }
        
        .image-secondary {
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default MobileCategoryView;