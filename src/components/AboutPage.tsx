import { ArrowLeft, Mail, Globe, Heart, Code, Users } from 'lucide-react';

interface AboutPageProps {
  onBack: () => void;
  onNavigateToRoleManagement?: () => void;
}

export function AboutPage({ onBack, onNavigateToRoleManagement }: AboutPageProps) {
  const developers = [
    {
      name: '강건희',
      role: 'Lead Developer / UI/UX Designer',
      avatar: '👨‍💻',
    },
    {
      name: '송수연',
      role: 'Backend Developer',
      avatar: '👩‍💻',
    },
    {
      name: '염가영',
      role: 'Frontend Developer',
      avatar: '🧑‍💻',
    },
    {
      name: '이종영',
      role: 'Full Stack Developer',
      avatar: '👨‍💻',
    },
  ];

  const features = [
    { icon: '📸', title: 'AI 쓰레기 인식', desc: '사진으로 쉽게 분류' },
    { icon: '🎮', title: '재미있는 퀴즈', desc: '포인트 적립 시스템' },
    { icon: '💬', title: '커뮤니티', desc: '정보 공유 및 소통' },
    { icon: '🏪', title: '포인트 상점', desc: '친환경 상품 교환' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={24} />
        </button>
        <h2>정보</h2>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-4 pb-24">
        {/* Company Info */}
        <div className="bg-gradient-to-br from-green-400 to-green-600 text-white rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <span className="text-3xl">🗑️</span>
            </div>
            <div>
              <h1 className="mb-1">쓰레기박사</h1>
              <p className="text-sm opacity-90">Trash Guru</p>
            </div>
          </div>
          <p className="text-sm opacity-90 leading-relaxed">
            환경을 생각하는 스마트 분리수거 도우미 애플리케이션입니다.
            AI 기술과 게임화 요소를 결합하여 누구나 쉽고 재미있게 올바른 분리수거를 실천할 수 있도록 돕습니다.
          </p>
        </div>

        {/* Version & Copyright */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">버전</span>
              <span className="text-gray-900">1.0.0</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">출시일</span>
              <span className="text-gray-900">2025.12.02</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">개발사</span>
              <span className="text-gray-900">분반쓰. Team.</span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <h3 className="mb-4 flex items-center gap-2">
            <Heart className="text-green-600" size={20} />
            주요 기능
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">{feature.icon}</div>
                <p className="text-sm mb-1">{feature.title}</p>
                <p className="text-xs text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Developers */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <h3 className="mb-4 flex items-center gap-2">
            <Users className="text-green-600" size={20} />
            프로젝트 구성원
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {developers.map((dev, idx) => (
              <div key={idx} className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mb-2">
                  {dev.avatar}
                </div>
                <h4 className="mb-1 text-center">{dev.name}</h4>
                <p className="text-xs text-gray-600 text-center">{dev.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <h3 className="mb-4 flex items-center gap-2">
            <Code className="text-green-600" size={20} />
            기술 스택
          </h3>
          <div className="flex flex-wrap gap-2">
            {['React', 'TypeScript', 'Tailwind CSS', 'Lucide Icons', 'LocalStorage API'].map((tech, idx) => (
              <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <h3 className="mb-4 flex items-center gap-2">
            <Globe className="text-green-600" size={20} />
            연락처
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Mail className="text-gray-500" size={20} />
              <div className="flex-1 min-w-0">
                <p className="text-gray-600 text-xs mb-1">이메일</p>
                <p className="text-gray-900 truncate">leejongyoung98@inha.edu</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Globe className="text-gray-500" size={20} />
              <div className="flex-1 min-w-0">
                <p className="text-gray-600 text-xs mb-1">웹사이트</p>
                <p className="text-gray-900 truncate">orchid-flame-51465142.figma.site</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Globe className="text-gray-500" size={20} />
              <div className="flex-1 min-w-0">
                <p className="text-gray-600 text-xs mb-1">GitHub</p>
                <p className="text-gray-900 truncate">github.com/leejongyoung</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
          <h3 className="text-green-800 mb-3">우리의 미션</h3>
          <p className="text-sm text-green-700 leading-relaxed">
            쓰레기박사는 모든 사람이 올바른 분리수거를 쉽게 실천할 수 있도록 돕습니다.
            기술과 교육을 통해 환경 보호에 기여하고, 지속 가능한 미래를 만들어갑니다.
          </p>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-gray-500 py-4">
          <button 
            onClick={onNavigateToRoleManagement}
            className="hover:text-green-600 transition-colors"
          >
            © 2025 분반쓰. Team.
          </button>
          <p className="mt-1">All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
