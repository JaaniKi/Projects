const categories = [
    { label: 'Kaikki kuvat', value: 'all' },
    { label: 'Maisemat', value: 'maisema' },
    { label: 'Puolustusvoimat', value: 'puolustusvoimat' },
    { label: 'Henkilökuvat', value: 'henkilökuvat' },
  ];
  
  const FilterTabs = ({ activeCategory, setActiveCategory }) => {
    return (
      <nav className="flex justify-center space-x-4 mb-8">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => setActiveCategory(category.value)}
            className={`px-4 py-2 rounded-xl ${
              activeCategory === category.value ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {category.label}
          </button>
        ))}
      </nav>
    );
  };
  
  export default FilterTabs;
  