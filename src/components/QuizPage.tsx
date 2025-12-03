import { useState, useEffect } from 'react';
import { Trophy, Clock, CheckCircle, XCircle, ChevronRight, History } from 'lucide-react';

interface QuizPageProps {
  onAddPoints: (points: number, reason?: string) => void;
  onNavigateToHistory?: () => void;
}

type QuestionType = 'ox' | 'multiple' | 'short' | 'essay';

interface Question {
  id: number;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  points: number;
}

const quizDatabase: Question[] = [
  // OX 퀴즈
  {
    id: 1,
    type: 'ox',
    question: '플라스틱 페트병은 라벨을 제거하고 배출해야 한다.',
    correctAnswer: 'O',
    explanation: '페트병은 라벨과 뚜껑을 제거하고, 내용물을 비운 후 압착하여 배출해야 합니다.',
    points: 100,
  },
  {
    id: 2,
    type: 'ox',
    question: '비닐봉지는 플라스틱류에 배출한다.',
    correctAnswer: 'X',
    explanation: '비닐봉지는 플라스틱이 아닌 비닐류로 따로 분리배출해야 합니다.',
    points: 100,
  },
  {
    id: 3,
    type: 'ox',
    question: '음식물이 묻은 종이는 재활용이 가능하다.',
    correctAnswer: 'X',
    explanation: '음식물이 묻은 종이는 재활용이 불가능하여 일반쓰레기로 배출해야 합니다.',
    points: 100,
  },
  {
    id: 4,
    type: 'ox',
    question: '우유팩은 일반 종이류와 함께 배출한다.',
    correctAnswer: 'X',
    explanation: '우유팩은 일반 종이와 달리 코팅이 되어있어 별도로 분리하여 배출해야 합니다.',
    points: 100,
  },
  // 객관식
  {
    id: 5,
    type: 'multiple',
    question: '다음 중 플라스틱으로 분류되지 않는 것은?',
    options: ['페트병', '스티로폼', '비닐봉지', '플라스틱 용기'],
    correctAnswer: '비닐봉지',
    explanation: '비닐봉지는 플라스틱이 아닌 비닐류로 분류됩니다.',
    points: 150,
  },
  {
    id: 6,
    type: 'multiple',
    question: '유리병을 배출할 때 올바른 방법은?',
    options: [
      '뚜껑을 닫고 배출',
      '내용물을 비우고 뚜껑을 분리하여 배출',
      '깨뜨려서 배출',
      '씻지 않고 그대로 배출'
    ],
    correctAnswer: '내용물을 비우고 뚜껑을 분리하여 배출',
    explanation: '유리병은 내용물을 비우고 뚜껑(플라스틱, 금속)을 분리한 후 배출해야 합니다.',
    points: 150,
  },
  {
    id: 7,
    type: 'multiple',
    question: '일회용 마스크는 어디에 버려야 하나요?',
    options: ['플라스틱', '비닐류', '종량제 봉투', '의료폐기물'],
    correctAnswer: '종량제 봉투',
    explanation: '일회용 마스크는 재활용이 불가능하며 종량제 봉투에 버려야 합니다.',
    points: 150,
  },
  {
    id: 8,
    type: 'multiple',
    question: '분리수거 시 가장 중요한 원칙은?',
    options: [
      '빠르게 버리기',
      '비우고, 헹구고, 분리하고, 섞지 않기',
      '모두 섞어서 버리기',
      '크기별로 분류하기'
    ],
    correctAnswer: '비우고, 헹구고, 분리하고, 섞지 않기',
    explanation: '분리수거의 4대 원칙은 "비우고, 헹구고, 분리하고, 섞지 않기"입니다.',
    points: 150,
  },
  // 단답형
  {
    id: 9,
    type: 'short',
    question: '플라스틱 분리수거 마크에서 숫자가 낮을수록 재활용이 ___합니다. (쉽다/어렵다)',
    correctAnswer: ['쉽다', '쉽습니다'],
    explanation: '플라스틱 재질 표시 숫자(1~7)에서 숫자가 낮을수록 재활용이 쉽습니다.',
    points: 200,
  },
  {
    id: 10,
    type: 'short',
    question: '종이팩(우유팩 등)은 씻어서 말린 후 ___하여 배출합니다.',
    correctAnswer: ['펼쳐', '펴서', '펼쳐서'],
    explanation: '우유팩 등 종이팩은 씻어서 말린 후 펼쳐서 배출하면 재활용이 용이합니다.',
    points: 200,
  },
  {
    id: 11,
    type: 'short',
    question: '음식물 쓰레기는 물기를 ___한 후 배출해야 합니다.',
    correctAnswer: ['제거', '제거한', '빼고', '뺀'],
    explanation: '음식물 쓰레기는 물기를 최대한 제거한 후 배출해야 처리가 용이합니다.',
    points: 200,
  },
  // 서술형
  {
    id: 12,
    type: 'essay',
    question: '플라스틱 페트병을 올바르게 배출하는 방법을 3가지 이상 서술하세요.',
    correctAnswer: ['라벨제거', '뚜껑분리', '내용물비우기', '압착', '헹구기'],
    explanation: '페트병은 1) 라벨 제거, 2) 뚜껑 분리, 3) 내용물 비우고 헹구기, 4) 압착하여 배출해야 합니다.',
    points: 300,
  },
  {
    id: 13,
    type: 'essay',
    question: '분리수거가 환경에 미치는 긍정적인 영향을 설명하세요.',
    correctAnswer: ['자원재활용', '환경보호', '에너지절약', '탄소배출감소'],
    explanation: '분리수거는 자원 재활용, 에너지 절약, 탄소 배출 감소, 환경 보호 등 다양한 긍정적 영향을 미칩니다.',
    points: 300,
  },
];

