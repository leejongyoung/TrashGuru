import { useState } from 'react';
import { HandHeart, MessageSquare, Camera, Truck, ShoppingCart, Image, X } from 'lucide-react';
import type { AppPage } from '../App';

interface BottomNavProps {
  currentPage: AppPage;
  onPageChange: (page: AppPage) => void;
  onTakePhoto: () => void;
  onOpenGallery: () => void;
}

export function BottomNav({ currentPage, onPageChange, onTakePhoto, onOpenGallery }: BottomNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems: { id: AppPage; icon: React.ElementType; label: string }[] = [
    { id: 'volunteer', icon: HandHeart, label: '봉사활동' },
    { id: 'community', icon: MessageSquare, label: '커뮤니티' },
    { id: 'search', icon: Camera, label: 'AI 카메라' },
    { id: 'pickup', icon: Truck, label: '대리수거' },
    { id: 'shop', icon: ShoppingCart, label: '상점' },
  ];

  const handleItemClick = (id: AppPage) => {
    if (id === 'search') {
      setIsMenuOpen(!isMenuOpen);
    } else {
      setIsMenuOpen(false);
      onPageChange(id);
    }
  };

  return (
    <>
      {/* Menu Backdrop (to close on click outside) */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsMenuOpen(false)} 
        />
      )}
      
      <nav className="w-full bg-white border-t border-gray-200 px-2 py-2 z-50 relative">
        {/* Camera Menu */}
        {isMenuOpen && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col gap-4 items-center z-50 animate-in slide-in-from-bottom-4 fade-in duration-200">
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onTakePhoto();
              }}
              className="flex items-center gap-3 bg-white px-5 py-3 rounded-full shadow-lg border border-gray-100 hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              <span className="text-sm font-medium text-gray-700">쓰레기 인식하기</span>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <Camera size={18} />
              </div>
            </button>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onOpenGallery();
              }}
              className="flex items-center gap-3 bg-white px-5 py-3 rounded-full shadow-lg border border-gray-100 hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              <span className="text-sm font-medium text-gray-700">분리수거 인증하기</span>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <Camera size={18} />
              </div>
            </button>
          </div>
        )}

        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                  isActive && item.id !== 'search' ? 'text-green-600' : 'text-gray-500'
                }`}
              >
                {item.id === 'search' ? (
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${isMenuOpen ? 'bg-gray-800' : (isActive ? 'bg-gray-200' : 'bg-green-600')}`}>
                    {isMenuOpen ? (
                      <X size={28} strokeWidth={2.5} className="text-white" />
                    ) : (
                      <Icon size={28} strokeWidth={2.5} className={isActive ? 'text-gray-800' : 'text-white'} />
                    )}
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
    </>
  );
}