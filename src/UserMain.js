import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { ChevronLeft, Filter, X } from 'lucide-react';

const UserMain = ({ category }) => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [gridColumns, setGridColumns] = useState(6); // Default 6 items per row for desktop
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // New states for modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemImage, setSelectedItemImage] = useState('imageUrl'); // Track which image is selected in modal
  
  useEffect(() => {
    // Check if mobile
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      
      // Adjust grid columns for mobile
      if (window.innerWidth < 640) {
        setGridColumns(2); // 2 columns for mobile
      } else if (window.innerWidth < 768) {
        setGridColumns(3); // 3 columns for tablets
      } else {
        setGridColumns(6); // Default for desktop
      }
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  useEffect(() => {
    if (!category) return;
    fetchItems();
  }, [category]);
  
  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, `categories/${category.id}/items`));
      const itemsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const sortedItems = itemsData.sort((a, b) => (b.rank - a.rank));
      
      // Calculate price range based on items
      if (sortedItems.length > 0) {
        const prices = sortedItems.map(item => item.price);
        const minItemPrice = Math.floor(Math.min(...prices));
        const maxItemPrice = Math.ceil(Math.max(...prices));
        setPriceRange({ min: minItemPrice, max: maxItemPrice });
        setMinPrice(minItemPrice);
        setMaxPrice(maxItemPrice);
      }
      
      // Clear items first
      setItems([]);
      
      // Add items with animation delay 
      sortedItems.forEach((item, index) => {
        setTimeout(() => {
          setItems(prev => [...prev, item]);
        }, 30 * index); // Faster animation for mobile
      });
      
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to handle item click and open modal
  const handleItemClick = (item) => {
    setSelectedItem(item);
    setSelectedItemImage('imageUrl'); // Reset to first image when opening modal
    setModalOpen(true);
  };
  
  const handleWhatsAppRedirect = (item) => {
    const whatsappBusinessNumber = '+918056511598'; // Replace with actual WhatsApp Business number
    const discountedPrice = item.price - (item.price * (item.discount / 100));
    const priceMessage = item.discount > 0
      ? `The discounted price is ₹${discountedPrice.toFixed(2)} (Original: ₹${item.price.toFixed(2)})`
      : `The price is ₹${item.price.toFixed(2)}`;
    
    const message = `Hello, I'm interested in "${item.name}". ${priceMessage}. Is it available?`;
    const encodedMessage = encodeURIComponent(message);
    
    window.open(`https://wa.me/${whatsappBusinessNumber}?text=${encodedMessage}`, '_blank');
    setModalOpen(false);
  };
  
  const getStockLabel = (stock) => {
    if (stock === 0) return { text: "Out of Stock", color: "bg-red-500" };
    if (stock < 10) return { text: "Few Left", color: "bg-amber-500" };
    return { text: "In Stock", color: "bg-green-500" };
  };
  
  // Filter items based on search and price range
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (item.price >= minPrice && item.price <= maxPrice)
  );
  
  // Toggle filters visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Get responsive grid style
  const getResponsiveGridStyle = () => {
    return {
      display: 'grid',
      gridTemplateColumns: isMobile 
        ? 'repeat(2, minmax(0, 1fr))' // 2 columns for mobile
        : `repeat(${gridColumns}, minmax(0, 1fr))`, // Desktop columns
      gap: isMobile ? '0.5rem' : '1rem'
    };
  };
  
  // Animation style for items
  const getItemAnimationStyle = (index) => {
    return {
      opacity: 0,
      transform: 'translateY(20px)',
      animation: `fadeInUp 0.3s ease-out ${index * 0.05}s forwards`
    };
  };
  
  // Grid Selector Component (Only for Desktop)
  const GridSelector = () => {
    const gridOptions = [
      { value: 3, label: "3×3" },
      { value: 4, label: "4×4" },
      { value: 5, label: "5×5" },
      { value: 6, label: "6×6" }
    ];
    
    return (
      <div className="flex space-x-2 items-center">
        <span className="text-sm text-gray-500 mr-1">View:</span>
        {gridOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setGridColumns(option.value)}
            className={`w-10 h-8 flex items-center justify-center rounded-md transition-all ${
              gridColumns === option.value 
                ? "bg-indigo-500 text-white shadow-md" 
                : "bg-gray-100 hover:bg-gray-200 text-gray-600"
            }`}
            title={`${option.label} grid`}
          >
            <span className="text-xs font-medium">{option.label}</span>
          </button>
        ))}
      </div>
    );
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Animation Keyframes */}
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .item-hover-effect {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          
          .item-hover-effect:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
          }
          
          /* Image hover transitions */
          .image-primary, .image-secondary {
            transition: opacity 0.3s ease;
          }
          
          .image-primary {
            opacity: 1;
          }
          
          .image-secondary {
            opacity: 0;
          }
          
          .item-card:hover .image-primary {
            opacity: 0;
          }
          
          .item-card:hover .image-secondary {
            opacity: 1;
          }
        `}
      </style>
      
      {/* Desktop Category Header */}
      {!isMobile && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{category?.name || "Select a Category"}</h2>
          <GridSelector />
        </div>
      )}
      
      {/* Mobile Category Header - Only in UserMain view */}
      {isMobile && category && (
        <div className="flex items-center justify-between py-3 border-b mb-3">
          <div className="flex items-center">
            <button className="p-2 rounded-full hover:bg-gray-100 mr-1">
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-lg font-bold">{category.name}</h2>
          </div>
          <button
            onClick={toggleFilters}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Filter size={20} />
          </button>
        </div>
      )}
      
      {/* Search and Filters Bar - Only in Desktop */}
      {!isMobile && (
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 justify-between mb-6">
          <div className="flex items-center space-x-2 w-full md:w-auto">
            {/* Filter Toggle Button */}
            <button
              onClick={toggleFilters}
              className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-md text-sm flex items-center transition-colors"
            >
              <Filter size={16} className="mr-1" />
              Filter
            </button>
            
            {/* Search Bar */}
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search items..."
                className="border rounded-md pl-8 pr-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-2.5 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      )}
      
      {/* Price Filter Panel */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-md mb-4 border">
          <h3 className="font-medium mb-2">Price Range</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">₹</span>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="border rounded p-1 w-20 text-sm"
                min={priceRange.min}
                max={maxPrice}
              />
            </div>
            <span>to</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">₹</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="border rounded p-1 w-20 text-sm"
                min={minPrice}
                max={priceRange.max}
              />
            </div>
            <button
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      )}
      
      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="w-12 h-12 border-t-4 border-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Mobile Search Bar (if in main view) */}
      {isMobile && !isLoading && filteredItems.length > 0 && (
        <div className="px-4 mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search in this category..."
              className="w-full p-2 pl-8 pr-3 bg-gray-100 rounded-md focus:outline-none text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-2.5 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      )}
      
      {/* Products Grid */}
      {!isLoading && filteredItems.length > 0 && (
        <div 
          style={getResponsiveGridStyle()}
          className={isMobile ? "px-2" : ""}
        >
          {filteredItems.map((item, index) => {
            const discountedPrice = item.price - (item.price * (item.discount / 100));
            const stockInfo = getStockLabel(item.stock);
            
            return (
              <div
                key={item.id}
                className={`relative bg-white rounded-lg shadow-md border ${isMobile ? 'p-2' : 'p-3'} group cursor-pointer item-hover-effect item-card`}
                style={getItemAnimationStyle(index)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => handleItemClick(item)}
              >
                {/* Stock Label */}
                <div className="absolute top-2 left-2 flex flex-col space-y-1 z-10">
                  {item.discount > 0 && (
                    <span className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-sm font-medium">
                      {item.discount}% OFF
                    </span>
                  )}
                </div>
                <div className="absolute top-2 right-2 flex flex-col space-y-1 z-10">
                  {/* NEW Badge */}
                  {item.isNew && (
                    <span className="bg-purple-500 text-white text-xs px-1.5 py-0.5 rounded-sm font-medium">
                      NEW
                    </span>
                  )}
                </div>
               
                {/* Product Image with Hover Effect */}
                <div className="relative w-full pt-[100%] bg-gray-100 overflow-hidden rounded">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 image-primary"
                  />
                  {item.imageUrl2 && (
                    <img
                      src={item.imageUrl2}
                      alt={`${item.name} alternate view`}
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 image-secondary transform scale-110"
                    />
                  )}
                  
                  {/* Hover Overlay - Desktop only */}
                  {!isMobile && hoveredItem === item.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white font-bold text-lg">
                      View Details
                    </div>
                  )}
                </div>
                
                {/* Product Info */}
                <div className="mt-2">
                  <h3 className="text-sm font-medium text-gray-800 line-clamp-2 h-10">{item.name}</h3>
                  
                  {/* Price Display */}
                  <div className="mt-1 flex items-center">
                    {item.discount > 0 ? (
                      <>
                        <span className="text-sm font-bold text-gray-800">₹{discountedPrice.toFixed(2)}</span>
                        <span className="ml-1 text-xs text-gray-500 line-through">₹{item.price.toFixed(2)}</span>
                      </>
                    ) : (
                      <span className="text-sm font-bold text-gray-800">₹{item.price.toFixed(2)}</span>
                    )}
                  </div>
                  
                  {/* Stock Status */}
                  <div className="mt-1">
                    <span className={`text-xs px-1.5 py-0.5 rounded-sm ${stockInfo.color} text-white`}>
                      {stockInfo.text}
                    </span>
                  </div>
                </div>
                
                {/* View Details Button - Desktop only */}
                {!isMobile && (
                  <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-1.5 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
                    >
                      View Details
                    </button>
                  </div>
                )}
              </div>
            );
          })}
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
                    className={`w-16 h-16 rounded-md overflow-hidden cursor-pointer border-2 ${selectedItemImage === 'imageUrl' ? 'border-indigo-500' : 'border-gray-200'}`}
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
                      className={`w-16 h-16 rounded-md overflow-hidden cursor-pointer border-2 ${selectedItemImage === 'imageUrl2' ? 'border-indigo-500' : 'border-gray-200'}`}
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
                  onClick={() => handleWhatsAppRedirect(selectedItem)}
                  className="px-4 py-2 bg-green-500 rounded text-sm font-medium text-white hover:bg-green-600"
                >
                  Interested
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* No Results Message */}
      {!isLoading && filteredItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-bold text-gray-700 mb-1">No items found</h3>
          {searchQuery ? (
            <p className="text-gray-500">No items match your search criteria. Try different keywords or filters.</p>
          ) : (
            <p className="text-gray-500">This category doesn't have any items yet. Please check back later.</p>
          )}
          {searchQuery && (
            <button 
              onClick={() => {
                setSearchQuery("");
                setMinPrice(priceRange.min);
                setMaxPrice(priceRange.max);
              }}
              className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-sm transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
      
      {/* Category Selection Prompt */}
      {!category && !isLoading && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <h3 className="text-xl font-bold text-gray-700 mb-1">Select a Category</h3>
          <p className="text-gray-500">Please select a category from the sidebar to view items.</p>
        </div>
      )}
      
      {/* Scroll to Top Button */}
      {!isLoading && filteredItems.length > 12 && (
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 bg-white shadow-md rounded-full p-3 hover:bg-gray-100 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default UserMain;