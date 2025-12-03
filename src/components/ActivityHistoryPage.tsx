import { ArrowLeft, TrendingUp, TrendingDown, Calendar, Star, ShoppingBag, MessageSquare, Camera, Award } from 'lucide-react';
import { useState } from 'react';

interface ActivityHistoryPageProps {
  onBack: () => void;
}

export function ActivityHistoryPage({ onBack }: ActivityHistoryPageProps) {
  const [filter, setFilter] = useState<'all' | 'earned' | 'spent'>('all');

  const activities = [
    {
      id: 1,
      date: '2025.12.02',
      time: '14:32',
      activity: '분리수거 OX 퀴즈 완료',
      points: 150,
      type: 'quiz',
      icon: '📝',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      id: 2,
      date: '2025.12.02',
      time: '11:15',
      activity: '커뮤니티 게시글 작성',
      points: 50,
      type: 'community',
      icon: '💬',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      id: 3,
      date: '2025.12.01',
      time: '18:45',
      activity: '쓰레기 인식 완료',
      points: 30,
      type: 'recognition',
      icon: '📸',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      id: 4,
      date: '2025.12.01',
      time: '16:20',
      activity: '카페 아메리카노 구매',
      points: -500,
      type: 'purchase',
      icon: '☕',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      id: 5,
      date: '2025.11.30',
      time: '20:10',
      activity: '오늘의 환경상식 퀴즈 완료',
      points: 100,
      type: 'quiz',
      icon: '📝',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      id: 6,
      date: '2025.11.30',
      time: '15:30',
      activity: '업적 달성: 퀴즈왕',
      points: 300,
      type: 'achievement',
      icon: '👑',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      id: 7,
      date: '2025.11.29',
      time: '19:25',
      activity: '환경 기부 참여',
      points: -1000,
      type: 'donation',
      icon: '💚',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      id: 8,
      date: '2025.11.29',
      time: '14:15',
      activity: '쓰레기 인식 완료',
      points: 30,
      type: 'recognition',
      icon: '📸',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      id: 9,
      date: '2025.11.28',
      time: '12:50',
      activity: '환경보호 퀴즈 완료',
      points: 150,
      type: 'quiz',
      icon: '📝',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      id: 10,
      date: '2025.11.28',
      time: '10:30',
      activity: '에코백 구매',
      points: -800,
      type: 'purchase',
      icon: '🛍️',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  const filteredActivities = activities.filter((activity) => {
    if (filter === 'earned') return activity.points > 0;
    if (filter === 'spent') return activity.points < 0;
    return true;
  });

  const totalEarned = activities.filter(a => a.points > 0).reduce((sum, a) => sum + a.points, 0);
  const totalSpent = Math.abs(activities.filter(a => a.points < 0).reduce((sum, a) => sum + a.points, 0));

  // Group activities by date
  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    const date = activity.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {} as { [key: string]: typeof activities });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-[430px] min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-10 flex-shrink-0">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={24} />
          </button>
          <h2>활동 내역</h2>
        </div>

        <div className="flex-1 p-4 space-y-4 pb-24 overflow-y-auto">
        {/* Summary Card */}
        <div className="bg-gradient-to-br from-purple-400 to-purple-600 text-white rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Calendar className="text-white" size={32} />
            </div>
            <div>
              <h3 className="mb-1">포인트 요약</h3>
              <p className="text-sm opacity-90">전체 활동 내역</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <p className="text-xs opacity-75 mb-1 flex items-center gap-1">
                <TrendingUp size={14} />
                획득
              </p>
              <p className="text-xl">+{totalEarned.toLocaleString()}P</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <p className="text-xs opacity-75 mb-1 flex items-center gap-1">
                <TrendingDown size={14} />
                사용
              </p>
              <p className="text-xl">-{totalSpent.toLocaleString()}P</p>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-2 rounded-xl transition-colors ${
              filter === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200'
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setFilter('earned')}
            className={`flex-1 py-2 rounded-xl transition-colors ${
              filter === 'earned'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200'
            }`}
          >
            획득
          </button>
          <button
            onClick={() => setFilter('spent')}
            className={`flex-1 py-2 rounded-xl transition-colors ${
              filter === 'spent'
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200'
            }`}
          >
            사용
          </button>
        </div>

        {/* Activity List */}
        <div className="space-y-4">
          {Object.keys(groupedActivities).map((date) => (
            <div key={date} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <p className="text-sm text-gray-600">{date}</p>
              </div>
              <div className="divide-y divide-gray-100">
                {groupedActivities[date].map((activity) => (
                  <div key={activity.id} className="p-4">
                    <div className="flex gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${activity.bgColor}`}
                      >
                        {activity.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex-1 min-w-0">
                            <h4 className="truncate">{activity.activity}</h4>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                          <div
                            className={`flex items-center gap-1 ml-2 ${
                              activity.points > 0 ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {activity.points > 0 ? (
                              <TrendingUp size={16} />
                            ) : (
                              <TrendingDown size={16} />
                            )}
                            <span className="whitespace-nowrap">
                              {activity.points > 0 ? '+' : ''}
                              {activity.points.toLocaleString()}P
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredActivities.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="text-gray-400" size={32} />
            </div>
            <h3 className="text-gray-600 mb-2">활동 내역이 없습니다</h3>
            <p className="text-sm text-gray-500">
              퀴즈를 풀거나 쓰레기를 인식하여 포인트를 획득해보세요!
            </p>
          </div>
        )}

        {/* Activity Type Legend */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="mb-4">활동 유형</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                📝
              </div>
              <span className="text-gray-700">퀴즈</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                📸
              </div>
              <span className="text-gray-700">쓰레기 인식</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                💬
              </div>
              <span className="text-gray-700">커뮤니티</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                👑
              </div>
              <span className="text-gray-700">업적</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                🛍️
              </div>
              <span className="text-gray-700">상점 구매</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                💚
              </div>
              <span className="text-gray-700">환경 기부</span>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