export function QuizPage({ onAddPoints, onNavigateToHistory }: QuizPageProps) {
  const [currentQuizSet, setCurrentQuizSet] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [showResult, setShowResult] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes

  const startQuiz = () => {
    // Randomly select 3 questions
    const shuffled = [...quizDatabase].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);
    setCurrentQuizSet(selected);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowResult(false);
    setQuizStarted(true);
    setScore(0);
    setTimeLeft(180);

    // Start timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleAnswer = (answer: string) => {
    setUserAnswers({ ...userAnswers, [currentQuizSet[currentQuestionIndex].id]: answer });
  };

  const handleNext = () => {
    if (currentQuestionIndex < currentQuizSet.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const checkAnswer = (question: Question, userAnswer: string): boolean => {
    if (Array.isArray(question.correctAnswer)) {
      // For short answer and essay questions
      return question.correctAnswer.some(answer => 
        userAnswer.toLowerCase().includes(answer.toLowerCase())
      );
    }
    return userAnswer === question.correctAnswer;
  };

  const handleSubmit = () => {
    let totalScore = 0;
    let correctCount = 0;

    currentQuizSet.forEach((question) => {
      const userAnswer = userAnswers[question.id] || '';
      if (checkAnswer(question, userAnswer)) {
        totalScore += question.points;
        correctCount++;
      }
    });

    setScore(totalScore);
    setShowResult(true);
    onAddPoints(totalScore, `퀴즈 ${correctCount}개 정답`);

    // Save to history
    const history = JSON.parse(localStorage.getItem('quizHistory') || '[]');
    history.unshift({
      date: new Date().toISOString(),
      score: totalScore,
      total: currentQuizSet.reduce((sum, q) => sum + q.points, 0),
      correctCount,
      totalQuestions: currentQuizSet.length,
      questions: currentQuizSet.map(q => ({
        question: q.question,
        userAnswer: userAnswers[q.id] || '답변 없음',
        correctAnswer: Array.isArray(q.correctAnswer) ? q.correctAnswer.join(', ') : q.correctAnswer,
        isCorrect: checkAnswer(q, userAnswers[q.id] || ''),
        explanation: q.explanation,
      })),
    });
    localStorage.setItem('quizHistory', JSON.stringify(history.slice(0, 50))); // Keep last 50
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = quizStarted ? currentQuizSet[currentQuestionIndex] : null;
  const userAnswer = currentQuestion ? userAnswers[currentQuestion.id] || '' : '';

  if (showResult) {
    const totalPossibleScore = currentQuizSet.reduce((sum, q) => sum + q.points, 0);
    const correctCount = currentQuizSet.filter(q => checkAnswer(q, userAnswers[q.id] || '')).length;

    return (
      <div className="p-4 pb-24">
        <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-8 text-white text-center mb-6">
          <Trophy size={64} className="mx-auto mb-4" />
          <h2 className="mb-2">퀴즈 완료!</h2>
          <p className="text-3xl mb-2">{score}P</p>
          <p className="text-sm opacity-90">
            {correctCount}/{currentQuizSet.length} 문제 정답
          </p>
        </div>

        <div className="space-y-4">
          {currentQuizSet.map((question, idx) => {
            const isCorrect = checkAnswer(question, userAnswers[question.id] || '');
            return (
              <div
                key={question.id}
                className={`bg-white dark:bg-gray-800 rounded-2xl p-5 border-2 ${
                  isCorrect ? 'border-green-500' : 'border-red-500'
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  {isCorrect ? (
                    <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
                  ) : (
                    <XCircle className="text-red-500 flex-shrink-0" size={24} />
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">문제 {idx + 1}</p>
                    <p className="dark:text-white mb-2">{question.question}</p>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-700 dark:text-gray-300">
                        내 답: <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                          {userAnswers[question.id] || '답변 없음'}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p className="text-gray-700 dark:text-gray-300">
                          정답: <span className="text-green-600">
                            {Array.isArray(question.correctAnswer) 
                              ? question.correctAnswer[0] 
                              : question.correctAnswer}
                          </span>
                        </p>
                      )}
                      <p className="text-gray-600 dark:text-gray-400 text-xs bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        💡 {question.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => {
            setQuizStarted(false);
            setShowResult(false);
          }}
          className="w-full mt-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
        >
          새 퀴즈 시작
        </button>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="p-4 pb-24">
        <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-6 text-white mb-6">
          <h2 className="mb-2">오늘의 퀴즈</h2>
          <p className="text-sm opacity-90">재미있는 퀴즈로 환경 지식을 쌓아보세요!</p>
        </div>

        {onNavigateToHistory && (
          <button
            onClick={onNavigateToHistory}
            className="w-full mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <History className="text-blue-600" size={24} />
              <div className="text-left">
                <p className="dark:text-white">내가 푼 퀴즈</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">지금까지 푼 퀴즈 기록 보기</p>
              </div>
            </div>
            <ChevronRight className="text-gray-400" size={20} />
          </button>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
          <h3 className="dark:text-white mb-4">퀴즈 안내</h3>
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>총 3문제가 출제됩니다</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>제한 시간은 3분입니다</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>OX, 객관식, 단답형, 서술형 문제가 출제됩니다</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>문제 유형에 따라 100~300 포인트를 획득할 수 있습니다</span>
            </div>
          </div>
        </div>

        <button
          onClick={startQuiz}
          className="w-full py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          <Trophy size={20} />
          <span>퀴즈 시작하기</span>
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24">
      {/* Progress Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="text-gray-500" size={18} />
            <span className={`text-sm ${timeLeft < 60 ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {currentQuestionIndex + 1} / {currentQuizSet.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-green-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / currentQuizSet.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      {currentQuestion && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full">
              {currentQuestion.type === 'ox' && 'OX 퀴즈'}
              {currentQuestion.type === 'multiple' && '객관식'}
              {currentQuestion.type === 'short' && '단답형'}
              {currentQuestion.type === 'essay' && '서술형'}
            </span>
            <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs rounded-full">
              +{currentQuestion.points}P
            </span>
          </div>

          <h3 className="dark:text-white mb-6">{currentQuestion.question}</h3>

          {/* OX Questions */}
          {currentQuestion.type === 'ox' && (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleAnswer('O')}
                className={`py-6 rounded-xl border-2 text-xl transition-all ${
                  userAnswer === 'O'
                    ? 'border-green-600 bg-green-50 dark:bg-green-900/20 text-green-600'
                    : 'border-gray-200 dark:border-gray-600 hover:border-green-400 dark:text-white'
                }`}
              >
                O
              </button>
              <button
                onClick={() => handleAnswer('X')}
                className={`py-6 rounded-xl border-2 text-xl transition-all ${
                  userAnswer === 'X'
                    ? 'border-red-600 bg-red-50 dark:bg-red-900/20 text-red-600'
                    : 'border-gray-200 dark:border-gray-600 hover:border-red-400 dark:text-white'
                }`}
              >
                X
              </button>
            </div>
          )}

          {/* Multiple Choice */}
          {currentQuestion.type === 'multiple' && currentQuestion.options && (
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    userAnswer === option
                      ? 'border-green-600 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-green-400'
                  }`}
                >
                  <span className="dark:text-white">{option}</span>
                </button>
              ))}
            </div>
          )}

          {/* Short Answer */}
          {currentQuestion.type === 'short' && (
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder="답을 입력하세요"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-green-500 dark:text-white"
            />
          )}

          {/* Essay */}
          {currentQuestion.type === 'essay' && (
            <textarea
              value={userAnswer}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder="답을 작성하세요 (키워드 포함 여부로 채점됩니다)"
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-green-500 dark:text-white resize-none"
            />
          )}
        </div>
      )}

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={!userAnswer}
        className="w-full py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {currentQuestionIndex < currentQuizSet.length - 1 ? (
          <>
            <span>다음 문제</span>
            <ChevronRight size={20} />
          </>
        ) : (
          <>
            <CheckCircle size={20} />
            <span>제출하기</span>
          </>
        )}
      </button>
    </div>
  );
}
