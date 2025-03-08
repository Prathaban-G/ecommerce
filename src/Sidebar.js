import { PlusCircle, Edit, Trash } from "lucide-react";

const Sidebar = ({ categories, onSelectCategory, openCategoryForm, onEditCategory, onDeleteCategory }) => (
  <aside className="bg-purple-800 text-white w-64 p-4 min-h-screen relative">
    <h2 className="text-lg font-bold mb-4">Categories</h2>
    <ul>
      {categories.sort((a, b) => b.rank - a.rank).map((cat) => (
        <li key={cat.id} className="flex items-center justify-between p-2 cursor-pointer hover:bg-purple-600 rounded">
          <div className="flex items-center gap-2" onClick={() => onSelectCategory(cat)}>
            <img src={cat.imageUrl} alt={cat.name} className="w-10 h-10 rounded-full border-2 border-white" />
            <span>{cat.name}</span>
            {cat.isNew && <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">New</span>}
          </div>

          <div className="flex gap-2">
            {/* Edit Button */}
            <button onClick={(e) => { e.stopPropagation(); onEditCategory(cat); }} className="text-blue-400">
  <Edit size={16} />
</button>


            {/* Delete Button */}
            <button onClick={(e) => { e.stopPropagation(); onDeleteCategory(cat.id); }} className="text-red-400">
              <Trash size={16} />
            </button>
          </div>
        </li>
      ))}
    </ul>

    <button onClick={openCategoryForm} className="absolute bottom-20 right-6 bg-blue-600 text-white p-2 rounded-full shadow-lg">
      <PlusCircle size={24} />
    </button>
  </aside>
);

export default Sidebar;
