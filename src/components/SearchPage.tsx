import { useState, useRef } from 'react';
import { Camera, ScanLine, Lightbulb, X, ArrowRight } from 'lucide-react';
import { CameraCapture } from './CameraCapture';

export function SearchPage() {
  const [showCamera, setShowCamera] = useState(false);
  const [showGalleryPicker, setShowGalleryPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGalleryClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setSelectedImage(imageData);
        setShowGalleryPicker(true);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-5 pb-24">
      {/* Show Camera Capture */}
      {showCamera && <CameraCapture onClose={() => setShowCamera(false)} />}

      {/* Gallery Picker Modal */}
      {showGalleryPicker && selectedImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-lg w-full shadow-2xl animate-slideUp">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg dark:text-white" style={{ fontWeight: 700 }}>선택한 사진</h3>
              <button
                onClick={() => {
                  setShowGalleryPicker(false);
                  setSelectedImage(null);
                }}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <X size={18} className="text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Selected Image */}
              <div className="mb-6 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img 
                  src={selectedImage} 
                  alt="Selected" 
                  className="w-full h-auto max-h-96 object-contain"
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    // Here you would process the image with AI
                    setShowGalleryPicker(false);
                    // Simulate AI processing
                    setTimeout(() => {
                      alert('AI 분석 중... 실제 구현 시 AI 분석 결과가 여기에 표시됩니다.');
                      setSelectedImage(null);
                    }, 500);
                  }}
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  style={{ fontWeight: 600 }}
                >
                  <span>AI 분석 시작하기</span>
                  <ArrowRight size={20} />
                </button>

                <button
                  onClick={handleGalleryClick}
                  className="w-full py-4 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all flex items-center justify-center gap-2"
                  style={{ fontWeight: 600 }}
                >
                  <ScanLine size={20} />
                  <span>다른 사진 선택</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl text-gray-900 dark:text-white mb-2" style={{ fontWeight: 700 }}>AI 카메라</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">쓰레기를 촬영하면 AI가 자동으로 분류해드려요</p>
      </div>

      {/* Main Card */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
        <div className="flex flex-col items-center gap-6">
          {/* Camera Icon with Pulse Effect */}
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full flex items-center justify-center shadow-lg">
              <Camera className="text-green-600 dark:text-green-400" size={56} />
            </div>
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <span className="text-2xl">✨</span>
            </div>
            {/* Notification Badge */}
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-800">
              <span className="text-white text-xs" style={{ fontWeight: 700 }}>AI</span>
            </div>
          </div>

          {/* Description */}
          <div className="text-center space-y-2">
            <h3 className="text-gray-900 dark:text-white" style={{ fontWeight: 600 }}>쓰레기 사진 인식</h3>
            <div className="space-y-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">쓰레기 사진을 찍으면</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">자동으로 분류 방법을 알려드려요</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => setShowCamera(true)}
            className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 relative overflow-hidden"
            style={{ fontWeight: 600 }}
          >
            {/* Animated Circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/20 rounded-full animate-ping" />
            <Camera size={22} />
            <span>사진 촬영하기</span>
          </button>

          <button 
            onClick={handleGalleryClick}
            className="w-full py-4 bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 border-2 border-green-600 dark:border-green-400 rounded-2xl hover:bg-green-50 dark:hover:bg-gray-600 transition-all flex items-center justify-center gap-2"
            style={{ fontWeight: 600 }}
          >
            <ScanLine size={22} />
            <span>갤러리에서 선택</span>
          </button>
        </div>
      </div>

      {/* Tips Card */}
      <div className="mt-5 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-3xl p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
            <Lightbulb className="text-white" size={20} />
          </div>
          <div className="flex-1">
            <h4 className="text-sm text-gray-900 dark:text-white mb-2" style={{ fontWeight: 600 }}>촬영 팁</h4>
            <ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 dark:text-yellow-400 mt-0.5">•</span>
                <span>밝은 곳에서 정면으로 촬영하세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 dark:text-yellow-400 mt-0.5">•</span>
                <span>쓰레기를 화면 중앙에 배치하세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 dark:text-yellow-400 mt-0.5">•</span>
                <span>라벨이나 재질이 잘 보이게 찍으세요</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-3">
            <span className="text-2xl">🎯</span>
          </div>
          <h4 className="text-sm text-gray-900 dark:text-white mb-1" style={{ fontWeight: 600 }}>높은 정확도</h4>
          <p className="text-xs text-gray-600 dark:text-gray-400">AI가 정확하게 분류를 도와드려요</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-3">
            <span className="text-2xl">⚡</span>
          </div>
          <h4 className="text-sm text-gray-900 dark:text-white mb-1" style={{ fontWeight: 600 }}>빠른 인식</h4>
          <p className="text-xs text-gray-600 dark:text-gray-400">몇 초만에 결과를 확인하세요</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-3">
            <span className="text-2xl">📚</span>
          </div>
          <h4 className="text-sm text-gray-900 dark:text-white mb-1" style={{ fontWeight: 600 }}>배출 가이드</h4>
          <p className="text-xs text-gray-600 dark:text-gray-400">올바른 배출 방법을 안내해요</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mb-3">
            <span className="text-2xl">🌱</span>
          </div>
          <h4 className="text-sm text-gray-900 dark:text-white mb-1" style={{ fontWeight: 600 }}>환경 보호</h4>
          <p className="text-xs text-gray-600 dark:text-gray-400">올바른 분리수거로 지구를 지켜요</p>
        </div>
      </div>
    </div>
  );
}
