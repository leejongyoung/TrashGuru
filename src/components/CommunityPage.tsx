import { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, MessageCircle, Plus, TrendingUp, Edit2, Trash2, X, Search } from 'lucide-react';
import { notifyCommunityActivity } from '../utils/notifications';

interface Post {
  id: number;
  author: string;
  time: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  category: string;
  isMyPost: boolean;
}

interface CommunityPageProps {
  onNavigateToMyPosts?: () => void;
  defaultTab?: 'popular' | 'recent' | 'my';
}

export function CommunityPage({ onNavigateToMyPosts, defaultTab = 'popular' }: CommunityPageProps) {
  const [activeTab, setActiveTab] = useState<'popular' | 'recent' | 'my'>(defaultTab);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: '정보공유' });
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const trendingKeywords = ['플라스틱', '분리수거', '재활용', '우유팩', '종량제봉투', '대형폐기물'];

  // Load posts from localStorage
  useEffect(() => {
    const savedPosts = localStorage.getItem('communityPosts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      // Initial sample posts
      const initialPosts: Post[] = [
        {
          id: 1,
          author: '환경지킴이',
          time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          title: '헷갈리는 분리수거 총정리',
          content: '자주 헷갈리는 분리수거 방법들을 정리해봤어요! 1. 플라스틱 용기는 라벨을 꼭 제거하고...',
          likes: 45,
          comments: 12,
          category: '정보공유',
          isMyPost: false,
        },
        {
          id: 2,
          author: '초보분리러',
          time: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          title: '일회용 마스크는 어디에 버려야 하나요?',
          content: '코로나 이후로 마스크를 많이 쓰는데, 이게 종량제 봉투에 버려야 하는지 궁금해요.',
          likes: 23,
          comments: 18,
          category: '질문',
          isMyPost: false,
        },
        {
          id: 3,
          author: '재활용왕',
          time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          title: '우유팩 분리수거 꿀팁!',
          content: '우유팩은 씻어서 말린 후 펼쳐서 배출하면 포인트도 받을 수 있어요. 근처 마트에 수거함이...',
          likes: 67,
          comments: 8,
          category: '꿀팁',
          isMyPost: false,
        },
      ];
      setPosts(initialPosts);
      localStorage.setItem('communityPosts', JSON.stringify(initialPosts));
    }
  }, []);

  // Save posts to localStorage
  const savePosts = (updatedPosts: Post[]) => {
    setPosts(updatedPosts);
    localStorage.setItem('communityPosts', JSON.stringify(updatedPosts));
  };

  const getTimeAgo = (timestamp: string) => {
    const now = Date.now();
    const postTime = new Date(timestamp).getTime();
    const diff = Math.floor((now - postTime) / 1000);

    if (diff < 60) return '방금 전';
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    return `${Math.floor(diff / 86400)}일 전`;
  };

  const handleWritePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    const username = localStorage.getItem('user') || 'Anonymous';
    const post: Post = {
      id: Date.now(),
      author: username,
      time: new Date().toISOString(),
      title: newPost.title,
      content: newPost.content,
      likes: 0,
      comments: 0,
      category: newPost.category,
      isMyPost: true,
    };

    const updatedPosts = [post, ...posts];
    savePosts(updatedPosts);
    setNewPost({ title: '', content: '', category: '정보공유' });
    setShowWriteModal(false);
    
    // Add notification
    notifyCommunityActivity(`새로운 글을 작성했습니다: "${post.title}"`);
  };

  const handleEditPost = () => {
    if (!editingPost || !newPost.title.trim() || !newPost.content.trim()) return;

    const updatedPosts = posts.map(post =>
      post.id === editingPost.id
        ? { ...post, title: newPost.title, content: newPost.content, category: newPost.category }
        : post
    );

    savePosts(updatedPosts);
    setNewPost({ title: '', content: '', category: '정보공유' });
    setEditingPost(null);
    setShowWriteModal(false);
  };

  const handleDeletePost = (postId: number) => {
    if (confirm('정말 이 게시글을 삭제하시겠습니까?')) {
      const updatedPosts = posts.filter(post => post.id !== postId);
      savePosts(updatedPosts);
    }
  };

  const openEditModal = (post: Post) => {
    setEditingPost(post);
    setNewPost({ title: post.title, content: post.content, category: post.category });
    setShowWriteModal(true);
  };

  const closeModal = () => {
    setShowWriteModal(false);
    setEditingPost(null);
    setNewPost({ title: '', content: '', category: '정보공유' });
  };

  const handleLike = (postId: number) => {
    const updatedPosts = posts.map(post =>
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    );
    savePosts(updatedPosts);
  };

  const filteredPosts = () => {
    let filtered = posts;
    
    // Apply tab filter
    if (activeTab === 'popular') {
      filtered = [...filtered].sort((a, b) => b.likes - a.likes);
    } else if (activeTab === 'recent') {
      filtered = [...filtered].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    } else {
      filtered = filtered.filter(post => post.isMyPost);
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  return (
    <div className="pb-24">
      {/* Write Modal */}
      {showWriteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl animate-slideUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="dark:text-white">{editingPost ? '게시글 수정' : '새 게시글 작성'}</h3>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">카테고리</label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-green-500 dark:text-white"
                >
                  <option>정보공유</option>
                  <option>질문</option>
                  <option>꿀팁</option>
                  <option>일상</option>
                  <option>후기</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">제목</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  placeholder="제목을 입력하세요"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-green-500 dark:text-white"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">내용</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder="내용을 입력하세요"
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-green-500 dark:text-white resize-none"
                />
              </div>

              <button
                onClick={editingPost ? handleEditPost : handleWritePost}
                className="w-full py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
              >
                {editingPost ? '수정하기' : '작성하기'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header with Search and Trending Keywords */}
      <div className="p-4 space-y-4">
        {/* Search Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="flex items-center gap-3 p-3">
            <Search className="text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="게시글 검색 (제목, 내용, 작성자)"
              className="flex-1 bg-transparent focus:outline-none dark:text-white text-sm placeholder:text-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X size={16} className="text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Trending Keywords */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="text-red-500" size={18} />
            <span className="text-sm dark:text-white">실시간 인기 키워드</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingKeywords.map((keyword, idx) => (
              <button
                key={idx}
                onClick={() => setSearchQuery(keyword)}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-sm rounded-full text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-700 dark:hover:text-green-400 cursor-pointer transition-colors"
              >
                #{keyword}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 z-10">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('popular')}
            className={`py-3 relative ${
              activeTab === 'popular'
                ? 'text-green-600 dark:text-green-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            인기글
            {activeTab === 'popular' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 dark:bg-green-400" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('recent')}
            className={`py-3 relative ${
              activeTab === 'recent'
                ? 'text-green-600 dark:text-green-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            최신글
            {activeTab === 'recent' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 dark:bg-green-400" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={`py-3 relative ${
              activeTab === 'my'
                ? 'text-green-600 dark:text-green-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            내글
            {activeTab === 'my' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 dark:bg-green-400" />
            )}
          </button>
        </div>
      </div>

      {/* Posts */}
      <div className="p-4 space-y-4">
        {filteredPosts().map((post) => (
          <div key={post.id} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <MessageSquare className="text-green-600" size={18} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm dark:text-white">{post.author}</span>
                    {post.isMyPost && (
                      <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded">
                        내 글
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{getTimeAgo(post.time)}</span>
                </div>
              </div>
              {post.isMyPost && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(post)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} className="text-gray-600 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
              )}
            </div>

            <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full text-gray-700 dark:text-gray-300 mb-3">
              {post.category}
            </span>

            <h4 className="dark:text-white mb-2">{post.title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{post.content}</p>

            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <button
                onClick={() => handleLike(post.id)}
                className="flex items-center gap-1 hover:text-red-500 transition-colors"
              >
                <ThumbsUp size={16} />
                <span>{post.likes}</span>
              </button>
              <div className="flex items-center gap-1">
                <MessageCircle size={16} />
                <span>{post.comments}</span>
              </div>
            </div>
          </div>
        ))}

        {filteredPosts().length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">{searchQuery ? '🔍' : '📝'}</div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchQuery 
                ? '검색 결과가 없습니다' 
                : activeTab === 'my' ? '작성한 글이 없습니다' : '게시글이 없습니다'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                검색 초기화
              </button>
            )}
          </div>
        )}
      </div>

      {/* Floating Write Button */}
      <button
        onClick={() => setShowWriteModal(true)}
        className="fixed right-4 bottom-24 w-14 h-14 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all hover:scale-110 flex items-center justify-center z-20"
      >
        <Plus size={24} />
      </button>
    </div>
  );
}
