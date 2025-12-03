import { Calendar, Clock, MapPin, Plus, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export function PickupPage() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [address, setAddress] = useState('');
  const [items, setItems] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const itemOptions = ['대형가전', '가구', '폐기물', '재활용품', '기타'];
  const timeSlots = ['09:00-11:00', '11:00-13:00', '13:00-15:00', '15:00-17:00'];

  const upcomingPickups = [
    { id: 1, date: '2025.12.05', time: '09:00-11:00', items: '대형가전, 가구', status: '예약완료' },
    { id: 2, date: '2025.12.10', time: '13:00-15:00', items: '재활용품', status: '수거중' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate && selectedTime && address && items.length > 0) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setSelectedDate('');
        setSelectedTime('');
        setAddress('');
        setItems([]);
      }, 2000);
    }
  };

  const toggleItem = (item: string) => {
    setItems(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-slideUp flex items-center gap-2">
          <CheckCircle size={20} />
          <span>수거 예약이 완료되었습니다!</span>
        </div>
      )}

      {/* Header Info */}
      <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-6 text-white">
        <h2 className="mb-2">수거예약</h2>
        <p className="text-sm opacity-90">대형폐기물 및 재활용품 수거 신청</p>
      </div>

      {/* Reservation Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 space-y-4">
        <h3 className="flex items-center gap-2 dark:text-white mb-4">
          <Plus className="text-blue-600" size={20} />
          <span>새 예약</span>
        </h3>

        {/* Date Selection */}
        <div>
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 mb-2">
            <Calendar size={16} className="text-blue-600" />
            수거 날짜
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-blue-500 dark:text-white"
            required
          />
        </div>

        {/* Time Selection */}
        <div>
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 mb-2">
            <Clock size={16} className="text-blue-600" />
            수거 시간
          </label>
          <div className="grid grid-cols-2 gap-2">
            {timeSlots.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => setSelectedTime(time)}
                className={`py-3 rounded-xl border text-sm transition-colors ${
                  selectedTime === time
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-500'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 mb-2">
            <MapPin size={16} className="text-blue-600" />
            수거 주소
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="상세 주소를 입력하세요"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-blue-500 dark:text-white"
            required
          />
        </div>

        {/* Item Selection */}
        <div>
          <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">
            수거 품목 선택
          </label>
          <div className="flex flex-wrap gap-2">
            {itemOptions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => toggleItem(item)}
                className={`px-4 py-2 rounded-xl text-sm transition-colors ${
                  items.includes(item)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          예약하기
        </button>
      </form>

      {/* Upcoming Pickups */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
        <h3 className="dark:text-white mb-4">예약 현황</h3>
        <div className="space-y-3">
          {upcomingPickups.map((pickup) => (
            <div key={pickup.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm dark:text-white mb-1">{pickup.date} {pickup.time}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{pickup.items}</p>
                </div>
                <span className={`px-3 py-1 text-xs rounded-full ${
                  pickup.status === '예약완료' 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                }`}>
                  {pickup.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
