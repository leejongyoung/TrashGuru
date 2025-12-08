import { Search, ChevronRight, MapPin, ChevronDown, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ClassificationPageProps {
  userLocation?: string;
  onRequestLocation?: () => void;
}

interface RegionRule {
  description: string;
  schedule: string;
  special: string;
}

interface WasteCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  items: string[];
}

// Helper to create standard rules with minor variations
const createStandardRules = (regionName: string, scheduleVariation: string = '지역별 상이') => ({
  'plastic': {
    description: '내용물을 비우고 헹궈서 배출. 투명 페트병은 별도 분리배출 필수.',
    schedule: scheduleVariation,
    special: '투명 페트병은 라벨을 제거하고 압착하여 전용 수거함에 배출해주세요.'
  },
  'paper': {
    description: '물기에 젖지 않게 묶어서 배출. 우유팩은 씻어서 펼쳐 건조 후 배출.',
    schedule: scheduleVariation,
    special: '택배 상자의 테이프와 운송장은 반드시 제거해야 합니다.'
  },
  'glass': {
    description: '깨지지 않게 주의. 소주/맥주병은 보증금 환불 가능.',
    schedule: scheduleVariation,
    special: '깨진 유리는 신문지에 싸서 종량제 봉투에 버려주세요.'
  },
  'can': {
    description: '내용물을 비우고 압착하여 배출. 부탄가스는 구멍 뚫어 배출.',
    schedule: scheduleVariation,
    special: '스프레이 캔은 가스를 완전히 제거해야 폭발 위험이 없습니다.'
  },
  'vinyl': {
    description: '이물질이 묻지 않은 비닐만 배출. 흩날리지 않게 묶어서 배출.',
    schedule: scheduleVariation,
    special: '음식물이 묻은 비닐은 종량제 봉투에 버려주세요.'
  },
  'general': {
    description: '재활용이 불가능한 쓰레기. 종량제 봉투에 담아 배출.',
    schedule: '매일 저녁 8시 ~ 12시 (토요일 제외)',
    special: '50L 이상 대형 봉투는 무게 제한을 준수해주세요.'
  }
});

