import React from 'react';

interface CustomAlertProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export function CustomAlert({ isOpen, title, message, onClose }: CustomAlertProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
        <h3 className="mb-4 font-bold text-lg">{title}</h3>
                  <div className="bg-white rounded-xl p-4 mb-4">          <p className="text-gray-600 text-sm whitespace-pre-line">{message}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
