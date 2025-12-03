import { Gift, Calendar, MapPin, Users, Trophy } from 'lucide-react';

export function EventsPage() {
  const ongoingEvents = [
    {
      id: 1,
      title: '12월 분리수거 챌린지',
      description: '한 달 동안 매일 분리수거를 실천하고 포인트 받기!',
      icon: '🏆',
      color: 'from-yellow-400 to-orange-500',
      reward: '1000P',
      endDate: '2025.12.31',
      participants: 1247,
    },
    {
      id: 2,
      title: '환경 캠페인 참여',
      description: '지역 환경 정화 활동에 참여하고 특별 보상 받기',
      icon: '🌱',
      color: 'from-green-400 to-green-600',
      reward: '2000P',
      endDate: '2025.12.20',
      participants: 523,
    },
    {
      id: 3,
      title: '친구 초대 이벤트',
      description: '친구를 초대하고 함께 포인트 받기',
      icon: '👥',
      color: 'from-blue-400 to-blue-600',
      reward: '500P',
      endDate: '2025.12.25',
      participants: 892,
    },
  ];

  const upcomingEvents = [
    {
      id: 4,
      title: '새해 특별 이벤트',
      description: '2026년 새해를 맞이하여 특별 보상 지급',
      startDate: '2026.01.01',
    },
    {
      id: 5,
      title: '겨울 환경 세미나',
      description: '전문가와 함께하는 환경 보호 특강',
      startDate: '2025.12.28',
    },
  ];

  const completedEvents = [
    {
      id: 6,
      title: '11월 환경의 날',
      description: '환경의 날 기념 특별 포인트 지급',
      completedDate: '2025.11.15',
      reward: '1500P',
    },
  ];

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Header Info */}
      <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl p-6 text-white">
        <h2 className="mb-2">이벤트</h2>
        <p className="text-sm opacity-90">다양한 이벤트에 참여하고 보상을 받으세요</p>
      </div>

      {/* Ongoing Events */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="text-orange-600" size={20} />
          <h3 className="dark:text-white">진행중인 이벤트</h3>
        </div>
        <div className="space-y-4">
          {ongoingEvents.map((event) => (
            <div key={event.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className={`bg-gradient-to-r ${event.color} p-4 text-white`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{event.icon}</div>
                    <div>
                      <h4 className="mb-1">{event.title}</h4>
                      <p className="text-sm opacity-90">{event.description}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Gift size={16} />
                    <span>보상: {event.reward}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar size={16} />
                    <span>{event.endDate}까지</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Users size={16} />
                    <span>{event.participants.toLocaleString()}명 참여중</span>
                  </div>
                  <button className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-sm hover:opacity-90 transition-opacity">
                    참여하기
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="text-blue-600" size={20} />
          <h3 className="dark:text-white">예정된 이벤트</h3>
        </div>
        <div className="space-y-3">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="dark:text-white mb-1">{event.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{event.description}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                    <Calendar size={14} />
                    <span>{event.startDate} 시작</span>
                  </div>
                </div>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full whitespace-nowrap">
                  곧 시작
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Events */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="text-gray-600" size={20} />
          <h3 className="dark:text-white">완료된 이벤트</h3>
        </div>
        <div className="space-y-3">
          {completedEvents.map((event) => (
            <div key={event.id} className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 opacity-60">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="dark:text-white mb-1">{event.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{event.description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                    <span>{event.completedDate} 종료</span>
                    <span>•</span>
                    <span>획득: {event.reward}</span>
                  </div>
                </div>
                <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                  종료
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
