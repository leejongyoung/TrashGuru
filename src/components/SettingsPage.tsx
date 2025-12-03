import { ArrowLeft, Bell, Moon, Globe, Lock, Trash2, Shield, HelpCircle, ChevronRight, AlertTriangle, Check, Megaphone } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SettingsPageProps {
  onBack: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  language: 'ko' | 'en';
  onChangeLanguage: (lang: 'ko' | 'en') => void;
  onNavigateToHelp: () => void;
  onLogout: () => void;
  username: string;
  onNavigateToAnnouncements: () => void;
}

export function SettingsPage({ 
  onBack, 
  darkMode, 
  onToggleDarkMode, 
  language, 
  onChangeLanguage,
  onNavigateToHelp,
  onLogout,
  username,
  onNavigateToAnnouncements
}: SettingsPageProps) {
  const [settings, setSettings] = useState({
    notifications: true,
    quizReminder: true,
    communityUpdates: false,
    soundEffects: true,
    vibration: true,
  });

  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('appSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const toggleSetting = (key: string) => {
    const newSettings = { ...settings, [key]: !settings[key as keyof typeof settings] };
    setSettings(newSettings);
    localStorage.setItem('appSettings', JSON.stringify(newSettings));
  };

  const handlePasswordChange = () => {
    setPasswordError('');
    setPasswordSuccess(false);

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError(language === 'ko' ? '모든 필드를 입력해주세요.' : 'Please fill in all fields.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError(language === 'ko' ? '새 비밀번호가 일치하지 않습니다.' : 'New passwords do not match.');
      return;
    }

    if (passwordForm.newPassword.length < 4) {
      setPasswordError(language === 'ko' ? '비밀번호는 최소 4자 이상이어야 합니다.' : 'Password must be at least 4 characters.');
      return;
    }

    // Check current password
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: any) => u.username === username);

    if (userIndex === -1) {
      // Admin account
      if (username === 'admin' && passwordForm.currentPassword !== 'admin') {
        setPasswordError(language === 'ko' ? '현재 비밀번호가 올바르지 않습니다.' : 'Current password is incorrect.');
        return;
      }
    } else {
      if (users[userIndex].password !== passwordForm.currentPassword) {
        setPasswordError(language === 'ko' ? '현재 비밀번호가 올바르지 않습니다.' : 'Current password is incorrect.');
        return;
      }
      
      // Update password
      users[userIndex].password = passwordForm.newPassword;
      localStorage.setItem('users', JSON.stringify(users));
    }

    setPasswordSuccess(true);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    
    setTimeout(() => {
      setShowPasswordModal(false);
      setPasswordSuccess(false);
    }, 2000);
  };

  const handleDeleteAccount = () => {
    const confirmText = language === 'ko' ? '삭제' : 'DELETE';
    
    if (deleteConfirmText !== confirmText) {
      return;
    }

    // Remove user from users list
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const filteredUsers = users.filter((u: any) => u.username !== username);
    localStorage.setItem('users', JSON.stringify(filteredUsers));

    // Clear all user data
    localStorage.removeItem('user');
    localStorage.removeItem('appSettings');

    // Logout
    setShowDeleteModal(false);
    alert(language === 'ko' ? '계정이 삭제되었습니다.' : 'Account has been deleted.');
    onLogout();
  };

  const t = {
    ko: {
      settings: '설정',
      notifications: '알림 설정',
      allNotifications: '전체 알림',
      allNotificationsDesc: '모든 알림 받기',
      quizReminder: '퀴즈 리마인더',
      quizReminderDesc: '매일 퀴즈 알림',
      communityUpdates: '커뮤니티 업데이트',
      communityUpdatesDesc: '댓글 및 좋아요 알림',
      display: '화면 설정',
      darkMode: '다크 모드',
      darkModeDesc: '어두운 테마 사용',
      language: '언어',
      languageKorean: '한국어',
      soundVibration: '소리 및 진동',
      soundEffects: '효과음',
      soundEffectsDesc: '버튼 클릭 소리',
      vibration: '진동',
      vibrationDesc: '햅틱 피드백',
      privacy: '개인정보 및 보안',
      changePassword: '비밀번호 변경',
      deleteAccount: '계정 데이터 삭제',
      helpSupport: '도움말 및 지원',
      appVersion: '쓰레기박사',
      version: '버전 1.0.0',
    },
    en: {
      settings: 'Settings',
      notifications: 'Notifications',
      allNotifications: 'All Notifications',
      allNotificationsDesc: 'Receive all notifications',
      quizReminder: 'Quiz Reminder',
      quizReminderDesc: 'Daily quiz notifications',
      communityUpdates: 'Community Updates',
      communityUpdatesDesc: 'Comments and likes notifications',
      display: 'Display Settings',
      darkMode: 'Dark Mode',
      darkModeDesc: 'Use dark theme',
      language: 'Language',
      languageKorean: 'English',
      soundVibration: 'Sound & Vibration',
      soundEffects: 'Sound Effects',
      soundEffectsDesc: 'Button click sounds',
      vibration: 'Vibration',
      vibrationDesc: 'Haptic feedback',
      privacy: 'Privacy & Security',
      changePassword: 'Change Password',
      deleteAccount: 'Delete Account Data',
      helpSupport: 'Help & Support',
      appVersion: 'Trash Guru',
      version: 'Version 1.0.0',
    },
  };

  const text = t[language];

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
      <div className={`w-full max-w-[430px] min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex flex-col`}>
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-3 sticky top-0 z-10 flex-shrink-0">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <ArrowLeft size={24} className="dark:text-white" />
          </button>
          <h2 className="dark:text-white">{text.settings}</h2>
        </div>

        <div className="flex-1 p-4 space-y-4 pb-24 overflow-y-auto">
        {/* Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <h3 className="flex items-center gap-2 dark:text-white">
              <Bell className="text-green-600" size={20} />
              {text.notifications}
            </h3>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm mb-1 dark:text-white">{text.allNotifications}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{text.allNotificationsDesc}</p>
              </div>
              <button
                onClick={() => toggleSetting('notifications')}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.notifications ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings.notifications ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                ></div>
              </button>
            </div>
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm mb-1 dark:text-white">{text.quizReminder}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{text.quizReminderDesc}</p>
              </div>
              <button
                onClick={() => toggleSetting('quizReminder')}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.quizReminder ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings.quizReminder ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                ></div>
              </button>
            </div>
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm mb-1 dark:text-white">{text.communityUpdates}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{text.communityUpdatesDesc}</p>
              </div>
              <button
                onClick={() => toggleSetting('communityUpdates')}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.communityUpdates ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings.communityUpdates ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                ></div>
              </button>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <h3 className="flex items-center gap-2 dark:text-white">
              <Moon className="text-green-600" size={20} />
              {text.display}
            </h3>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm mb-1 dark:text-white">{text.darkMode}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{text.darkModeDesc}</p>
              </div>
              <button
                onClick={onToggleDarkMode}
                className={`w-12 h-6 rounded-full transition-colors ${
                  darkMode ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    darkMode ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                ></div>
              </button>
            </div>
            <button 
              onClick={() => setShowLanguageModal(true)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="text-left">
                <p className="text-sm mb-1 dark:text-white">{text.language}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{text.languageKorean}</p>
              </div>
              <ChevronRight className="text-gray-400" size={20} />
            </button>
          </div>
        </div>

        {/* Sound & Vibration */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <h3 className="flex items-center gap-2 dark:text-white">
              <Globe className="text-green-600" size={20} />
              {text.soundVibration}
            </h3>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm mb-1 dark:text-white">{text.soundEffects}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{text.soundEffectsDesc}</p>
              </div>
              <button
                onClick={() => toggleSetting('soundEffects')}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.soundEffects ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings.soundEffects ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                ></div>
              </button>
            </div>
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm mb-1 dark:text-white">{text.vibration}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{text.vibrationDesc}</p>
              </div>
              <button
                onClick={() => toggleSetting('vibration')}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.vibration ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings.vibration ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                ></div>
              </button>
            </div>
          </div>
        </div>

        {/* Community */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <h3 className="flex items-center gap-2 dark:text-white">
              <Megaphone className="text-green-600" size={20} />
              커뮤니티
            </h3>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            <button 
              onClick={onNavigateToAnnouncements}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="flex items-center gap-3">
                <Megaphone className="text-gray-500 dark:text-gray-400" size={20} />
                <span className="text-sm dark:text-white">공지사항</span>
              </div>
              <ChevronRight className="text-gray-400" size={20} />
            </button>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <h3 className="flex items-center gap-2 dark:text-white">
              <Shield className="text-green-600" size={20} />
              {text.privacy}
            </h3>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            <button 
              onClick={() => setShowPasswordModal(true)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="flex items-center gap-3">
                <Lock className="text-gray-500 dark:text-gray-400" size={20} />
                <span className="text-sm dark:text-white">{text.changePassword}</span>
              </div>
              <ChevronRight className="text-gray-400" size={20} />
            </button>
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="flex items-center gap-3">
                <Trash2 className="text-red-500" size={20} />
                <span className="text-sm dark:text-white">{text.deleteAccount}</span>
              </div>
              <ChevronRight className="text-gray-400" size={20} />
            </button>
          </div>
        </div>

        {/* Help */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <button 
            onClick={onNavigateToHelp}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="text-green-600" size={20} />
              <span className="text-sm dark:text-white">{text.helpSupport}</span>
            </div>
            <ChevronRight className="text-gray-400" size={20} />
          </button>
        </div>

        {/* App Version */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 text-center border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{text.appVersion}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500">{text.version}</p>
        </div>
      </div>

      {/* Language Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full">
            <h3 className="mb-4 dark:text-white">{language === 'ko' ? '언어 선택' : 'Select Language'}</h3>
            <div className="space-y-3">
              <button
                onClick={() => {
                  onChangeLanguage('ko');
                  setShowLanguageModal(false);
                }}
                className={`w-full p-4 rounded-xl border-2 transition-colors ${
                  language === 'ko'
                    ? 'border-green-600 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="dark:text-white">한국어</span>
                  {language === 'ko' && <Check className="text-green-600" size={20} />}
                </div>
              </button>
              <button
                onClick={() => {
                  onChangeLanguage('en');
                  setShowLanguageModal(false);
                }}
                className={`w-full p-4 rounded-xl border-2 transition-colors ${
                  language === 'en'
                    ? 'border-green-600 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="dark:text-white">English</span>
                  {language === 'en' && <Check className="text-green-600" size={20} />}
                </div>
              </button>
            </div>
            <button
              onClick={() => setShowLanguageModal(false)}
              className="w-full mt-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
            >
              {language === 'ko' ? '취소' : 'Cancel'}
            </button>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full">
            <h3 className="mb-4 dark:text-white">
              {language === 'ko' ? '비밀번호 변경' : 'Change Password'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  {language === 'ko' ? '현재 비밀번호' : 'Current Password'}
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  {language === 'ko' ? '새 비밀번호' : 'New Password'}
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  {language === 'ko' ? '새 비밀번호 확인' : 'Confirm New Password'}
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:border-green-500"
                />
              </div>
              
              {passwordError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
                  {passwordError}
                </div>
              )}
              
              {passwordSuccess && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400 text-sm flex items-center gap-2">
                  <Check size={16} />
                  {language === 'ko' ? '비밀번호가 변경되었습니다!' : 'Password changed successfully!'}
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  setPasswordError('');
                  setPasswordSuccess(false);
                }}
                className="flex-1 py-2 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
              >
                {language === 'ko' ? '취소' : 'Cancel'}
              </button>
              <button
                onClick={handlePasswordChange}
                className="flex-1 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
              >
                {language === 'ko' ? '변경' : 'Change'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
              <h3 className="dark:text-white">
                {language === 'ko' ? '계정 데이터 삭제' : 'Delete Account Data'}
              </h3>
            </div>
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-sm text-red-800 dark:text-red-400 mb-2">
                {language === 'ko' 
                  ? '⚠️ 경고: 이 작업은 되돌릴 수 없습니다!' 
                  : '⚠️ Warning: This action cannot be undone!'}
              </p>
              <p className="text-sm text-red-700 dark:text-red-300">
                {language === 'ko'
                  ? '계정과 모든 데이터가 영구적으로 삭제됩니다. 포인트, 업적, 활동 내역 등 모든 정보가 삭제됩니다.'
                  : 'Your account and all data will be permanently deleted. All information including points, achievements, and activity history will be removed.'}
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                {language === 'ko' 
                  ? '계속하려면 "삭제"를 입력하세요' 
                  : 'Type "DELETE" to continue'}
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder={language === 'ko' ? '삭제' : 'DELETE'}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:border-red-500"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText('');
                }}
                className="flex-1 py-2 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
              >
                {language === 'ko' ? '취소' : 'Cancel'}
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== (language === 'ko' ? '삭제' : 'DELETE')}
                className="flex-1 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {language === 'ko' ? '계정 삭제' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
