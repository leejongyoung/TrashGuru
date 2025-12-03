import React from 'react';
import logo from '../assets/logo.svg';

const SplashScreen: React.FC = () => {
  return (
    <div className="splash-screen">
      <div className="splash-content">
        <img src={logo} alt="Trash Guru Logo" className="splash-logo" />
        <h1 className="splash-title">쓰레기 박사</h1>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-message">앱을 불러오고 있습니다...</p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;