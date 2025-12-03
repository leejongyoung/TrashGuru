import { HandHeart, Calendar, Clock, MapPin, Search, CheckCircle, Award, Users, Star } from 'lucide-react';
import { useState } from 'react';

export function VolunteerPage() {
  const [activeTab, setActiveTab] = useState('find'); // 'find' or 'my'
  const [showSuccess, setShowSuccess] = useState(false);

  const upcomingEvents = [
    {
      id: 1,
      title: '우리 동네 클린업',
      date: '2025.12.15',
      time: '14:00-16:00',
      location: '해변공원',
      points: 200,
      organizer: '환경보호 시민연대',
    },
    {
      id: 2,
      title: '재활용 교육 캠페인',
      date: '2025.12.20',
      time: '10:00-12:00',
      location: '중앙 도서관',
      points: 150,
      organizer: '초록지구',
    },
  ];

  const myActivities = [
    {
      id: 1,
      title: '공원 플로깅 이벤트',
      date: '2025.11.28',
      status: '참여완료',
      points: 120,
    },
    {
      id: 2,
      title: '어르신 분리배출 돕기',
      date: '2025.11.15',
      status: '참여완료',
      points: 100,
    },
  ];

  const handleApply = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      {showSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-slideUp flex items-center gap-2">
          <CheckCircle size={20} />
          <span>봉사활동 신청이 완료되었습니다!</span>
        </div>
      )}

      <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-6 text-white">
        <h2 className="mb-2">봉사활동</h2>
        <p className="text-sm opacity-90">지역 사회에 기여하고 포인트를 얻으세요!</p>
      </div>
      
      <div className="flex justify-center bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('find')}
          className={`w-full py-2.5 text-sm rounded-lg transition-colors ${
            activeTab === 'find' ? 'bg-white dark:bg-gray-700 shadow text-green-600' : 'text-gray-500'
          }`}
        >
          봉사활동 찾기
        </button>
        <button
          onClick={() => setActiveTab('my')}
          className={`w-full py-2.5 text-sm rounded-lg transition-colors ${
            activeTab === 'my' ? 'bg-white dark:bg-gray-700 shadow text-green-600' : 'text-gray-500'
          }`}
        >
          나의 봉사활동
        </button>
      </div>

      {activeTab === 'find' && (
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="'지역' 또는 '활동'으로 검색"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-green-500 dark:text-white"
            />
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {upcomingEvents.map((event) => (
            <div key={event.id} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 space-y-3">
              <h3 className="dark:text-white font-semibold">{event.title}</h3>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1.5">
                <p className="flex items-center gap-2"><Calendar size={14} /> {event.date} {event.time}</p>
                <p className="flex items-center gap-2"><MapPin size={14} /> {event.location}</p>
                <p className="flex items-center gap-2"><Users size={14} /> 주최: {event.organizer}</p>
              </div>
              <div className="flex justify-between items-center pt-3">
                <div className="flex items-center gap-1.5 text-green-600">
                    <Award size={18} />
                    <span className="font-semibold">{event.points}P</span>
                </div>
                <button onClick={handleApply} className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  신청하기
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'my' && (
        <div className="space-y-4">
          {myActivities.map((activity) => (
            <div key={activity.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div>
                    <h4 className="dark:text-white">{activity.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{activity.date}</p>
                </div>
                <div className="text-right">
                    <span className="px-3 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">{activity.status}</span>
                    <p className="text-green-600 font-semibold mt-1.5">{activity.points}P 적립</p>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
