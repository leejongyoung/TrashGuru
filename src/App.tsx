import { useState, useEffect, useRef } from 'react';
import { Home } from 'lucide-react';
import { HomePage } from './components/HomePage';
import { QuizPage } from './components/QuizPage';
import { QuizHistoryPage } from './components/QuizHistoryPage';
import { SearchPage } from './components/SearchPage';
import { CommunityPage } from './components/CommunityPage';
import { ShopPage } from './components/ShopPage';
import { ClassificationPage } from './components/ClassificationPage';
import { PickupPage } from './components/PickupPage';
import { BagsPage } from './components/BagsPage';
import { EventsPage } from './components/EventsPage';
import { NotificationPage } from './components/NotificationPage';
import { AnnouncementPage } from './components/AnnouncementPage';
import { RoleManagementPage } from './components/RoleManagementPage';
import { VolunteerPage } from './components/VolunteerPage';
import { initializeDailyNotifications, initializeSampleNotifications, getUnreadCount, notifyPointsEarned, notifyCommunityActivity } from './utils/notifications';
import { BottomNav } from './components/BottomNav';
import { AuthPage } from './components/AuthPage';
import { MyPage } from './components/MyPage';
import { AboutPage } from './components/AboutPage';
import { SettingsPage } from './components/SettingsPage';
import { AchievementsPage } from './components/AchievementsPage';
import { GoalsPage } from './components/GoalsPage';
import { ActivityHistoryPage } from './components/ActivityHistoryPage';
import { HelpPage } from './components/HelpPage';
import { LocationPage } from './components/LocationPage';
import { LocationRequestModal } from './components/LocationRequestModal';
import SplashScreen from './components/SplashScreen';
import { CameraCapture } from './components/CameraCapture';

