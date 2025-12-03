import { Trophy, Leaf, Star, TrendingUp, Settings, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

interface HomePageProps {
  userPoints: number;
  onAddPoints: (points: number) => void;
  onNavigateToQuiz: () => void;
  onNavigateToCommunity: () => void;
  onNavigateToClassification: () => void;
  onNavigateToPickup: () => void;
  onNavigateToBags: () => void;
  onNavigateToEvents: () => void;
  onNavigateToSearch: () => void;
  username: string;
  profilePhoto?: string;
}

interface Mission {
  id: string;
  title: string;
  description: string;
  points: number;
  progress: number;
  total: number;
  completed: boolean;
}

export function HomePage({ 
  userPoints, 
  onAddPoints,
  onNavigateToQuiz, 
  onNavigateToCommunity,
  onNavigateToClassification,
  onNavigateToPickup,
  onNavigateToBags,
  onNavigateToEvents,
  onNavigateToSearch,
  username,
  profilePhoto
}: HomePageProps) {
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [tempGoal, setTempGoal] = useState(10000);
  const [currentMissionTab, setCurrentMissionTab] = useState<'daily' | 'weekly' | 'special'>('daily');
  const [missions, setMissions] = useState<Mission[]>([]);
  const [localProfilePhoto, setLocalProfilePhoto] = useState<string>('');
  const [joinDays, setJoinDays] = useState(1);
  const [welcomeMessage, setWelcomeMessage] = useState('');

  // Get daily goals from localStorage
  const savedGoals = localStorage.getItem('userGoals');
  const goals = savedGoals ? JSON.parse(savedGoals) : { dailySteps: 10000, weeklyRecycling: 7 };
  
  // Get steps from localStorage (simulate steps tracking)
  const savedSteps = localStorage.getItem('todaySteps');
  const todaySteps = savedSteps ? parseInt(savedSteps) : Math.floor(Math.random() * 8000) + 3000;
  
  // Save steps if not saved
  if (!savedSteps) {
    localStorage.setItem('todaySteps', todaySteps.toString());
  }

  // Initialize missions
  const initializeMissions = () => {
    const savedMissions = localStorage.getItem('userMissions');
    let missionsToSet: Mission[] = [];
    
    if (savedMissions) {
      try {
        const parsedMissions = JSON.parse(savedMissions);
        if (Array.isArray(parsedMissions) && parsedMissions.length > 0) {
          missionsToSet = parsedMissions.map((mission: Mission) => {
            if (mission.id === 'special-3') {
              const hasProfile = !!localProfilePhoto;
              return {
                ...mission,
                progress: hasProfile ? 1 : 0,
                completed: hasProfile
              };
            }
            return mission;
          });
        } else {
          missionsToSet = createDefaultMissions();
        }
      } catch (error) {
        console.error('Error parsing missions:', error);
        missionsToSet = createDefaultMissions();
      }
    } else {
      missionsToSet = createDefaultMissions();
    }
    
    setMissions(missionsToSet);
    localStorage.setItem('userMissions', JSON.stringify(missionsToSet));
  };

  // Create default missions
  const createDefaultMissions = (): Mission[] => {
    return [
      // Daily missions
      { id: 'daily-1', title: '퀴즈 풀기', description: '오늘의 퀴즈 3개 완료하기', points: 100, progress: 0, total: 3, completed: false },
      { id: 'daily-2', title: '분리수거 인증', description: '카메라로 쓰레기 1회 인식하기', points: 50, progress: 0, total: 1, completed: false },
      { id: 'daily-3', title: '커뮤니티 활동', description: '게시글에 좋아요 3개 누르기', points: 30, progress: 0, total: 3, completed: false },
      // Weekly missions
      { id: 'weekly-1', title: '주간 퀴즈 달인', description: '이번 주 퀴즈 10개 완료하기', points: 500, progress: 0, total: 10, completed: false },
      { id: 'weekly-2', title: '분리수거 마스터', description: '이번 주 분리수거 5회 인증하기', points: 300, progress: 0, total: 5, completed: false },
      { id: 'weekly-3', title: '글쓰기 챌린지', description: '커뮤니티에 글 3개 작성하기', points: 200, progress: 0, total: 3, completed: false },
      // Special missions
      { id: 'special-1', title: '🎉 신규 가입 보너스', description: '회원가입 완료하기', points: 1000, progress: 1, total: 1, completed: true },
      { id: 'special-2', title: '⚡ 첫 퀴즈 완료', description: '첫 퀴즈 도전하기', points: 200, progress: 0, total: 1, completed: false },
      { id: 'special-3', title: '🌟 프로필 완성', description: '프로필 사진 설정하기', points: 150, progress: localProfilePhoto ? 1 : 0, total: 1, completed: !!localProfilePhoto },
    ];
  };

  // Calculate join days and set welcome message
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      // Get join date
      let joinDate = localStorage.getItem(`joinDate_${savedUser}`);
      if (!joinDate) {
        // If no join date exists, set it to today
        joinDate = new Date().toISOString();
        localStorage.setItem(`joinDate_${savedUser}`, joinDate);
      }
      
      // Calculate days since joining (starting from 1)
      const join = new Date(joinDate);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - join.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setJoinDays(diffDays);
      
      // Set random welcome message
      const messages = [
        '함께 지구를 지켜요! 🌍',
        '오늘도 환경을 생각해요! 🌱',
        '분리수거 영웅! 💚',
        '작은 실천, 큰 변화! ♻️',
        '지구를 위한 한 걸음! 🌿',
        '환경 지킴이! 🌏',
        '녹색 실천가! 🍃',
        '에코 워리어! 🌾'
      ];
      setWelcomeMessage(messages[Math.floor(Math.random() * messages.length)]);
      
      // Load profile photo
      const savedPhoto = localStorage.getItem(`profilePhoto_${savedUser}`);
      if (savedPhoto) {
        setLocalProfilePhoto(savedPhoto);
      }
    }
    
    // Listen for profile photo updates
    const handleProfilePhotoUpdate = () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const savedPhoto = localStorage.getItem(`profilePhoto_${savedUser}`);
        if (savedPhoto) {
          setLocalProfilePhoto(savedPhoto);
        }
      }
    };
    
    window.addEventListener('profilePhotoUpdate', handleProfilePhotoUpdate);
    return () => window.removeEventListener('profilePhotoUpdate', handleProfilePhotoUpdate);
  }, []);

  // Load missions on mount
  useEffect(() => {
    initializeMissions();
  }, []);

  // Update missions when profile photo changes
  useEffect(() => {
    if (missions.length > 0) {
      const updatedMissions = missions.map((mission) => {
        if (mission.id === 'special-3') {
          const hasProfile = !!localProfilePhoto;
          const wasCompleted = mission.completed;
          
          // Award points if mission just completed
          if (!wasCompleted && hasProfile) {
            onAddPoints(150);
          }
          
          return {
            ...mission,
            progress: hasProfile ? 1 : 0,
            completed: hasProfile
          };
        }
        return mission;
      });
      
      setMissions(updatedMissions);
      localStorage.setItem('userMissions', JSON.stringify(updatedMissions));
    }
  }, [localProfilePhoto]);

  const handleSaveGoal = () => {
    const newGoals = { ...goals, dailySteps: tempGoal };
    localStorage.setItem('userGoals', JSON.stringify(newGoals));
    setShowGoalModal(false);
    window.location.reload();
  };

  const openGoalModal = () => {
    setTempGoal(goals.dailySteps);
    setShowGoalModal(true);
  };
  
  const todayQuizzes = [
    { id: 1, title: '오늘의 환경상식', status: '완료', points: 100 },
    { id: 2, title: '분리수거 OX 퀴즈', status: '미완료', points: 150 },
  ];

  const popularPosts = [
    { id: 1, title: '헷갈리는 분리수거 모음', author: 'N', date: '2025.11.14 08:30', likes: 128 },
    { id: 2, title: '플라스틱 분리배출 꿀팁!', author: 'K', date: '2025.11.13 18:00', likes: 95 },
    { id: 3, title: '일회용 마스크 버리는 법', author: 'M', date: '2025.11.14 07:30', likes: 87 },
  ];

  const handleQuizClick = (quiz: typeof todayQuizzes[0]) => {
    if (quiz.status === '미완료') {
      onNavigateToQuiz();
    }
  };

  const handleMissionAction = (missionId: string) => {
    if (missionId === 'daily-1' || missionId === 'weekly-1' || missionId === 'special-2') {
      onNavigateToQuiz();
    } else if (missionId === 'daily-2' || missionId === 'weekly-2') {
      onNavigateToSearch();
    } else if (missionId === 'daily-3' || missionId === 'weekly-3') {
      onNavigateToCommunity();
    }
  };

  const stepsPercentage = Math.min((todaySteps / goals.dailySteps) * 100, 100);

  const getDailyMissions = () => missions.filter(m => m.id.startsWith('daily-'));
  const getWeeklyMissions = () => missions.filter(m => m.id.startsWith('weekly-'));
  const getSpecialMissions = () => missions.filter(m => m.id.startsWith('special-'));
  
  const calculateCompletionRate = (missionList: Mission[]) => {
    if (missionList.length === 0) return 0;
    return (missionList.filter(m => m.completed).length / missionList.length) * 100;
  };

  const getCurrentMissions = () => {
    switch (currentMissionTab) {
      case 'daily': return getDailyMissions();
      case 'weekly': return getWeeklyMissions();
      case 'special': return getSpecialMissions();
      default: return [];
    }
  };

  return (
    <div className="p-5 space-y-5 pb-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen">
      {/* Goal Setting Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-slideUp">
            <h3 className="dark:text-white mb-4">일일 걸음 목표 설정</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">
                  목표 걸음 수
                </label>
                <input
                  type="number"
                  value={tempGoal}
                  onChange={(e) => setTempGoal(parseInt(e.target.value) || 0)}
                  step="1000"
                  min="1000"
                  max="50000"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-green-500 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  권장: 하루 10,000걸음
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowGoalModal(false)}
                  className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleSaveGoal}
                  className="flex-1 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Section */}
      <section className="bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 rounded-3xl p-6 text-white shadow-lg shadow-green-500/30">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="mb-1.5 text-xl">{username}님</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm opacity-90">D+{joinDays}</span>
              <span className="text-sm opacity-75">•</span>
              <span className="text-sm opacity-90">{welcomeMessage}</span>
            </div>
          </div>
          <div className="bg-white/20 rounded-2xl px-4 py-2.5 backdrop-blur-md border border-white/30 shadow-lg">
            <div className="flex items-center gap-1.5">
              <Star className="text-yellow-300 drop-shadow-sm" size={18} fill="currentColor" />
              <span className="text-lg">{userPoints.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Card */}
      <section className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-green-600" size={20} />
            </div>
            <h3 className="dark:text-white">오늘의 걸음</h3>
          </div>
          <button
            onClick={openGoalModal}
            className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-xl transition-colors"
          >
            <span>{todaySteps.toLocaleString()}</span>
            <span className="opacity-60">/</span>
            <span>{goals.dailySteps.toLocaleString()}</span>
            <Settings size={14} className="opacity-70" />
          </button>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${stepsPercentage}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 flex items-center gap-1.5">
          <Sparkles size={14} />
          <span>목표 달성률 {Math.round(stepsPercentage)}%</span>
        </p>
      </section>

      {/* Mission Achievement Rate Card */}
      <section className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
              <Trophy className="text-yellow-600" size={20} />
            </div>
            <h3 className="dark:text-white">미션 달성률</h3>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-xl">
            {missions.filter(m => m.completed).length}/{missions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-yellow-500 to-orange-500 h-full rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${calculateCompletionRate(missions)}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 flex items-center gap-1.5">
          <Sparkles size={14} />
          <span>목표 달성률 {Math.round(calculateCompletionRate(missions))}%</span>
        </p>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-4 gap-3">
        <button
          onClick={onNavigateToClassification}
          className="flex flex-col items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-gray-700 hover:scale-105"
        >
          <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-2xl flex items-center justify-center shadow-sm">
            <span className="text-2xl">📚</span>
          </div>
          <span className="text-xs text-gray-700 dark:text-gray-300" style={{ fontWeight: 500 }}>분류정보</span>
        </button>
        <button
          onClick={onNavigateToPickup}
          className="flex flex-col items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-gray-700 hover:scale-105"
        >
          <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl flex items-center justify-center shadow-sm">
            <span className="text-2xl">🚚</span>
          </div>
          <span className="text-xs text-gray-700 dark:text-gray-300" style={{ fontWeight: 500 }}>수거예약</span>
        </button>
        <button
          onClick={onNavigateToBags}
          className="flex flex-col items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-gray-700 hover:scale-105"
        >
          <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-2xl flex items-center justify-center shadow-sm">
            <span className="text-2xl">🛍️</span>
          </div>
          <span className="text-xs text-gray-700 dark:text-gray-300" style={{ fontWeight: 500 }}>봉투받기</span>
        </button>
        <button
          onClick={onNavigateToEvents}
          className="flex flex-col items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-gray-700 hover:scale-105"
        >
          <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 rounded-2xl flex items-center justify-center shadow-sm">
            <span className="text-2xl">🎉</span>
          </div>
          <span className="text-xs text-gray-700 dark:text-gray-300" style={{ fontWeight: 500 }}>이벤트</span>
        </button>
      </section>

      {/* Mission List */}
      <section className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
            <Trophy className="text-purple-600" size={20} />
          </div>
          <h3 className="dark:text-white">미션 목록</h3>
        </div>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setCurrentMissionTab('daily')}
            className={`flex-1 py-2.5 rounded-xl text-sm transition-all duration-200 ${
              currentMissionTab === 'daily' 
                ? 'bg-green-600 text-white shadow-md' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            style={{ fontWeight: 600 }}
          >
            일일
          </button>
          <button
            onClick={() => setCurrentMissionTab('weekly')}
            className={`flex-1 py-2.5 rounded-xl text-sm transition-all duration-200 ${
              currentMissionTab === 'weekly' 
                ? 'bg-green-600 text-white shadow-md' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            style={{ fontWeight: 600 }}
          >
            주간
          </button>
          <button
            onClick={() => setCurrentMissionTab('special')}
            className={`flex-1 py-2.5 rounded-xl text-sm transition-all duration-200 ${
              currentMissionTab === 'special' 
                ? 'bg-green-600 text-white shadow-md' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            style={{ fontWeight: 600 }}
          >
            반짝
          </button>
        </div>
        <div className="space-y-2">
          {getCurrentMissions().length > 0 ? (
            getCurrentMissions().map(mission => (
              <button
                key={mission.id}
                onClick={() => handleMissionAction(mission.id)}
                className="w-full bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 border border-gray-100 dark:border-gray-600"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    {mission.completed ? (
                      <CheckCircle2 className="text-green-500 flex-shrink-0" size={20} />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-500 flex-shrink-0" />
                    )}
                    <div className="text-left flex-1">
                      <p className="text-sm dark:text-white" style={{ fontWeight: 600 }}>{mission.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{mission.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1.5 rounded-xl" style={{ fontWeight: 600 }}>
                      +{mission.points}P
                    </span>
                    {!mission.completed && (
                      <ArrowRight className="text-gray-400 dark:text-gray-500 flex-shrink-0" size={18} />
                    )}
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
              미션 로딩 중...
            </div>
          )}
        </div>
      </section>

      {/* Today's Quiz */}
      <section className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-5">
          <h3 className="flex items-center gap-2.5 dark:text-white">
            <div className="w-9 h-9 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <Trophy className="text-green-600" size={18} />
            </div>
            <span>오늘의 퀴즈</span>
          </h3>
          <button 
            onClick={onNavigateToQuiz}
            className="text-sm text-green-600 dark:text-green-400 hover:gap-2 flex items-center gap-1 transition-all"
          >
            더보기
            <ArrowRight size={14} />
          </button>
        </div>
        <div className="space-y-3">
          {todayQuizzes.map((quiz) => (
            <button
              key={quiz.id}
              onClick={() => handleQuizClick(quiz)}
              disabled={quiz.status === '완료'}
              className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${quiz.status === '완료' ? 'bg-gray-400' : 'bg-green-500 shadow-sm shadow-green-500/50'}`} />
                <div className="text-left">
                  <p className="text-sm dark:text-white" style={{ fontWeight: 500 }}>{quiz.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{quiz.status === '완료' ? '완료됨' : `+${quiz.points}P`}</p>
                </div>
              </div>
              {quiz.status === '미완료' && (
                <span className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-4 py-2 rounded-xl" style={{ fontWeight: 600 }}>시작하기</span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Popular Community Posts */}
      <section className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-5">
          <h3 className="flex items-center gap-2.5 dark:text-white">
            <div className="w-9 h-9 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <Leaf className="text-green-600" size={18} />
            </div>
            <span>지금 인기있는 글</span>
          </h3>
          <button 
            onClick={onNavigateToCommunity}
            className="text-sm text-green-600 dark:text-green-400 hover:gap-2 flex items-center gap-1 transition-all"
          >
            더보기
            <ArrowRight size={14} />
          </button>
        </div>
        <div className="space-y-2">
          {popularPosts.map((post) => (
            <button
              key={post.id}
              onClick={onNavigateToCommunity}
              className="w-full flex items-start justify-between py-3 px-3 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-all"
            >
              <div className="flex-1 text-left">
                <p className="text-sm mb-1.5 dark:text-white" style={{ fontWeight: 500 }}>{post.title}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>{post.author}</span>
                  <span>•</span>
                  <span>{post.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 ml-3">
                <span>❤️</span>
                <span>{post.likes}</span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
