import { Package, MapPin, Phone, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export function BagsPage() {
  const [selectedBag, setSelectedBag] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const bagTypes = [
    { id: '10L', name: '소형 (10L)', price: 0, color: 'bg-green-100 dark:bg-green-900/30' },
    { id: '20L', name: '중형 (20L)', price: 0, color: 'bg-blue-100 dark:bg-blue-900/30' },
    { id: '50L', name: '대형 (50L)', price: 0, color: 'bg-purple-100 dark:bg-purple-900/30' },
    { id: '100L', name: '특대형 (100L)', price: 0, color: 'bg-orange-100 dark:bg-orange-900/30' },
  ];

  const recentOrders = [
    { id: 1, type: '중형 (20L)', quantity: 5, date: '2025.11.20', status: '배송완료' },
    { id: 2, type: '대형 (50L)', quantity: 3, date: '2025.11.15', status: '배송중' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBag && address && phone) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setSelectedBag('');
        setQuantity(1);
        setAddress('');
        setPhone('');
      }, 2000);
    }
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-slideUp flex items-center gap-2">
          <CheckCircle size={20} />
          <span>봉투 신청이 완료되었습니다!</span>
        </div>
      )}

      {/* Header Info */}
      <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl p-6 text-white">
        <h2 className="mb-2">봉투받기</h2>
        <p className="text-sm opacity-90">무료로 분리수거 봉투를 받아보세요</p>
      </div>

      {/* Bag Selection */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 space-y-4">
        <h3 className="flex items-center gap-2 dark:text-white mb-4">
          <Package className="text-purple-600" size={20} />
          <span>봉투 신청</span>
        </h3>

        {/* Bag Type Selection */}
        <div>
          <label className="text-sm text-gray-700 dark:text-gray-300 mb-3 block">
            봉투 크기 선택
          </label>
          <div className="grid grid-cols-2 gap-3">
            {bagTypes.map((bag) => (
              <button
                key={bag.id}
                type="button"
                onClick={() => setSelectedBag(bag.id)}
                className={`p-4 rounded-xl border transition-all ${
                  selectedBag === bag.id
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-purple-400'
                }`}
              >
                <div className={`w-12 h-12 ${bag.color} rounded-full flex items-center justify-center text-2xl mx-auto mb-2`}>
                  🛍️
                </div>
                <p className="text-sm dark:text-white text-center">{bag.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">무료</p>
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">
            수량 (최대 10개)
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
              min="1"
              max="10"
              className="flex-1 text-center px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-purple-500 dark:text-white"
            />
            <button
              type="button"
              onClick={() => setQuantity(Math.min(10, quantity + 1))}
              className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 mb-2">
            <MapPin size={16} className="text-purple-600" />
            배송 주소
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="상세 주소를 입력하세요"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-purple-500 dark:text-white"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 mb-2">
            <Phone size={16} className="text-purple-600" />
            연락처
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="010-0000-0000"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-purple-500 dark:text-white"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
        >
          신청하기
        </button>
      </form>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
        <h3 className="dark:text-white mb-4">신청 내역</h3>
        <div className="space-y-3">
          {recentOrders.map((order) => (
            <div key={order.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm dark:text-white mb-1">{order.type} × {order.quantity}개</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{order.date}</p>
                </div>
                <span className={`px-3 py-1 text-xs rounded-full ${
                  order.status === '배송완료'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
