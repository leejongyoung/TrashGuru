import { useState, useEffect, useRef } from 'react';
import { Camera, X, Grid3x3, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CameraCaptureProps {
  onClose: () => void;
}

type RecognitionResult = {
  success: boolean;
  items?: {
    name: string;
    confidence: number;
    category: string;
  }[];
};

export function CameraCapture({ onClose }: CameraCaptureProps) {
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [recognitionResult, setRecognitionResult] = useState<RecognitionResult | null>(null);
  const [showFailModal, setShowFailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showGuide, setShowGuide] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // 랜덤 쓰레기 이미지들
  const wasteImages = [
    { 
      url: 'https://images.unsplash.com/photo-1606964575099-8fe6f0bf0872?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFzdGljJTIwYm90dGxlJTIwd2FzdGV8ZW58MXx8fHwxNzY0NTU4NDAxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      recognizable: true,
      items: [
        { name: '페트병', confidence: 95, category: '플라스틱' },
        { name: '플라스틱 뚜껑', confidence: 88, category: '플라스틱' },
      ]
    },
    { 
      url: 'https://images.unsplash.com/photo-1582126924905-7cdf67fab6cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbHVtaW51bSUyMGNhbiUyMHJlY3ljbGluZ3xlbnwxfHx8fDE3NjQ2NjQ3OTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      recognizable: true,
      items: [
        { name: '알루미늄 캔', confidence: 92, category: '캔/금속' },
      ]
    },
    { 
      url: 'https://images.unsplash.com/photo-1717667745830-de42bb75a4fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXBlciUyMGNhcmRib2FyZCUyMHdhc3RlfGVufDF8fHx8MTc2NDY2NDc5OHww&ixlib=rb-4.1.0&q=80&w=1080',
      recognizable: true,
      items: [
        { name: '골판지 상자', confidence: 90, category: '종이' },
      ]
    },
    { 
      url: 'https://images.unsplash.com/photo-1620676524838-7017c424120e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnbGFzcyUyMGJvdHRsZSUyMHdhc3RlfGVufDF8fHx8MTc2NDY2NDc5OHww&ixlib=rb-4.1.0&q=80&w=1080',
      recognizable: true,
      items: [
        { name: '유리병', confidence: 94, category: '유리' },
      ]
    },
    { 
      url: 'https://images.unsplash.com/photo-1644866331678-3b1385841c6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHlyb2ZvYW0lMjB3YXN0ZXxlbnwxfHx8fDE3NjQ2NjQ3OTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      recognizable: false, // 인식 실패 케이스
      items: []
    },
  ];

  const guideData: { [key: string]: any } = {
    '페트병': {
      category: '플라스틱',
      steps: [
        '내용물을 완전히 비웁니다',
        '라벨을 제거합니다',
        '물로 헹궈서 이물질을 제거합니다',
        '뚜껑을 분리하여 압착합니다',
      ],
      tip: '페트병은 압착하면 부피가 줄어 보관이 편리합니다',
      color: 'bg-green-50 border-green-200',
      textColor: 'text-green-800',
    },
    '알루미늄 캔': {
      category: '캔/금속',
      steps: [
        '내용물을 완전히 비웁니다',
        '물로 헹궈서 깨끗하게 씻습니다',
        '가볍게 압착합니다',
        '캔류 수거함에 배출합니다',
      ],
      tip: '담배꽁초 등 이물질이 들어가지 않도록 주의하세요',
      color: 'bg-orange-50 border-orange-200',
      textColor: 'text-orange-800',
    },
    '골판지 상자': {
      category: '종이',
      steps: [
        '테이프, 스티커 등을 제거합니다',
        '상자를 납작하게 펼칩니다',
        '끈으로 묶어서 배출합니다',
        '비닐 코팅된 부분은 제거합니다',
      ],
      tip: '젖은 종이는 재활용이 안되므로 물기를 제거하세요',
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-800',
    },
    '유리병': {
      category: '유리',
      steps: [
        '내용물을 완전히 비웁니다',
        '물로 헹궈서 이물질을 제거합니다',
        '뚜껑(금속, 플라스틱)을 분리합니다',
        '유리병 수거함에 배출합니다',
      ],
      tip: '깨진 유리병은 신문지에 싸서 종량제 봉투에 버려주세요',
      color: 'bg-purple-50 border-purple-200',
      textColor: 'text-purple-800',
    },
    '플라스틱 뚜껑': {
      category: '플라스틱',
      steps: [
        '페트병에서 분리합니다',
        '이물질을 제거합니다',
        '플라스틱류로 배출합니다',
      ],
      tip: '뚜껑은 페트병과 재질이 다르므로 분리 배출해야 합니다',
      color: 'bg-green-50 border-green-200',
      textColor: 'text-green-800',
    },
  };

  const startCamera = async () => {
    setCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraActive(false);
      // Handle error appropriately, maybe show an alert
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageDataUrl);
        
        // Stop camera after capture
        stopCamera();
        setCameraActive(false);

        // 랜덤으로 쓰레기 이미지 선택 (Mock recognition result)
        const randomImage = wasteImages[Math.floor(Math.random() * wasteImages.length)];

        // 인식 처리 시뮬레이션 (1초 후)
        setTimeout(() => {
          if (randomImage.recognizable) {
            setRecognitionResult({
              success: true,
              items: randomImage.items,
            });
          } else {
            setRecognitionResult({ success: false });
            setShowFailModal(true);
          }
        }, 1000);
      }
    }
  };

  const handleItemSelect = (item: any) => {
    setSelectedItem(item);
    setShowGuide(true);
  };

  const handleRetry = () => {
    setCapturedImage(null);
    setRecognitionResult(null);
    setShowFailModal(false);
    setSelectedItem(null);
    setShowGuide(false);
    startCamera();
  };

  const handleReset = () => {
    setCapturedImage(null);
    setRecognitionResult(null);
    setShowFailModal(false);
    setSelectedItem(null);
    setShowGuide(false);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-black text-white p-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2">
          <Camera size={24} />
          쓰레기 인식
        </h3>
        <button onClick={onClose} className="p-2">
          <X size={24} />
        </button>
      </div>

      {/* Camera View or Result */}
      <div className="flex-1 relative bg-gray-900">
        {!cameraActive && !capturedImage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={startCamera}
              className="bg-green-600 text-white px-8 py-4 rounded-xl flex items-center gap-2 hover:bg-green-700 transition-colors"
            >
              <Camera size={24} />
              카메라 시작
            </button>
          </div>
        )}

        {cameraActive && !capturedImage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="absolute inset-0 w-full h-full object-cover" 
            />
            {/* Grid Focus Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-80 h-80 relative">
                {/* Corner brackets */}
                <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-green-500"></div>
                <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-green-500"></div>
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-green-500"></div>
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-green-500"></div>

                {/* Center lines */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="border border-green-500/30"></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Guide Text */}
            <div className="absolute top-1/4 left-0 right-0 text-center">
              <p className="text-white text-lg mb-2">쓰레기를 화면 중앙에 맞춰주세요</p>
              <p className="text-white/70 text-sm">초점 영역 안에 쓰레기를 배치하세요</p>
            </div>
          </div>
        )}

        {capturedImage && (
          <div className="absolute inset-0">
            <ImageWithFallback
              src={capturedImage}
              alt="Captured waste"
              className="w-full h-full object-cover"
            />
            
            {recognitionResult === null && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p>쓰레기 인식 중...</p>
                </div>
              </div>
            )}

            {recognitionResult?.success && !showGuide && (
              <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[60vh] overflow-y-auto">
                <div className="flex items-center gap-2 mb-4 text-green-600">
                  <CheckCircle size={24} />
                  <h3>인식 완료!</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">품목을 선택하여 배출 가이드를 확인하세요</p>
                
                <div className="space-y-3">
                  {recognitionResult.items?.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleItemSelect(item)}
                      className="w-full p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-gray-900 mb-1">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-green-600">{item.confidence}%</p>
                          <p className="text-xs text-gray-500">신뢰도</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleReset}
                  className="w-full mt-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                >
                  다시 촬영하기
                </button>
              </div>
            )}

            {showGuide && selectedItem && guideData[selectedItem.name] && (
              <div className="absolute inset-0 bg-white overflow-y-auto">
                <div className="p-6">
                  <button
                    onClick={() => setShowGuide(false)}
                    className="mb-4 text-gray-600 flex items-center gap-2"
                  >
                    ← 뒤로
                  </button>

                  <div className={`${guideData[selectedItem.name].color} border rounded-2xl p-5 mb-6`}>
                    <h2 className={`${guideData[selectedItem.name].textColor} mb-2`}>
                      {selectedItem.name}
                    </h2>
                    <p className={`text-sm ${guideData[selectedItem.name].textColor}/80`}>
                      {guideData[selectedItem.name].category}
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="flex items-center gap-2 mb-4">
                      <Info size={20} className="text-green-600" />
                      배출 방법
                    </h3>
                    <div className="space-y-3">
                      {guideData[selectedItem.name].steps.map((step: string, idx: number) => (
                        <div key={idx} className="flex gap-3">
                          <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm">
                            {idx + 1}
                          </div>
                          <p className="text-gray-700 flex-1 pt-0.5">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                    <p className="text-sm text-yellow-800">
                      💡 <strong>팁:</strong> {guideData[selectedItem.name].tip}
                    </p>
                  </div>

                  <button
                    onClick={handleReset}
                    className="w-full py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                  >
                    새로운 쓰레기 인식하기
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Capture Button */}
      {cameraActive && !capturedImage && (
        <div className="bg-black p-6 flex items-center justify-center">
          <button
            onClick={handleCapture}
            className="w-20 h-20 bg-white rounded-full border-4 border-green-500 hover:bg-gray-100 transition-colors flex items-center justify-center"
          >
            <div className="w-16 h-16 bg-green-500 rounded-full"></div>
          </button>
        </div>
      )}

      {/* Recognition Fail Modal */}
      {showFailModal && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
          <div className="bg-white rounded-2xl p-6 max-w-sm mx-4">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="text-red-600" size={32} />
              </div>
              <h3 className="mb-2">인식에 실패했습니다</h3>
              <p className="text-sm text-gray-600 mb-6">
                쓰레기가 흐릿하거나 초점이 맞지 않아 인식할 수 없습니다.
                다시 촬영해주세요.
              </p>
              <div className="w-full space-y-2">
                <button
                  onClick={handleRetry}
                  className="w-full py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                >
                  다시 촬영하기
                </button>
                <button
                  onClick={() => {
                    setShowFailModal(false);
                    onClose();
                  }}
                  className="w-full py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
