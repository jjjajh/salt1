import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { BarChart, Users, MessageSquare, Settings, Plus, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import AdminSignup from './AdminSignup';

const AdminDashboard: React.FC = () => {
  const { user, isAdmin, loading } = useAuth();
  const [showAdminSignup, setShowAdminSignup] = useState(false);
  const [stats, setStats] = useState({
    totalPosts: 0,
    postsByCategory: {} as { [key: string]: number },
    totalAdmins: 0,
  });

  const categories = [
    { name: 'news', displayName: '교회소식' },
    { name: 'sermon', displayName: '설교말씀' },
    { name: 'elementary', displayName: '유초등부' },
    { name: 'youth', displayName: '중고등부' },
    { name: 'young-adult', displayName: '청년부' },
    { name: 'adult', displayName: '장년부' },
  ];

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  const fetchStats = async () => {
    if (!supabase) {
      setStats({
        totalPosts: 0,
        postsByCategory: {},
        totalAdmins: 0,
      });
      return;
    }
    
    // Fetch posts data
    const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .select('category');

    // Fetch admin users count
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('id', { count: 'exact' });

    if (!postsError && postsData) {
      const postsByCategory: { [key: string]: number } = {};
      categories.forEach(cat => {
        postsByCategory[cat.name] = 0;
      });

      postsData.forEach(post => {
        if (postsByCategory.hasOwnProperty(post.category)) {
          postsByCategory[post.category]++;
        }
      });

      setStats({
        totalPosts: postsData.length,
        postsByCategory,
        totalAdmins: adminData?.length || 0,
      });
    }
  };

  const handleAdminSignupSuccess = () => {
    setShowAdminSignup(false);
    fetchStats(); // Refresh stats to update admin count
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
        <div className="flex items-center space-x-2 text-gray-600">
          <Users size={20} />
          <span>관리자: {user.email}</span>
        </div>
      </div>

      {/* Admin Signup Modal */}
      {showAdminSignup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="max-w-md w-full mx-4">
            <AdminSignup
              onSuccess={handleAdminSignupSuccess}
              onCancel={() => setShowAdminSignup(false)}
            />
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">전체 게시물</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPosts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <BarChart className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">활성 게시판</p>
              <p className="text-2xl font-bold text-gray-900">6</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">관리자</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAdmins}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Settings className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">시스템 상태</p>
              <p className="text-2xl font-bold text-green-600">정상</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Overview */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">게시판별 현황</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.name} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-900">{category.displayName}</h3>
                <span className="text-2xl font-bold text-blue-600">
                  {stats.postsByCategory[category.name] || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">게시물</span>
                <a
                  href={`/board/${category.name}/new`}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                >
                  <Plus size={14} />
                  <span>새 글</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">빠른 작업</h2>
        
        {/* Admin Management Section */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">관리자 관리</h3>
          <button
            onClick={() => setShowAdminSignup(true)}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-green-100 rounded-lg">
              <UserPlus className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">새 관리자 추가</p>
              <p className="text-sm text-gray-600">새로운 관리자 계정 생성</p>
            </div>
          </button>
        </div>

        {/* Post Management Section */}
        <h3 className="text-lg font-medium text-gray-900 mb-4">게시물 관리</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <a
              key={category.name}
              href={`/board/${category.name}/new`}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-blue-100 rounded-lg">
                <Plus className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{category.displayName}</p>
                <p className="text-sm text-gray-600">새 게시물 작성</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;