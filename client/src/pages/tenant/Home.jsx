// src/pages/tenant/Home.jsx
import { useState } from 'react';
import { SearchOutlined, HomeOutlined, AppstoreOutlined } from '@ant-design/icons';

// Import các component con
import HeroSection from './home/HeroSection';
import CategoryFilter from './home/CategoryFilter';
import FeaturedRooms from './home/FeaturedRooms';
import LandlordCTA from './home/LandlordCTA';

// --- MOCK DATA ---
const CATEGORIES = [
  { id: 'all', name: 'Tất cả', icon: SearchOutlined },
  { id: 'phong-tro', name: 'Phòng trọ', icon: HomeOutlined },
  { id: 'can-ho', name: 'Căn hộ mini', icon: AppstoreOutlined },
  { id: 'o-ghep', name: 'Ở ghép', icon: HomeOutlined },
];

const FEATURED_ROOMS = [
  { id: 1, title: "Phòng trọ ban công thoáng mát", price: "3.5", unit: "triệu/tháng", location: "Bình Thạnh, TP.HCM", area: "25m²", beds: 1, baths: 1, image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3", verified: true, rating: 4.8, isFavorite: false },
  // ... các data phòng khác
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <div className="w-full">
      <HeroSection />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CategoryFilter 
          categories={CATEGORIES} 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory} 
        />
        
        <FeaturedRooms rooms={FEATURED_ROOMS} />
      </main>

      <LandlordCTA />
    </div>
  );
}