// Mock Data for Regional Rules
const REGION_RULES: Record<string, Record<string, RegionRule>> = {
  // 서울특별시 (25개 자치구)
  '서울시 강남구': createStandardRules('강남구', '매일 배출 가능 (일몰 후)'),
  '서울시 강동구': createStandardRules('강동구', '매주 일~금 20:00 ~ 24:00'),
  '서울시 강북구': createStandardRules('강북구', '매주 일, 화, 목 18:00 ~ 24:00'),
  '서울시 강서구': createStandardRules('강서구', '매주 일~목 19:00 ~ 23:00'),
  '서울시 관악구': createStandardRules('관악구', '매주 월~금 18:00 ~ 24:00'),
  '서울시 광진구': createStandardRules('광진구', '매일 19:00 ~ 23:00 (토요일 제외)'),
  '서울시 구로구': createStandardRules('구로구', '매주 월, 수, 금 20:00 ~ 24:00'),
  '서울시 금천구': createStandardRules('금천구', '매일 18:00 ~ 24:00 (토요일 제외)'),
  '서울시 노원구': createStandardRules('노원구', '매주 일~금 20:00 ~ 04:00'),
  '서울시 도봉구': createStandardRules('도봉구', '매주 월, 수, 금 18:00 ~ 21:00'),
  '서울시 동대문구': createStandardRules('동대문구', '매일 19:00 ~ 24:00 (토요일 제외)'),
  '서울시 동작구': createStandardRules('동작구', '매일 17:00 ~ 23:00 (토, 일 제외)'),
  '서울시 마포구': {
    'plastic': {
      description: '내용물을 비우고 헹궈서 배출. 투명 페트병은 별도 분리배출 필수.',
      schedule: '매주 월, 목요일 저녁 8시 ~ 12시',
      special: '투명 페트병은 라벨을 제거하고 압착하여 전용 수거함에 배출해주세요.'
    },
    'paper': {
      description: '물기에 젖지 않게 묶어서 배출. 우유팩은 씻어서 펼쳐 건조 후 배출.',
      schedule: '매주 화, 금요일 저녁 8시 ~ 12시',
      special: '택배 상자의 테이프와 운송장은 반드시 제거해야 합니다.'
    },
    'glass': {
      description: '깨지지 않게 주의. 소주/맥주병은 보증금 환불 가능.',
      schedule: '매주 수, 토요일 저녁 8시 ~ 12시',
      special: '깨진 유리는 신문지에 싸서 종량제 봉투에 버려주세요.'
    },
    'can': {
      description: '내용물을 비우고 압착하여 배출. 부탄가스는 구멍 뚫어 배출.',
      schedule: '매주 월, 목요일 저녁 8시 ~ 12시',
      special: '스프레이 캔은 가스를 완전히 제거해야 폭발 위험이 없습니다.'
    },
    'vinyl': {
      description: '이물질이 묻지 않은 비닐만 배출. 흩날리지 않게 묶어서 배출.',
      schedule: '매주 목요일 저녁 8시 ~ 12시',
      special: '음식물이 묻은 비닐은 종량제 봉투에 버려주세요.'
    },
    'general': {
      description: '재활용이 불가능한 쓰레기. 종량제 봉투에 담아 배출.',
      schedule: '매일 저녁 8시 ~ 12시 (토요일 제외)',
      special: '50L 이상 대형 봉투는 무게 제한을 준수해주세요.'
    }
  },
  '서울시 서대문구': createStandardRules('서대문구', '매주 월, 수, 금 19:00 ~ 23:00'),
  '서울시 서초구': createStandardRules('서초구', '매일 20:00 ~ 24:00 (토요일 제외)'),
  '서울시 성동구': createStandardRules('성동구', '매주 일~목 20:00 ~ 24:00'),
  '서울시 성북구': createStandardRules('성북구', '매주 일~금 18:00 ~ 24:00'),
  '서울시 송파구': createStandardRules('송파구', '매일 20:00 ~ 23:00 (토요일 제외)'),
  '서울시 양천구': createStandardRules('양천구', '매주 일~금 19:00 ~ 24:00'),
  '서울시 영등포구': createStandardRules('영등포구', '매일 20:00 ~ 24:00 (토요일 제외)'),
  '서울시 용산구': createStandardRules('용산구', '매주 일~목 18:00 ~ 22:00'),
  '서울시 은평구': createStandardRules('은평구', '매일 18:00 ~ 24:00 (토요일 제외)'),
  '서울시 종로구': createStandardRules('종로구', '매주 월, 수, 금 19:00 ~ 23:00'),
  '서울시 중구': createStandardRules('중구', '매일 19:00 ~ 24:00 (토요일 제외)'),
  '서울시 중랑구': createStandardRules('중랑구', '매주 일~금 20:00 ~ 04:00'),

  // 부산광역시
  '부산시 중구': createStandardRules('부산시 중구'),
  '부산시 서구': createStandardRules('부산시 서구'),
  '부산시 동구': createStandardRules('부산시 동구'),
  '부산시 영도구': createStandardRules('부산시 영도구'),
  '부산시 부산진구': createStandardRules('부산시 부산진구'),
  '부산시 동래구': createStandardRules('부산시 동래구'),
  '부산시 남구': createStandardRules('부산시 남구'),
  '부산시 북구': createStandardRules('부산시 북구'),
  '부산시 해운대구': createStandardRules('부산시 해운대구'),
  '부산시 사하구': createStandardRules('부산시 사하구'),
  '부산시 금정구': createStandardRules('부산시 금정구'),
  '부산시 강서구': createStandardRules('부산시 강서구'),
  '부산시 연제구': createStandardRules('부산시 연제구'),
  '부산시 수영구': createStandardRules('부산시 수영구'),
  '부산시 사상구': createStandardRules('부산시 사상구'),
  '부산시 기장군': createStandardRules('부산시 기장군'),

  // 대구광역시
  '대구시 중구': createStandardRules('대구시 중구'),
  '대구시 동구': createStandardRules('대구시 동구'),
  '대구시 서구': createStandardRules('대구시 서구'),
  '대구시 남구': createStandardRules('대구시 남구'),
  '대구시 북구': createStandardRules('대구시 북구'),
  '대구시 수성구': createStandardRules('대구시 수성구'),
  '대구시 달서구': createStandardRules('대구시 달서구'),
  '대구시 달성군': createStandardRules('대구시 달성군'),
  '대구시 군위군': createStandardRules('대구시 군위군'),

  // 인천광역시
  '인천시 중구': createStandardRules('인천시 중구'),
  '인천시 동구': createStandardRules('인천시 동구'),
  '인천시 미추홀구': createStandardRules('인천시 미추홀구'),
  '인천시 연수구': createStandardRules('인천시 연수구'),
  '인천시 남동구': createStandardRules('인천시 남동구'),
  '인천시 부평구': createStandardRules('인천시 부평구'),
  '인천시 계양구': createStandardRules('인천시 계양구'),
  '인천시 서구': createStandardRules('인천시 서구'),
  '인천시 강화군': createStandardRules('인천시 강화군'),
  '인천시 옹진군': createStandardRules('인천시 옹진군'),

  // 광주광역시
  '광주시 동구': createStandardRules('광주시 동구'),
  '광주시 서구': createStandardRules('광주시 서구'),
  '광주시 남구': createStandardRules('광주시 남구'),
  '광주시 북구': createStandardRules('광주시 북구'),
  '광주시 광산구': createStandardRules('광주시 광산구'),

  // 대전광역시
  '대전시 동구': createStandardRules('대전시 동구'),
  '대전시 중구': createStandardRules('대전시 중구'),
  '대전시 서구': createStandardRules('대전시 서구'),
  '대전시 유성구': createStandardRules('대전시 유성구'),
  '대전시 대덕구': createStandardRules('대전시 대덕구'),

  // 울산광역시
  '울산시 중구': createStandardRules('울산시 중구'),
  '울산시 남구': createStandardRules('울산시 남구'),
  '울산시 동구': createStandardRules('울산시 동구'),
  '울산시 북구': createStandardRules('울산시 북구'),
  '울산시 울주군': createStandardRules('울산시 울주군'),

  // 세종특별자치시 (단일)
  '세종시': createStandardRules('세종시', '자동크린넷 및 요일별 수거'),

  // 경기도 (31개 시군)
  '경기도 수원시': createStandardRules('수원시'),
  '경기도 성남시': createStandardRules('성남시'),
  '경기도 의정부시': createStandardRules('의정부시'),
  '경기도 안양시': createStandardRules('안양시'),
  '경기도 부천시': createStandardRules('부천시'),
  '경기도 광명시': createStandardRules('광명시'),
  '경기도 평택시': createStandardRules('평택시'),
  '경기도 동두천시': createStandardRules('동두천시'),
  '경기도 안산시': createStandardRules('안산시'),
  '경기도 고양시': createStandardRules('고양시'),
  '경기도 과천시': createStandardRules('과천시'),
  '경기도 구리시': createStandardRules('구리시'),
  '경기도 남양주시': createStandardRules('남양주시'),
  '경기도 오산시': createStandardRules('오산시'),
  '경기도 시흥시': createStandardRules('시흥시'),
  '경기도 군포시': createStandardRules('군포시'),
  '경기도 의왕시': createStandardRules('의왕시'),
  '경기도 하남시': createStandardRules('하남시'),
  '경기도 용인시': createStandardRules('용인시'),
  '경기도 파주시': createStandardRules('파주시'),
  '경기도 이천시': createStandardRules('이천시'),
  '경기도 안성시': createStandardRules('안성시'),
  '경기도 김포시': createStandardRules('김포시'),
  '경기도 화성시': createStandardRules('화성시'),
  '경기도 광주시': createStandardRules('광주시'),
  '경기도 양주시': createStandardRules('양주시'),
  '경기도 포천시': createStandardRules('포천시'),
  '경기도 여주시': createStandardRules('여주시'),
  '경기도 연천군': createStandardRules('연천군'),
  '경기도 가평군': createStandardRules('가평군'),
  '경기도 양평군': createStandardRules('양평군'),

  // 강원특별자치도
  '강원도 춘천시': createStandardRules('춘천시'),
  '강원도 원주시': createStandardRules('원주시'),
  '강원도 강릉시': createStandardRules('강릉시'),
  '강원도 동해시': createStandardRules('동해시'),
  '강원도 태백시': createStandardRules('태백시'),
  '강원도 속초시': createStandardRules('속초시'),
  '강원도 삼척시': createStandardRules('삼척시'),
  '강원도 홍천군': createStandardRules('홍천군'),
  '강원도 횡성군': createStandardRules('횡성군'),
  '강원도 영월군': createStandardRules('영월군'),
  '강원도 평창군': createStandardRules('평창군'),
  '강원도 정선군': createStandardRules('정선군'),
  '강원도 철원군': createStandardRules('철원군'),
  '강원도 화천군': createStandardRules('화천군'),
  '강원도 양구군': createStandardRules('양구군'),
  '강원도 인제군': createStandardRules('인제군'),
  '강원도 고성군': createStandardRules('고성군'),
  '강원도 양양군': createStandardRules('양양군'),

  // 충청북도
  '충청북도 청주시': createStandardRules('청주시'),
  '충청북도 충주시': createStandardRules('충주시'),
  '충청북도 제천시': createStandardRules('제천시'),
  '충청북도 보은군': createStandardRules('보은군'),
  '충청북도 옥천군': createStandardRules('옥천군'),
  '충청북도 영동군': createStandardRules('영동군'),
  '충청북도 증평군': createStandardRules('증평군'),
  '충청북도 진천군': createStandardRules('진천군'),
  '충청북도 괴산군': createStandardRules('괴산군'),
  '충청북도 음성군': createStandardRules('음성군'),
  '충청북도 단양군': createStandardRules('단양군'),

  // 충청남도
  '충청남도 천안시': createStandardRules('천안시'),
  '충청남도 공주시': createStandardRules('공주시'),
  '충청남도 보령시': createStandardRules('보령시'),
  '충청남도 아산시': createStandardRules('아산시'),
  '충청남도 서산시': createStandardRules('서산시'),
  '충청남도 논산시': createStandardRules('논산시'),
  '충청남도 계룡시': createStandardRules('계룡시'),
  '충청남도 당진시': createStandardRules('당진시'),
  '충청남도 금산군': createStandardRules('금산군'),
  '충청남도 부여군': createStandardRules('부여군'),
  '충청남도 서천군': createStandardRules('서천군'),
  '충청남도 청양군': createStandardRules('청양군'),
  '충청남도 홍성군': createStandardRules('홍성군'),
  '충청남도 예산군': createStandardRules('예산군'),
  '충청남도 태안군': createStandardRules('태안군'),

  // 전라북도
  '전라북도 전주시': createStandardRules('전주시'),
  '전라북도 군산시': createStandardRules('군산시'),
  '전라북도 익산시': createStandardRules('익산시'),
  '전라북도 정읍시': createStandardRules('정읍시'),
  '전라북도 남원시': createStandardRules('남원시'),
  '전라북도 김제시': createStandardRules('김제시'),
  '전라북도 완주군': createStandardRules('완주군'),
  '전라북도 진안군': createStandardRules('진안군'),
  '전라북도 무주군': createStandardRules('무주군'),
  '전라북도 장수군': createStandardRules('장수군'),
  '전라북도 임실군': createStandardRules('임실군'),
  '전라북도 순창군': createStandardRules('순창군'),
  '전라북도 고창군': createStandardRules('고창군'),
  '전라북도 부안군': createStandardRules('부안군'),

  // 전라남도
  '전라남도 목포시': createStandardRules('목포시'),
  '전라남도 여수시': createStandardRules('여수시'),
  '전라남도 순천시': createStandardRules('순천시'),
  '전라남도 나주시': createStandardRules('나주시'),
  '전라남도 광양시': createStandardRules('광양시'),
  '전라남도 담양군': createStandardRules('담양군'),
  '전라남도 곡성군': createStandardRules('곡성군'),
  '전라남도 구례군': createStandardRules('구례군'),
  '전라남도 고흥군': createStandardRules('고흥군'),
  '전라남도 보성군': createStandardRules('보성군'),
  '전라남도 화순군': createStandardRules('화순군'),
  '전라남도 장흥군': createStandardRules('장흥군'),
  '전라남도 강진군': createStandardRules('강진군'),
  '전라남도 해남군': createStandardRules('해남군'),
  '전라남도 영암군': createStandardRules('영암군'),
  '전라남도 무안군': createStandardRules('무안군'),
  '전라남도 함평군': createStandardRules('함평군'),
  '전라남도 영광군': createStandardRules('영광군'),
  '전라남도 장성군': createStandardRules('장성군'),
  '전라남도 완도군': createStandardRules('완도군'),
  '전라남도 진도군': createStandardRules('진도군'),
  '전라남도 신안군': createStandardRules('신안군'),

  // 경상북도
  '경상북도 포항시': createStandardRules('포항시'),
  '경상북도 경주시': createStandardRules('경주시'),
  '경상북도 김천시': createStandardRules('김천시'),
  '경상북도 안동시': createStandardRules('안동시'),
  '경상북도 구미시': createStandardRules('구미시'),
  '경상북도 영주시': createStandardRules('영주시'),
  '경상북도 영천시': createStandardRules('영천시'),
  '경상북도 상주시': createStandardRules('상주시'),
  '경상북도 문경시': createStandardRules('문경시'),
  '경상북도 경산시': createStandardRules('경산시'),
  '경상북도 의성군': createStandardRules('의성군'),
  '경상북도 청송군': createStandardRules('청송군'),
  '경상북도 영양군': createStandardRules('영양군'),
  '경상북도 영덕군': createStandardRules('영덕군'),
  '경상북도 청도군': createStandardRules('청도군'),
  '경상북도 고령군': createStandardRules('고령군'),
  '경상북도 성주군': createStandardRules('성주군'),
  '경상북도 칠곡군': createStandardRules('칠곡군'),
  '경상북도 예천군': createStandardRules('예천군'),
  '경상북도 봉화군': createStandardRules('봉화군'),
  '경상북도 울진군': createStandardRules('울진군'),
  '경상북도 울릉군': createStandardRules('울릉군'),

  // 경상남도
  '경상남도 창원시': createStandardRules('창원시'),
  '경상남도 진주시': createStandardRules('진주시'),
  '경상남도 통영시': createStandardRules('통영시'),
  '경상남도 사천시': createStandardRules('사천시'),
  '경상남도 김해시': createStandardRules('김해시'),
  '경상남도 밀양시': createStandardRules('밀양시'),
  '경상남도 거제시': createStandardRules('거제시'),
  '경상남도 양산시': createStandardRules('양산시'),
  '경상남도 의령군': createStandardRules('의령군'),
  '경상남도 함안군': createStandardRules('함안군'),
  '경상남도 창녕군': createStandardRules('창녕군'),
  '경상남도 고성군': createStandardRules('고성군'),
  '경상남도 남해군': createStandardRules('남해군'),
  '경상남도 하동군': createStandardRules('하동군'),
  '경상남도 산청군': createStandardRules('산청군'),
  '경상남도 함양군': createStandardRules('함양군'),
  '경상남도 거창군': createStandardRules('거창군'),
  '경상남도 합천군': createStandardRules('합천군'),

  // 제주특별자치도
  '제주도 제주시': createStandardRules('제주시', '클린하우스 및 요일별 배출'),
  '제주도 서귀포시': createStandardRules('서귀포시', '클린하우스 및 요일별 배출'),

  // 기타 지역
  '기타 지역': { 
    'plastic': {
      description: '내용물을 비우고 깨끗하게 헹궈서 배출해주세요. 라벨과 뚜껑은 제거하는 것이 좋습니다.',
      schedule: '지역별 상이',
      special: '투명 페트병은 별도로 분리 배출하는 곳이 많으니 확인해주세요.'
    },
    'paper': {
      description: '물기에 젖지 않도록 하며, 박스는 펼쳐서 묶어 배출합니다. 이물질이 묻은 종이는 일반쓰레기입니다.',
      schedule: '지역별 상이',
      special: '영수증, 코팅된 종이는 재활용이 안 되니 일반쓰레기로 버려주세요.'
    },
    'glass': {
      description: '뚜껑을 제거하고 내용물을 비워 배출합니다. 깨진 유리는 신문지에 싸서 안전하게 버려주세요.',
      schedule: '지역별 상이',
      special: '도자기류, 거울은 재활용 불가 품목이니 일반쓰레기 또는 특수규격봉투로 배출합니다.'
    },
    'can': {
      description: '내용물을 비우고 헹군 후 가능한 압착하여 배출합니다. 부탄가스 용기는 구멍을 뚫어 가스를 완전히 제거합니다.',
      schedule: '지역별 상이',
      special: '고철류는 재활용품으로 배출하며, 이물질이 많으면 일반쓰레기입니다.'
    },
    'vinyl': {
      description: '이물질이 묻지 않은 깨끗한 비닐류만 배출합니다. 오염된 비닐은 일반쓰레기입니다.',
      schedule: '지역별 상이',
      special: '과자 봉지, 빵 봉지 등은 모아서 버려도 되지만, 랩 필름은 재활용이 어렵습니다.'
    },
    'general': {
      description: '재활용이 불가능한 모든 쓰레기는 해당 지역의 종량제 봉투에 담아 배출합니다.',
      schedule: '지역별 상이',
      special: '음식물 쓰레기, 재활용 불가 쓰레기를 혼합하여 버리면 과태료가 부과될 수 있습니다.'
    }
  }
};

