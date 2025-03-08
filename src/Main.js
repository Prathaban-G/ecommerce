import { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

const Main = ({ category, openEditForm }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!category) return;
    fetchItems();
  }, [category]);

  const fetchItems = async () => {
    const querySnapshot = await getDocs(collection(db, `categories/${category.id}/items`));
    const itemsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setItems(itemsData.sort((a, b) => (b.rank - a.rank)));
  };

  const handleDelete = async (id) => {
    if (!category) return;
    await deleteDoc(doc(db, `categories/${category.id}/items/${id}`));
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="flex-1 p-6">
      <h2 className="text-2xl font-bold text-purple-700">{category?.name || "Select a Category"}</h2>
      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => {
          const discountedPrice = item.price - (item.price * (item.discount / 100));

          return (
            <div key={item.id} className="relative bg-white p-4 rounded-lg shadow-md group flex flex-col items-center">
              
              {/* "New" Badge */}
              {item.isNew && (
                <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                  NEW
                </div>
              )}

              {/* Discount Badge */}
              {item.discount > 0 && (
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                  {item.discount}% OFF
                </div>
              )}

              {/* Stock Badge */}
              {item.stock === 0 && (
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  OUT OF STOCK
                </div>
              )}
              {item.stock > 0 && item.stock < 10 && (
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                  LIMITED STOCK
                </div>
              )}

              {/* Square Image */}
              <div className="w-40 h-40 bg-gray-200 flex justify-center items-center rounded-lg overflow-hidden">
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              </div>

              <h3 className="text-lg font-bold mt-2">{item.name}</h3>

              {/* Price Display */}
              <p className="text-gray-600 font-bold">
                {item.discount > 0 ? (
                  <>
                    <span className="line-through text-gray-400">${item.price.toFixed(2)}</span>
                    <span className="text-red-500 ml-2">${discountedPrice.toFixed(2)}</span>
                  </>
                ) : (
                  <span>${item.price.toFixed(2)}</span>
                )}
              </p>

              {/* Action Buttons */}
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black bg-opacity-50">
                <button onClick={() => openEditForm(item)} className="bg-blue-500 text-white p-2 rounded mx-1">
                  Edit
                </button>
                <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white p-2 rounded mx-1">
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <footer></footer>
    </div>
  );
};

export default Main;
