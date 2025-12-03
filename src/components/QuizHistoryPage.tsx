import { Trophy, Calendar, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';

interface QuizHistoryItem {
  date: string;
  score: number;
  total: number;
  correctCount: number;
  totalQuestions: number;
  questions: Array<{
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation: string;
  }>;
}

export function QuizHistoryPage() {
  const [history, setHistory] = useState<QuizHistoryItem[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('quizHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return '오늘';
    if (days === 1) return '어제';
    if (days < 7) return `${days}일 전`;
    
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const totalQuizzes = history.length;
  const totalScore = history.reduce((sum, item) => sum + item.score, 0);
  const averageScore = totalQuizzes > 0 ? Math.round(totalScore / totalQuizzes) : 0;
  const totalCorrect = history.reduce((sum, item) => sum + item.correctCount, 0);
  const totalQuestions = history.reduce((sum, item) => sum + item.totalQuestions, 0);
  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  return (
    <div className="p-4 pb-24">
      {/* Stats Summary */}
      <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-6 text-white mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Trophy size={24} />
          <h2>퀴즈 통계</h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl mb-1">{totalQuizzes}</p>
            <p className="text-xs opacity-80">총 퀴즈 수</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl mb-1">{averageScore}P</p>
            <p className="text-xs opacity-80">평균 점수</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl mb-1">{accuracy}%</p>
            <p className="text-xs opacity-80">정답률</p>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {history.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">아직 푼 퀴즈가 없습니다</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">퀴즈를 풀고 기록을 쌓아보세요!</p>
          </div>
        ) : (
          history.map((item, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <button
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className="w-full p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    (item.score / item.total) >= 0.8
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                      : (item.score / item.total) >= 0.5
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-600'
                  }`}>
                    <Trophy size={24} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="text-gray-400" size={14} />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(item.date)}
                      </span>
                    </div>
                    <p className="dark:text-white mb-1">
                      {item.score}P / {item.total}P
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.correctCount}/{item.totalQuestions} 정답 ({Math.round((item.correctCount / item.totalQuestions) * 100)}%)
                    </p>
                  </div>
                </div>
                {expandedIndex === index ? (
                  <ChevronUp className="text-gray-400" size={20} />
                ) : (
                  <ChevronDown className="text-gray-400" size={20} />
                )}
              </button>

              {/* Expanded Details */}
              {expandedIndex === index && (
                <div className="px-5 pb-5 space-y-4 border-t border-gray-100 dark:border-gray-700 pt-4">
                  {item.questions.map((question, qIdx) => (
                    <div
                      key={qIdx}
                      className={`p-4 rounded-xl border-2 ${
                        question.isCorrect
                          ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10'
                          : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10'
                      }`}
                    >
                      <div className="flex items-start gap-2 mb-3">
                        {question.isCorrect ? (
                          <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
                        ) : (
                          <XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
                        )}
                        <div className="flex-1">
                          <p className="text-sm dark:text-white mb-2">{question.question}</p>
                          <div className="space-y-1 text-xs">
                            <p className="text-gray-700 dark:text-gray-300">
                              내 답: <span className={question.isCorrect ? 'text-green-600' : 'text-red-600'}>
                                {question.userAnswer}
                              </span>
                            </p>
                            {!question.isCorrect && (
                              <p className="text-gray-700 dark:text-gray-300">
                                정답: <span className="text-green-600">{question.correctAnswer}</span>
                              </p>
                            )}
                            <p className="text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-2 rounded mt-2">
                              💡 {question.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
