import { useState, useEffect } from "react";

const AddCategoryForm = ({ onClose, onAddCategory, initialData }) => {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [rank, setRank] = useState("");
  const [isNew, setIsNew] = useState(false); // ✅ Ensure default value is false

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setImageUrl(initialData.imageUrl);
      setRank(initialData.rank);
      setIsNew(initialData.isNew ?? false); // ✅ Ensure default value is false if undefined
    }
  }, [initialData]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold">{initialData ? "Edit Category" : "Add Category"}</h2>

        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 w-full mt-2" />
        <input type="text" placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="border p-2 w-full mt-2" />
        <input type="number" placeholder="Rank" value={rank} onChange={(e) => setRank(e.target.value)} className="border p-2 w-full mt-2" />

        {/* ✅ Fix checkbox to ensure `isNew` is properly handled */}
        <div className="flex items-center mt-2">
          <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} className="mr-2" />
          <label className="text-sm font-medium">Mark as New</label>
        </div>

        <button onClick={() => onAddCategory(name, imageUrl, rank, isNew)} className="bg-green-500 text-white p-2 rounded w-full mt-4">
          {initialData ? "Update" : "Add"}
        </button>
      </div>
    </div>
  );
};

export default AddCategoryForm;
