import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

const UserMain = ({ category }) => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [gridColumns, setGridColumns] = useState(6); // Default 6 items per row
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [showFilters, setShowFilters] = useState(false);
  
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
      
      // Add items one by one with delay
      sortedItems.forEach((item, index) => {
        setTimeout(() => {
          setItems(prev => [...prev, item]);
        }, 50 * index); // 50ms delay between each item
      });
      
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setIsLoading(false);
    }
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
  
  // Handle price filter changes
  const handlePriceFilterApply = () => {
    // Already applying in the filter function
  };
  
  // Fixed grid style based on the selected number of columns
  const getGridStyle = () => {
    return {
      display: 'grid',
      gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
      gap: '1rem'
    };
  };
  
  // Responsive grid style for smaller screens
  const getResponsiveGridStyle = () => {
    // Base style for mobile (1 column)
    let style = {
      display: 'grid',
      gap: '1rem'
    };
    
    // Apply responsive columns based on screen size
    if (window.innerWidth < 640) {
      // Mobile: 1 column
      style.gridTemplateColumns = 'repeat(1, minmax(0, 1fr))';
    } else if (window.innerWidth < 768) {
      // Small tablets: 2 columns
      style.gridTemplateColumns = 'repeat(2, minmax(0, 1fr))';
    } else {
      // Larger screens: Use selected grid columns
      style.gridTemplateColumns = `repeat(${gridColumns}, minmax(0, 1fr))`;
    }
    
    return style;
  };
  
  // Improved grid selector component
  const GridSelector = () => {
    // Fixed grid options with correct column values
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
            <div className="flex flex-col items-center justify-center">
              <span className="text-xs font-medium">{option.label}</span>
            </div>
          </button>
        ))}
      </div>
    );
  };
  
  // Animation style for items
  const getItemAnimationStyle = (index) => {
    return {
      opacity: 0,
      transform: 'translateY(20px)',
      animation: `fadeInUp 0.3s ease-out ${index * 0.05}s forwards`
    };
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
        `}
      </style>
      
      {/* Top Bar: Category Name */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">{category?.name || "Select a Category"}</h2>
        <GridSelector />
      </div>
      
      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 justify-between mb-6">
        <div className="flex items-center space-x-2 w-full md:w-auto">
          {/* Filter Toggle Button */}
          <button
            onClick={toggleFilters}
            className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-md text-sm flex items-center transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
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
              onClick={handlePriceFilterApply}
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
      
      {/* Products Grid - Using inline style for grid columns */}
      {!isLoading && filteredItems.length > 0 && (
        <div style={getResponsiveGridStyle()}>
          {filteredItems.map((item, index) => {
            const discountedPrice = item.price - (item.price * (item.discount / 100));
            const stockInfo = getStockLabel(item.stock);
            
            return (
              <div
                key={item.id}
                className="relative bg-white rounded-lg shadow-md border p-3 group cursor-pointer item-hover-effect"
                style={getItemAnimationStyle(index)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => handleWhatsAppRedirect(item)}
              >
                {/* Stock Label - Now shows next to item name */}
                <div className="absolute top-3 left-3 flex flex-col space-y-1 z-10">
                  {item.discount > 0 && (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      {item.discount}% OFF
                    </span>
                  )}
                </div>
                <div className="absolute top-3 right-3 flex flex-col space-y-1 z-10">
                   {/* NEW Badge in top right with sweet color */}
                {item.isNew && (
                  <span className=" bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    NEW
                  </span>
                )}
                </div>
               
                
                {/* Product Image */}
                <div className="relative w-full pt-[100%] bg-gray-100 overflow-hidden rounded">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {/* Hover Overlay */}
                  {hoveredItem === item.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white font-bold text-lg">
                      Want to Buy?
                    </div>
                  )}
                </div>
                
                {/* Product Name with Stock indicator beside it */}
                <div className="flex items-center justify-center mt-2 space-x-2">
                  <h3 className="font-medium text-gray-800 text-sm">
                    {item.name}
                  </h3>
                  <span className={`${stockInfo.color} text-white text-xs px-2 py-0.5 rounded-full`}>
                    {stockInfo.text} 
                  </span>
                </div>
                
                {/* Price Display */}
                <div className="mt-1 text-center">
                  {item.discount > 0 ? (
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-red-500 font-bold">₹{discountedPrice.toFixed(2)}</span>
                      <span className="line-through text-gray-400 text-sm">₹{item.price.toFixed(2)}</span>
                    </div>
                  ) : (
                    <span className="text-gray-800 font-bold">₹{item.price.toFixed(2)}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* No Results Message */}
      {!isLoading && filteredItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-medium">No items found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default UserMain;