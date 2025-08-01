import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Church, Phone, MapPin, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();

  const categories = [
    { name: 'news', displayName: '교회소식', path: '/board/news' },
    { name: 'sermon', displayName: '설교말씀', path: '/board/sermon' },
    { name: 'elementary', displayName: '유초등부', path: '/board/elementary' },
    { name: 'youth', displayName: '중고등부', path: '/board/youth' },
    { name: 'young-adult', displayName: '청년부', path: '/board/young-adult' },
    { name: 'adult', displayName: '장년부', path: '/board/adult' },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-3">
              <Church className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">동서울소망교회</h1>
                <p className="text-sm text-gray-600">East Seoul Hope Church</p>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              {user && isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <User size={16} />
                  <span>관리자</span>
                </Link>
              )}
              
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <LogOut size={16} />
                  <span>로그아웃</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <User size={16} />
                  <span>로그인</span>
                </Link>
              )}
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex space-x-8 pb-4">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors pb-2 border-b-2 ${
                location.pathname === '/'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-blue-600 hover:border-blue-300'
              }`}
            >
              홈
            </Link>
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.path}
                className={`text-sm font-medium transition-colors pb-2 border-b-2 ${
                  location.pathname === category.path
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-600 border-transparent hover:text-blue-600 hover:border-blue-300'
                }`}
              >
                {category.displayName}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Church className="h-6 w-6" />
                <h3 className="text-lg font-semibold">동서울소망교회</h3>
              </div>
              <p className="text-gray-400 mb-4">
                하나님의 사랑과 은혜가 넘치는 교회
              </p>
            </div>
            
            <div>
              <h4 className="text-md font-semibold mb-4">연락처</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MapPin size={16} />
                  <span className="text-gray-400">서울 중랑구 겸재로 154</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone size={16} />
                  <span className="text-gray-400">02-435-1992</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 동서울소망교회. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;