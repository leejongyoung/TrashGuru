import { Search, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export function ClassificationPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      name: '플라스틱',
      icon: '♻️',
      color: 'bg-blue-100 dark:bg-blue-900/30',
      items: ['페트병', '플라스틱 용기', '비닐봉지', '스티로폼']
    },
    {
      name: '종이류',
      icon: '📄',
      color: 'bg-green-100 dark:bg-green-900/30',
      items: ['신문지', '박스', '책', '우유팩']
    },
    {
      name: '유리병',
      icon: '🍾',
      color: 'bg-purple-100 dark:bg-purple-900/30',
      items: ['소주병', '맥주병', '음료수병', '화장품병']
    },
    {
      name: '캔류',
      icon: '🥫',
      color: 'bg-orange-100 dark:bg-orange-900/30',
      items: ['음료수캔', '통조림캔', '부탄가스', '스프레이']
    },
    {
      name: '비닐류',
      icon: '🛍️',
      color: 'bg-pink-100 dark:bg-pink-900/30',
      items: ['과자봉지', '택배봉투', '에어캡', '랩']
    },
    {
      name: '일반쓰레기',
      icon: '🗑️',
      color: 'bg-gray-100 dark:bg-gray-700',
      items: ['음식물', '기저귀', '화장지', '일회용품']
    },
  ];

  const filteredCategories = searchQuery
    ? categories.filter(cat => 
        cat.name.includes(searchQuery) || 
        cat.items.some(item => item.includes(searchQuery))
      )
    : categories;

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Header Info */}
      <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-6 text-white">
        <h2 className="mb-2">분류정보</h2>
        <p className="text-sm opacity-90">올바른 분리수거를 위한 가이드</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="분류 방법 검색"
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-green-500 dark:text-white"
        />
      </div>

      {/* Categories */}
      <div className="space-y-3">
        {filteredCategories.map((category, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center text-2xl`}>
                  {category.icon}
                </div>
                <div className="text-left">
                  <h3 className="dark:text-white mb-1">{category.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {category.items.length}개 항목
                  </p>
                </div>
              </div>
              <ChevronRight className="text-gray-400" size={20} />
            </button>
            
            <div className="px-4 pb-4 pt-0">
              <div className="flex flex-wrap gap-2">
                {category.items.map((item, itemIdx) => (
                  <span
                    key={itemIdx}
                    className="px-3 py-1 bg-gray-50 dark:bg-gray-700 text-xs rounded-full text-gray-700 dark:text-gray-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-600 dark:text-gray-400">검색 결과가 없습니다</p>
        </div>
      )}
    </div>
  );
}