const DEFAULT_REGION = '서울시 마포구';

export function ClassificationPage({ userLocation, onRequestLocation }: ClassificationPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('서울특별시');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('마포구');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const ADMINISTRATIVE_REGIONS = [
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

  // Helper to map full region names to keys in REGION_RULES
  const getRegionPrefix = (city: string) => {
    if (city.endsWith('광역시')) return city.replace('광역시', '시');
    if (city.endsWith('특별자치시')) return city.replace('특별자치시', '시');
    if (city.endsWith('특별자치도')) return city.replace('특별자치도', '도');
    return city;
  };

  // Get available districts based on selected city
  const availableDistricts = Object.keys(REGION_RULES)
    .filter(key => key.startsWith(getRegionPrefix(selectedCity)))
    .map(key => key.split(' ')[1])
    .filter(Boolean);

  useEffect(() => {
    // Reset district when city changes
    if (availableDistricts.length > 0) {
      if (!availableDistricts.includes(selectedDistrict)) {
        setSelectedDistrict(availableDistricts[0]);
      }
    } else {
      setSelectedDistrict('');
    }
  }, [selectedCity, availableDistricts]);

  useEffect(() => {
    // Set the first category to be expanded by default
    if (categories.length > 0) {
      setExpandedCategory(categories[0].id);
    }
  }, []);

  const currentRegionKey = selectedDistrict 
    ? `${getRegionPrefix(selectedCity)} ${selectedDistrict}`
    : getRegionPrefix(selectedCity);
    
  const currentRules = REGION_RULES[currentRegionKey] || REGION_RULES['기타 지역'];

  const categories: WasteCategory[] = [
    {
      id: 'plastic',
      name: '플라스틱',
      icon: '♻️',
      color: 'bg-blue-100 dark:bg-blue-900/30',
      items: ['페트병', '플라스틱 용기', '비닐봉지', '스티로폼']
    },
    {
      id: 'paper',
      name: '종이류',
      icon: '📄',
      color: 'bg-green-100 dark:bg-green-900/30',
      items: ['신문지', '박스', '책', '우유팩']
    },
    {
      id: 'glass',
      name: '유리병',
      icon: '🍾',
      color: 'bg-purple-100 dark:bg-purple-900/30',
      items: ['소주병', '맥주병', '음료수병', '화장품병']
    },
    {
      id: 'can',
      name: '캔류',
      icon: '🥫',
      color: 'bg-orange-100 dark:bg-orange-900/30',
      items: ['음료수캔', '통조림캔', '부탄가스', '스프레이']
    },
    {
      id: 'vinyl',
      name: '비닐류',
      icon: '🛍️',
      color: 'bg-pink-100 dark:bg-pink-900/30',
      items: ['과자봉지', '택배봉투', '에어캡', '랩']
    },
    {
      id: 'general',
      name: '일반쓰레기',
      icon: '🗑️',
      color: 'bg-gray-100 dark:bg-gray-700',
      items: ['음식물', '기저귀', '화장지', '일회용품']
    },
  ];

  const filteredCategories = searchQuery
    ? categories.filter(cat => 
        cat.name.includes(searchQuery) || 
        cat.items.some(item => item.includes(searchQuery))
      )
    : categories;

  return (
    <div className="pb-24 min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sticky Header Section */}
      <div className="bg-white dark:bg-gray-900 sticky top-0 z-10 shadow-sm border-b border-gray-100 dark:border-gray-800">
        <div className="p-4 space-y-3">
          {/* Search Bar */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500">
            <div className="flex items-center gap-3 p-3">
              <Search className="text-gray-400 flex-shrink-0" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="분류 방법 검색 (예: 페트병, 박스)"
                className="flex-1 bg-transparent focus:outline-none dark:text-white text-sm placeholder:text-gray-400 min-w-0"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors flex-shrink-0"
                >
                  <X size={16} className="text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* Region Selectors */}
          <div className="flex gap-2">
            {/* City Selector */}
            <div className="relative flex-1">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-600 pointer-events-none">
                <MapPin size={18} />
              </div>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full pl-10 pr-8 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl appearance-none focus:outline-none focus:border-green-500 dark:text-white text-sm font-medium transition-all cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50"
              >
                {ADMINISTRATIVE_REGIONS.map((region) => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>

            {/* District Selector */}
            <div className="relative flex-1">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                disabled={availableDistricts.length === 0}
                className="w-full pl-4 pr-8 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl appearance-none focus:outline-none focus:border-green-500 dark:text-white text-sm font-medium transition-all cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {availableDistricts.length > 0 ? (
                  availableDistricts.map((district) => (
                    <option key={district} value={district}>{district}</option>
                  ))
                ) : (
                  <option value="">세부 지역 없음</option>
                )}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="p-4 space-y-3">
        {filteredCategories.map((category) => (
          <div key={category.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm transition-all duration-300">
            <button 
              onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${category.color} rounded-2xl flex items-center justify-center text-2xl shadow-sm`}>
                  {category.icon}
                </div>
                <div className="text-left">
                  <h3 className="font-semibold dark:text-white text-lg">{category.name}</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                     {category.items.slice(0, 3).map((item, i) => (
                       <span key={i} className="text-xs text-gray-500 dark:text-gray-400">{item}{i < 2 ? ', ' : ''}</span>
                     ))}
                     {category.items.length > 3 && <span className="text-xs text-gray-500 dark:text-gray-400">...</span>}
                  </div>
                </div>
              </div>
              <ChevronRight 
                className={`text-gray-400 transition-transform duration-300 ${expandedCategory === category.id ? 'rotate-90' : ''}`} 
                size={24} 
              />
            </button>
            
            {/* Expanded Content */}
            <div className={`grid transition-all duration-300 ease-in-out ${
              expandedCategory === category.id ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            }`}>
              <div className="overflow-hidden">
                <div className="p-4 pt-0 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                  <div className="space-y-4 py-4">
                    {/* Items Tags */}
                    <div className="flex flex-wrap gap-2">
                      {category.items.map((item, itemIdx) => (
                        <span
                          key={itemIdx}
                          className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs rounded-full text-gray-700 dark:text-gray-300 font-medium"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    {/* Rules Content */}
                    <div className="space-y-3">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100 dark:border-blue-800">
                        <h4 className="text-xs font-bold text-blue-800 dark:text-blue-300 mb-1">💡 배출 방법</h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {currentRules[category.id]?.description || '내용 없음'}
                        </p>
                      </div>
                      
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-xl border border-green-100 dark:border-green-800">
                        <h4 className="text-xs font-bold text-green-800 dark:text-green-300 mb-1">📅 수거 일정</h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {currentRules[category.id]?.schedule || '내용 없음'}
                        </p>
                      </div>

                      <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-xl border border-orange-100 dark:border-orange-800">
                        <h4 className="text-xs font-bold text-orange-800 dark:text-orange-300 mb-1">⚠️ 주의사항</h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {currentRules[category.id]?.special || '내용 없음'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">검색 결과가 없습니다</h3>
          <p className="text-gray-600 dark:text-gray-400">다른 키워드로 검색해보세요</p>
        </div>
      )}
    </div>
  );
}
