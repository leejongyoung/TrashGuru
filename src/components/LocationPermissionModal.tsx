import { MapPin, X, AlertTriangle } from 'lucide-react';

interface LocationPermissionModalProps {
  onClose: () => void;
  language: 'ko' | 'en';
  errorType: 'permission' | 'unavailable' | 'timeout' | 'general';
}

export function LocationPermissionModal({ onClose, language, errorType }: LocationPermissionModalProps) {
  const content = {
    ko: {
      permission: {
        title: '위치 권한 필요',
        message: '위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.',
        steps: [
          '1. 브라우저 주소창 왼쪽의 자물쇠 아이콘을 클릭하세요',
          '2. 위치 권한을 "허용"으로 변경하세요',
          '3. 페이지를 새로고침하세요',
        ],
      },
      unavailable: {
        title: '위치 정보 없음',
        message: '위치 정보를 사용할 수 없습니다. 인터넷 연결을 확인하거나 수동으로 위치를 설정해주세요.',
        steps: [],
      },
      timeout: {
        title: '시간 초과',
        message: '위치 정보 요청 시간이 초과되었습니다. 다시 시도하거나 수동으로 위치를 설정해주세요.',
        steps: [],
      },
      general: {
        title: '위치 가져오기 실패',
        message: '위치 정보를 가져오는데 실패했습니다. 수동으로 위치를 선택해주세요.',
        steps: [],
      },
      close: '닫기',
      understand: '확인',
    },
    en: {
      permission: {
        title: 'Location Permission Required',
        message: 'Location permission denied. Please enable location access in your browser settings.',
        steps: [
          '1. Click the lock icon on the left of the address bar',
          '2. Change location permission to "Allow"',
          '3. Refresh the page',
        ],
      },
      unavailable: {
        title: 'Location Unavailable',
        message: 'Location information is unavailable. Please check your internet connection or set location manually.',
        steps: [],
      },
      timeout: {
        title: 'Request Timeout',
        message: 'Location request timed out. Please try again or set location manually.',
        steps: [],
      },
      general: {
        title: 'Location Failed',
        message: 'Failed to get location information. Please select location manually.',
        steps: [],
      },
      close: 'Close',
      understand: 'OK',
    },
  };

  const t = content[language];
  const error = t[errorType];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-slideUp">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              errorType === 'permission' 
                ? 'bg-orange-100 dark:bg-orange-900/20' 
                : 'bg-red-100 dark:bg-red-900/20'
            }`}>
              {errorType === 'permission' ? (
                <MapPin className="text-orange-600" size={24} />
              ) : (
                <AlertTriangle className="text-red-600" size={24} />
              )}
            </div>
            <h3 className="dark:text-white">{error.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Message */}
        <div className={`p-4 rounded-xl mb-4 ${
          errorType === 'permission'
            ? 'bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800'
            : 'bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800'
        }`}>
          <p className={`text-sm ${
            errorType === 'permission'
              ? 'text-orange-800 dark:text-orange-300'
              : 'text-red-800 dark:text-red-300'
          }`}>
            {error.message}
          </p>
        </div>

        {/* Steps */}
        {error.steps && error.steps.length > 0 && (
          <div className="mb-6 space-y-2">
            {error.steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">{step}</span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
        >
          {error.steps && error.steps.length > 0 ? t.understand : t.close}
        </button>
      </div>
    </div>
  );
}
