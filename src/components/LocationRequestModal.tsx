import React from 'react';

interface LocationRequestModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function LocationRequestModal({ isOpen, onConfirm, onCancel }: LocationRequestModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
        <h3 className="mb-4 font-bold text-lg">위치 정보 설정</h3>
        <div className="bg-white rounded-xl p-4 mb-4">
          <p className="text-gray-600 text-sm whitespace-pre-line">
            현재 위치 정보를 가져오시겠습니까?
            
            위치 정보를 허용하면 내 주변의 수거함 위치와 배출 요일 정보를 정확하게 확인할 수 있습니다.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
          >
            나중에
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold"
          >
            허용하기
          </button>
        </div>
      </div>
    </div>
  );
}
