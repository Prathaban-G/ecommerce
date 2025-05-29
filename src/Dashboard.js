import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase"; // Ensure correct Firebase import
import Footer from "./Footer";
import Main from "./Main";
import AddCategoryForm from "./AddCategoryForm";
import AddItemForm from "./AddItemForm";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null); // Track which category is being edited
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "categories"));
      setCategories(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleLogout = () => {
    // Add actual logout logic here (e.g., Firebase auth signOut)
    navigate("/login"); // Redirect to login page
  };

  // Add or Update Category
  const handleAddCategory = async (name, imageUrl, rank, isNew) => {
    try {
      if (editingCategory) {
        const categoryRef = doc(db, "categories", editingCategory.id);
        await updateDoc(categoryRef, {
          name,
          imageUrl,
          rank: parseInt(rank, 10),
          isNew: isNew ?? false, // Ensure default value
        });
        setEditingCategory(null);
      } else {
        await addDoc(collection(db, "categories"), {
          name,
          imageUrl,
          rank: parseInt(rank, 10),
          isNew: isNew ?? false, // Ensure default value
        });
      }
      fetchCategories();
      setShowCategoryForm(false);
    } catch (error) {
      console.error("Error adding/updating category:", error);
    }
  };

  // Edit Category
  const handleEditCategory = (category) => {
    setEditingCategory(category); // Set category for editing
    setShowCategoryForm(true); // Open the form
  };

  // Delete Category
  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteDoc(doc(db, "categories", categoryId));
        fetchCategories(); // Refresh list after deletion
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar onLogout={handleLogout} />
      <div className="flex flex-grow">
        <Sidebar
          categories={categories}
          onSelectCategory={setSelectedCategory}
          openCategoryForm={() => setShowCategoryForm(true)}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
        />
        <Main
          category={selectedCategory}
          openEditForm={(item) => {
            setEditingItem(item);
            setShowItemForm(true);
          }}
        />
      </div>
      <button
        onClick={() => {
          setEditingItem(null);
          setShowItemForm(true);
        }}
        className="fixed bottom-6 right-6 bg-purple-700 text-white p-4 rounded-full shadow-lg"
      >
        <PlusCircle size={32} />
      </button>

      {/* Add/Edit Category Form */}
      {showCategoryForm && (
        <AddCategoryForm
          onClose={() => {
            setShowCategoryForm(false);
            setEditingCategory(null); // Reset editing state
          }}
          onAddCategory={handleAddCategory}
          initialData={editingCategory} // Pass editingCategory as initialData
        />
      )}

      {/* Add/Edit Item Form */}
      {showItemForm && (
        <AddItemForm
          onClose={() => {
            setShowItemForm(false);
            setEditingItem(null); // Reset editing state
          }}
          selectedCategory={selectedCategory}
          editItem={editingItem}
          refreshItems={fetchCategories}
        />
      )}

      <Footer />
    </div>
  );
};

export default Dashboard;
