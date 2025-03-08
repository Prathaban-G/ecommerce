import React, { useState } from "react";
import { Filter, Star, TrendingUp, Bookmark, Settings, ChevronDown, ChevronRight, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const UserSidebar = ({ categories, onSelectCategory, selectedCategory, isLoading, isCollapsed = false }) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    categories: true
  });

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  // Filter categories based on selected filter and search query
  const filteredCategories = categories
    .sort((a, b) => b.rank - a.rank)
    .filter((cat) => {
      // Filter by type
      const typeMatch = 
        selectedFilter === "all" ? true :
        selectedFilter === "new" ? cat.isNew :
        selectedFilter === "trending" ? cat.rank > 5 : true;
      
      // Filter by search
      const searchMatch = searchQuery === "" || 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      return typeMatch && searchMatch;
    });

  const filterOptions = [
    { value: "all", label: "All Categories", icon: <Bookmark size={16} className="mr-2" /> },
    { value: "new", label: "New Arrivals", icon: <Star size={16} className="mr-2 text-amber-400" /> },
    { value: "trending", label: "Trending", icon: <TrendingUp size={16} className="mr-2 text-emerald-400" /> },
  ];

  // Skip rendering content if collapsed mode is active
  if (isCollapsed) {
    return (
      <div className="w-16 h-full bg-white flex flex-col items-center pt-6 space-y-6">
        <button className="p-3 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
          <Bookmark size={20} />
        </button>
        <button className="p-3 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
          <Star size={20} />
        </button>
        <button className="p-3 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
          <TrendingUp size={20} />
        </button>
        <button className="p-3 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors mt-auto mb-6">
          <Settings size={20} />
        </button>
      </div>
    );
  }

  return (
    <aside className="h-full w-64 flex flex-col bg-white">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Browse</h2>
          <motion.button
            onClick={() => setFilterOpen(!filterOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-md hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <Filter size={18} />
          </motion.button>
        </div>

        {/* Search box */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 pl-10 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all"
          />
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Filter Options */}
      <AnimatePresence>
        {filterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-gray-100"
          >
            <div className="p-3 bg-gray-50">
              <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2">Filter By</h3>
              {filterOptions.map((option) => (
                <motion.div
                  key={option.value}
                  onClick={() => {
                    setSelectedFilter(option.value);
                  }}
                  whileHover={{ backgroundColor: "rgba(79, 70, 229, 0.08)" }}
                  className={`flex items-center p-2 cursor-pointer rounded-md text-sm transition-all ${
                    selectedFilter === option.value 
                    ? "bg-indigo-50 text-indigo-600 font-medium" 
                    : "text-gray-600"
                  }`}
                >
                  {option.icon}
                  <span>{option.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex-1 flex justify-center items-center p-6">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Categories Section */}
          <div className="border-b border-gray-100">
            <div 
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection('categories')}
            >
              <h3 className="text-sm uppercase text-gray-500 font-semibold">Categories</h3>
              {expandedSections.categories ? (
                <ChevronDown size={16} className="text-gray-400" />
              ) : (
                <ChevronRight size={16} className="text-gray-400" />
              )}
            </div>

            {expandedSections.categories && (
              <motion.ul
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.05,
                    },
                  },
                }}
                className="pb-2"
              >
                {filteredCategories.length === 0 ? (
                  <motion.div className="text-center text-gray-400 text-sm py-4">
                    No categories found
                  </motion.div>
                ) : (
                  filteredCategories.map((cat) => (
                    <motion.li
                      key={cat.id}
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      className={`mx-2 my-1 rounded-lg transition-all ${
                        selectedCategory?.id === cat.id 
                        ? "bg-indigo-50" 
                        : "hover:bg-gray-50"
                      }`}
                    >
                      <motion.div 
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center p-2 cursor-pointer rounded-lg ${
                          selectedCategory?.id === cat.id 
                          ? "text-indigo-600" 
                          : "text-gray-700"
                        }`}
                        onClick={() => onSelectCategory(cat)}
                      >
                        <div className={`w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 border ${
                          selectedCategory?.id === cat.id 
                          ? "border-indigo-300" 
                          : "border-gray-200"
                        }`}>
                          <img 
                            src={cat.imageUrl} 
                            alt={cat.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <span className="ml-3 text-sm truncate">{cat.name}</span>
                        {cat.isNew && (
                          <motion.span className="ml-auto bg-amber-100 text-amber-600 text-xs px-2 py-0.5 rounded-full font-medium">
                            New
                          </motion.span>
                        )}
                        {cat.rank > 5 && !cat.isNew && (
                          <motion.span className="ml-auto bg-emerald-100 text-emerald-600 text-xs px-2 py-0.5 rounded-full font-medium">
                            Trending
                          </motion.span>
                        )}
                      </motion.div>
                    </motion.li>
                  ))
                )}
              </motion.ul>
            )}
          </div>
        </div>
      )}

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-100">
        <motion.button

        
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
        >
          
        </motion.button>
      </div>
    </aside>
  );
};

export default UserSidebar;