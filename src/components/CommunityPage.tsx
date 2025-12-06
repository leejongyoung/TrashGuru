import { useState, useEffect, useRef } from 'react';
import { MessageSquare, ThumbsUp, MessageCircle, Plus, TrendingUp, Edit2, Trash2, X, Search, ArrowLeft, Send, Smile, AlertTriangle } from 'lucide-react';
import { notifyCommunityActivity } from '../utils/notifications';
import { CustomAlert } from './ui/custom-alert';

const BAD_WORDS = ['나쁜말', '욕설', '바보', '멍청이', '시발', '꺼져'];

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

interface Challenge {
  id: number;
  title: string;
  description: string;
  points: number;
  participants: number;
  isJoined: boolean;
  isCompleted: boolean;
  progress: number;
  maxProgress: number;
}

interface RankingUser {
  rank: number;
  username: string;
  points: number;
  region: string;
  avatar: string;
}

interface CommunityPageProps {
  onNavigateToMyPosts?: () => void;
  defaultTab?: 'popular' | 'recent' | 'my' | 'challenges' | 'ranking';
  onAddPoints?: (points: number, reason: string) => void;
  onDeductPoints?: (points: number, reason: string) => void;
  userLocation?: string;
  userPoints?: number;
}

export function CommunityPage({ onNavigateToMyPosts, defaultTab = 'popular', onAddPoints, onDeductPoints, userLocation, userPoints = 0 }: CommunityPageProps) {
  const [view, setView] = useState<'list' | 'write' | 'detail' | 'challenge-verify'>('list');
  const [activeTab, setActiveTab] = useState<'popular' | 'recent' | 'my' | 'challenges' | 'ranking'>(defaultTab);
  const [rankingFilter, setRankingFilter] = useState<'all' | 'region'>('all');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [verifyingChallenge, setVerifyingChallenge] = useState<Challenge | null>(null);
  const [verificationText, setVerificationText] = useState('');
  
  // Alert State
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [lastPostTime, setLastPostTime] = useState(0);
  const [lastCommentTime, setLastCommentTime] = useState(0);

  // Report State
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('스팸/홍보');
  const [reportDescription, setReportDescription] = useState('');

  // Liked Posts State
  const [likedPostIds, setLikedPostIds] = useState<number[]>(() => {
    const saved = localStorage.getItem('likedPostIds');
    return saved ? JSON.parse(saved) : [];
  });

  // Challenges Data
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: 1,
      title: '플라스틱 프리 일주일',
      description: '일주일 동안 일회용 플라스틱 사용하지 않기',
      points: 500,
      participants: 128,
      isJoined: false,
      isCompleted: false,
      progress: 0,
      maxProgress: 7
    },
    {
      id: 2,
      title: '올바른 분리수거 인증',
      description: '분리수거 하는 모습 사진 찍어 인증하기',
      points: 100,
      participants: 342,
      isJoined: true,
      isCompleted: false,
      progress: 1,
      maxProgress: 1
    },
    {
      id: 3,
      title: '줍깅 챌린지',
      description: '동네 한 바퀴 돌며 쓰레기 줍기',
      points: 300,
      participants: 56,
      isJoined: false,
      isCompleted: false,
      progress: 0,
      maxProgress: 3
    }
  ]);

  // Ranking Data
  const [rankings, setRankings] = useState<RankingUser[]>([
    { rank: 1, username: '지구지킴이', points: 15400, region: '서울특별시 강남구', avatar: '🌱' },
    { rank: 2, username: '분리수거왕', points: 13200, region: '경기도 성남시', avatar: '♻️' },
    { rank: 3, username: '환경박사', points: 12800, region: '서울특별시 서초구', avatar: '🌍' },
    { rank: 4, username: '초록이', points: 11500, region: '부산광역시 해운대구', avatar: '🌿' },
    { rank: 5, username: '맑은하늘', points: 9800, region: '서울특별시 강남구', avatar: '☀️' },
  ]);

  // Update rankings with current user's points
  useEffect(() => {
    const username = localStorage.getItem('user') || '나야나';
    
    setRankings(prevRankings => {
      // Remove existing user entry if present to re-insert with new score
      const otherRankings = prevRankings.filter(r => r.username !== username && r.username !== '나야나');
      
      const currentUser: RankingUser = {
        rank: 0, // Will be calculated
        username: username,
        points: userPoints,
        region: userLocation || '지역 미설정',
        avatar: '👤'
      };
      
      const newRankings = [...otherRankings, currentUser].sort((a, b) => b.points - a.points);
      
      // Recalculate ranks
      return newRankings.map((r, index) => ({ ...r, rank: index + 1 }));
    });
  }, [userPoints, userLocation]);

  const handleJoinChallenge = (id: number) => {
    setChallenges(challenges.map(c => 
      c.id === id ? { ...c, isJoined: true } : c
    ));
  };

  const handleChallengeVerifyStart = (challenge: Challenge) => {
    setVerifyingChallenge(challenge);
    setVerificationText('');
    setView('challenge-verify');
  };

  const handleChallengeVerifySubmit = () => {
    if (!verifyingChallenge) return;

    setChallenges(challenges.map(c => 
      c.id === verifyingChallenge.id ? { ...c, isCompleted: true, progress: c.maxProgress } : c
    ));
    
    if (onAddPoints) {
      onAddPoints(verifyingChallenge.points, `${verifyingChallenge.title} 챌린지 완료`);
    }
    
    setVerifyingChallenge(null);
    setView('list');
  };

  // Function to undo challenge completion (simulating "caught" or user cancellation)
  const handleChallengeUndo = (id: number) => {
    if (confirm('챌린지 완료를 취소하시겠습니까? 획득한 포인트가 차감됩니다.')) {
      const challenge = challenges.find(c => c.id === id);
      if (challenge && challenge.isCompleted) {
        setChallenges(challenges.map(c => 
          c.id === id ? { ...c, isCompleted: false, progress: 0 } : c
        ));
        
        if (onDeductPoints) {
          onDeductPoints(challenge.points, `${challenge.title} 챌린지 취소`);
        }
      }
    }
  };

  const filteredRankings = () => {
    if (rankingFilter === 'region' && userLocation && userLocation !== '위치 설정') {
      const locationParts = userLocation.split(' ');
      const city = locationParts[locationParts.length - 1];
      return rankings.filter(r => r.region.includes(city));
    }
    return rankings;
  };

  const getMyRanking = () => {
    const username = localStorage.getItem('user') || '나야나';
    return rankings.find(r => r.username === username) || { 
      rank: '-', 
      username: username, 
      points: userPoints, 
      region: userLocation || '지역 미설정', 
      avatar: '👤' 
    };
  };

  // ... existing state ...
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: '정보공유' });
  const [searchQuery, setSearchQuery] = useState('');
  const [commentInput, setCommentInput] = useState('');

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

  const checkProfanity = (text: string) => {
    return BAD_WORDS.some(word => text.includes(word));
  };

  const handleReportSubmit = () => {
    setReportModalOpen(false);
    setReportReason('스팸/홍보');
    setReportDescription('');
    setAlertTitle('신고 접수');
    setAlertMessage('신고가 정상적으로 접수되었습니다.\n관리자 검토 후 조치될 예정입니다.');
    setAlertOpen(true);
  };

  const handleWritePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    // Profanity check
    if (checkProfanity(newPost.title) || checkProfanity(newPost.content)) {
      setAlertTitle('등록 불가');
      setAlertMessage('비속어나 유해한 단어가 포함되어 있어\n등록할 수 없습니다.');
      setAlertOpen(true);
      return;
    }

    // Spam check
    const now = Date.now();
    if (now - lastPostTime < 15000) { // 15 seconds cooldown
      setAlertTitle('도배 방지');
      setAlertMessage('게시글을 너무 자주 작성할 수 없습니다.\n잠시 후 다시 시도해주세요.');
      setAlertOpen(true);
      return;
    }

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
    setLastPostTime(now);
    setView('list');
    
    // Add notification and points
    if (onAddPoints) {
      onAddPoints(50, '커뮤니티 게시글 작성');
    }
    notifyCommunityActivity(`새로운 글을 작성했습니다: "${post.title}"`);
  };

  const handleEditPost = () => {
    if (!editingPost || !newPost.title.trim() || !newPost.content.trim()) return;

    // Profanity check
    if (checkProfanity(newPost.title) || checkProfanity(newPost.content)) {
      setAlertTitle('수정 불가');
      setAlertMessage('비속어나 유해한 단어가 포함되어 있어\n수정할 수 없습니다.');
      setAlertOpen(true);
      return;
    }

    const updatedPosts = posts.map(post =>
      post.id === editingPost.id
        ? { ...post, title: newPost.title, content: newPost.content, category: newPost.category }
        : post
    );

    savePosts(updatedPosts);
    setNewPost({ title: '', content: '', category: '정보공유' });
    setEditingPost(null);
    setView('list');
  };

  const handleDeletePost = (postId: number) => {
    if (confirm('정말 이 게시글을 삭제하시겠습니까?')) {
      const updatedPosts = posts.filter(post => post.id !== postId);
      savePosts(updatedPosts);
      if (view === 'detail') {
        setView('list');
        setSelectedPost(null);
      }
      
      // Deduct points for deleting a post
      if (onDeductPoints) {
        onDeductPoints(50, '게시글 삭제');
      }
    }
  };

  const startWriting = () => {
    setEditingPost(null);
    setNewPost({ title: '', content: '', category: '정보공유' });
    setView('write');
  };

  const startEditing = (post: Post, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingPost(post);
    setNewPost({ title: post.title, content: post.content, category: post.category });
    setView('write');
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setView('detail');
  };

  const handleLike = (postId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const isLiked = likedPostIds.includes(postId);
    let newLikedIds;

    if (isLiked) {
      // Unlike
      newLikedIds = likedPostIds.filter(id => id !== postId);
    } else {
      // Like
      newLikedIds = [...likedPostIds, postId];
    }

    setLikedPostIds(newLikedIds);
    localStorage.setItem('likedPostIds', JSON.stringify(newLikedIds));

    const updatedPosts = posts.map(post =>
      post.id === postId 
        ? { ...post, likes: post.likes + (isLiked ? -1 : 1) } 
        : post
    );
    savePosts(updatedPosts);
    
    // Update selected post if in detail view
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost({ ...selectedPost, likes: selectedPost.likes + (isLiked ? -1 : 1) });
    }
  };

  const [comments, setComments] = useState<{id: number, author: string, content: string, time: string}[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const emojis = ['😀', '😂', '😍', '👍', '👏', '🎉', '🔥', '❤️', '🤔', '😢', '🙌', '✨'];

  // Scroll to bottom when comments change
  useEffect(() => {
    if (view === 'detail') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [comments, view]);

  // Load comments when a post is selected (using ID to prevent reset on update)
  useEffect(() => {
    if (selectedPost?.id) {
      // In a real app, fetch comments for this post. Here we just set some dummy data or empty
      // Only set initial comments if empty to avoid overwriting new ones in this simple local state implementation
      if (comments.length === 0) {
        setComments([
          { id: 1, author: '이웃주민', content: '좋은 정보 감사합니다!', time: new Date(Date.now() - 1000 * 60 * 5).toISOString() }
        ]);
      }
    } else {
      setComments([]);
    }
  }, [selectedPost?.id]);

  const handleAddComment = () => {
    if (!commentInput.trim() || !selectedPost) return;

    // Spam check
    const now = Date.now();
    if (now - lastCommentTime < 15000) { // 15 seconds cooldown
      setAlertTitle('도배 방지');
      setAlertMessage('댓글을 너무 자주 작성할 수 없습니다.\n잠시 후 다시 시도해주세요.');
      setAlertOpen(true);
      return;
    }
    
    const newComment = {
      id: Date.now(),
      author: localStorage.getItem('user') || '익명',
      content: commentInput,
      time: new Date().toISOString()
    };

    setComments(prev => [...prev, newComment]);

    // Update comment count in posts list
    const updatedPosts = posts.map(post =>
      post.id === selectedPost.id ? { ...post, comments: post.comments + 1 } : post
    );
    savePosts(updatedPosts);
    
    // Update selected post state
    setSelectedPost(prev => prev ? { ...prev, comments: prev.comments + 1 } : null);
    
    setCommentInput('');
    setLastCommentTime(now);
    setShowEmojiPicker(false);
  };

  const addEmoji = (emoji: string) => {
    setCommentInput(prev => prev + emoji);
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

  // Render Write/Edit View
  if (view === 'write') {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3 sticky top-0 bg-white dark:bg-gray-900 z-10">
          <button 
            onClick={() => setView('list')}
            className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <ArrowLeft size={24} className="text-gray-600 dark:text-gray-300" />
          </button>
          <h2 className="text-lg font-bold dark:text-white">
            {editingPost ? '게시글 수정' : '새 게시글 작성'}
          </h2>
        </div>

        {/* Form */}
        <div className="flex-1 p-4 space-y-6 overflow-y-auto pb-24">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              카테고리
            </label>
            <select
              value={newPost.category}
              onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-green-500 dark:text-white appearance-none"
            >
              <option>정보공유</option>
              <option>질문</option>
              <option>꿀팁</option>
              <option>일상</option>
              <option>후기</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              제목
            </label>
            <input
              type="text"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              placeholder="제목을 입력하세요"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-green-500 dark:text-white placeholder:text-gray-400"
            />
          </div>

          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              내용
            </label>
            <textarea
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              placeholder="내용을 입력하세요 (50자 이상)"
              className="w-full h-64 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-green-500 dark:text-white placeholder:text-gray-400 resize-none"
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {newPost.content.length} / 50자 이상
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky bottom-24 z-10">
          <button
            onClick={editingPost ? handleEditPost : handleWritePost}
            disabled={!newPost.title.trim() || newPost.content.length < 50}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-colors ${
              !newPost.title.trim() || newPost.content.length < 50
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {editingPost ? '수정 완료' : '작성 완료'}
          </button>
        </div>
        
        <CustomAlert 
          isOpen={alertOpen} 
          title={alertTitle} 
          message={alertMessage} 
          onClose={() => setAlertOpen(false)} 
        />
      </div>
    );
  }

  // Render Challenge Verification View
  if (view === 'challenge-verify' && verifyingChallenge) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3 sticky top-0 bg-white dark:bg-gray-900 z-10">
          <button 
            onClick={() => setView('list')}
            className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <ArrowLeft size={24} className="text-gray-600 dark:text-gray-300" />
          </button>
          <h2 className="text-lg font-bold dark:text-white">챌린지 인증</h2>
        </div>

        <div className="flex-1 p-4 space-y-6 overflow-y-auto pb-24">
          <div>
            <h3 className="text-xl font-bold dark:text-white mb-2">{verifyingChallenge.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{verifyingChallenge.description}</p>
          </div>

          <div className="space-y-4">
            <div className="aspect-square rounded-2xl bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-3">
                <Plus size={32} className="text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">인증 사진 올리기</span>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                인증 내용
              </label>
              <textarea
                value={verificationText}
                onChange={(e) => setVerificationText(e.target.value)}
                placeholder="챌린지 참여 소감을 남겨주세요 (50자 이상)"
                className="w-full h-32 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-green-500 dark:text-white placeholder:text-gray-400 resize-none"
              />
               <div className="text-right text-sm text-gray-500 mt-1">
                {verificationText.length} / 50자 이상
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky bottom-24 z-10">
          <button
            onClick={handleChallengeVerifySubmit}
            disabled={verificationText.length < 50}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-colors ${
              verificationText.length < 50
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            인증 완료하기
          </button>
        </div>
      </div>
    );
  }

  // Render Detail View
  if (view === 'detail' && selectedPost) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col relative max-w-[430px] mx-auto">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-900 z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setView('list');
                setComments([]); // Clear comments when going back
              }}
              className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <ArrowLeft size={24} className="text-gray-600 dark:text-gray-300" />
            </button>
            <h2 className="text-lg font-bold dark:text-white">게시글</h2>
          </div>
          <div className="flex items-center gap-1">
          {selectedPost.isMyPost ? (
            <>
              <button
                onClick={() => startEditing(selectedPost)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Edit2 size={20} className="text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={() => handleDeletePost(selectedPost.id)}
                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
              >
                <Trash2 size={20} className="text-red-600" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setReportModalOpen(true)}
              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <AlertTriangle size={20} className="text-red-500" />
            </button>
          )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto pb-24">
          {/* Author Info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <MessageSquare className="text-green-600" size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold dark:text-white">{selectedPost.author}</span>
                {selectedPost.isMyPost && (
                  <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded">
                    내 글
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">{getTimeAgo(selectedPost.time)}</span>
            </div>
          </div>

          {/* Post Body */}
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded-full text-gray-700 dark:text-gray-300 mb-3">
              {selectedPost.category}
            </span>
            <h1 className="text-xl font-bold dark:text-white mb-3">{selectedPost.title}</h1>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {selectedPost.content}
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 py-4 border-t border-gray-100 dark:border-gray-800">
            <button 
              onClick={() => handleLike(selectedPost.id)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ThumbsUp 
                size={18} 
                className={likedPostIds.includes(selectedPost.id) ? "text-red-500 fill-red-500" : "text-gray-500"} 
              />
              <span className="dark:text-white">{selectedPost.likes}</span>
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-full">
              <MessageCircle size={18} className="text-gray-500" />
              <span className="dark:text-white">{selectedPost.comments}</span>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-6">
            <h3 className="font-bold mb-4 dark:text-white">댓글 {comments.length}</h3>
            {comments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">첫 댓글을 남겨보세요!</p>
            ) : (
              <div className="space-y-4">
                {comments.map(comment => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs">👤</span>
                    </div>
                    <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-2xl p-3">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-sm dark:text-white">{comment.author}</span>
                        <span className="text-xs text-gray-400">{getTimeAgo(comment.time)}</span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Comment Input Fixed Bottom */}
        <div className={`fixed left-0 right-0 mx-auto max-w-[430px] w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 transition-all duration-300 ${isInputFocused ? 'bottom-0 md:bottom-24 z-50' : 'bottom-24 z-30'}`}>
          {showEmojiPicker && (
            <div className="absolute bottom-full left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-2 overflow-x-auto whitespace-nowrap">
              {emojis.map(emoji => (
                <button
                  key={emoji}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => addEmoji(emoji)}
                  className="p-2 text-2xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-2 items-center">
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 text-gray-500 hover:text-green-600 dark:text-gray-400 transition-colors"
            >
              <Smile size={24} />
            </button>
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              placeholder="댓글을 입력하세요..."
              className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-green-500 dark:text-white"
            />
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleAddComment}
              disabled={!commentInput.trim()}
              className={`p-3 rounded-xl transition-colors ${
                commentInput.trim() 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800'
              }`}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
        
        <CustomAlert 
          isOpen={alertOpen} 
          title={alertTitle} 
          message={alertMessage} 
          onClose={() => setAlertOpen(false)} 
        />
        
        {/* Report Modal */}
        {reportModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full">
              <h3 className="mb-4 font-bold text-lg dark:text-white">게시글 신고</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    신고 사유
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-red-500 dark:text-white appearance-none"
                  >
                    <option>스팸/홍보</option>
                    <option>욕설/비하</option>
                    <option>음란물</option>
                    <option>기타</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    상세 내용
                  </label>
                  <textarea
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    placeholder="신고 사유를 자세히 적어주세요"
                    className="w-full h-24 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-red-500 dark:text-white placeholder:text-gray-400 resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setReportModalOpen(false)}
                  className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-semibold"
                >
                  취소
                </button>
                <button
                  onClick={handleReportSubmit}
                  className="flex-1 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold"
                >
                  신고하기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render List View (Default)
  return (
    <div className="pb-24 relative min-h-screen bg-gray-50 dark:bg-gray-900 max-w-[430px] mx-auto">
      {/* Header with Search and Trending Keywords */}
      <div className="p-4 space-y-4 bg-white dark:bg-gray-900">
        {/* Search Bar */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
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
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
              >
                <X size={16} className="text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Trending Keywords */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="text-red-500" size={18} />
            <span className="text-sm font-bold dark:text-white">실시간 인기 키워드</span>
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
      <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 z-10 shadow-sm">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('popular')}
            className={`py-3 relative font-medium transition-colors ${
              activeTab === 'popular'
                ? 'text-green-600 dark:text-green-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            인기글
            {activeTab === 'popular' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 dark:bg-green-400" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('recent')}
            className={`py-3 relative font-medium transition-colors ${
              activeTab === 'recent'
                ? 'text-green-600 dark:text-green-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            최신글
            {activeTab === 'recent' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 dark:bg-green-400" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={`py-3 relative font-medium transition-colors ${
              activeTab === 'my'
                ? 'text-green-600 dark:text-green-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            내글
            {activeTab === 'my' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 dark:bg-green-400" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('challenges')}
            className={`py-3 relative font-medium transition-colors ${
              activeTab === 'challenges'
                ? 'text-green-600 dark:text-green-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            챌린지
            {activeTab === 'challenges' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 dark:bg-green-400" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('ranking')}
            className={`py-3 relative font-medium transition-colors ${
              activeTab === 'ranking'
                ? 'text-green-600 dark:text-green-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            랭킹
            {activeTab === 'ranking' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 dark:bg-green-400" />
            )}
          </button>
        </div>
      </div>

      {/* Challenges Tab */}
      {activeTab === 'challenges' && (
        <div className="p-4 space-y-4">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg dark:text-white mb-1">{challenge.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{challenge.description}</p>
                </div>
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-bold">
                  {challenge.points}P
                </span>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                  <span>참여자 {challenge.participants}명</span>
                  <span>{challenge.isCompleted ? '완료됨' : challenge.isJoined ? '진행중' : ''}</span>
                </div>
                {challenge.isJoined && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-4">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full" 
                      style={{ width: `${(challenge.progress / challenge.maxProgress) * 100}%` }}
                    ></div>
                  </div>
                )}
                
                {!challenge.isJoined ? (
                  <button
                    onClick={() => handleJoinChallenge(challenge.id)}
                    className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    참여하기
                  </button>
                ) : challenge.isCompleted ? (
                  <div className="flex gap-2">
                    <button
                      disabled
                      className="flex-1 py-2 rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 font-medium"
                    >
                      완료
                    </button>
                    <button
                      onClick={() => handleChallengeUndo(challenge.id)}
                      className="px-4 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors font-medium text-sm"
                    >
                      취소
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleChallengeVerifyStart(challenge)}
                    className="w-full py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
                  >
                    인증하고 완료하기
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ranking Tab */}
      {activeTab === 'ranking' && (
        <div className="p-4 space-y-4">
          {/* My Ranking Card */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg">나의 랭킹</h3>
              <span className="bg-white/20 px-2 py-1 rounded-lg text-sm backdrop-blur-sm">
                {rankingFilter === 'all' ? '전체' : '우리 동네'}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl">
                {getMyRanking().avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{getMyRanking().rank}위</span>
                  <span className="text-sm opacity-90">/ 상위 15%</span>
                </div>
                <div className="text-sm opacity-90">{getMyRanking().username}</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{getMyRanking().points.toLocaleString()}</div>
                <div className="text-sm opacity-90">Points</div>
              </div>
            </div>
          </div>

          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            <button
              onClick={() => setRankingFilter('all')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                rankingFilter === 'all'
                  ? 'bg-white dark:bg-gray-700 text-green-600 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              전체 랭킹
            </button>
            <button
              onClick={() => setRankingFilter('region')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                rankingFilter === 'region'
                  ? 'bg-white dark:bg-gray-700 text-green-600 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              우리 동네
            </button>
          </div>

          <div className="space-y-2">
            {filteredRankings().map((user, index) => (
              <div key={index} className={`flex items-center gap-4 p-4 rounded-xl border ${
                user.username === '지구지킴이' // Mock current user check
                  ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                  : 'bg-white border-gray-100 dark:bg-gray-800 dark:border-gray-700'
              }`}>
                <div className={`w-8 h-8 flex items-center justify-center font-bold rounded-full ${
                  user.rank <= 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {user.rank}
                </div>
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                  {user.avatar}
                </div>
                <div className="flex-1">
                  <div className="font-bold dark:text-white">{user.username}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{user.region}</div>
                </div>
                <div className="font-bold text-green-600">
                  {user.points.toLocaleString()}P
                </div>
              </div>
            ))}
            {filteredRankings().length === 0 && (
              <div className="text-center py-12 text-gray-500">
                해당 지역의 랭킹 정보가 없습니다.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Posts */}
      {(activeTab === 'popular' || activeTab === 'recent' || activeTab === 'my') && (
      <div className="p-4 space-y-4">
        {filteredPosts().map((post) => (
          <div 
            key={post.id} 
            onClick={() => handlePostClick(post)}
            className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer active:scale-[0.99] transition-transform"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="text-green-600" size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold dark:text-white truncate">{post.author}</span>
                    {post.isMyPost && (
                      <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded flex-shrink-0">
                        내 글
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{getTimeAgo(post.time)}</span>
                </div>
              </div>
              {post.isMyPost && (
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={(e) => startEditing(post, e)}
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

            <h4 className="text-lg font-bold dark:text-white mb-2 line-clamp-1">{post.title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">{post.content}</p>

            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <button
                onClick={(e) => handleLike(post.id, e)}
                className="flex items-center gap-1 hover:text-red-500 transition-colors p-1 -ml-1"
              >
                <ThumbsUp 
                  size={16} 
                  className={likedPostIds.includes(post.id) ? "text-red-500 fill-red-500" : ""}
                />
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
      )}

      {/* Floating Write Button - Fixed to viewport but constrained to width */}
      {(activeTab === 'popular' || activeTab === 'recent' || activeTab === 'my') && (
      <div className="fixed bottom-0 left-0 right-0 mx-auto max-w-[430px] w-full h-0 z-20 overflow-visible pointer-events-none">
        <button
          onClick={startWriting}
          className="absolute right-4 bottom-28 w-14 h-14 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all hover:scale-110 flex items-center justify-center shadow-green-600/30 pointer-events-auto"
        >
          <Plus size={24} />
        </button>
      </div>
      )}
    </div>
  );
}
