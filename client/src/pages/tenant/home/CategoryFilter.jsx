// src/components/home/CategoryFilter.jsx
export default function CategoryFilter({ categories, activeCategory, setActiveCategory }) {
  return (
    <div className="flex overflow-x-auto pb-4 mb-8 space-x-4 scrollbar-hide">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center px-6 py-3 rounded-full whitespace-nowrap transition-all border ${
              isActive 
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-200' 
                : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50'
            }`}
          >
            <Icon className="mr-2 text-lg" />
            <span className="font-medium">{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}