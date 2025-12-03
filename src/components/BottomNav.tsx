import { HandHeart, MessageSquare, Camera, Truck, ShoppingCart } from 'lucide-react';
import type { AppPage } from '../App';

interface BottomNavProps {
  currentPage: AppPage;
  onPageChange: (page: AppPage) => void;
}

export function BottomNav({ currentPage, onPageChange }: BottomNavProps) {
  const navItems: { id: AppPage; icon: React.ElementType; label: string }[] = [
    { id: 'volunteer', icon: HandHeart, label: '봉사활동' },
    { id: 'community', icon: MessageSquare, label: '커뮤니티' },
    { id: 'search', icon: Camera, label: 'AI 카메라' },
    { id: 'pickup', icon: Truck, label: '대리수거' },
    { id: 'shop', icon: ShoppingCart, label: '상점' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 max-w-[430px] mx-auto">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                isActive && item.id !== 'search' ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              {item.id === 'search' ? (
                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-gray-200' : 'bg-green-600'}`}>
                  <Icon size={28} strokeWidth={2.5} className={isActive ? 'text-gray-800' : 'text-white'} />
                </div>
              ) : (
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              )}
              <span className={`text-xs ${isActive && item.id !== 'search' ? 'text-green-600' : 'text-gray-500'}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}