// [중요] 여기에 'quizhistory'가 포함되어 있어야 TS2367 에러가 발생하지 않습니다.
export type AppPage = 'home' | 'quiz' | 'search' | 'community' | 'shop' | 'mypage' | 'about' | 'settings' | 'achievements' | 'goals' | 'activity' | 'help' | 'location' | 'classification' | 'pickup' | 'bags' | 'events' | 'myposts' | 'quizhistory' | 'announcements' | 'rolemanagement' | 'volunteer';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [userPoints, setUserPoints] = useState(1250);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<'ko' | 'en'>('ko');
  const [userLocation, setUserLocation] = useState('위치 설정');
  const [locationPermissionAsked, setLocationPermissionAsked] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string>('');
  const [userRole, setUserRole] = useState<'superadmin' | 'admin' | 'user'>('user');
  const [notificationCount, setNotificationCount] = useState(0);
  const [showLocationRequestModal, setShowLocationRequestModal] = useState(false);

  const [showCamera, setShowCamera] = useState(false);
  const [cameraMode, setCameraMode] = useState<'identification' | 'verification'>('identification');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Effect to hide splash screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Check login status and settings on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUsername(savedUser);
      setIsLoggedIn(true);
      
      const savedPhoto = localStorage.getItem(`profilePhoto_${savedUser}`);
      if (savedPhoto) {
        setProfilePhoto(savedPhoto);
      }

      const savedRoles = localStorage.getItem('userRoles');
      if (savedRoles) {
        const roles = JSON.parse(savedRoles);
        const userRoleObj = roles.find((r: any) => r.username === savedUser);
        if (userRoleObj) {
          setUserRole(userRoleObj.role);
        }
      }

      initializeSampleNotifications();
      initializeDailyNotifications();
      setNotificationCount(getUnreadCount());
    }
    
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
    
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage === 'en' || savedLanguage === 'ko') {
      setLanguage(savedLanguage);
    }

    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      setUserLocation(savedLocation);
    }

    const permissionAsked = localStorage.getItem('locationPermissionAsked');
    if (permissionAsked) {
      setLocationPermissionAsked(true);
    }

    const handleNotificationUpdate = () => {
      setNotificationCount(getUnreadCount());
    };
    window.addEventListener('notificationUpdate', handleNotificationUpdate);
    
    const handleProfilePhotoUpdate = () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const savedPhoto = localStorage.getItem(`profilePhoto_${savedUser}`);
        if (savedPhoto) {
          setProfilePhoto(savedPhoto);
        }
      }
    };
    window.addEventListener('profilePhotoUpdate', handleProfilePhotoUpdate);
    
    return () => {
      window.removeEventListener('notificationUpdate', handleNotificationUpdate);
      window.removeEventListener('profilePhotoUpdate', handleProfilePhotoUpdate);
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn && !locationPermissionAsked && userLocation === '위치 설정') {
      setShowLocationRequestModal(true);
    }
  }, [isLoggedIn, locationPermissionAsked, userLocation]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const checkDailyNotifications = () => {
      initializeDailyNotifications();
      setNotificationCount(getUnreadCount());
    };

    checkDailyNotifications();
    const interval = setInterval(checkDailyNotifications, 60000);

    return () => clearInterval(interval);
  }, [isLoggedIn]);

  const handleLocationConfirm = () => {
    setShowLocationRequestModal(false);
    requestLocationPermission();
  };

  const handleLocationCancel = () => {
    setShowLocationRequestModal(false);
    setLocationPermissionAsked(true);
    localStorage.setItem('locationPermissionAsked', 'true');
  };

  const requestLocationPermission = () => {
    if (!navigator.geolocation) {
      setLocationPermissionAsked(true);
      localStorage.setItem('locationPermissionAsked', 'true');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=${language}`
          );
          const data = await response.json();
          
          let locationName = '';
          if (data.address) {
            const addr = data.address;
            locationName = addr.city || addr.town || addr.county || addr.state || data.display_name;
            
            if (language === 'ko' && addr.city && addr.state) {
              locationName = `${addr.state} ${addr.city}`;
            }
          } else {
            locationName = data.display_name;
          }
          
          setUserLocation(locationName);
          localStorage.setItem('userLocation', locationName);
        } catch (error) {
          console.error('Geocoding error:', error);
        }
        
        setLocationPermissionAsked(true);
        localStorage.setItem('locationPermissionAsked', 'true');
      },
      (error) => {
        console.log('Location permission not granted or unavailable');
        setLocationPermissionAsked(true);
        localStorage.setItem('locationPermissionAsked', 'true');
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 300000
      }
    );
  };

  const handleLocationChange = (location: string) => {
    setUserLocation(location);
    localStorage.setItem('userLocation', location);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const changeLanguage = (lang: 'ko' | 'en') => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const handleLogin = (user: string) => {
    setUsername(user);
    setIsLoggedIn(true);
    localStorage.setItem('user', user);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    localStorage.removeItem('user');
    setCurrentPage('home');
  };

  const addPoints = (points: number, reason?: string) => {
    setUserPoints(prev => prev + points);
    if (reason) {
      notifyPointsEarned(points, reason);
    }
  };

  const deductPoints = (points: number, reason?: string) => {
    setUserPoints(prev => Math.max(0, prev - points));
    if (reason) {
      notifyPointsEarned(-points, reason); // Using notifyPointsEarned with negative value to show deduction
    }
  };

  const handleTakePhoto = () => {
    setCameraMode('identification');
    setSelectedImage(null);
    setShowCamera(true);
  };

  const handleOpenGallery = () => {
    setCameraMode('verification');
    setSelectedImage(null);
    setShowCamera(true);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setSelectedImage(imageData);
        setShowCamera(true);
      };
      reader.readAsDataURL(file);
    }
    // Reset value to allow selecting same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  if (!isLoggedIn) {
    return <AuthPage onLogin={handleLogin} />;
  }

  // Show sub-pages
  if (currentPage === 'about') {
    return <AboutPage onBack={() => setCurrentPage('mypage')} onNavigateToRoleManagement={() => setCurrentPage('rolemanagement')} />;
  }

  if (currentPage === 'settings') {
    return (
      <SettingsPage
        onBack={() => setCurrentPage('mypage')}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        language={language}
        onChangeLanguage={changeLanguage}
        onNavigateToHelp={() => setCurrentPage('help')}
        onLogout={handleLogout}
        username={username}
        onNavigateToAnnouncements={() => setCurrentPage('announcements')}
      />
    );
  }

  if (currentPage === 'achievements') {
    return <AchievementsPage onBack={() => setCurrentPage('mypage')} />;
  }

  if (currentPage === 'goals') {
    return <GoalsPage onBack={() => setCurrentPage('mypage')} />;
  }

  if (currentPage === 'activity') {
    return <ActivityHistoryPage onBack={() => setCurrentPage('mypage')} />;
  }

  if (currentPage === 'help') {
    return <HelpPage onBack={() => setCurrentPage('settings')} language={language} />;
  }

  if (currentPage === 'location') {
    return (
      <LocationPage
        onBack={() => setCurrentPage('home')}
        currentLocation={userLocation}
        onLocationChange={handleLocationChange}
        language={language}
      />
    );
  }

  if (currentPage === 'myposts') {
    return (
      <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-[430px] mx-auto min-h-screen bg-white dark:bg-gray-900">
          <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
            <button
              onClick={() => setCurrentPage('mypage')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600 dark:text-gray-300">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <h2 className="dark:text-white">내가 작성한 글</h2>
          </header>
          <main className="w-full">
            <CommunityPage defaultTab="my" onAddPoints={addPoints} onDeductPoints={deductPoints} userLocation={userLocation} userPoints={userPoints} />
          </main>
        </div>
      </div>
    );
  }

  // [확인] quizhistory는 여기서 별도 레이아웃으로 처리됩니다.
  const isQuizHistoryPage = currentPage === 'quizhistory'; // Temporary variable
  if (isQuizHistoryPage) {
    return (
      <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-[430px] mx-auto min-h-screen bg-white dark:bg-gray-900">
          <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
            <button
              onClick={() => setCurrentPage('quiz')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600 dark:text-gray-300">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <h2 className="dark:text-white">내가 푼 퀴즈</h2>
          </header>
          <main className="w-full">
            <QuizHistoryPage />
          </main>
        </div>
      </div>
    );
  }

  if (currentPage === 'announcements') {
    return (
      <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-[430px] mx-auto min-h-screen bg-white dark:bg-gray-900">
          <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
            <button
              onClick={() => setCurrentPage('settings')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600 dark:text-gray-300">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <h2 className="dark:text-white">공지사항</h2>
          </header>
          <main className="w-full">
            <AnnouncementPage currentUser={username} userRole={userRole} />
          </main>
        </div>
      </div>
    );
  }

  if (currentPage === 'rolemanagement') {
    return (
      <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-[430px] mx-auto min-h-screen bg-white dark:bg-gray-900">
          <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
            <button
              onClick={() => setCurrentPage('about')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600 dark:text-gray-300">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <h2 className="dark:text-white">권한 관리</h2>
          </header>
          <main className="w-full">
            <RoleManagementPage 
              currentUser={username} 
              currentUserRole={userRole} 
              onRoleChange={(role) => setUserRole(role)}
            />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-[430px] mx-auto h-screen bg-white dark:bg-gray-900 relative flex flex-col">
        {/* Camera Capture Modal */}
        {showCamera && (
          <CameraCapture 
            onClose={() => {
              setShowCamera(false);
              setSelectedImage(null);
            }} 
            initialImage={selectedImage}
            mode={cameraMode}
          />
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <LocationRequestModal
          isOpen={showLocationRequestModal}
          onConfirm={handleLocationConfirm}
          onCancel={handleLocationCancel}
        />
        {showNotifications && <NotificationPage onClose={() => setShowNotifications(false)} onNavigate={(page) => setCurrentPage(page as AppPage)} />}

        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between sticky top-0 z-10 w-full">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <button
              onClick={() => setCurrentPage('location')}
              className="flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors min-w-0"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600 flex-shrink-0">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="text-sm dark:text-white truncate">{userLocation}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400 flex-shrink-0">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {currentPage !== 'home' && (
              <button
                onClick={() => setCurrentPage('home')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Home size={22} className="text-gray-600 dark:text-gray-300" />
              </button>
            )}
            <button 
              onClick={() => setShowNotifications(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors relative"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600 dark:text-gray-300">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setCurrentPage('mypage')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600 dark:text-gray-300">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
          </div>
        </header>

        <main className="w-full flex-1 overflow-y-auto">
          {currentPage === 'home' && (
          <HomePage 
            userPoints={userPoints} 
            onAddPoints={addPoints}
            onNavigateToQuiz={() => setCurrentPage('quiz')}
            onNavigateToCommunity={() => setCurrentPage('community')}
            onNavigateToClassification={() => setCurrentPage('classification')}
            onNavigateToPickup={() => setCurrentPage('pickup')}
            onNavigateToBags={() => setCurrentPage('bags')}
            onNavigateToEvents={() => setCurrentPage('events')}
            onNavigateToSearch={() => handleTakePhoto()}
            username={username}
            profilePhoto={profilePhoto}
          />
        )}
        {currentPage === 'quiz' && <QuizPage onAddPoints={addPoints} onNavigateToHistory={() => setCurrentPage('quizhistory')} />}
        {currentPage === 'community' && <CommunityPage onAddPoints={addPoints} onDeductPoints={deductPoints} userLocation={userLocation} userPoints={userPoints} />}
        {currentPage === 'shop' && <ShopPage userPoints={userPoints} onPurchase={(cost) => setUserPoints(prev => prev - cost)} />}
        {currentPage === 'classification' && (
          <ClassificationPage 
            userLocation={userLocation} 
            onRequestLocation={() => setShowLocationRequestModal(true)}
          />
        )}
        {currentPage === 'pickup' && <PickupPage />}
        {currentPage === 'bags' && <BagsPage />}
        {currentPage === 'events' && <EventsPage />}
        {currentPage === 'volunteer' && <VolunteerPage />}
        {currentPage === 'mypage' && (
          <MyPage
            username={username}
            userPoints={userPoints}
            onLogout={handleLogout}
            onNavigateToAbout={() => setCurrentPage('about')}
            onNavigateToSettings={() => setCurrentPage('settings')}
            onNavigateToAchievements={() => setCurrentPage('achievements')}
            onNavigateToGoals={() => setCurrentPage('goals')}
            onNavigateToActivity={() => setCurrentPage('activity')}
            onNavigateToMyPosts={() => setCurrentPage('myposts')}
            onProfilePhotoChange={(photo) => setProfilePhoto(photo)}
            onNavigateToShop={() => setCurrentPage('shop')}
            onNavigateToQuizHistory={() => setCurrentPage('quizhistory')}
          />
        )}
        </main>

        {!showCamera && (
          <BottomNav 
            currentPage={currentPage} 
            onPageChange={(page) => setCurrentPage(page as AppPage)} 
            onTakePhoto={handleTakePhoto}
            onOpenGallery={handleOpenGallery}
          />
        )}
        
        {showNotifications && <NotificationPage onClose={() => setShowNotifications(false)} onNavigate={(page) => setCurrentPage(page as AppPage)} />}
      </div>
    </div>
  );
}

