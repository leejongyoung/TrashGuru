import { useState, useEffect } from 'react';
import { X, Check, Bell, Trash2, Settings, Filter, ChevronDown } from 'lucide-react';
import { getNotifications, markAsRead, markAllAsRead, getUnreadCount, type Notification } from '../utils/notifications';

interface NotificationPageProps {
  onClose: () => void;
  onNavigate: (page: string) => void;
}

export function NotificationPage({ onClose, onNavigate }: NotificationPageProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'quiz' | 'community' | 'point' | 'announcement'>('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    const notifs = getNotifications();
    setNotifications(notifs);
    setUnreadCount(getUnreadCount());
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    loadNotifications();
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
      loadNotifications();
    }
    
    if (notification.link) {
      onNavigate(notification.link);
      onClose();
    }
  };

  const handleDeleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notifications.filter(n => n.id !== id);
    localStorage.setItem('notifications', JSON.stringify(updated));
    loadNotifications();
  };

  const handleClearAll = () => {
    if (window.confirm('모든 알림을 삭제하시겠습니까?')) {
      localStorage.setItem('notifications', JSON.stringify([]));
      loadNotifications();
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now.getTime() - time.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    
    return time.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'quiz': return '🎯';
      case 'community': return '💬';
      case 'point': return '⭐';
      case 'announcement': return '📢';
      default: return '🔔';
    }
  };

  const getNotificationGradient = (type: string) => {
    switch (type) {
      case 'quiz': return 'from-blue-400 to-blue-500';
      case 'community': return 'from-purple-400 to-purple-500';
      case 'point': return 'from-yellow-400 to-yellow-500';
      case 'announcement': return 'from-red-400 to-red-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filterType === 'all') return true;
    if (filterType === 'unread') return !n.read;
    return n.type === filterType;
  });

  const filterOptions = [
    { value: 'all', label: '전체', icon: '📋' },
    { value: 'unread', label: '읽지 않음', icon: '🔴' },
    { value: 'quiz', label: '퀴즈', icon: '🎯' },
    { value: 'community', label: '커뮤니티', icon: '💬' },
    { value: 'point', label: '포인트', icon: '⭐' },
    { value: 'announcement', label: '공지', icon: '📢' },
  ];

  // Group notifications by date
  const groupedNotifications = filteredNotifications.reduce((groups: { [key: string]: { label: string; notifications: Notification[] } }, notification) => {
    const date = new Date(notification.timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let label = '';
    let key = '';
    if (date.toDateString() === today.toDateString()) {
      label = '오늘';
      key = 'today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      label = '어제';
      key = 'yesterday';
    } else {
      label = date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
      key = date.toISOString().split('T')[0]; // Use ISO date as unique key
    }

    if (!groups[key]) {
      groups[key] = { label, notifications: [] };
    }
    groups[key].notifications.push(notification);
    return groups;
  }, {});

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 animate-fadeIn flex items-center justify-center">
      <div className="w-full max-w-[430px] h-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 z-20 flex-shrink-0">
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Bell className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl text-gray-900 dark:text-white" style={{ fontWeight: 700 }}>알림</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {unreadCount > 0 ? `${unreadCount}개의 새 알림` : '모든 알림을 확인했어요'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <X size={20} className="text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex-1 py-2.5 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-sm flex items-center justify-center gap-2 text-sm"
                style={{ fontWeight: 600 }}
              >
                <Check size={16} />
                <span>모두 읽음</span>
              </button>
            )}
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="flex-1 py-2.5 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex items-center justify-center gap-2 text-sm"
              style={{ fontWeight: 600 }}
            >
              <Filter size={16} />
              <span>{filterOptions.find(f => f.value === filterType)?.label || '필터'}</span>
              <ChevronDown size={14} className={`transition-transform ${showFilterMenu ? 'rotate-180' : ''}`} />
            </button>
            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="py-2.5 px-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all flex items-center justify-center gap-2 text-sm"
                style={{ fontWeight: 600 }}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          {/* Filter Menu */}
          {showFilterMenu && (
            <div className="mt-3 bg-white dark:bg-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-600 overflow-hidden animate-slideDown">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setFilterType(option.value as any);
                    setShowFilterMenu(false);
                  }}
                  className={`w-full px-4 py-3 flex items-center gap-3 transition-colors ${
                    filterType === option.value
                      ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="text-lg">{option.icon}</span>
                  <span className="text-sm" style={{ fontWeight: 600 }}>{option.label}</span>
                  {filterType === option.value && (
                    <Check size={16} className="ml-auto text-green-600 dark:text-green-400" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

        {/* Notifications List */}
        <div className="flex-1 px-5 py-4 pb-24 overflow-y-auto">
        {Object.keys(groupedNotifications).length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-3xl flex items-center justify-center">
              <Bell size={40} className="text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-gray-900 dark:text-white mb-2" style={{ fontWeight: 600 }}>알림이 없습니다</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filterType === 'unread' ? '읽지 않은 알림이 없어요' : '새로운 소식이 있으면 알려드릴게요'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedNotifications).map(([dateKey, group]) => (
              <div key={dateKey}>
                {/* Date Header */}
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-sm text-gray-500 dark:text-gray-400" style={{ fontWeight: 700 }}>{group.label}</h3>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{group.notifications.length}개</span>
                </div>

                {/* Notifications */}
                <div className="space-y-2">
                  {group.notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`relative p-4 rounded-2xl border transition-all cursor-pointer group ${
                        notification.read
                          ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                          : 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800 shadow-sm'
                      } hover:shadow-md active:scale-98 transition-transform`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getNotificationGradient(notification.type)} flex items-center justify-center flex-shrink-0 shadow-md`}>
                          <span className="text-2xl">{notification.icon || getNotificationIcon(notification.type)}</span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          {/* Title and Badge */}
                          <div className="flex items-start gap-2 mb-1">
                            <p className={`flex-1 text-sm ${notification.read ? 'text-gray-700 dark:text-gray-200' : 'text-gray-900 dark:text-white'}`} style={{ fontWeight: notification.read ? 500 : 700 }}>
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-1.5 shadow-sm shadow-green-500/50"></span>
                            )}
                          </div>

                          {/* Message */}
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                            {notification.message}
                          </p>

                          {/* Time and Action */}
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 dark:text-gray-500">
                              {getTimeAgo(notification.timestamp)}
                            </span>
                            {notification.link && (
                              <span className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full" style={{ fontWeight: 600 }}>
                                자세히 보기
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={(e) => handleDeleteNotification(notification.id, e)}
                          className="absolute top-3 right-3 w-7 h-7 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center"
                        >
                          <Trash2 size={14} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
