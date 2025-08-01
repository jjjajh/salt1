import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Upload, Youtube } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Post } from '../types';

const PostForm: React.FC = () => {
  const navigate = useNavigate();
  const { category, id } = useParams<{ category: string; id?: string }>();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: '',
    youtube_url: '',
  });

  const categoryNames: { [key: string]: string } = {
    news: '교회소식',
    sermon: '설교말씀',
    elementary: '유초등부',
    youth: '중고등부',
    'young-adult': '청년부',
    adult: '장년부',
  };

  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      fetchPost();
        if (!supabase) return;
        
    }
  }, [id]);

  const fetchPost = async () => {
    if (!id) return;

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching post:', error);
      navigate(`/board/${category}`);
    } else {
      setFormData({
        title: data.title,
        content: data.content,
        image_url: data.image_url || '',
        youtube_url: data.youtube_url || '',
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supabase) {
      alert('Supabase가 연결되지 않았습니다. 먼저 Supabase를 연결해주세요.');
      return;
    }
    
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    setLoading(true);

    const postData = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      category,
      image_url: formData.image_url.trim() || null,
      youtube_url: formData.youtube_url.trim() || null,
    };

    let error;
    
    if (isEditing) {
      ({ error } = await supabase
        .from('posts')
        .update({ ...postData, updated_at: new Date().toISOString() })
        .eq('id', id));
    } else {
      ({ error } = await supabase
        .from('posts')
        .insert([postData]));
    }

    if (error) {
      console.error('Error saving post:', error);
      alert('저장 중 오류가 발생했습니다.');
    } else {
      navigate(`/board/${category}`);
    }
    
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate(`/board/${category}`)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>{categoryNames[category || '']} 목록으로</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {isEditing ? '게시물 수정' : '새 게시물 작성'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              제목 *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="제목을 입력하세요"
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              내용 *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="내용을 입력하세요"
              required
            />
          </div>

          <div>
            <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-2">
              <Upload className="inline w-4 h-4 mr-1" />
              이미지 URL
            </label>
            <input
              type="url"
              id="image_url"
              name="image_url"
              value={formData.image_url}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-sm text-gray-500 mt-1">
              온라인 이미지의 URL을 입력하세요 (선택사항)
            </p>
          </div>

          <div>
            <label htmlFor="youtube_url" className="block text-sm font-medium text-gray-700 mb-2">
              <Youtube className="inline w-4 h-4 mr-1 text-red-500" />
              YouTube URL
            </label>
            <input
              type="url"
              id="youtube_url"
              name="youtube_url"
              value={formData.youtube_url}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <p className="text-sm text-gray-500 mt-1">
              YouTube 동영상 URL을 입력하세요 (선택사항)
            </p>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(`/board/${category}`)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              <span>{loading ? '저장 중...' : (isEditing ? '수정' : '저장')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostForm;