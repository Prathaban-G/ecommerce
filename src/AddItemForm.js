import { useState } from "react";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

const AddItemForm = ({ onClose, selectedCategory, editItem, refreshItems }) => {
  const [name, setName] = useState(editItem ? editItem.name : "");
  const [imageUrls, setImageUrls] = useState(editItem?.imageUrls || Array(10).fill("")); // ✅ Up to 10
  const [price, setPrice] = useState(editItem ? editItem.price : "");
  const [rank, setRank] = useState(editItem ? editItem.rank : "");
  const [discount, setDiscount] = useState(editItem ? editItem.discount || 0 : 0);
  const [isNew, setIsNew] = useState(editItem ? editItem.isNew || false : false);
  const [stock, setStock] = useState(editItem ? editItem.stock || 0 : 0);

  const handleSaveItem = async () => {
    if (!selectedCategory) return alert("Please select a category first!");

    const itemData = {
      name,
      imageUrls: imageUrls.filter(url => url.trim() !== ""), // ✅ Only non-empty
      price: parseFloat(price),
      rank: parseInt(rank),
      discount: parseFloat(discount) || 0,
      isNew,
      stock: parseInt(stock),
    };

    const collectionRef = collection(db, `categories/${selectedCategory.id}/items`);

    if (editItem) {
      await updateDoc(doc(db, `categories/${selectedCategory.id}/items/${editItem.id}`), itemData);
    } else {
      await addDoc(collectionRef, itemData);
    }

    refreshItems();
    onClose();
  };

  const handleImageChange = (index, value) => {
    const updated = [...imageUrls];
    updated[index] = value;
    setImageUrls(updated);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-2">{editItem ? "Edit Item" : "Add Item"}</h2>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 w-full mt-2" />

        {imageUrls.map((url, idx) => (
          <input
            key={idx}
            type="text"
            placeholder={`Image URL ${idx + 1}`}
            value={url}
            onChange={(e) => handleImageChange(idx, e.target.value)}
            className="border p-2 w-full mt-2"
          />
        ))}

        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} className="border p-2 w-full mt-2" />
        <input type="number" placeholder="Discount (%)" value={discount} onChange={(e) => setDiscount(e.target.value)} className="border p-2 w-full mt-2" />
        <input type="number" placeholder="Rank" value={rank} onChange={(e) => setRank(e.target.value)} className="border p-2 w-full mt-2" />
        <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} className="border p-2 w-full mt-2" />

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
