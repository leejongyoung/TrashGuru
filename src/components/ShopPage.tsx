import { useState } from 'react';
import { Gift, ShoppingBag, Star, Award, Coffee, Shirt } from 'lucide-react';
import { notifyPointsEarned } from '../utils/notifications';

interface ShopPageProps {
  userPoints: number;
  onPurchase: (cost: number) => void;
}

export function ShopPage({ userPoints, onPurchase }: ShopPageProps) {
  const [activeTab, setActiveTab] = useState<'items' | 'donations' | 'history'>('items');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const shopItems = [
    {
      id: 1,
      name: '카페 아메리카노',
      points: 500,
      icon: Coffee,
      color: 'bg-amber-100',
      iconColor: 'text-amber-600',
      description: '스타벅스 아메리카노 쿠폰',
      stock: '재고 있음',
    },
    {
      id: 2,
      name: '에코백',
      points: 1000,
      icon: ShoppingBag,
      color: 'bg-green-100',
      iconColor: 'text-green-600',
      description: '재활용 소재 에코백',
      stock: '재고 있음',
    },
    {
      id: 3,
      name: '친환경 티셔츠',
      points: 2000,
      icon: Shirt,
      color: 'bg-blue-100',
      iconColor: 'text-blue-600',
      description: '유기농 면 100% 티셔츠',
      stock: '재고 있음',
    },
    {
      id: 4,
      name: '기프티콘 5000원',
      points: 800,
      icon: Gift,
      color: 'bg-purple-100',
      iconColor: 'text-purple-600',
      description: '편의점 상품권',
      stock: '재고 있음',
    },
    {
      id: 5,
      name: '환경 뱃지',
      points: 300,
      icon: Award,
      color: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      description: '분리수거 마스터 뱃지',
      stock: '재고 있음',
    },
  ];

  const donations = [
    {
      id: 1,
      name: '나무 심기',
      points: 1000,
      description: '1000P = 나무 1그루',
      impact: '연간 CO2 22kg 흡수',
    },
    {
      id: 2,
      name: '해양 정화',
      points: 500,
      description: '500P = 플라스틱 1kg 수거',
      impact: '바다를 깨끗하게',
    },
    {
      id: 3,
      name: '동물 보호',
      points: 2000,
      description: '2000P = 멸종위기 동물 후원',
      impact: '생태계 보호',
    },
  ];

  const purchaseHistory = [
    { date: '2025.11.28', item: '카페 아메리카노', points: -500 },
    { date: '2025.11.20', item: '나무 심기', points: -1000 },
    { date: '2025.11.15', item: '환경 뱃지', points: -300 },
  ];

  const handlePurchase = (item: any) => {
    setSelectedItem(item);
    setShowPurchaseModal(true);
  };

  const confirmPurchase = () => {
    if (selectedItem && userPoints >= selectedItem.points) {
      onPurchase(selectedItem.points);
      
      // Add notification for purchase
      notifyPointsEarned(-selectedItem.points, `${selectedItem.name} 구매 완료`);
      
      setShowPurchaseModal(false);
      setSelectedItem(null);
      alert('구매가 완료되었습니다! 🎉');
    } else {
      alert('포인트가 부족합니다 😢');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Points Display */}
      <div className="bg-gradient-to-br from-green-400 to-green-600 text-white p-6">
        <div className="flex items-center justify-between mb-2">
          <h2>포인트 상점</h2>
          <Star className="text-yellow-300" size={32} fill="currentColor" />
        </div>
        <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
          <p className="text-sm opacity-90 mb-1">보유 포인트</p>
          <p className="text-3xl">{userPoints.toLocaleString()}P</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('items')}
            className={`flex-1 py-4 text-center transition-colors ${
              activeTab === 'items'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-500'
            }`}
          >
            상품
          </button>
          <button
            onClick={() => setActiveTab('donations')}
            className={`flex-1 py-4 text-center transition-colors ${
              activeTab === 'donations'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-500'
            }`}
          >
            기부
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-4 text-center transition-colors ${
              activeTab === 'history'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-500'
            }`}
          >
            구매내역
          </button>
        </div>
      </div>

      {/* Items Tab */}
      {activeTab === 'items' && (
        <div className="p-4 space-y-3">
          {shopItems.map((item) => {
            const Icon = item.icon;
            const canAfford = userPoints >= item.points;
            
            return (
              <div key={item.id} className="bg-white rounded-2xl p-5 border border-gray-200">
                <div className="flex gap-4">
                  <div className={`w-16 h-16 ${item.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className={item.iconColor} size={32} />
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-1">{item.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-green-600">{item.points.toLocaleString()}P</span>
                        <span className="text-xs text-gray-500 ml-2">{item.stock}</span>
                      </div>
                      <button
                        onClick={() => handlePurchase(item)}
                        disabled={!canAfford}
                        className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                          canAfford
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        구매하기
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Donations Tab */}
      {activeTab === 'donations' && (
        <div className="p-4 space-y-3">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-4">
            <p className="text-sm text-green-800">
              💚 포인트로 지구를 지켜요! 여러분의 작은 실천이 큰 변화를 만듭니다.
            </p>
          </div>

          {donations.map((donation) => (
            <div key={donation.id} className="bg-white rounded-2xl p-5 border border-gray-200">
              <h4 className="mb-2">{donation.name}</h4>
              <p className="text-sm text-gray-600 mb-1">{donation.description}</p>
              <p className="text-sm text-green-600 mb-3">✓ {donation.impact}</p>
              <div className="flex items-center justify-between">
                <span className="text-green-600">{donation.points.toLocaleString()}P</span>
                <button
                  onClick={() => handlePurchase(donation)}
                  disabled={userPoints < donation.points}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    userPoints >= donation.points
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  기부하기
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="p-4 space-y-3">
          {purchaseHistory.length > 0 ? (
            purchaseHistory.map((history, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-5 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-800 mb-1">{history.item}</p>
                    <p className="text-xs text-gray-500">{history.date}</p>
                  </div>
                  <span className="text-red-600">{history.points.toLocaleString()}P</span>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center text-gray-500">
              <p>구매 내역이 없어요</p>
              <p className="text-sm mt-2">포인트로 상품을 구매해보세요!</p>
            </div>
          )}
        </div>
      )}

      {/* Purchase Modal */}
      {showPurchaseModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="mb-4">구매 확인</h3>
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-600 mb-2">상품명</p>
              <p className="mb-3">{selectedItem.name}</p>
              <p className="text-sm text-gray-600 mb-2">필요 포인트</p>
              <p className="text-green-600 mb-3">{selectedItem.points.toLocaleString()}P</p>
              <p className="text-sm text-gray-600 mb-2">구매 후 잔액</p>
              <p>{(userPoints - selectedItem.points).toLocaleString()}P</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
              >
                취소
              </button>
              <button
                onClick={confirmPurchase}
                className="flex-1 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
              >
                구매하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
