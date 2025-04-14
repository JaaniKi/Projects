import React, { useState, useMemo } from 'react';
import imagesData from './data/images';
import Gallery from './components/gallery';
import './App.css';
import Header from './components/header';

const categories = [
  { label: 'Kaikki kuvat', value: 'all' },
  { label: 'Maisemat', value: 'maisemat' },
  { label: 'Puolustusvoimat', value: 'puolustusvoimat' },
  { label: 'Henkilökuvat', value: 'henkilökuvat' },
  { label: 'Muut', value: 'muut' },
];

const App = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredImages = useMemo(() => {
    return activeCategory === 'all'
      ? imagesData
      : imagesData.filter((img) => img.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="app-container">
      <header>
        <Header/>
      </header>

      <nav className="filter-tabs">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => setActiveCategory(category.value)}
            className={activeCategory === category.value ? 'active' : ''}
          >
            {category.label}
          </button>
        ))}
      </nav>

      <Gallery images={filteredImages} />
    </div>
  );
};

export default App;
