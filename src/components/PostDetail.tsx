import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, User, Edit, Trash2, ArrowLeft, Youtube } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Post } from '../types';
import { useAuth } from '../contexts/AuthContext';

const PostDetail: React.FC = () => {
  const { category, id } = useParams<{ category: string; id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
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
    fetchPost();
      if (!supabase) {
        setLoading(false);
        return;
      }
      
  }, [id]);

  const fetchPost = async () => {
    if (!id) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching post:', error);
      navigate(`/board/${category}`);
    } else {
      setPost(data);
    }
    setLoading(false);
  };

  const deletePost = async () => {
    if (!id || !confirm('정말로 이 게시물을 삭제하시겠습니까?')) return;

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
      alert('삭제 중 오류가 발생했습니다.');
    } else {
      navigate(`/board/${category}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">게시물을 찾을 수 없습니다.</p>
        <Link
          to={`/board/${category}`}
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          to={`/board/${category}`}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>{categoryNames[category || '']} 목록으로</span>
        </Link>
      </div>

      <article className="bg-white rounded-lg shadow-lg overflow-hidden">
        <header className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
            {isAdmin && (
              <div className="flex space-x-2">
                <Link
                  to={`/board/${category}/${id}/edit`}
                  className="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit size={16} />
                  <span>수정</span>
                </Link>
                <button
                  onClick={deletePost}
                  className="flex items-center space-x-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                  <span>삭제</span>
                </button>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4 text-gray-500">
            <div className="flex items-center space-x-1">
              <User size={16} />
              <span>관리자</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar size={16} />
              <span>{formatDate(post.created_at)}</span>
            </div>
          </div>
        </header>

        <div className="p-6">
          {post.image_url && (
            <div className="mb-6">
              <img
                src={post.image_url}
                alt="Post image"
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
          )}

          {post.youtube_url && (
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <Youtube className="text-red-500" size={20} />
                <span className="font-medium text-gray-700">동영상</span>
              </div>
              {getYouTubeEmbedUrl(post.youtube_url) ? (
                <div className="aspect-video">
                  <iframe
                    src={getYouTubeEmbedUrl(post.youtube_url)!}
                    title="YouTube video"
                    className="w-full h-full rounded-lg"
                    frameBorder="0"
                    allowFullScreen
                  />
                </div>
              ) : (
                <a
                  href={post.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {post.youtube_url}
                </a>
              )}
            </div>
          )}

          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br>') }}
          />
        </div>
      </article>
    </div>
  );
};

export default PostDetail;