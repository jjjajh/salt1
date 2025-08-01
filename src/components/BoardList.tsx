import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, User, MessageCircle, Plus, Youtube, Image } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Post } from '../types';
import { useAuth } from '../contexts/AuthContext';

const BoardList: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const { isAdmin } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryNames: { [key: string]: string } = {
    news: '교회소식',
    sermon: '설교말씀',
    elementary: '유초등부',
    youth: '중고등부',
    'young-adult': '청년부',
    adult: '장년부',
  };

  useEffect(() => {
    fetchPosts();
  }, [category]);

  const fetchPosts = async () => {
    if (!supabase) {
      setPosts([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {categoryNames[category || '']}
        </h1>
        {isAdmin && (
          <Link
            to={`/board/${category}/new`}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>새 글 작성</span>
          </Link>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">아직 게시된 글이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/board/${category}/${post.id}`}
              className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                <div className="flex items-center space-x-2 text-gray-400">
                  {post.youtube_url && <Youtube size={16} className="text-red-500" />}
                  {post.image_url && <Image size={16} className="text-green-500" />}
                </div>
              </div>
              
              <p className="text-gray-600 line-clamp-2 mb-4">
                {post.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
              </p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar size={14} />
                  <span>{formatDate(post.created_at)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User size={14} />
                  <span>관리자</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BoardList;