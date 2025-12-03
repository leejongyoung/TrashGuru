import { Home, HelpCircle, Camera, MessageSquare, ShoppingCart } from 'lucide-react';

interface BottomNavProps {
  currentPage: 'home' | 'quiz' | 'search' | 'community' | 'shop' | 'mypage';
  onPageChange: (page: 'home' | 'quiz' | 'search' | 'community' | 'shop' | 'mypage') => void;
}

export function BottomNav({ currentPage, onPageChange }: BottomNavProps) {
  const navItems = [
    { id: 'home' as const, icon: Home, label: '메인' },
    { id: 'quiz' as const, icon: HelpCircle, label: '퀴즈' },
    { id: 'search' as const, icon: Camera, label: 'AI 카메라' },
    { id: 'community' as const, icon: MessageSquare, label: '커뮤니티' },
    { id: 'shop' as const, icon: ShoppingCart, label: '상점' },
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
                isActive ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              <Icon size={item.id === 'search' ? 28 : 24} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-xs ${isActive ? '' : ''}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}