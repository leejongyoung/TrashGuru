import { ArrowLeft, Award, Lock, Star, Trophy, Target, Zap } from 'lucide-react';

interface AchievementsPageProps {
  onBack: () => void;
}

export function AchievementsPage({ onBack }: AchievementsPageProps) {
  const achievements = [
    {
      id: 1,
      name: '분리수거 초보',
      description: '첫 번째 쓰레기 인식 완료',
      icon: '🌱',
      unlocked: true,
      date: '2025.11.01',
      points: 100,
      category: 'beginner',
    },
    {
      id: 2,
      name: '환경지킴이',
      description: '쓰레기 10개 인식 성공',
      icon: '♻️',
      unlocked: true,
      date: '2025.11.15',
      points: 200,
      category: 'recognition',
    },
    {
      id: 3,
      name: '퀴즈왕',
      description: '퀴즈 10개 정답',
      icon: '👑',
      unlocked: true,
      date: '2025.11.28',
      points: 300,
      category: 'quiz',
    },
    {
      id: 4,
      name: '분리수거 마스터',
      description: '쓰레기 50개 인식 성공',
      icon: '⭐',
      unlocked: false,
      date: null,
      points: 500,
      category: 'recognition',
      progress: 32,
      total: 50,
    },
    {
      id: 5,
      name: '연속 출석왕',
      description: '7일 연속 접속',
      icon: '🔥',
      unlocked: false,
      date: null,
      points: 300,
      category: 'daily',
      progress: 4,
      total: 7,
    },
    {
      id: 6,
      name: '커뮤니티 활동가',
      description: '게시글 20개 작성',
      icon: '💬',
      unlocked: false,
      date: null,
      points: 400,
      category: 'community',
      progress: 12,
      total: 20,
    },
    {
      id: 7,
      name: '포인트 부자',
      description: '5,000 포인트 적립',
      icon: '💰',
      unlocked: false,
      date: null,
      points: 500,
      category: 'points',
      progress: 1250,
      total: 5000,
    },
    {
      id: 8,
      name: '환경 후원자',
      description: '환경 기부 첫 참여',
      icon: '💚',
      unlocked: false,
      date: null,
      points: 300,
      category: 'donation',
    },
    {
      id: 9,
      name: '퀴즈 전문가',
      description: '퀴즈 50개 정답',
      icon: '🎓',
      unlocked: false,
      date: null,
      points: 600,
      category: 'quiz',
      progress: 45,
      total: 50,
    },
    {
      id: 10,
      name: '완벽주의자',
      description: '모든 업적 달성',
      icon: '🏆',
      unlocked: false,
      date: null,
      points: 1000,
      category: 'special',
    },
  ];

  const stats = {
    total: achievements.length,
    unlocked: achievements.filter(a => a.unlocked).length,
    totalPoints: achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0),
  };

  const categories = [
    { id: 'all', name: '전체', icon: Award },
    { id: 'beginner', name: '입문', icon: Star },
    { id: 'recognition', name: '인식', icon: Target },
    { id: 'quiz', name: '퀴즈', icon: Trophy },
    { id: 'community', name: '커뮤니티', icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-[430px] min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-10 flex-shrink-0">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={24} />
          </button>
          <h2>내 업적</h2>
        </div>

        <div className="flex-1 p-4 space-y-4 pb-24 overflow-y-auto">
        {/* Stats Card */}
        <div className="bg-gradient-to-br from-green-400 to-green-600 text-white rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Trophy className="text-white" size={32} />
            </div>
            <div>
              <h3 className="mb-1">업적 현황</h3>
              <p className="text-sm opacity-90">{stats.unlocked}/{stats.total} 달성</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <p className="text-xs opacity-75 mb-1">달성률</p>
              <p className="text-xl">{Math.round((stats.unlocked / stats.total) * 100)}%</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <p className="text-xs opacity-75 mb-1">획득 포인트</p>
              <p className="text-xl">{stats.totalPoints.toLocaleString()}P</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">전체 진행도</span>
            <span className="text-sm">{stats.unlocked}/{stats.total}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all"
              style={{ width: `${(stats.unlocked / stats.total) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Achievements List */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="flex items-center gap-2">
              <Award className="text-green-600" size={20} />
              업적 목록
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 ${achievement.unlocked ? 'bg-white' : 'bg-gray-50'}`}
              >
                <div className="flex gap-4">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 ${
                      achievement.unlocked
                        ? 'bg-green-100'
                        : 'bg-gray-200 opacity-50'
                    }`}
                  >
                    {achievement.unlocked ? achievement.icon : '🔒'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className={achievement.unlocked ? 'text-gray-900' : 'text-gray-500'}>
                        {achievement.name}
                      </h4>
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Star size={14} fill="currentColor" />
                        <span className="text-xs">+{achievement.points}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                    
                    {achievement.unlocked ? (
                      <div className="flex items-center gap-2 text-xs text-green-600">
                        <Award size={14} />
                        <span>달성: {achievement.date}</span>
                      </div>
                    ) : achievement.progress !== undefined ? (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500">
                            {achievement.progress}/{achievement.total}
                          </span>
                          <span className="text-xs text-gray-500">
                            {Math.round((achievement.progress / achievement.total) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full"
                            style={{
                              width: `${(achievement.progress / achievement.total) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Lock size={14} />
                        <span>미달성</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
