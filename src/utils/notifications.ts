export interface Notification {
  id: string;
  type: 'quiz' | 'community' | 'point' | 'system' | 'announcement';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  icon?: string;
  link?: string;
}

export function getNotifications(): Notification[] {
  const saved = localStorage.getItem('notifications');
  if (!saved) return [];
  
  const notifications: Notification[] = JSON.parse(saved);
  
  // Fix duplicate IDs if they exist
  const seenIds = new Set<string>();
  const fixed = notifications.map(notif => {
    if (seenIds.has(notif.id)) {
      // Generate new unique ID for duplicate
      return {
        ...notif,
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      };
    }
    seenIds.add(notif.id);
    return notif;
  });
  
  // Save fixed notifications if there were duplicates
  if (fixed.length !== seenIds.size) {
    localStorage.setItem('notifications', JSON.stringify(fixed));
  }
  
  return fixed;
}

export function saveNotifications(notifications: Notification[]) {
  localStorage.setItem('notifications', JSON.stringify(notifications));
}

export function addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
  const notifications = getNotifications();
  // Generate unique ID using timestamp + random string
  const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const newNotification: Notification = {
    ...notification,
    id: uniqueId,
    timestamp: new Date().toISOString(),
    read: false,
  };
  notifications.unshift(newNotification);
  saveNotifications(notifications);
  
  // Update badge count
  updateNotificationBadge();
}

export function markAsRead(id: string) {
  const notifications = getNotifications();
  const updated = notifications.map(n => 
    n.id === id ? { ...n, read: true } : n
  );
  saveNotifications(updated);
  updateNotificationBadge();
}

export function markAllAsRead() {
  const notifications = getNotifications();
  const updated = notifications.map(n => ({ ...n, read: true }));
  saveNotifications(updated);
  updateNotificationBadge();
}

export function getUnreadCount(): number {
  const notifications = getNotifications();
  return notifications.filter(n => !n.read).length;
}

export function updateNotificationBadge() {
  const count = getUnreadCount();
  localStorage.setItem('unreadNotificationCount', count.toString());
  
  // Dispatch custom event for UI update
  window.dispatchEvent(new CustomEvent('notificationUpdate', { detail: { count } }));
}

// Initialize daily quiz notification at midnight
export function initializeDailyNotifications() {
  const lastCheck = localStorage.getItem('lastNotificationCheck');
  const today = new Date().toDateString();
  
  if (lastCheck !== today) {
    // Add daily quiz notification
    addNotification({
      type: 'quiz',
      title: '새로운 퀴즈가 등록되었습니다! 🎯',
      message: '오늘의 퀴즈를 풀고 포인트를 획득하세요!',
      icon: '🎯',
      link: 'quiz',
    });
    
    localStorage.setItem('lastNotificationCheck', today);
  }
}

// Add point notification
export function notifyPointsEarned(points: number, reason: string) {
  addNotification({
    type: 'point',
    title: `${points} 포인트 적립! 💰`,
    message: reason,
    icon: '⭐',
    link: 'shop',
  });
}

// Add community notification
export function notifyCommunityActivity(activity: string) {
  addNotification({
    type: 'community',
    title: '커뮤니티 활동 알림 💬',
    message: activity,
    icon: '💬',
    link: 'community',
  });
}

// Add announcement notification
export function notifyAnnouncement(title: string, preview: string) {
  addNotification({
    type: 'announcement',
    title: `공지사항: ${title} 📢`,
    message: preview,
    icon: '📢',
    link: 'announcements',
  });
}

// Initialize sample notifications for new users
export function initializeSampleNotifications() {
  const initialized = localStorage.getItem('notificationsInitialized');
  if (initialized) return;

  // Welcome notification
  addNotification({
    type: 'system',
    title: '쓰레기박사에 오신 것을 환영합니다! 🎉',
    message: '재활용 분리수거를 함께 배워봐요!',
    icon: '🎉',
  });
  
  // Initial quiz notification
  addNotification({
    type: 'quiz',
    title: '새로운 퀴즈가 등록되었습니다! 🎯',
    message: '오늘의 퀴즈를 풀고 포인트를 획득하세요!',
    icon: '🎯',
    link: 'quiz',
  });
  
  // Announcement notification
  addNotification({
    type: 'announcement',
    title: '공지사항: 앱 출시 안내 📢',
    message: '쓰레기박사 앱이 정식 출시되었습니다!',
    icon: '📢',
    link: 'announcements',
  });

  // Community sample notification
  addNotification({
    type: 'community',
    title: '인기 게시글 알림 💬',
    message: '"플라스틱 분리수거 꿀팁" 게시글이 인기글이 되었습니다!',
    icon: '💬',
    link: 'community',
  });

  localStorage.setItem('notificationsInitialized', 'true');
}
