import { useState, useEffect } from 'react';
import { Megaphone, Calendar, Eye, ChevronRight, Plus, Trash2, Edit2, X } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  authorRole: 'superadmin' | 'admin' | 'user';
  date: string;
  views: number;
  important: boolean;
}

interface AnnouncementPageProps {
  currentUser: string;
  userRole: 'superadmin' | 'admin' | 'user';
}

export function AnnouncementPage({ currentUser, userRole }: AnnouncementPageProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    important: false,
  });

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = () => {
    const saved = localStorage.getItem('announcements');
    if (saved) {
      setAnnouncements(JSON.parse(saved));
    } else {
      // Initialize with welcome announcement
      const initialAnnouncements: Announcement[] = [
        {
          id: '1',
          title: '🎉 쓰레기박사 앱 정식 출시!',
          content: `안녕하세요, 쓰레기박사 팀입니다!

드디어 쓰레기박사 앱이 정식으로 출시되었습니다! 🎊

**주요 기능:**
✅ AI 기반 쓰레기 분류 인식
✅ 재미있는 환경 퀴즈
✅ 커뮤니티 게시판
✅ 포인트 리워드 시스템
✅ 분리수거 정보 검색

**앱 이용 안내:**
- 매일 새로운 퀴즈를 풀고 포인트를 획득하세요
- 커뮤니티에서 다른 사용자들과 정보를 공유하세요
- 모은 포인트로 상점에서 상품을 구매하거나 환경 기부를 할 수 있습니다

**문의 및 건의사항:**
앱 사용 중 불편한 점이나 건의사항이 있으시면 언제든 커뮤니티 게시판에 남겨주세요.

함께 깨끗한 환경을 만들어가요! 🌱♻️

- 쓰레기박사 팀 드림`,
          author: 'admin',
          authorRole: 'superadmin',
          date: new Date().toISOString(),
          views: 247,
          important: true,
        },
        {
          id: '2',
          title: '분리수거 가이드 업데이트 안내',
          content: `쓰레기박사를 이용해주시는 모든 분들께 감사드립니다.

최신 분리수거 정책에 맞춰 가이드를 업데이트했습니다.

**주요 변경사항:**
- 플라스틱 분류 기준 세분화
- 일회용품 배출 방법 추가
- 지역별 수거 정보 강화

자세한 내용은 '분류 정보' 메뉴에서 확인하실 수 있습니다.

감사합니다.`,
          author: 'admin',
          authorRole: 'admin',
          date: new Date(Date.now() - 86400000).toISOString(),
          views: 189,
          important: false,
        },
      ];
      localStorage.setItem('announcements', JSON.stringify(initialAnnouncements));
      setAnnouncements(initialAnnouncements);
    }
  };

  const saveAnnouncements = (announcements: Announcement[]) => {
    localStorage.setItem('announcements', JSON.stringify(announcements));
    setAnnouncements(announcements);
  };

  const handleViewAnnouncement = (announcement: Announcement) => {
    // Increment view count
    const updated = announcements.map(a =>
      a.id === announcement.id ? { ...a, views: a.views + 1 } : a
    );
    saveAnnouncements(updated);
    setSelectedAnnouncement({ ...announcement, views: announcement.views + 1 });
  };

  const handleWriteAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    const announcement: Announcement = {
      id: Date.now().toString(),
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      author: currentUser,
      authorRole: userRole,
      date: new Date().toISOString(),
      views: 0,
      important: newAnnouncement.important,
    };

    const updated = [announcement, ...announcements];
    saveAnnouncements(updated);
    setShowWriteModal(false);
    setNewAnnouncement({ title: '', content: '', important: false });
  };

  const handleDeleteAnnouncement = (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      const updated = announcements.filter(a => a.id !== id);
      saveAnnouncements(updated);
      setSelectedAnnouncement(null);
    }
  };

  const canWrite = userRole === 'superadmin' || userRole === 'admin';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'superadmin':
        return <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 text-xs rounded">최고관리자</span>;
      case 'admin':
        return <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-xs rounded">관리자</span>;
      default:
        return null;
    }
  };

  // Detail View
  if (selectedAnnouncement) {
    const canDelete = selectedAnnouncement.author === currentUser || userRole === 'superadmin';
    
    return (
      <div className="p-4 pb-24">
        <button
          onClick={() => setSelectedAnnouncement(null)}
          className="mb-4 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>목록으로</span>
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {selectedAnnouncement.important && (
            <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 px-6 py-2">
              <span className="text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                <Megaphone size={16} />
                중요 공지
              </span>
            </div>
          )}
          
          <div className="p-6">
            <h1 className="text-2xl dark:text-white mb-4">{selectedAnnouncement.title}</h1>
            
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span>{selectedAnnouncement.author}</span>
                {getRoleBadge(selectedAnnouncement.authorRole)}
              </div>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                <Calendar size={14} />
                <span>{formatDate(selectedAnnouncement.date)}</span>
              </div>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                <Eye size={14} />
                <span>{selectedAnnouncement.views}</span>
              </div>
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {selectedAnnouncement.content}
              </div>
            </div>

            {canDelete && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                <button
                  onClick={() => handleDeleteAnnouncement(selectedAnnouncement.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  <span>삭제</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="p-4 pb-24">
      <div className="bg-gradient-to-br from-red-400 to-red-600 rounded-2xl p-6 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="mb-2">공지사항</h2>
            <p className="text-sm opacity-90">중요한 소식과 업데이트를 확인하세요</p>
          </div>
          <Megaphone size={40} className="opacity-50" />
        </div>
      </div>

      {canWrite && (
        <button
          onClick={() => setShowWriteModal(true)}
          className="w-full mb-6 p-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          <span>공지사항 작성</span>
        </button>
      )}

      {/* Write Modal */}
      {showWriteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full shadow-2xl animate-slideUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="dark:text-white">공지사항 작성</h3>
              <button onClick={() => setShowWriteModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">제목</label>
                <input
                  type="text"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  placeholder="공지사항 제목을 입력하세요"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-green-500 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">내용</label>
                <textarea
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  placeholder="공지사항 내용을 입력하세요"
                  rows={12}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-green-500 dark:text-white resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="important"
                  checked={newAnnouncement.important}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, important: e.target.checked })}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <label htmlFor="important" className="text-sm text-gray-700 dark:text-gray-300">
                  중요 공지로 표시
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowWriteModal(false)}
                  className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleWriteAnnouncement}
                  className="flex-1 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                >
                  작성 완료
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Announcements List */}
      <div className="space-y-3">
        {announcements.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📢</div>
            <p className="text-gray-600 dark:text-gray-400">등록된 공지사항이 없습니다</p>
          </div>
        ) : (
          announcements.map((announcement) => (
            <button
              key={announcement.id}
              onClick={() => handleViewAnnouncement(announcement)}
              className={`w-full p-4 rounded-xl border transition-all text-left hover:shadow-md ${
                announcement.important
                  ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {announcement.important && (
                      <Megaphone className="text-red-600 flex-shrink-0" size={16} />
                    )}
                    <h3 className="dark:text-white truncate">{announcement.title}</h3>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <span>{announcement.author}</span>
                      {getRoleBadge(announcement.authorRole)}
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{new Date(announcement.date).toLocaleDateString('ko-KR')}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Eye size={12} />
                      <span>{announcement.views}</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="text-gray-400 flex-shrink-0 mt-1" size={20} />
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
