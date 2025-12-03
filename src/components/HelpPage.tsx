import { ArrowLeft, HelpCircle, Mail, MessageCircle, Book, FileText } from 'lucide-react';
import { useState } from 'react';

interface HelpPageProps {
  onBack: () => void;
  language: 'ko' | 'en';
}

export function HelpPage({ onBack, language }: HelpPageProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const content = {
    ko: {
      title: '도움말 및 지원',
      faq: {
        title: '자주 묻는 질문',
        items: [
          {
            question: '포인트는 어떻게 획득하나요?',
            answer: '퀴즈를 풀거나, 쓰레기를 인식하거나, 커뮤니티에 참여하면 포인트를 획득할 수 있습니다. 업적을 달성해도 보너스 포인트를 받을 수 있습니다.',
          },
          {
            question: '카메라 인식이 잘 안되는데 어떻게 하나요?',
            answer: '밝은 곳에서 촬영하고, 쓰레기가 화면 중앙에 오도록 배치해주세요. 그리드 가이드를 참고하면 더 정확한 인식이 가능합니다.',
          },
          {
            question: '획득한 포인트는 어디에 사용하나요?',
            answer: '상점에서 다양한 상품을 구매하거나, 환경 기부에 참여할 수 있습니다.',
          },
          {
            question: '비밀번호를 잊어버렸어요.',
            answer: '로그인 화면에서 "비밀번호 찾기"를 클릭하여 이메일로 재설정 링크를 받을 수 있습니다.',
          },
          {
            question: '목표는 어떻게 설정하나요?',
            answer: '마이페이지에서 "목표 설정"을 선택하고 + 버튼을 눌러 새로운 목표를 추가할 수 있습니다.',
          },
        ],
      },
      guides: {
        title: '사용 가이드',
        items: [
          {
            title: '쓰레기 인식하기',
            content: '검색/카메라 탭에서 카메라 버튼을 누르고, 쓰레기를 촬영하면 AI가 자동으로 분류해드립니다.',
          },
          {
            title: '퀴즈 풀기',
            content: '퀴즈 탭에서 OX 퀴즈나 환경상식 퀴즈를 풀어 포인트를 획득하세요.',
          },
          {
            title: '커뮤니티 참여',
            content: '커뮤니티에서 분리수거 팁을 공유하고 다른 사용자들과 소통하세요.',
          },
          {
            title: '업적 달성',
            content: '다양한 활동을 통해 업적을 달성하고 특별 보상을 받으세요.',
          },
        ],
      },
      contact: {
        title: '문의하기',
        description: '더 궁금한 점이 있으시면 아래 방법으로 문의해주세요.',
        email: 'leejongyoung98@inha.edu',
        response: '평균 응답 시간: 24시간 이내',
      },
    },
    en: {
      title: 'Help & Support',
      faq: {
        title: 'Frequently Asked Questions',
        items: [
          {
            question: 'How do I earn points?',
            answer: 'You can earn points by solving quizzes, recognizing waste, or participating in the community. You can also receive bonus points by achieving milestones.',
          },
          {
            question: 'Camera recognition is not working well. What should I do?',
            answer: 'Take pictures in a well-lit area and place the waste in the center of the screen. Use the grid guide for more accurate recognition.',
          },
          {
            question: 'Where can I use the points I earned?',
            answer: 'You can purchase various products at the store or participate in environmental donations.',
          },
          {
            question: 'I forgot my password.',
            answer: 'Click "Forgot Password" on the login screen to receive a reset link via email.',
          },
          {
            question: 'How do I set goals?',
            answer: 'Select "Goal Settings" from My Page and press the + button to add a new goal.',
          },
        ],
      },
      guides: {
        title: 'User Guide',
        items: [
          {
            title: 'Recognize Waste',
            content: 'Press the camera button in the Search/Camera tab and take a picture of the waste. AI will automatically classify it.',
          },
          {
            title: 'Take Quizzes',
            content: 'Solve OX quizzes or environmental knowledge quizzes in the Quiz tab to earn points.',
          },
          {
            title: 'Join Community',
            content: 'Share recycling tips and communicate with other users in the community.',
          },
          {
            title: 'Achieve Milestones',
            content: 'Achieve milestones through various activities and receive special rewards.',
          },
        ],
      },
      contact: {
        title: 'Contact Us',
        description: 'If you have any questions, please contact us using the methods below.',
        email: 'leejongyoung98@inha.edu',
        response: 'Average response time: Within 24 hours',
      },
    },
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <ArrowLeft size={24} className="dark:text-white" />
        </button>
        <h2 className="dark:text-white">{t.title}</h2>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-4 pb-24">
        {/* FAQ Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <h3 className="flex items-center gap-2 dark:text-white">
              <HelpCircle className="text-green-600" size={20} />
              {t.faq.title}
            </h3>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {t.faq.items.map((item, idx) => (
              <div key={idx}>
                <button
                  onClick={() => setActiveSection(activeSection === `faq-${idx}` ? null : `faq-${idx}`)}
                  className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm dark:text-white">{item.question}</p>
                    <span className="text-gray-400 dark:text-gray-500 flex-shrink-0">
                      {activeSection === `faq-${idx}` ? '−' : '+'}
                    </span>
                  </div>
                </button>
                {activeSection === `faq-${idx}` && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* User Guide */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <h3 className="flex items-center gap-2 dark:text-white">
              <Book className="text-blue-600" size={20} />
              {t.guides.title}
            </h3>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {t.guides.items.map((item, idx) => (
              <div key={idx} className="p-4">
                <h4 className="mb-2 dark:text-white">{item.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-br from-green-400 to-green-600 text-white rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Mail size={24} />
            </div>
            <h3>{t.contact.title}</h3>
          </div>
          <p className="text-sm opacity-90 mb-4">{t.contact.description}</p>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Mail size={18} />
              <div>
                <p className="text-xs opacity-75 mb-1">Email</p>
                <p className="text-sm">{t.contact.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MessageCircle size={18} />
              <div>
                <p className="text-xs opacity-75 mb-1">{language === 'ko' ? '응답 시간' : 'Response Time'}</p>
                <p className="text-sm">{t.contact.response}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <FileText className="text-blue-600 dark:text-blue-400 flex-shrink-0" size={20} />
            <div>
              <h4 className="mb-2 text-blue-900 dark:text-blue-300">
                {language === 'ko' ? '💡 팁' : '💡 Tip'}
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-400">
                {language === 'ko'
                  ? '앱 사용 중 문제가 발생하면 설정에서 "계정 데이터 삭제"를 통해 초기화할 수 있습니다. 단, 모든 데이터가 삭제되니 주의하세요.'
                  : 'If you encounter problems while using the app, you can reset it through "Delete Account Data" in settings. Please note that all data will be deleted.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
