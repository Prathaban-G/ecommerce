import { useState } from "react"; 
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

const AddItemForm = ({ onClose, selectedCategory, editItem, refreshItems }) => {
  const [name, setName] = useState(editItem ? editItem.name : "");
  const [imageUrl, setImageUrl] = useState(editItem ? editItem.imageUrl : "");
  
  const [imageUrl2, setImageUrl2] = useState(editItem ? editItem.imageUrl2 : "");
  const [price, setPrice] = useState(editItem ? editItem.price : "");
  const [rank, setRank] = useState(editItem ? editItem.rank : "");
  const [discount, setDiscount] = useState(editItem ? editItem.discount || 0 : 0);
  const [isNew, setIsNew] = useState(editItem ? editItem.isNew || false : false);
  const [stock, setStock] = useState(editItem ? editItem.stock || 0 : 0); // New stock field

  const handleSaveItem = async () => {
    if (!selectedCategory) return alert("Please select a category first!");
    
    const collectionRef = collection(db, `categories/${selectedCategory.id}/items`);
    const itemData = { 
      name, 
      imageUrl, 
        imageUrl2, 
      price: parseFloat(price), 
      rank: parseInt(rank),
      discount: parseFloat(discount) || 0,
      isNew,
      stock: parseInt(stock), // Save stock value
    };

    if (editItem) {
      await updateDoc(doc(db, `categories/${selectedCategory.id}/items/${editItem.id}`), itemData);
    } else {
      await addDoc(collectionRef, itemData);
    }

    refreshItems();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold">{editItem ? "Edit Item" : "Add Item"}</h2>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 w-full mt-2" />
        <input type="text" placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="border p-2 w-full mt-2" />
        <input type="text" placeholder="Image URL2" value={imageUrl2} onChange={(e) => setImageUrl2(e.target.value)} className="border p-2 w-full mt-2" />
       
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} className="border p-2 w-full mt-2" />
        <input type="number" placeholder="Discount (%)" value={discount} onChange={(e) => setDiscount(e.target.value)} className="border p-2 w-full mt-2" />
        <input type="number" placeholder="Rank" value={rank} onChange={(e) => setRank(e.target.value)} className="border p-2 w-full mt-2" />
        <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} className="border p-2 w-full mt-2" />
        
        {/* Toggle "New" Badge */}
        <div className="flex items-center mt-2">
          <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} className="mr-2" />
          <label className="text-sm">Mark as New</label>
        </div>

        <div className="flex justify-between mt-4">
          <button onClick={handleSaveItem} className="bg-green-500 text-white p-2 rounded w-1/2 mr-2">{editItem ? "Save Changes" : "Add"}</button>
          <button onClick={onClose} className="bg-gray-300 text-gray-700 p-2 rounded w-1/2">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddItemForm;
