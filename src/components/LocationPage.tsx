import { ArrowLeft, MapPin, Search, Check, Loader, Navigation, Plus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { LocationPermissionModal } from './LocationPermissionModal';

interface LocationPageProps {
  onBack: () => void;
  currentLocation: string;
  onLocationChange: (location: string) => void;
  language: 'ko' | 'en';
}

interface SavedAddress {
  id: string;
  name: string;
  roadAddress: string;
  detailAddress: string;
  region: string;
  city: string;
}

export function LocationPage({ onBack, currentLocation, onLocationChange, language }: LocationPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorType, setErrorType] = useState<'permission' | 'unavailable' | 'timeout' | 'general'>('general');
  const [tempLocation, setTempLocation] = useState(currentLocation);
  const [selectedServiceArea, setSelectedServiceArea] = useState('서울특별시');
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newAddressName, setNewAddressName] = useState('');
  const [newRoadAddress, setNewRoadAddress] = useState('');
  const [newDetailAddress, setNewDetailAddress] = useState('');
  const [showServiceAreaModal, setShowServiceAreaModal] = useState(false);

  // 서비스 지역과 구/시 데이터
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

  // Load saved addresses
  useEffect(() => {
    const saved = localStorage.getItem('savedAddresses');
    if (saved) {
      setSavedAddresses(JSON.parse(saved));
    }
  }, []);

  // Get current service area's cities
  const currentAreaCities = serviceAreas.find(area => area.region === selectedServiceArea)?.cities || [];

  // 전체 서비스 지역의 구/시를 검색
  const allCities = serviceAreas.flatMap(area => 
    area.cities.map(city => ({ region: area.region, city }))
  );

  const filteredLocations = searchQuery
    ? allCities.filter(loc => 
        loc.city.includes(searchQuery) || loc.region.includes(searchQuery)
      )
    : currentAreaCities.map(city => ({ region: selectedServiceArea, city }));

  const handleLocationSelect = (region: string, city: string) => {
    setTempLocation(`${region} ${city}`);
    setSelectedServiceArea(region);
  };

  const handleSaveLocation = () => {
    onLocationChange(tempLocation);
    onBack();
  };

  const handleAddAddress = () => {
    if (newAddressName.trim() && newRoadAddress.trim() && tempLocation) {
      // tempLocation에서 지역과 구/시 분리
      const locationParts = tempLocation.split(' ');
      const region = locationParts[0] || '';
      const city = locationParts[1] || '';
      
      const newAddress: SavedAddress = {
        id: Date.now().toString(),
        name: newAddressName.trim(),
        roadAddress: newRoadAddress.trim(),
        detailAddress: newDetailAddress.trim(),
        region: region,
        city: city,
      };
      const updated = [...savedAddresses, newAddress];
      setSavedAddresses(updated);
      localStorage.setItem('savedAddresses', JSON.stringify(updated));
      setNewAddressName('');
      setNewRoadAddress('');
      setNewDetailAddress('');
      setShowAddAddressModal(false);
    }
  };

  const handleDeleteAddress = (id: string) => {
    const updated = savedAddresses.filter(addr => addr.id !== id);
    setSavedAddresses(updated);
    localStorage.setItem('savedAddresses', JSON.stringify(updated));
  };

  const handleGetCurrentLocation = () => {
    setIsLoading(true);
    
    if (!navigator.geolocation) {
      setErrorType('unavailable');
      setShowErrorModal(true);
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocoding using Nominatim API
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=${language}`
          );
          const data = await response.json();
          
          let locationName = '';
          if (data.address) {
            const addr = data.address;
            
            // For Korean addresses, get state and district/city (OO시 OO구 format)
            if (language === 'ko') {
              // Try to get province/city first (시/도 level)
              const state = addr.state || '';
              
              // Try to get district/city (구/시 level)
              // city_district: 구, city: 시, county: 군
              const district = addr.city_district || addr.county || addr.city || addr.suburb || addr.town || '';
              
              // Build location string: only show 시/도 and 구/시
              if (state && district) {
                // Remove redundant parts (e.g., "서울특별시" -> just use it)
                // district might have full name like "강남구", keep it as is
                locationName = `${state} ${district}`;
              } else if (state) {
                locationName = state;
              } else if (district) {
                locationName = district;
              } else {
                // Fallback to a simplified version
                locationName = data.display_name.split(',').slice(0, 2).join(' ').trim();
              }
            } else {
              locationName = addr.city || addr.town || addr.county || addr.state || data.display_name;
            }
          } else {
            locationName = data.display_name.split(',').slice(0, 2).join(' ').trim();
          }
          
          setTempLocation(locationName);
          setIsLoading(false);
        } catch (error) {
          console.error('Geocoding error:', error);
          setErrorType('general');
          setShowErrorModal(true);
          setIsLoading(false);
        }
      },
      (error) => {
        if (error && error.code) {
          switch (error.code) {
            case 1: // PERMISSION_DENIED
              setErrorType('permission');
              break;
            case 2: // POSITION_UNAVAILABLE
              setErrorType('unavailable');
              break;
            case 3: // TIMEOUT
              setErrorType('timeout');
              break;
            default:
              setErrorType('general');
          }
        } else {
          setErrorType('general');
        }
        
        setShowErrorModal(true);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 300000
      }
    );
  };

  const t = {
    ko: {
      title: '위치 설정',
      savedAddresses: '지정한 내 주소',
      addAddress: '내 주소 추가',
      currentLocationInfo: '현재 위치 정보',
      getCurrentLocation: '현재 위치 확인하기',
      search: '서비스 위치 검색 (전국)',
      nearby: '내 주변 동네',
      serviceArea: '서비스 지역',
      serviceAreaDesc: '현재 서비스를 제공하고 있는 지역입니다',
      save: '저장하기',
      loading: '위치를 가져오는 중...',
      noSavedAddresses: '저장된 주소가 없습니다',
      addAddressTitle: '주소 추가',
      addressName: '주소 이름 (예: 집, 회사)',
      roadAddress: '도로명 주소',
      detailAddress: '상세 주소 (선택)',
      selectedLocation: '선택된 지역',
      cancel: '취소',
      add: '추가',
      confirm: '확인',
    },
    en: {
      title: 'Location Settings',
      savedAddresses: 'Saved Addresses',
      addAddress: 'Add Address',
      currentLocationInfo: 'Current Location',
      getCurrentLocation: 'Get Current Location',
      search: 'Search Service Location (Nationwide)',
      nearby: 'Nearby Areas',
      serviceArea: 'Service Areas',
      serviceAreaDesc: 'Areas where we currently provide service',
      save: 'Save',
      loading: 'Getting location...',
      noSavedAddresses: 'No saved addresses',
      addAddressTitle: 'Add Address',
      addressName: 'Address name (e.g., Home, Work)',
      roadAddress: 'Street Address',
      detailAddress: 'Detail Address (Optional)',
      selectedLocation: 'Selected Region',
      cancel: 'Cancel',
      add: 'Add',
      confirm: 'Confirm',
    },
  };

  const text = t[language];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-[430px] mx-auto min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <ArrowLeft size={24} className="dark:text-white" />
          </button>
          <h2 className="dark:text-white">{text.title}</h2>
        </div>

        <div className="p-4 space-y-4 pb-24">
          {/* Saved Addresses */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h3 className="dark:text-white" style={{ fontWeight: 600 }}>
                {text.savedAddresses}
              </h3>
              <button
                onClick={() => setShowAddAddressModal(true)}
                className="flex items-center gap-1 text-green-600 text-sm hover:text-green-700"
                style={{ fontWeight: 600 }}
              >
                <Plus size={18} />
                <span>{text.addAddress}</span>
              </button>
            </div>
            <div className="p-4">
              {savedAddresses.length === 0 ? (
                <p className="text-center text-gray-400 py-4 text-sm">{text.noSavedAddresses}</p>
              ) : (
                <div className="space-y-2">
                  {savedAddresses.map((address) => (
                    <div
                      key={address.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <MapPin className="text-green-600 flex-shrink-0" size={18} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm dark:text-white" style={{ fontWeight: 600 }}>
                            {address.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {address.region} {address.city}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
                            {address.roadAddress}
                            {address.detailAddress && `, ${address.detailAddress}`}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteAddress(address.id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex-shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Current Location Info Box */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="text-green-600" size={20} />
              <h3 className="text-sm text-gray-600 dark:text-gray-400">{text.currentLocationInfo}</h3>
            </div>
            <p className="text-gray-900 dark:text-white" style={{ fontWeight: 600 }}>
              {tempLocation}
            </p>
          </div>

          {/* Get Current Location Button */}
          <button
            onClick={handleGetCurrentLocation}
            disabled={isLoading}
            className="w-full bg-white dark:bg-gray-800 border-2 border-green-600 text-green-600 rounded-xl py-3 hover:bg-green-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ fontWeight: 600 }}
          >
            {isLoading ? (
              <>
                <Loader className="animate-spin" size={20} />
                <span>{text.loading}</span>
              </>
            ) : (
              <>
                <Navigation size={20} />
                <span>{text.getCurrentLocation}</span>
              </>
            )}
          </button>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={text.search}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-green-500 dark:text-white"
            />
          </div>

          {/* Nearby Locations */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="flex items-center gap-2 dark:text-white" style={{ fontWeight: 600 }}>
                <MapPin className="text-green-600" size={20} />
                {searchQuery ? '검색 결과' : text.nearby}
              </h3>
            </div>
            <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
              {filteredLocations.map((location, idx) => (
                <button
                  key={idx}
                  onClick={() => handleLocationSelect(location.region, location.city)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="text-gray-400 dark:text-gray-500" size={18} />
                    <div className="text-left">
                      <span className="text-sm dark:text-white block">{location.region} {location.city}</span>
                    </div>
                  </div>
                  {`${location.region} ${location.city}` === tempLocation && (
                    <Check className="text-green-600" size={20} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {filteredLocations.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center">
              <MapPin className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-600 dark:text-gray-400">
                {language === 'ko' ? '검색 결과가 없습니다.' : 'No results found.'}
              </p>
            </div>
          )}

          {/* Service Area Link */}
          <div className="flex justify-center">
            <button
              onClick={() => setShowServiceAreaModal(true)}
              className="text-gray-600 dark:text-gray-400 text-sm underline hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              {text.serviceArea}
            </button>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveLocation}
            className="w-full bg-green-600 text-white rounded-xl py-4 hover:bg-green-700 transition-colors sticky bottom-4"
            style={{ fontWeight: 600 }}
          >
            {text.save}
          </button>
        </div>

        {/* Add Address Modal */}
        {showAddAddressModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowAddAddressModal(false)}>
            <div 
              className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-[390px] p-6 space-y-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-2">
                <h3 className="dark:text-white" style={{ fontWeight: 700 }}>
                  {text.addAddressTitle}
                </h3>
                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <MapPin className="text-green-600" size={16} />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{text.selectedLocation}</p>
                    <p className="text-sm text-green-700 dark:text-green-400" style={{ fontWeight: 600 }}>
                      {tempLocation}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1.5" style={{ fontWeight: 500 }}>
                    {text.addressName}
                  </label>
                  <input
                    type="text"
                    value={newAddressName}
                    onChange={(e) => setNewAddressName(e.target.value)}
                    placeholder="예: 우리집, 회사, 엄마집"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-green-500 dark:text-white"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1.5" style={{ fontWeight: 500 }}>
                    {text.roadAddress}
                  </label>
                  <input
                    type="text"
                    value={newRoadAddress}
                    onChange={(e) => setNewRoadAddress(e.target.value)}
                    placeholder="예: 테헤란로 123"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-green-500 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1.5" style={{ fontWeight: 500 }}>
                    {text.detailAddress}
                  </label>
                  <input
                    type="text"
                    value={newDetailAddress}
                    onChange={(e) => setNewDetailAddress(e.target.value)}
                    placeholder="예: 101동 1001호"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-green-500 dark:text-white"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddAddress();
                      }
                    }}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowAddAddressModal(false);
                    setNewAddressName('');
                    setNewRoadAddress('');
                    setNewDetailAddress('');
                  }}
                  className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  style={{ fontWeight: 600 }}
                >
                  {text.cancel}
                </button>
                <button
                  onClick={handleAddAddress}
                  disabled={!newAddressName.trim() || !newRoadAddress.trim()}
                  className="flex-1 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontWeight: 600 }}
                >
                  {text.add}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Service Area Modal */}
        {showServiceAreaModal && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={() => setShowServiceAreaModal(false)}>
            <div 
              className="bg-white dark:bg-gray-800 rounded-t-3xl w-full max-w-[430px] max-h-[80vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="dark:text-white" style={{ fontWeight: 700 }}>{text.serviceArea}</h3>
                  <button 
                    onClick={() => setShowServiceAreaModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{text.serviceAreaDesc}</p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                {serviceAreas.map((area, index) => (
                  <div key={index} className="mb-6">
                    <h4 className="mb-3 text-green-700 dark:text-green-400" style={{ fontWeight: 600 }}>
                      {area.region}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {area.cities.map((city, cityIndex) => (
                        <span 
                          key={cityIndex}
                          className="px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg text-sm"
                        >
                          {city}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowServiceAreaModal(false)}
                  className="w-full py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                  style={{ fontWeight: 600 }}
                >
                  {text.confirm}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Modal */}
        {showErrorModal && (
          <LocationPermissionModal
            onClose={() => setShowErrorModal(false)}
            language={language}
            errorType={errorType}
          />
        )}
      </div>
    </div>
  );
}
