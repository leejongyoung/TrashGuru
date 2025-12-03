import { User, Star, Trophy, MessageSquare, Settings, LogOut, ChevronRight, Award, Target, TrendingUp, Info, Edit3, Camera, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface MyPageProps {
  username: string;
  userPoints: number;
  onLogout: () => void;
  onNavigateToAbout: () => void;
  onNavigateToSettings: () => void;
  onNavigateToAchievements: () => void;
  onNavigateToGoals: () => void;
  onNavigateToActivity: () => void;
  onNavigateToMyPosts: () => void;
  onProfilePhotoChange: (photo: string) => void;
  onNavigateToShop: () => void;
  onNavigateToQuizHistory: () => void;
}

export function MyPage({ username, userPoints, onLogout, onNavigateToAbout, onNavigateToSettings, onNavigateToAchievements, onNavigateToGoals, onNavigateToActivity, onNavigateToMyPosts, onProfilePhotoChange, onNavigateToShop, onNavigateToQuizHistory }: MyPageProps) {
  // Get number of posts from localStorage
  const savedPosts = localStorage.getItem('communityPosts');
  const myPostsCount = savedPosts 
    ? JSON.parse(savedPosts).filter((post: any) => post.isMyPost).length 
    : 0;

  // Profile photo state
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string>('');

  // Load profile photo on mount
  useEffect(() => {
    const savedPhoto = localStorage.getItem(`profilePhoto_${username}`);
    if (savedPhoto) {
      setProfilePhoto(savedPhoto);
    }
  }, [username]);

  // Save profile photo
  const handlePhotoSelect = (photo: string) => {
    setProfilePhoto(photo);
    localStorage.setItem(`profilePhoto_${username}`, photo);
    onProfilePhotoChange(photo);
    setShowPhotoModal(false);
    
    // Dispatch event to update profile photo across components
    window.dispatchEvent(new Event('profilePhotoUpdate'));
  };

  // Avatar options
  const avatarOptions = [
    '👤', '👨', '👩', '🧑', '👨‍💼', '👩‍💼', '👨‍🎓', '👩‍🎓',
    '🧑‍💻', '👨‍🔬', '👩‍🔬', '👨‍🌾', '👩‍🌾', '👨‍🍳', '👩‍🍳', '🧑‍🎨',
    '🦸', '🦸‍♂️', '🦸‍♀️', '🧙', '🧙‍♂️', '🧙‍♀️', '🧚', '🧚‍♂️',
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
    '🌟', '⭐', '💫', '✨', '🔥', '💚', '♻️', '🌱'
  ];

  const stats = [
    { label: '획득 포인트', value: userPoints, icon: Star, color: 'text-yellow-600' },
    { label: '완료한 퀴즈', value: 45, icon: Trophy, color: 'text-green-600' },
    { label: '작성한 글', value: myPostsCount, icon: MessageSquare, color: 'text-blue-600' },
  ];

  const achievements = [
    { id: 1, name: '분리수거 초보', icon: '🌱', unlocked: true, date: '2025.11.01' },
    { id: 2, name: '환경지킴이', icon: '♻️', unlocked: true, date: '2025.11.15' },
    { id: 3, name: '퀴즈왕', icon: '👑', unlocked: true, date: '2025.11.28' },
    { id: 4, name: '분리수거 마스터', icon: '⭐', unlocked: false, date: null },
  ];

  const activities = [
    { date: '2025.12.02', activity: '분리수거 OX 퀴즈 완료', points: 150 },
    { date: '2025.12.01', activity: '커뮤니티 게시글 작성', points: 50 },
    { date: '2025.11.30', activity: '쓰레기 인식 완료', points: 30 },
    { date: '2025.11.29', activity: '카페 아메리카노 구매', points: -500 },
    { date: '2025.11.28', activity: '오늘의 환경상식 퀴즈 완료', points: 100 },
  ];

  const menuItems = [
    { icon: Settings, label: '설정', color: 'text-gray-600', action: onNavigateToSettings },
    { icon: Info, label: '앱 정보', color: 'text-purple-600', action: onNavigateToAbout },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Photo Selection Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-slideUp max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="dark:text-white">프로필 사진 선택</h3>
              <button onClick={() => setShowPhotoModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="grid grid-cols-6 gap-3">
              {avatarOptions.map((avatar, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePhotoSelect(avatar)}
                  className={`w-full aspect-square flex items-center justify-center text-3xl bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors ${
                    profilePhoto === avatar ? 'ring-2 ring-green-600 bg-green-100 dark:bg-green-900/30' : ''
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Profile Section */}
      <div className="bg-gradient-to-br from-green-400 to-green-600 text-white p-6 pb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30">
              {profilePhoto ? (
                <span className="text-4xl">{profilePhoto}</span>
              ) : (
                <User size={40} />
              )}
            </div>
            <button
              onClick={() => setShowPhotoModal(true)}
              className="absolute -bottom-1 -right-1 w-8 h-8 bg-white text-green-600 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
            >
              <Camera size={16} />
            </button>
          </div>
          <div>
            <h2 className="mb-1">{username}</h2>
            <p className="text-sm opacity-90">환경을 생각하는 시민</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={onNavigateToShop}
            className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center hover:bg-white/30 transition-colors"
          >
            <Star className="mx-auto mb-1" size={20} />
            <p className="mb-1">{userPoints.toLocaleString()}</p>
            <p className="text-xs opacity-80">획득 포인트</p>
          </button>
          <button
            onClick={onNavigateToQuizHistory}
            className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center hover:bg-white/30 transition-colors"
          >
            <Trophy className="mx-auto mb-1" size={20} />
            <p className="mb-1">45</p>
            <p className="text-xs opacity-80">완료한 퀴즈</p>
          </button>
          <button
            onClick={onNavigateToMyPosts}
            className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center hover:bg-white/30 transition-colors"
          >
            <MessageSquare className="mx-auto mb-1" size={20} />
            <p className="mb-1">{myPostsCount}</p>
            <p className="text-xs opacity-80">작성한 글</p>
          </button>
        </div>
      </div>

      {/* Points Card */}
      <div className="px-4 -mt-6 mb-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">보유 포인트</span>
            <Star className="text-yellow-500" size={20} fill="currentColor" />
          </div>
          <p className="text-3xl text-green-600 mb-1">{userPoints.toLocaleString()}P</p>
          <p className="text-sm text-gray-500">상점에서 사용 가능</p>
        </div>
      </div>

      {/* Achievements */}
      <div className="px-4 mb-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
          <button
            onClick={onNavigateToAchievements}
            className="w-full mb-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 p-2 -m-2 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-2">
              <Award className="text-yellow-600" size={20} />
              <h3 className="dark:text-white">획득한 업적</h3>
            </div>
            <ChevronRight className="text-gray-400" size={20} />
          </button>
          <div className="grid grid-cols-4 gap-3">
            {achievements.slice(0, 4).map((achievement) => (
              <div
                key={achievement.id}
                className={`flex flex-col items-center ${
                  achievement.unlocked ? 'opacity-100' : 'opacity-30'
                }`}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-1 ${
                  achievement.unlocked ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  {achievement.icon}
                </div>
                <p className="text-xs text-center text-gray-700 dark:text-gray-300">{achievement.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="px-4 mb-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
          <button
            onClick={onNavigateToActivity}
            className="w-full mb-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 p-2 -m-2 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="text-green-600" size={20} />
              <h3 className="dark:text-white">최근 활동</h3>
            </div>
            <ChevronRight className="text-gray-400" size={20} />
          </button>
          <h3 className="mb-4 flex items-center gap-2 hidden">
            <TrendingUp className="text-green-600" size={20} />
            최근 활동
          </h3>
          <div className="space-y-3">
            {activities.slice(0, 3).map((activity, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <div className="flex-1">
                  <p className="text-sm text-gray-800 dark:text-gray-200 mb-1">{activity.activity}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.date}</p>
                </div>
                <span className={`text-sm ${activity.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {activity.points > 0 ? '+' : ''}{activity.points}P
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={item.action || undefined}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <Icon className={item.color} size={20} />
                  <span className="text-gray-800">{item.label}</span>
                </div>
                <ChevronRight className="text-gray-400" size={20} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Logout Button */}
      <div className="px-4 pb-24">
        <button
          onClick={onLogout}
          className="w-full py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2 border border-red-200"
        >
          <LogOut size={20} />
          로그아웃
        </button>
      </div>
    </div>
  );
}