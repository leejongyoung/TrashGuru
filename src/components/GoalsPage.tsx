import { ArrowLeft, Target, Plus, Trash2, Check, Calendar, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface GoalsPageProps {
  onBack: () => void;
}

interface Goal {
  id: number;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  category: string;
  icon: string;
  dueDate: string;
  completed: boolean;
}

export function GoalsPage({ onBack }: GoalsPageProps) {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 1,
      title: '이번 주 퀴즈 완료',
      description: '주간 퀴즈 5개 완료하기',
      target: 5,
      current: 3,
      unit: '개',
      category: 'quiz',
      icon: '📝',
      dueDate: '2025.12.08',
      completed: false,
    },
    {
      id: 2,
      title: '포인트 모으기',
      description: '2,000 포인트 적립하기',
      target: 2000,
      current: 1250,
      unit: 'P',
      category: 'points',
      icon: '💰',
      dueDate: '2025.12.31',
      completed: false,
    },
    {
      id: 3,
      title: '쓰레기 인식',
      description: '이번 달 쓰레기 20개 인식',
      target: 20,
      current: 12,
      unit: '개',
      category: 'recognition',
      icon: '📸',
      dueDate: '2025.12.31',
      completed: false,
    },
    {
      id: 4,
      title: '커뮤니티 활동',
      description: '게시글 5개 작성하기',
      target: 5,
      current: 5,
      unit: '개',
      category: 'community',
      icon: '💬',
      dueDate: '2025.11.30',
      completed: true,
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    target: 10,
    category: 'quiz',
    dueDate: '',
  });

  const deleteGoal = (id: number) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const addGoal = () => {
    const categoryIcons: { [key: string]: string } = {
      quiz: '📝',
      points: '💰',
      recognition: '📸',
      community: '💬',
      daily: '📅',
    };

    const newGoalData: Goal = {
      id: Date.now(),
      title: newGoal.title,
      description: newGoal.description,
      target: newGoal.target,
      current: 0,
      unit: newGoal.category === 'points' ? 'P' : '개',
      category: newGoal.category,
      icon: categoryIcons[newGoal.category],
      dueDate: newGoal.dueDate,
      completed: false,
    };

    setGoals([...goals, newGoalData]);
    setShowAddModal(false);
    setNewGoal({
      title: '',
      description: '',
      target: 10,
      category: 'quiz',
      dueDate: '',
    });
  };

  const activeGoals = goals.filter(g => !g.completed);
  const completedGoals = goals.filter(g => g.completed);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={24} />
          </button>
          <h2>목표 설정</h2>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-4 pb-24">
        {/* Stats */}
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Target className="text-white" size={32} />
            </div>
            <div>
              <h3 className="mb-1">목표 현황</h3>
              <p className="text-sm opacity-90">
                진행 중 {activeGoals.length}개 · 완료 {completedGoals.length}개
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <p className="text-xs opacity-75 mb-1">달성률</p>
              <p className="text-xl">
                {goals.length > 0
                  ? Math.round((completedGoals.length / goals.length) * 100)
                  : 0}
                %
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <p className="text-xs opacity-75 mb-1">평균 진행도</p>
              <p className="text-xl">
                {activeGoals.length > 0
                  ? Math.round(
                      activeGoals.reduce((sum, g) => sum + (g.current / g.target) * 100, 0) /
                        activeGoals.length
                    )
                  : 0}
                %
              </p>
            </div>
          </div>
        </div>

        {/* Active Goals */}
        {activeGoals.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200">
            <div className="p-4 border-b border-gray-100">
              <h3 className="flex items-center gap-2">
                <TrendingUp className="text-blue-600" size={20} />
                진행 중인 목표
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {activeGoals.map((goal) => (
                <div key={goal.id} className="p-4">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                      {goal.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h4>{goal.title}</h4>
                        <button
                          onClick={() => deleteGoal(goal.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                      <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                        <Calendar size={14} />
                        <span>마감: {goal.dueDate}</span>
                      </div>
                      <div className="mb-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">
                            {goal.current.toLocaleString()} / {goal.target.toLocaleString()}{' '}
                            {goal.unit}
                          </span>
                          <span className="text-sm text-blue-600">
                            {Math.round((goal.current / goal.target) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{
                              width: `${Math.min((goal.current / goal.target) * 100, 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Goals */}
        {completedGoals.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200">
            <div className="p-4 border-b border-gray-100">
              <h3 className="flex items-center gap-2">
                <Check className="text-green-600" size={20} />
                완료된 목표
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {completedGoals.map((goal) => (
                <div key={goal.id} className="p-4 bg-green-50/50">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                      {goal.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="text-gray-700">{goal.title}</h4>
                        <div className="flex items-center gap-1 text-green-600">
                          <Check size={16} />
                          <span className="text-xs">완료</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-green-600">
                          {goal.target.toLocaleString()} {goal.unit} 달성!
                        </span>
                        <button
                          onClick={() => deleteGoal(goal.id)}
                          className="text-xs text-red-600 hover:underline"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {goals.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="text-gray-400" size={32} />
            </div>
            <h3 className="text-gray-600 mb-2">목표가 없습니다</h3>
            <p className="text-sm text-gray-500 mb-4">
              새로운 목표를 설정하고 달성해보세요!
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
            >
              목표 추가하기
            </button>
          </div>
        )}
      </div>

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="mb-4">새 목표 추가</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">목표 이름</label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  placeholder="예: 이번 주 퀴즈 완료"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">설명</label>
                <input
                  type="text"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  placeholder="예: 주간 퀴즈 5개 완료하기"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">카테고리</label>
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
                >
                  <option value="quiz">퀴즈</option>
                  <option value="points">포인트</option>
                  <option value="recognition">쓰레기 인식</option>
                  <option value="community">커뮤니티</option>
                  <option value="daily">일일 목표</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">목표 수치</label>
                <input
                  type="number"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal({ ...newGoal, target: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">마감일</label>
                <input
                  type="date"
                  value={newGoal.dueDate}
                  onChange={(e) => setNewGoal({ ...newGoal, dueDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 border border-gray-300 rounded-xl hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={addGoal}
                disabled={!newGoal.title || !newGoal.description || !newGoal.dueDate}
                className="flex-1 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:bg-gray-300"
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
