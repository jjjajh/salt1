import React, { useState } from 'react';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AdminSignupProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AdminSignup: React.FC<AdminSignupProps> = ({ onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supabase) {
      alert('Supabase가 연결되지 않았습니다. 먼저 Supabase를 연결해주세요.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (formData.password.length < 6) {
      alert('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    setLoading(true);

    try {
      // 1. Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error('사용자 생성에 실패했습니다.');
      }

      // 2. Add to admin_users table
      const { error: adminError } = await supabase
        .from('admin_users')
        .insert([{
          id: authData.user.id,
          email: formData.email,
          is_admin: true,
        }]);

      if (adminError) {
        throw adminError;
      }

      alert('관리자 계정이 성공적으로 생성되었습니다.');
      onSuccess();
    } catch (error: any) {
      console.error('Error creating admin user:', error);
      if (error.message.includes('User already registered')) {
        alert('이미 등록된 이메일입니다.');
      } else {
        alert(`계정 생성 중 오류가 발생했습니다: ${error.message}`);
      }
    }

    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <UserPlus className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">새 관리자 추가</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="inline w-4 h-4 mr-1" />
            이메일
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="admin@example.com"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            <Lock className="inline w-4 h-4 mr-1" />
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="최소 6자 이상"
            required
            minLength={6}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            <Lock className="inline w-4 h-4 mr-1" />
            비밀번호 확인
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="비밀번호를 다시 입력하세요"
            required
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserPlus size={16} />
            <span>{loading ? '생성 중...' : '관리자 추가'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSignup;