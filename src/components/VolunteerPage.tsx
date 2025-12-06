import { HandHeart, Calendar, Clock, MapPin, Search, CheckCircle, Award, Users, Star, ArrowLeft, ChevronRight, Filter, X, Package, AlertCircle, PieChart, Info } from 'lucide-react';
import { useState } from 'react';

interface VolunteerEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  region: string;
  points: number;
  organizer: string;
  description: string;
  supplies: string;
  maxParticipants: number;
  currentParticipants: number;
  status: 'recruiting' | 'closed';
  genderRatio: { male: number, female: number };
  ageGroups: { [key: string]: number };
  deadline: string;
  cancellationDeadline: string;
  penalty: string;
}

interface MyActivity {
  id: number;
  title: string;
  date: string;
  status: string;
  points: number;
}

export function VolunteerPage() {
  const [activeTab, setActiveTab] = useState('find'); // 'find' or 'my'
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<VolunteerEvent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedOrganizer, setSelectedOrganizer] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');

  const upcomingEvents: VolunteerEvent[] = [
    {
      id: 1,
      title: '우리 동네 클린업',
      date: '2025.12.15',
      time: '14:00-16:00',
      location: '해변공원',
      region: '서울특별시',
      points: 200,
      organizer: '환경보호 시민연대',
      description: '우리 동네 해변공원을 깨끗하게 만드는 클린업 활동입니다. 쓰레기 줍기, 분리수거 등의 활동을 진행합니다. 봉사시간 인정 가능하며, 활동 후에는 간단한 간식이 제공됩니다. 편한 복장으로 참여해 주세요!',
      supplies: '편한 복장, 운동화, 개인 텀블러',
      maxParticipants: 20,
      currentParticipants: 12,
      status: 'recruiting',
      genderRatio: { male: 45, female: 55 },
      ageGroups: { '10대': 10, '20대': 40, '30대': 30, '40대 이상': 20 },
      deadline: '2025.12.14',
      cancellationDeadline: '2025.12.13',
      penalty: '활동 시작 24시간 전 미취소 시 노쇼 패널티 부과 (1개월 신청 제한)',
    },
    {
      id: 2,
      title: '재활용 교육 캠페인',
      date: '2025.12.20',
      time: '10:00-12:00',
      location: '중앙 도서관',
      region: '경기도',
      points: 150,
      organizer: '녹색연합',
      description: '올바른 재활용 방법을 알리는 교육 캠페인입니다. 시민들에게 분리배출 요령을 안내하고 홍보물을 배포하는 활동을 합니다. 사전 교육이 30분간 진행될 예정입니다.',
      supplies: '필기도구',
      maxParticipants: 10,
      currentParticipants: 8,
      status: 'recruiting',
      genderRatio: { male: 30, female: 70 },
      ageGroups: { '10대': 20, '20대': 50, '30대': 20, '40대 이상': 10 },
      deadline: '2025.12.18',
      cancellationDeadline: '2025.12.17',
      penalty: '사전 연락 없이 불참 시 다음 교육 활동 참여 제한',
    },
    {
      id: 3,
      title: '한강 쓰레기 줍기',
      date: '2025.12.22',
      time: '15:00-17:00',
      location: '여의도 한강공원',
      region: '서울특별시',
      points: 300,
      organizer: '서울환경연합',
      description: '한강공원 일대를 돌며 쓰레기를 줍는 봉사활동입니다. 한강을 사랑하는 누구나 참여 가능합니다. 집게와 장갑은 제공됩니다.',
      supplies: '모자, 자외선 차단제, 편한 신발',
      maxParticipants: 50,
      currentParticipants: 42,
      status: 'recruiting',
      genderRatio: { male: 60, female: 40 },
      ageGroups: { '10대': 5, '20대': 60, '30대': 25, '40대 이상': 10 },
      deadline: '2025.12.21',
      cancellationDeadline: '2025.12.20',
      penalty: '노쇼 3회 누적 시 영구 제명',
    },
    {
      id: 4,
      title: '소외계층 도시락 배달',
      date: '2025.12.24',
      time: '09:00-13:00',
      location: '사랑복지관',
      region: '인천광역시',
      points: 500,
      organizer: '아름다운가게',
      description: '크리스마스 이브를 맞아 독거노인 분들께 따뜻한 도시락을 배달합니다. 차량 소지자 우대합니다.',
      supplies: '운전면허증 (차량 소지자)',
      maxParticipants: 15,
      currentParticipants: 15,
      status: 'closed',
      genderRatio: { male: 80, female: 20 },
      ageGroups: { '10대': 0, '20대': 20, '30대': 40, '40대 이상': 40 },
      deadline: '2025.12.22',
      cancellationDeadline: '2025.12.21',
      penalty: '당일 취소 불가, 미참석 시 포인트 차감',
    },
    {
      id: 5,
      title: '나무 심기 행사',
      date: '2026.01.05',
      time: '10:00-15:00',
      location: '시민의 숲',
      region: '서울특별시',
      points: 400,
      organizer: '생명의숲',
      description: '도심 속 숲 조성을 위한 나무 심기 행사입니다. 삽과 장갑은 제공되며, 점심 식사가 포함되어 있습니다.',
      supplies: '작업복, 장화 (있으면 좋음)',
      maxParticipants: 30,
      currentParticipants: 5,
      status: 'recruiting',
      genderRatio: { male: 50, female: 50 },
      ageGroups: { '10대': 10, '20대': 30, '30대': 30, '40대 이상': 30 },
      deadline: '2026.01.01',
      cancellationDeadline: '2025.12.31',
      penalty: '활동 3일 전까지 취소 가능, 이후 취소 시 패널티 점수 부과',
    },
    {
      id: 6,
      title: '바닷가 플로깅',
      date: '2026.01.10',
      time: '09:00-12:00',
      location: '해운대 해수욕장',
      region: '부산광역시',
      points: 250,
      organizer: '그린피스',
      description: '아름다운 해운대 해수욕장을 깨끗하게 가꾸는 플로깅 활동입니다. 가족 단위 참여를 환영합니다.',
      supplies: '모자, 선글라스, 개인 물병',
      maxParticipants: 40,
      currentParticipants: 20,
      status: 'recruiting',
      genderRatio: { male: 40, female: 60 },
      ageGroups: { '10대': 30, '20대': 30, '30대': 20, '40대 이상': 20 },
      deadline: '2026.01.08',
      cancellationDeadline: '2026.01.07',
      penalty: '별도 패널티 없음',
    },
    {
      id: 7,
      title: '산림 보호 캠페인',
      date: '2026.01.12',
      time: '13:00-16:00',
      location: '계룡산 국립공원',
      region: '대전광역시',
      points: 350,
      organizer: 'WWF',
      description: '계룡산의 생태계를 보호하고 등산객들에게 환경 보호의 중요성을 알리는 캠페인입니다.',
      supplies: '등산화, 배낭',
      maxParticipants: 15,
      currentParticipants: 10,
      status: 'recruiting',
      genderRatio: { male: 70, female: 30 },
      ageGroups: { '10대': 0, '20대': 40, '30대': 40, '40대 이상': 20 },
      deadline: '2026.01.10',
      cancellationDeadline: '2026.01.09',
      penalty: '무단 불참 시 3개월간 활동 신청 불가',
    },
    {
      id: 8,
      title: '재난 구호 물품 분류',
      date: '2026.01.18',
      time: '10:00-17:00',
      location: '시민 봉사센터',
      region: '광주광역시',
      points: 600,
      organizer: '희망나눔 재단',
      description: '이재민들을 위한 구호 물품을 분류하고 포장하는 활동입니다. 많은 손길이 필요합니다.',
      supplies: '마스크, 장갑',
      maxParticipants: 25,
      currentParticipants: 25,
      status: 'closed',
      genderRatio: { male: 50, female: 50 },
      ageGroups: { '10대': 20, '20대': 60, '30대': 10, '40대 이상': 10 },
      deadline: '2026.01.15',
      cancellationDeadline: '2026.01.14',
      penalty: '활동 특성상 당일 취소 절대 불가',
    },
    {
      id: 9,
      title: '농촌 일손 돕기',
      date: '2026.01.25',
      time: '08:00-18:00',
      location: '화천군 농가',
      region: '강원특별자치도',
      points: 800,
      organizer: '농촌사랑 연합',
      description: '고령 농가의 농작업을 돕는 활동입니다. 왕복 교통편과 점심이 제공됩니다. 육체 활동이 많습니다.',
      supplies: '작업복, 여벌 옷, 모자',
      maxParticipants: 10,
      currentParticipants: 7,
      status: 'recruiting',
      genderRatio: { male: 90, female: 10 },
      ageGroups: { '10대': 0, '20대': 80, '30대': 20, '40대 이상': 0 },
      deadline: '2026.01.20',
      cancellationDeadline: '2026.01.18',
      penalty: '출발 시간 미준수 시 참여 불가 및 패널티 부과',
    }
  ];

  const [myActivities, setMyActivities] = useState<MyActivity[]>([
    {
      id: 101,
      title: '공원 플로깅 이벤트',
      date: '2025.11.28',
      status: '참여완료',
      points: 120,
    },
    {
      id: 102,
      title: '어르신 분리배출 돕기',
      date: '2025.11.15',
      status: '참여완료',
      points: 100,
    },
  ]);

  const allAdministrativeRegions = [
    '서울특별시',
    '부산광역시',
    '대구광역시',
    '인천광역시',
    '광주광역시',
    '대전광역시',
    '울산광역시',
    '세종특별자치시',
    '경기도',
    '강원특별자치도',
    '충청북도',
    '충청남도',
    '전라북도',
    '전라남도',
    '경상북도',
    '경상남도',
    '제주특별자치도',
  ];
  
  const uniqueRegions = allAdministrativeRegions;
  const uniqueOrganizers = ['all', ...Array.from(new Set(upcomingEvents.map(e => e.organizer)))];

  const filteredEvents = upcomingEvents.filter(event => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || event.region === selectedRegion;
    const matchesOrganizer = selectedOrganizer === 'all' || event.organizer === selectedOrganizer;
    
    const eventDate = new Date(event.date.replace(/\./g, '-'));
    const filterDate = selectedDate ? new Date(selectedDate) : null;
    const matchesDate = !filterDate || eventDate >= filterDate;

    return matchesSearch && matchesRegion && matchesOrganizer && matchesDate;
  });

  const handleApply = () => {
    if (!selectedEvent) return;

    // 중복 신청 체크
    if (myActivities.some(activity => activity.id === selectedEvent.id)) {
      return;
    }

    setShowSuccess(true);
    
    const newActivity: MyActivity = {
      id: selectedEvent.id,
      title: selectedEvent.title,
      date: selectedEvent.date,
      status: '신청완료',
      points: selectedEvent.points,
    };

    setMyActivities(prev => [newActivity, ...prev]);

    setTimeout(() => {
      setShowSuccess(false);
      setSelectedEvent(null);
      setActiveTab('my');
    }, 1500);
  };

  if (selectedEvent) {
    const isApplied = myActivities.some(activity => activity.id === selectedEvent.id);

    return (
      <div className="p-4 space-y-6 pb-24 animate-slideUp">
        {showSuccess && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2">
            <CheckCircle size={20} />
            <span>봉사활동 신청이 완료되었습니다!</span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSelectedEvent(null)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <ArrowLeft className="text-gray-600 dark:text-white" />
          </button>
          <h2 className="text-xl font-bold dark:text-white">활동 상세</h2>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight pr-2">{selectedEvent.title}</h1>
              <div className="flex flex-col items-end gap-1">
                <span className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                  selectedEvent.status === 'recruiting' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {selectedEvent.status === 'recruiting' ? '모집중' : '마감'}
                </span>
                <span className="text-green-600 font-bold text-sm flex items-center gap-1">
                  <Award size={14} />
                  {selectedEvent.points}P
                </span>
              </div>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{selectedEvent.organizer}</p>
          </div>

          <div className="flex flex-wrap gap-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 px-3 py-2 rounded-lg">
              <Calendar size={16} className="text-green-600" />
              <span>{selectedEvent.date}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 px-3 py-2 rounded-lg">
              <Clock size={16} className="text-green-600" />
              <span>{selectedEvent.time}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 px-3 py-2 rounded-lg">
              <MapPin size={16} className="text-green-600" />
              <span>{selectedEvent.region} {selectedEvent.location}</span>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">활동 소개</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
              {selectedEvent.description}
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Package size={18} className="text-green-600" />
              준비물
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
              {selectedEvent.supplies}
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <PieChart size={18} className="text-green-600" />
              참여 현황 분석
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 text-center">성별 비율</div>
                <div className="flex h-4 rounded-full overflow-hidden">
                  <div className="bg-blue-400 h-full" style={{ width: `${selectedEvent.genderRatio.male}%` }} />
                  <div className="bg-pink-400 h-full" style={{ width: `${selectedEvent.genderRatio.female}%` }} />
                </div>
                <div className="flex justify-between text-xs mt-1 text-gray-600 dark:text-gray-300">
                  <span>남 {selectedEvent.genderRatio.male}%</span>
                  <span>여 {selectedEvent.genderRatio.female}%</span>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 text-center">연령대 비율</div>
                <div className="flex items-end justify-between h-10 gap-1">
                  {Object.entries(selectedEvent.ageGroups).map(([age, percent]) => (
                    <div key={age} className="flex flex-col items-center w-full">
                      <div className="w-full bg-green-400 rounded-t-sm" style={{ height: `${percent}%` }} />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] mt-1 text-gray-600 dark:text-gray-300">
                  {Object.keys(selectedEvent.ageGroups).map(age => <span key={age}>{age}</span>)}
                </div>
              </div>
            </div>

            <div className="mt-2">
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                <span>현재 {selectedEvent.currentParticipants}명 참여</span>
                <span>최대 {selectedEvent.maxParticipants}명</span>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-green-500 h-full rounded-full" 
                  style={{ width: `${(selectedEvent.currentParticipants / selectedEvent.maxParticipants) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <AlertCircle size={18} className="text-green-600" />
              유의사항
            </h3>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl space-y-2 text-sm">
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>신청 마감</span>
                <span className="font-medium">{selectedEvent.deadline}</span>
              </div>
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>취소 가능</span>
                <span className="font-medium">{selectedEvent.cancellationDeadline} 까지</span>
              </div>
              <div className="pt-2 border-t border-red-100 dark:border-red-800/30 text-red-600 dark:text-red-400 text-xs">
                <span className="font-bold mr-1">패널티:</span>
                {selectedEvent.penalty}
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-24 left-0 right-0 px-4">
            <div className="max-w-[430px] mx-auto">
                <button
                    onClick={handleApply}
                    disabled={selectedEvent.status === 'closed' || isApplied}
                    className={`w-full py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                      selectedEvent.status === 'closed' || isApplied
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                        : 'bg-green-600 text-white shadow-green-600/30 hover:bg-green-700'
                    }`}
                >
                    {selectedEvent.status === 'closed' 
                      ? '모집 마감' 
                      : isApplied 
                        ? '신청 완료됨' 
                        : '신청하기'}
                </button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 min-h-screen bg-gray-50 dark:bg-gray-900">
      {showSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-slideUp flex items-center gap-2">
          <CheckCircle size={20} />
          <span>봉사활동 신청이 완료되었습니다!</span>
        </div>
      )}

      {/* Header Section: Search & Filters & Tabs */}
      <div className="bg-white dark:bg-gray-900 sticky top-0 z-10 shadow-sm">
        <div className="p-4 pb-2 space-y-3">
          {/* Search Bar */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center gap-3 p-3">
              <Search className="text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="'지역' 또는 '활동'으로 검색"
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
          
          {/* Filters */}
          <div className="flex gap-2 mt-3"> {/* Added mt-3 for spacing below search bar */}
            <div className="relative flex-1">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full pl-3 pr-8 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl appearance-none focus:outline-none focus:border-green-500 dark:text-white text-sm transition-colors"
              >
                <option value="all">모든 지역</option>
                {uniqueRegions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" size={16} />
            </div>
            
            <div className="relative flex-1">
              <select
                value={selectedOrganizer}
                onChange={(e) => setSelectedOrganizer(e.target.value)}
                className="w-full pl-3 pr-8 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl appearance-none focus:outline-none focus:border-green-500 dark:text-white text-sm transition-colors"
              >
                <option value="all">모든 주최</option>
                {uniqueOrganizers.filter(o => o !== 'all').map(organizer => (
                  <option key={organizer} value={organizer}>{organizer}</option>
                ))}
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>

          {/* Date Filter */}
          <div className="relative mt-2"> {/* Added mt-2 for spacing below other filters */}
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full pl-3 pr-8 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl appearance-none focus:outline-none focus:border-green-500 dark:text-white text-sm transition-colors"
            />
            {/* Optional: Add a clear button for the date input if selectedDate is not empty */}
            {selectedDate && (
                <button
                    onClick={() => setSelectedDate('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                >
                    <X size={16} className="text-gray-400" />
                </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('find')}
            className={`flex-1 py-3 relative font-medium transition-colors text-center ${
              activeTab === 'find'
                ? 'text-green-600 dark:text-green-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            전체 활동
            {activeTab === 'find' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 dark:bg-green-400" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={`flex-1 py-3 relative font-medium transition-colors text-center ${
              activeTab === 'my'
                ? 'text-green-600 dark:text-green-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            내 활동
            {activeTab === 'my' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 dark:bg-green-400" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {activeTab === 'find' && (
          <>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <div 
                  key={event.id} 
                  onClick={() => setSelectedEvent(event)}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 space-y-3 cursor-pointer hover:border-green-500 dark:hover:border-green-500 transition-all hover:shadow-md"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="dark:text-white font-semibold text-lg leading-tight mb-1">{event.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        event.status === 'recruiting' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {event.status === 'recruiting' ? '모집중' : '마감'}
                      </span>
                    </div>
                    <ChevronRight className="text-gray-400 flex-shrink-0" size={20} />
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    <p className="flex items-center gap-2"><Calendar size={14} /> {event.date} {event.time}</p>
                    <p className="flex items-center gap-2"><MapPin size={14} /> {event.region} {event.location}</p>
                    <p className="flex items-center gap-2"><Users size={14} /> 주최: {event.organizer}</p>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700 mt-3">
                    <div className="flex items-center gap-1.5 text-green-600">
                        <Award size={18} />
                        <span className="font-bold">{event.points}P</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                       {event.currentParticipants}/{event.maxParticipants}명 참여중
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-gray-500 dark:text-gray-400">조건에 맞는 봉사활동이 없습니다.</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'my' && (
          <div className="space-y-4">
            {myActivities.map((activity) => (
              <div key={activity.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <div>
                      <h4 className="dark:text-white font-medium">{activity.title}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{activity.date}</p>
                  </div>
                  <div className="text-right">
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">{activity.status}</span>
                      <p className="text-green-600 font-semibold mt-1.5">{activity.points}P 적립</p>
                  </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}