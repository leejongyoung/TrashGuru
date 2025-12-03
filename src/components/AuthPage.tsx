import { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Check } from 'lucide-react';

interface AuthPageProps {
  onLogin: (username: string) => void;
}

type OnboardingSlide = {
  title: string;
  description: string;
  illustration: string;
};

export function AuthPage({ onLogin }: AuthPageProps) {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showServiceAreaModal, setShowServiceAreaModal] = useState(false);
  const [showSocialLoginModal, setShowSocialLoginModal] = useState(false);
  const [socialLoginProvider, setSocialLoginProvider] = useState('');
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsContent, setTermsContent] = useState({ title: '', content: '' });
  
  // Agreement states
  const [agreements, setAgreements] = useState({
    privacy: false,
    terms: false,
    marketing: false,
  });
  const [showAgreements, setShowAgreements] = useState(false);

  const slides: OnboardingSlide[] = [
    {
      title: '쓰레기박사',
      description: '환경을 생각하는\n분리수거 도우미',
      illustration: '🌍',
    },
    {
      title: '분리수거 손가락 한번이면 충분해요',
      description: '카메라로 촬영하면 AI가 자동으로\n분리수거 방법을 알려드려요',
      illustration: '📸',
    },
    {
      title: '그냥 버렸을 뿐인데',
      description: '알아서 재활용까지 처리해요\n올바른 분리수거로 환경을 지켜요',
      illustration: '♻️',
    },
  ];

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
    if (isRightSwipe && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleSocialLogin = (provider: string) => {
    setSocialLoginProvider(provider);
    setShowSocialLoginModal(true);
  };

  const showTermsDetail = (type: 'privacy' | 'terms' | 'marketing') => {
    const contents = {
      privacy: {
        title: '개인정보 처리방침',
        content: `1. 수집하는 개인정보 항목
쓰레기박사는 회원가입, 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다.
- 필수항목: 아이디, 비밀번호, 닉네임
- 선택항목: 프로필 사진, 거주지역

2. 개인정보의 수집 및 이용목적
- 회원 가입 및 관리
- 서비스 제공 및 개선
- 분리수거 정보 제공
- 커뮤니티 활동 지원

3. 개인정보의 보유 및 이용기간
회원 탈퇴 시까지 보유하며, 탈퇴 시 즉시 파기합니다.

4. 개인정보의 제3자 제공
쓰레기박사는 사용자의 개인정보를 제3자에게 제공하지 않습니다.

5. 개인정보 처리의 위탁
개인정보 처리를 외부에 위탁하지 않습니다.

6. 이용자의 권리
사용자는 언제든지 본인의 개인정보를 조회하거나 수정할 수 있으며, 회원 탈퇴를 통해 개인정보 삭제를 요청할 수 있습니다.

문의사항이 있으시면 고객센터로 연락주시기 바랍니다.`,
      },
      terms: {
        title: '서비스 이용약관',
        content: `제1조 (목적)
본 약관은 쓰레기박사(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

제2조 (정의)
1. "서비스"란 분리수거 정보 제공, 퀴즈, 커뮤니티, 상점 등의 기능을 말합니다.
2. "이용자"란 본 약관에 따라 서비스를 이용하는 회원을 말합니다.

제3조 (약관의 효력 및 변경)
1. 본 약관은 서비스를 이용하고자 하는 모든 이용자에 대하여 효력이 발생합니다.
2. 회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있습니다.

제4조 (서비스의 제공 및 변경)
1. 회사는 다음과 같은 서비스를 제공합니다:
   - 분리수거 방법 안내
   - AI 카메라 인식 기능
   - 퀴즈 및 포인트 시스템
   - 커뮤니티 기능
2. 회사는 서비스 내용을 변경할 수 있으며, 변경 사항은 공지사항을 통해 안내합니다.

제5조 (이용자의 의무)
1. 이용자는 다음 행위를 하여서는 안 됩니다:
   - 타인의 정보 도용
   - 허위 정보 게시
   - 부적절한 콘텐츠 게시
   - 서비스 운영 방해

제6조 (면책조항)
회사는 천재지변, 시스템 장애 등 불가항력적인 사유로 인한 서비스 중단에 대해 책임지지 않습니다.

제7조 (분쟁해결)
본 약관과 관련된 분쟁은 대한민국 법률에 따라 해결합니다.`,
      },
      marketing: {
        title: '마케팅 수신 동의',
        content: `쓰레기박사는 서비스 개선 및 이용자 편의 증진을 위해 다음과 같은 마케팅 정보를 제공합니다.

1. 수신 정보의 내용
- 새로운 기능 및 서비스 안내
- 이벤트 및 프로모션 정보
- 포인트 적립 이벤트
- 환경 관련 캠페인
- 맞춤형 분리수거 팁

2. 발송 방법
- 앱 푸시 알림
- 이메일 (선택 시)
- 서비스 내 알림

3. 수신 동의 철회
마케팅 정보 수신에 동의하신 경우에도 언제든지 설정 메뉴에서 수신 거부를 할 수 있습니다.

4. 동의 거부권 및 불이익
마케팅 정보 수신은 선택사항이며, 동의하지 않으셔도 서비스 이용에 제한이 없습니다. 다만, 유용한 정보와 혜택을 받지 못할 수 있습니다.

문의사항이 있으시면 설정 > 고객센터로 연락주시기 바랍니다.`,
      },
    };
    setTermsContent(contents[type]);
    setShowTermsModal(true);
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setTouchStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setTouchEnd(e.clientX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    handleTouchEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      handleTouchEnd();
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      alert('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    const savedPassword = localStorage.getItem(`password_${username}`);
    
    if (savedPassword && savedPassword === password) {
      onLogin(username);
    } else if (username === 'admin' && password === 'admin') {
      onLogin(username);
    } else {
      alert('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password || !confirmPassword) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    if (!agreements.privacy || !agreements.terms) {
      alert('필수 약관에 동의해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (password.length < 4) {
      alert('비밀번호는 최소 4자 이상이어야 합니다.');
      return;
    }

    localStorage.setItem(`password_${username}`, password);
    alert('회원가입이 완료되었습니다! 로그인해주세요.');
    setAuthMode('login');
    setPassword('');
    setConfirmPassword('');
    setAgreements({ privacy: false, terms: false, marketing: false });
  };

  const toggleAgreement = (key: 'privacy' | 'terms' | 'marketing') => {
    setAgreements({ ...agreements, [key]: !agreements[key] });
  };

  const toggleAllAgreements = () => {
    const allChecked = agreements.privacy && agreements.terms && agreements.marketing;
    setAgreements({
      privacy: !allChecked,
      terms: !allChecked,
      marketing: !allChecked,
    });
  };

  const serviceAreas = [
    { region: '서울특별시', cities: ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'] },
    { region: '인천광역시', cities: ['계양구', '남동구', '동구', '미추홀구', '부평구', '서구', '연수구', '중구'] },
    { region: '경기도', cities: ['고양시', '과천시', '광명시', '구리시', '군포시', '김포시', '남양주시', '성남시', '수원시', '시흥시', '안산시', '안양시', '용인시', '의정부시', '하남시', '화성시'] },
    { region: '강원도', cities: ['강릉시', '동해시', '속초시', '원주시', '춘천시'] },
    { region: '부산광역시', cities: ['강서구', '금정구', '남구', '동구', '동래구', '부산진구', '북구', '사상구', '사하구', '서구', '수영구', '연제구', '영도구', '중구', '해운대구'] },
    { region: '울산광역시', cities: ['남구', '동구', '북구', '중구'] },
    { region: '광주광역시', cities: ['광산구', '남구', '동구', '북구', '서구'] },
    { region: '대전광역시', cities: ['대덕구', '동구', '서구', '유성구', '중구'] },
    { region: '전라남도', cities: ['광양시', '나주시', '목포시', '순천시', '여수시'] },
    { region: '전라북도', cities: ['군산시', '익산시', '전주시'] },
    { region: '경상남도', cities: ['거제시', '김해시', '마산시', '양산시', '진주시', '창원시', '통영시'] },
    { region: '경상북도', cities: ['경산시', '경주시', '구미시', '김천시', '안동시', '포항시'] },
  ];

  // Modal Components
  const SocialLoginModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowSocialLoginModal(false)}>
      <div 
        className="bg-white rounded-2xl w-full max-w-[390px] mx-4 p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center space-y-2">
          <div className="text-4xl mb-2">🚧</div>
          <h3 className="text-gray-900" style={{ fontWeight: 700 }}>
            {socialLoginProvider} 로그인 준비 중
          </h3>
          <p className="text-gray-600 text-sm">
            현재는 일반 로그인만 사용 가능합니다.
            <br />
            빠른 시일 내에 제공할 예정입니다.
          </p>
        </div>
        <button
          onClick={() => setShowSocialLoginModal(false)}
          className="w-full py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
          style={{ fontWeight: 600 }}
        >
          확인
        </button>
      </div>
    </div>
  );

  const TermsModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowTermsModal(false)}>
      <div 
        className="bg-white rounded-2xl w-full max-w-[390px] mx-4 max-h-[80vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-gray-900" style={{ fontWeight: 700 }}>
            {termsContent.title}
          </h3>
          <button 
            onClick={() => setShowTermsModal(false)}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">
            {termsContent.content}
          </p>
        </div>
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={() => setShowTermsModal(false)}
            className="w-full py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
            style={{ fontWeight: 600 }}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );

  // Onboarding Screen
  if (!showAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
        <div className="max-w-[430px] w-full min-h-screen bg-gradient-to-br from-green-400 to-green-600 flex flex-col relative">
        {/* Modals */}
        {showSocialLoginModal && <SocialLoginModal />}
        {showTermsModal && <TermsModal />}

        {/* Service Area Modal */}
        {showServiceAreaModal && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={() => setShowServiceAreaModal(false)}>
            <div 
              className="bg-white rounded-t-3xl w-full max-w-[430px] max-h-[80vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 style={{ fontWeight: 700 }}>서비스 지역</h3>
                  <button 
                    onClick={() => setShowServiceAreaModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-sm text-gray-600">현재 서비스를 제공하고 있는 지역입니다</p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                {serviceAreas.map((area, index) => (
                  <div key={index} className="mb-6">
                    <h4 className="mb-3 text-green-700" style={{ fontWeight: 600 }}>
                      {area.region}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {area.cities.map((city, cityIndex) => (
                        <span 
                          key={cityIndex}
                          className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm"
                        >
                          {city}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-6 border-t border-gray-200">
                <button
                  onClick={() => setShowServiceAreaModal(false)}
                  className="w-full py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                  style={{ fontWeight: 600 }}
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Slide Container */}
        <div 
          className="flex-1 flex flex-col justify-center items-center px-6 py-12 select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <div className="w-full max-w-md">
            {/* Title */}
            <h1 className="text-white text-center mb-2" style={{ fontWeight: 700 }}>
              {slides[currentSlide].title}
            </h1>
            <p className="text-white text-center text-lg mb-12 whitespace-pre-line" style={{ fontWeight: 700 }}>
              {slides[currentSlide].description}
            </p>

            {/* Illustration */}
            <div className="flex justify-center items-center mb-12">
              <div className="w-64 h-64 bg-white/10 backdrop-blur-lg rounded-3xl flex items-center justify-center">
                <span className="text-9xl">{slides[currentSlide].illustration}</span>
              </div>
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center gap-2 mb-12">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentSlide 
                      ? 'w-8 bg-white' 
                      : 'w-2 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="px-6 pb-8 space-y-4">
          <div className="text-center">
            <button 
              onClick={() => setShowServiceAreaModal(true)}
              className="text-white underline text-sm mb-4"
            >
              서비스 지역
            </button>
          </div>
          
          <button
            onClick={() => setShowAuth(true)}
            className="w-full py-4 bg-white text-green-600 rounded-2xl hover:bg-gray-50 transition-colors text-lg"
            style={{ fontWeight: 600 }}
          >
            지금 바로 시작하기
          </button>
        </div>
        </div>
      </div>
    );
  }

  // Auth Screen (Login/Signup)
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-[430px] w-full min-h-screen bg-white flex flex-col relative">
      {/* Modals */}
      {showSocialLoginModal && <SocialLoginModal />}
      {showTermsModal && <TermsModal />}

      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <button 
          onClick={() => setShowAuth(false)}
          className="text-gray-600 text-sm mb-4"
        >
          ← 돌아가기
        </button>
        <h2 className="text-gray-900 mb-2" style={{ fontWeight: 700 }}>
          {authMode === 'login' ? '로그인' : '회원가입'}
        </h2>
        <p className="text-gray-600">
          {authMode === 'login' 
            ? '쓰레기박사에 오신 것을 환영합니다' 
            : '새로운 계정을 만들어보세요'}
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 py-4">
        <form onSubmit={authMode === 'login' ? handleLogin : handleSignup} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">아이디</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="아이디를 입력하세요"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">비밀번호</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password (Signup only) */}
          {authMode === 'signup' && (
            <div>
              <label className="block text-sm text-gray-700 mb-2">비밀번호 확인</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호를 다시 입력하세요"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>
          )}

          {/* Agreements (Signup only) */}
          {authMode === 'signup' && (
            <div className="pt-4 space-y-3">
              <div className="border-t border-gray-200 pt-4">
                <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={agreements.privacy && agreements.terms && agreements.marketing}
                      onChange={toggleAllAgreements}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      agreements.privacy && agreements.terms && agreements.marketing
                        ? 'bg-green-600 border-green-600'
                        : 'border-gray-300'
                    }`}>
                      {agreements.privacy && agreements.terms && agreements.marketing && (
                        <Check size={14} className="text-white" />
                      )}
                    </div>
                  </div>
                  <span className="text-sm" style={{ fontWeight: 600 }}>전체 동의</span>
                </label>
              </div>

              <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={agreements.privacy}
                    onChange={() => toggleAgreement('privacy')}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    agreements.privacy
                      ? 'bg-green-600 border-green-600'
                      : 'border-gray-300'
                  }`}>
                    {agreements.privacy && <Check size={14} className="text-white" />}
                  </div>
                </div>
                <span className="text-sm flex-1">[필수] 개인정보 처리방침 동의</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    showTermsDetail('privacy');
                  }}
                  className="text-xs text-gray-500 underline"
                >
                  보기
                </button>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={agreements.terms}
                    onChange={() => toggleAgreement('terms')}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    agreements.terms
                      ? 'bg-green-600 border-green-600'
                      : 'border-gray-300'
                  }`}>
                    {agreements.terms && <Check size={14} className="text-white" />}
                  </div>
                </div>
                <span className="text-sm flex-1">[필수] 서비스 이용약관 동의</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    showTermsDetail('terms');
                  }}
                  className="text-xs text-gray-500 underline"
                >
                  보기
                </button>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={agreements.marketing}
                    onChange={() => toggleAgreement('marketing')}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    agreements.marketing
                      ? 'bg-green-600 border-green-600'
                      : 'border-gray-300'
                  }`}>
                    {agreements.marketing && <Check size={14} className="text-white" />}
                  </div>
                </div>
                <span className="text-sm flex-1">[선택] 마케팅 수신 동의</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    showTermsDetail('marketing');
                  }}
                  className="text-xs text-gray-500 underline"
                >
                  보기
                </button>
              </label>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-lg mt-6"
            style={{ fontWeight: 600 }}
          >
            {authMode === 'login' ? '로그인' : '회원가입'}
          </button>

          {/* Toggle Auth Mode */}
          <div className="text-center pt-4">
            <button
              type="button"
              onClick={() => {
                setAuthMode(authMode === 'login' ? 'signup' : 'login');
                setPassword('');
                setConfirmPassword('');
                setAgreements({ privacy: false, terms: false, marketing: false });
              }}
              className="text-sm text-gray-600"
            >
              {authMode === 'login' 
                ? '계정이 없으신가요? ' 
                : '이미 계정이 있으신가요? '}
              <span className="text-green-600 underline">
                {authMode === 'login' ? '회원가입' : '로그인'}
              </span>
            </button>
          </div>
        </form>

        {/* Social Login (Login mode only) */}
        {authMode === 'login' && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500 mb-4">간편 로그인</p>
            <div className="grid grid-cols-4 gap-3">
              {/* Google */}
              <button
                onClick={() => handleSocialLogin('Google')}
                className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                <span className="text-xs text-gray-600">Google</span>
              </button>

              {/* Apple */}
              <button
                onClick={() => handleSocialLogin('Apple')}
                className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                  <svg width="20" height="24" viewBox="0 0 814 1000" fill="#fff">
                    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
                  </svg>
                </div>
                <span className="text-xs text-gray-600">Apple</span>
              </button>

              {/* Kakao */}
              <button
                onClick={() => handleSocialLogin('Kakao')}
                className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-[#FEE500] flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#000000">
                    <path d="M12 3C6.477 3 2 6.477 2 10.75c0 2.75 1.789 5.156 4.469 6.531-.188.688-.563 2.094-.656 2.438 0 0-.063.469.25.656.313.188.656.063.656.063.469-.063 2.719-1.781 3.156-2.094.375.063.75.094 1.125.094 5.523 0 10-3.477 10-7.75S17.523 3 12 3z"/>
                  </svg>
                </div>
                <span className="text-xs text-gray-600">Kakao</span>
              </button>

              {/* Naver */}
              <button
                onClick={() => handleSocialLogin('Naver')}
                className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-[#03C75A] flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="#fff">
                    <path d="M10.5 7.5L5.5 0H0v16h5.5V8.5L10.5 16H16V0h-5.5v7.5z"/>
                  </svg>
                </div>
                <span className="text-xs text-gray-600">Naver</span>
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
