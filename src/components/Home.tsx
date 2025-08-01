import React from 'react';
import { Calendar, Clock, MapPin, Phone, Mail } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg overflow-hidden">
        <div className="px-8 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            동서울소망교회에 오신 것을 환영합니다
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8">
            하나님의 사랑과 은혜가 넘치는 교회
          </p>
          <div className="flex justify-center space-x-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <Calendar className="h-6 w-6 mx-auto mb-2" />
              <p className="text-sm">주일예배</p>
              <p className="font-semibold">오전 11시</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <Clock className="h-6 w-6 mx-auto mb-2" />
              <p className="text-sm">수요예배</p>
              <p className="font-semibold">오후 7시</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">교회 소개</h2>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            동서울소망교회는 하나님의 말씀을 중심으로 하는 교회입니다. 
            모든 성도가 하나님의 사랑 안에서 성장하고, 지역사회에 빛과 소금의 역할을 
            감당하는 교회가 되고자 합니다.
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-gray-700">말씀 중심의 예배</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-gray-700">연령별 맞춤 교육</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-gray-700">지역사회 섬김</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">예배 시간</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-600 pl-4">
              <h4 className="font-semibold text-gray-900">주일 대예배</h4>
              <p className="text-gray-600">매주 일요일 오전 11:00</p>
            </div>
            <div className="border-l-4 border-blue-600 pl-4">
              <h4 className="font-semibold text-gray-900">수요 기도회</h4>
              <p className="text-gray-600">매주 수요일 오후 7:00</p>
            </div>
            <div className="border-l-4 border-blue-600 pl-4">
              <h4 className="font-semibold text-gray-900">새벽 기도회</h4>
              <p className="text-gray-600">매일 오전 5:30</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Map Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">연락처 및 위치</h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">주소</h4>
                  <p className="text-gray-600">서울 중랑구 겸재로 154</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">전화번호</h4>
                  <p className="text-gray-600">02-435-1992</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">이메일</h4>
                  <p className="text-gray-600">info@dongseoulchurch.org</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">오시는 길</h3>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div 
              id="daumRoughmapContainer1754040873656" 
              className="root_daum_roughmap root_daum_roughmap_landing"
              style={{ width: '100%', height: '360px' }}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;