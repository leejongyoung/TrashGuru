import { 
  Calendar, Clock, MapPin, Plus, CheckCircle, Search, 
  User, Truck, DollarSign, Camera, ChevronRight, X, AlertCircle, Loader2, Navigation,
  ChevronLeft, TrendingUp, Wallet, CalendarRange
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { notifyVolunteerActivity, notifyPointsEarned } from '../utils/notifications';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// --- Types ---
type Role = 'requestor' | 'collector';
type ViewMode = 'main' | 'stats';
type StatsPeriod = 'month' | 'year';
type PickupStatus = 'pending' | 'matched' | 'completed' | 'verified';

interface PickupRequest {
  id: number;
  requestorId: string;
  items: string[];
  location: string;
  date: string;
  time: string;
  reward: number;
  status: PickupStatus;
  collectorId?: string;
  photoUrl?: string;
  distance?: string;
}

// --- Mock Data ---
const MOCK_REQUESTS: PickupRequest[] = [
  {
    id: 1,
    requestorId: 'user1',
    items: ['대형가전(냉장고)', '폐가구(의자)'],
    location: '서울 강남구 역삼동',
    date: '2025.12.08',
    time: '14:00-16:00',
    reward: 15000,
    status: 'pending',
    distance: '500m'
  },
  {
    id: 2,
    requestorId: 'user2',
    items: ['재활용품 3봉투'],
    location: '서울 서초구 반포동',
    date: '2025.12.09',
    time: '10:00-12:00',
    reward: 5000,
    status: 'pending',
    distance: '1.2km'
  },
  {
    id: 4,
    requestorId: 'user3',
    items: ['안 쓰는 자전거'],
    location: '서울 송파구 잠원동',
    date: '2025.12.08',
    time: '18:00-20:00',
    reward: 8000,
    status: 'pending',
    distance: '2.5km'
  },
  {
    id: 5,
    requestorId: 'user4',
    items: ['폐가전(전자레인지, 밥솥)'],
    location: '서울 강남구 논현동',
    date: '2025.12.11',
    time: '09:00-11:00',
    reward: 12000,
    status: 'pending',
    distance: '800m'
  },
  {
    id: 6,
    requestorId: 'user5',
    items: ['이사 폐기물 박스 5개'],
    location: '서울 서초구 방배동',
    date: '2025.12.12',
    time: '13:00-15:00',
    reward: 25000,
    status: 'pending',
    distance: '3.1km'
  },
  {
    id: 7,
    requestorId: 'user6',
    items: ['헌 옷 10kg'],
    location: '서울 강남구 대치동',
    date: '2025.12.10',
    time: '10:00-12:00',
    reward: 6000,
    status: 'pending',
    distance: '1.5km'
  },
  {
    id: 8,
    requestorId: 'user7',
    items: ['책장, 책상 세트'],
    location: '서울 강남구 압구정동',
    date: '2025.12.13',
    time: '15:00-17:00',
    reward: 30000,
    status: 'pending',
    distance: '2.8km'
  },
  {
    id: 9,
    requestorId: 'user8',
    items: ['침대 프레임'],
    location: '서울 강남구 삼성동',
    date: '2025.12.14',
    time: '09:00-11:00',
    reward: 20000,
    status: 'pending',
    distance: '1.1km'
  },
  {
    id: 10,
    requestorId: 'user9',
    items: ['의자 2개'],
    location: '서울 서초구 잠원동',
    date: '2025.12.15',
    time: '11:00-13:00',
    reward: 7000,
    status: 'pending',
    distance: '0.7km'
  },
  {
    id: 11,
    requestorId: 'user10',
    items: ['소형가전(믹서기, 토스터기)'],
    location: '서울 송파구 신천동',
    date: '2025.12.16',
    time: '14:00-16:00',
    reward: 9000,
    status: 'pending',
    distance: '2.0km'
  },
  {
    id: 12,
    requestorId: 'user11',
    items: ['유리병, 캔류'],
    location: '서울 강남구 청담동',
    date: '2025.12.17',
    time: '16:00-18:00',
    reward: 4000,
    status: 'pending',
    distance: '1.8km'
  },
  {
    id: 13,
    requestorId: 'user12',
    items: ['플라스틱 용기 다수'],
    location: '서울 서초구 양재동',
    date: '2025.12.18',
    time: '10:00-12:00',
    reward: 5500,
    status: 'pending',
    distance: '2.3km'
  },
  {
    id: 3,
    requestorId: 'me',
    items: ['오래된 책상'],
    location: '우리집 문 앞',
    date: '2025.12.10',
    time: '09:00-11:00',
    reward: 8000,
    status: 'matched',
    collectorId: 'partner1'
  }
];

// Mock Data for Stats
const STATS_DATA = {
  month: {
    total: 45000,
    chartData: [
      { label: '1', value: 10000 },
      { label: '3', value: 20000 },
      { label: '5', value: 15000 },
      { label: '10', value: 0 },
      { label: '15', value: 0 },
      { label: '20', value: 0 },
      { label: '25', value: 0 },
      { label: '30', value: 0 },
    ],
    history: [
      { id: 101, date: '2025.12.05', title: '폐가구(서랍장)', amount: 15000 },
      { id: 102, date: '2025.12.03', title: '대형가전(전자레인지)', amount: 20000 },
      { id: 103, date: '2025.12.01', title: '재활용품 5봉투', amount: 10000 },
    ]
  },
  year: {
    total: 520000,
    chartData: [
      { label: '1월', value: 30000 },
      { label: '2월', value: 45000 },
      { label: '3월', value: 25000 },
      { label: '4월', value: 50000 },
      { label: '5월', value: 60000 },
      { label: '6월', value: 40000 },
      { label: '7월', value: 55000 },
      { label: '8월', value: 40000 },
      { label: '9월', value: 80000 },
      { label: '10월', value: 120000 },
      { label: '11월', value: 150000 },
      { label: '12월', value: 45000 },
    ],
    history: [
      { id: 201, date: '2025.11.30', title: '11월 정산', amount: 150000 },
      { id: 202, date: '2025.10.31', title: '10월 정산', amount: 120000 },
      { id: 203, date: '2025.09.30', title: '9월 정산', amount: 80000 },
      { id: 204, date: '2025.08.31', title: '8월 정산', amount: 40000 },
    ]
  }
};

export function PickupPage() {
  const [role, setRole] = useState<Role>('requestor');
  const [viewMode, setViewMode] = useState<ViewMode>('main');
  const [statsPeriod, setStatsPeriod] = useState<StatsPeriod>('month');
  
  // Data State
  const [requests, setRequests] = useState<PickupRequest[]>(MOCK_REQUESTS);
  const [myTasks, setMyTasks] = useState<PickupRequest[]>([]); 

  // UI State
  const [selectedRequest, setSelectedRequest] = useState<PickupRequest | null>(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  
  // Form State
  const [newRequest, setNewRequest] = useState({
    items: [] as string[],
    date: '',
    time: '',
    location: '',
    reward: 3000
  });
  
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      setNewRequest(prev => ({ ...prev, location: savedLocation }));
    }
  }, []);
  
  // Camera State
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // Filters
  const myRequests = requests.filter(r => r.requestorId === 'me');
  const availableRequests = requests.filter(r => r.status === 'pending' && r.requestorId !== 'me');

  // --- Actions ---

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const request: PickupRequest = {
      id: Date.now(),
      requestorId: 'me',
      items: newRequest.items,
      location: newRequest.location,
      date: newRequest.date,
      time: newRequest.time,
      reward: newRequest.reward,
      status: 'pending',
    };
    setRequests(prev => [request, ...prev]);
    const savedLocation = localStorage.getItem('userLocation') || '';
    setNewRequest({ items: [], date: '', time: '', location: savedLocation, reward: 3000 });
    notifyVolunteerActivity('대리수거 요청 등록', '수거 요청이 정상적으로 등록되었습니다.');
  };

  const handleAcceptRequest = (req: PickupRequest) => {
    setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'matched', collectorId: 'me' } : r));
    setMyTasks(prev => [...prev, { ...req, status: 'matched', collectorId: 'me' }]);
    setSelectedRequest(null);
    alert(`'${req.location}' 수거 건을 수락했습니다!`);
  };

  const openCameraForCompletion = (req: PickupRequest) => {
    setSelectedRequest(req);
    setShowCameraModal(true);
    startCamera();
  };

  const handleCaptureAndComplete = () => {
    if (!selectedRequest) return;
    const updatedTask = { ...selectedRequest, status: 'completed' as PickupStatus, photoUrl: 'mock_url' };
    setRequests(prev => prev.map(r => r.id === selectedRequest.id ? updatedTask : r));
    setMyTasks(prev => prev.map(r => r.id === selectedRequest.id ? updatedTask : r));
    closeCameraModal();
    notifyVolunteerActivity('작업 완료 요청', '인증 사진이 업로드되었습니다.');
  };

  const handleVerifyAndPay = (req: PickupRequest) => {
    setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'verified' } : r));
    setShowVerifyModal(false);
    setSelectedRequest(null);
    notifyPointsEarned(-req.reward, `대리수거 비용 결제`);
    alert('작업 승인 및 포인트 결제가 완료되었습니다.');
  };

  // --- Camera Logic ---
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsScanning(true);
    } catch (err) {
      console.error("Camera Error", err);
      alert("카메라를 실행할 수 없습니다.");
    }
  };

  const closeCameraModal = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setShowCameraModal(false);
    setIsScanning(false);
  };

  const renderStatusBadge = (status: PickupStatus) => {
    switch (status) {
      case 'pending': return <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">매칭 대기</span>;
      case 'matched': return <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded text-xs">매칭 완료</span>;
      case 'completed': return <span className="px-2 py-0.5 bg-purple-100 text-purple-600 rounded text-xs">작업 완료</span>;
      case 'verified': return <span className="px-2 py-0.5 bg-green-100 text-green-600 rounded text-xs">결제 완료</span>;
    }
  };

  // --- Sub-Page: Collector Stats (Ledger View) ---
  if (viewMode === 'stats') {
    const data = STATS_DATA[statsPeriod];

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-48 animate-slideInRight">
        
        <div className="p-4 space-y-6 pt-6">
          {/* Period Toggle */}
          <div className="flex bg-white dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setStatsPeriod('month')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                statsPeriod === 'month'
                  ? 'bg-green-100 text-green-700 shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              월별 보기
            </button>
            <button
              onClick={() => setStatsPeriod('year')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                statsPeriod === 'year'
                  ? 'bg-green-100 text-green-700 shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              연별 보기
            </button>
          </div>

          {/* Summary Card */}
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-2 opacity-90 mb-1">
              <Wallet size={18} />
              <span className="text-sm">{statsPeriod === 'month' ? '12월 총 수익' : '2025년 총 수익'}</span>
            </div>
            <h3 className="text-3xl font-bold">{data.total.toLocaleString()} P</h3>
          </div>

          {/* Chart Area with Recharts */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <h4 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <TrendingUp size={18} className="text-green-600" />
              수익 추이
            </h4>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data.chartData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -20,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="label" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#9ca3af' }} 
                    interval={statsPeriod === 'month' ? 0 : 0} // Show all labels or every other one
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#9ca3af' }} 
                    tickFormatter={(value) => `${value / 10000}만`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    formatter={(value: number) => [`${value.toLocaleString()} P`, '수익']}
                    labelStyle={{ color: '#6b7280', marginBottom: '4px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#22c55e" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

                    {/* Transaction List */}
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <CalendarRange size={18} className="text-green-600" />
                        상세 내역
                      </h4>            <div className="space-y-3">
              {data.history.map((item) => (
                <div key={item.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{item.date}</p>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{item.title}</p>
                  </div>
                  <span className="font-bold text-green-600">+{item.amount.toLocaleString()} P</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      {/* Fixed Bottom Role Switcher & Stats Button */}
      <div className="fixed bottom-[101px] left-0 right-0 z-45 pointer-events-none">
        <div className="max-w-[430px] mx-auto pointer-events-auto">
          <div className="bg-white dark:bg-gray-800 rounded-none px-3 py-2 shadow-lg border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
            
            {/* Requestor Mode Button */}
            <button
              onClick={() => {
                setRole('requestor');
                setViewMode('main');
              }}
              className={`flex-1 py-4 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                false
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <User size={16} />
              요청하기
            </button>

            {/* Collector Mode Button */}
            <button
              onClick={() => {
                setRole('collector');
                setViewMode('main');
              }}
              className={`flex-1 py-4 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                false
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Truck size={16} />
              수거하기
            </button>

            {/* Stats Button (Always Visible) */}
            <button
              onClick={() => {
                setRole('collector'); 
                setViewMode('stats');
              }}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shrink-0 ${
                 viewMode === 'stats'
                  ? 'bg-green-100 text-green-600 border-2 border-green-200'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 border border-transparent'
              }`}
              title="수익 관리"
            >
              <Wallet size={20} />
            </button>
          </div>
        </div>
      </div>

      </div>
    );
  }

  // --- Main View ---
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-48"> {/* Increased padding bottom */}
      {/* Fixed Bottom Role Switcher & Stats Button */}
      {viewMode === 'main' && (
        <div className="fixed bottom-[101px] left-0 right-0 z-45 pointer-events-none">
          <div className="max-w-[430px] mx-auto pointer-events-auto">
            <div className="bg-white dark:bg-gray-800 rounded-none px-3 py-2 shadow-lg border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
              
              {/* Requestor Mode Button */}
              <button
                onClick={() => {
                  setRole('requestor');
                  setViewMode('main');
                }}
                className={`flex-1 py-4 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  role === 'requestor'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <User size={16} />
                요청하기
              </button>

              {/* Collector Mode Button */}
              <button
                onClick={() => {
                  setRole('collector');
                  setViewMode('main');
                }}
                className={`flex-1 py-4 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  role === 'collector'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Truck size={16} />
                수거하기
              </button>

              {/* Stats Button (Always Visible) */}
              <button
                onClick={() => {
                  setRole('collector'); 
                  setViewMode('stats');
                }}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shrink-0 ${
                   false
                    ? 'bg-green-100 text-green-600 border-2 border-green-200'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 border border-transparent'
                }`}
                title="수익 관리"
              >
                <Wallet size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 space-y-6">
        
        {/* === REQUESTOR VIEW === */}
        {role === 'requestor' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Unified Request Form Container */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm space-y-4 w-full">
               <h3 className="text-lg font-bold dark:text-white flex items-center gap-2">
                 <Plus size={18} className="text-blue-600" />
                 대리수거 예약
               </h3>
               <form onSubmit={handleCreateRequest} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">수거 품목</label>
                    <input 
                      type="text" 
                      placeholder="예: 안쓰는 책상, 의자 2개"
                      className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600"
                      value={newRequest.items.join(', ')}
                      onChange={e => setNewRequest({...newRequest, items: e.target.value.split(', ')})}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">날짜</label>
                       <input 
                          type="date" 
                          className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600"
                          value={newRequest.date}
                          onChange={e => setNewRequest({...newRequest, date: e.target.value})}
                          required
                       />
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">시간</label>
                       <select 
                          className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600"
                          value={newRequest.time}
                          onChange={e => setNewRequest({...newRequest, time: e.target.value})}
                          required
                       >
                         <option value="">선택</option>
                         <option value="09:00-12:00">오전 (09-12)</option>
                         <option value="13:00-16:00">오후 (13-16)</option>
                         <option value="16:00-19:00">저녁 (16-19)</option>
                       </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">배출 장소</label>
                    <input 
                      type="text" 
                      placeholder="위치 설정 값 기본 적용"
                      className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600"
                      value={newRequest.location}
                      onChange={e => setNewRequest({...newRequest, location: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">지급 포인트(수수료)</label>
                    <div className="relative">
                        <input 
                          type="number" 
                          className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600 font-bold text-blue-600 pl-3 pr-10"
                          value={newRequest.reward}
                          onChange={e => setNewRequest({...newRequest, reward: parseInt(e.target.value) || 0})}
                          min="1000"
                          step="500"
                          required
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">P</span>
                    </div>
                  </div>
                  <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98]">
                    예약하기
                  </button>
               </form>
            </div>

            {/* My Requests List */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Calendar size={18} className="text-blue-500" />
                예약 현황
              </h3>
              <div className="space-y-3">
                {myRequests.length > 0 ? myRequests.map(req => (
                  <div 
                    key={req.id} 
                    onClick={() => setSelectedRequest(req)}
                    className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm active:bg-gray-50 dark:active:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        {renderStatusBadge(req.status)}
                        <span className="text-xs text-gray-500 dark:text-gray-400">{req.date}</span>
                      </div>
                      <span className="font-bold text-blue-600">{req.reward.toLocaleString()} P</span>
                    </div>
                    <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-1">{req.items.join(', ')}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-3">
                      <MapPin size={12} /> {req.location}
                    </p>
                    
                    <div className="flex justify-end border-t border-gray-100 dark:border-gray-700 pt-3">
                        <span className="text-sm text-blue-500 font-medium flex items-center gap-1">
                            상세보기 <ChevronRight size={14} />
                        </span>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-10 text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                    <p>아직 요청한 내역이 없습니다.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* === COLLECTOR VIEW === */}
        {role === 'collector' && (
          <div className="space-y-6 animate-fadeIn">
            {/* My Active Tasks */}
            {myTasks.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Truck size={18} className="text-green-600" />
                  진행 중인 작업
                </h3>
                <div className="space-y-3">
                  {myTasks.map(task => (
                    <div key={task.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border-l-4 border-green-500 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                         <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">수거 진행중</span>
                         <span className="font-bold text-gray-900 dark:text-white">{task.reward.toLocaleString()} P</span>
                      </div>
                      <h4 className="font-medium text-gray-800 dark:text-gray-200">{task.items.join(', ')}</h4>
                      <p className="text-sm text-gray-500 mt-1">{task.location}</p>
                      
                      {task.status === 'matched' && (
                        <button 
                          onClick={() => openCameraForCompletion(task)}
                          className="w-full mt-3 py-2 bg-green-600 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
                        >
                          <Camera size={16} />
                          작업 완료 인증하기
                        </button>
                      )}
                      {task.status === 'completed' && (
                        <div className="mt-3 text-center text-sm text-gray-500 bg-gray-50 dark:bg-gray-700 py-2 rounded-lg">
                          요청자 승인 대기 중...
                        </div>
                      )}
                      {task.status === 'verified' && (
                        <div className="mt-3 text-center text-sm text-green-600 bg-green-50 dark:bg-green-900/20 py-2 rounded-lg font-bold">
                          정산 완료
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Requests Map/List */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Navigation size={18} className="text-green-500" />
                내 주변 요청
              </h3>
              <div className="space-y-3">
                {availableRequests.length > 0 ? availableRequests.map(req => (
                  <div 
                    key={req.id} 
                    onClick={() => setSelectedRequest(req)}
                    className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm active:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                         <h4 className="font-bold text-gray-800 dark:text-gray-200">{req.items[0]} 외 {req.items.length - 1}건</h4>
                         <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{req.location}</p>
                      </div>
                      <div className="text-right">
                        <span className="block font-bold text-green-600">{req.reward.toLocaleString()} P</span>
                        <span className="text-xs text-gray-400">{req.distance}</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-sm">
                       <span className="text-gray-500">{req.date} {req.time}</span>
                       <span className="text-green-500 font-medium flex items-center">상세보기 <ChevronRight size={14} /></span>
                    </div>
                  </div>
                )) : (
                   <div className="text-center py-12 text-gray-400">
                      <p>현재 주변에 대기 중인 요청이 없습니다.</p>
                   </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- MODALS --- */}

      {/* Request Details & Accept Modal */}
      {selectedRequest && !showVerifyModal && !showCameraModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-2xl p-6 space-y-5 animate-slideUp shadow-2xl">
            <div className="text-center">
              <h3 className="text-xl font-bold dark:text-white mb-1">수거 요청 상세</h3>
              {role === 'collector' && <p className="text-sm text-gray-500">{selectedRequest.distance} 거리</p>}
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl space-y-3">
               <div className="flex justify-between border-b border-gray-200 dark:border-gray-600 pb-2">
                 <span className="text-gray-500 text-sm">수거 품목</span>
                 <span className="font-medium dark:text-white text-right">{selectedRequest.items.join(', ')}</span>
               </div>
               <div className="flex justify-between border-b border-gray-200 dark:border-gray-600 pb-2">
                 <span className="text-gray-500 text-sm">위치</span>
                 <span className="font-medium dark:text-white text-right">{selectedRequest.location}</span>
               </div>
               <div className="flex justify-between border-b border-gray-200 dark:border-gray-600 pb-2">
                 <span className="text-gray-500 text-sm">일시</span>
                 <span className="font-medium dark:text-white text-right">{selectedRequest.date}<br/>{selectedRequest.time}</span>
               </div>
               <div className="flex justify-between items-center pt-1">
                 <span className="text-gray-500 text-sm">예상 수익</span>
                 <span className={`text-xl font-bold ${role === 'collector' ? 'text-green-600' : 'text-blue-600'}`}>{selectedRequest.reward.toLocaleString()} P</span>
               </div>
               <div className="flex justify-between items-center pt-1">
                 <span className="text-gray-500 text-sm">상태</span>
                 <div className="text-right">
                    {renderStatusBadge(selectedRequest.status)}
                 </div>
               </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setSelectedRequest(null)}
                className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl font-bold"
              >
                닫기
              </button>
              {selectedRequest.status === 'pending' && role === 'collector' && (
                <button 
                  onClick={() => handleAcceptRequest(selectedRequest)}
                  className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-600/20"
                >
                  수거 승인
                </button>
              )}
              {selectedRequest.status === 'completed' && role === 'requestor' && (
                <button 
                  onClick={() => { setShowVerifyModal(true); }}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20"
                >
                  결제하기
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Camera Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 bg-black z-[60] flex flex-col animate-fadeIn">
          <div className="relative flex-1 bg-black">
             <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted
                className="absolute inset-0 w-full h-full object-cover"
             />
             <div className="absolute inset-0 flex flex-col justify-between p-6 z-10">
                <div className="flex justify-between items-center text-white">
                   <h3 className="font-bold text-lg drop-shadow-md">작업 완료 인증</h3>
                   <button onClick={closeCameraModal} className="p-2 bg-black/40 rounded-full"><X /></button>
                </div>
                <div className="self-center text-center space-y-4 w-full">
                   <p className="text-white text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm inline-block">
                     배출된 물품 사진을 촬영해주세요
                   </p>
                   <button 
                      onClick={handleCaptureAndComplete}
                      className="w-20 h-20 bg-white rounded-full border-4 border-gray-300 shadow-xl mx-auto flex items-center justify-center active:scale-90 transition-transform"
                   >
                      <div className="w-16 h-16 bg-white rounded-full border-2 border-black" />
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Verification Modal */}
      {showVerifyModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl p-6 space-y-4">
             <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 text-green-600">
                   <CheckCircle size={24} />
                </div>
                <h3 className="text-lg font-bold dark:text-white">수거 작업 완료 확인</h3>
                <p className="text-sm text-gray-500">파트너가 수거 인증 사진을 보냈습니다.</p>
             </div>

             <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="text-gray-400 flex flex-col items-center">
                   <Camera size={32} />
                   <span className="text-xs mt-1">인증 사진 (예시)</span>
                </div>
                <div className="absolute inset-0 bg-black/10" />
             </div>

             <div className="space-y-2">
                <div className="flex justify-between text-sm">
                   <span className="text-gray-500">결제 금액</span>
                   <span className="font-bold text-blue-600">{selectedRequest.reward.toLocaleString()} P</span>
                </div>
                <p className="text-xs text-gray-400 text-center">승인 시 포인트가 즉시 차감됩니다.</p>
             </div>

             <div className="flex gap-2 pt-2">
                <button 
                   onClick={() => setShowVerifyModal(false)}
                   className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm"
                >
                   나중에
                </button>
                <button 
                   onClick={() => handleVerifyAndPay(selectedRequest)}
                   className="flex-[2] py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20"
                >
                   승인 및 결제
                </button>
             </div>
          </div>
        </div>
      )}

    </div>
  );
}