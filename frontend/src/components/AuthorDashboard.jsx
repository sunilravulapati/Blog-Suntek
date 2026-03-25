import { useNavigate } from "react-router";
import { toast } from 'react-hot-toast';
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from '../store/authStore';
import { 
  articleBody, 
  articleCardClass, 
  articleGrid, 
  articleTitle, 
  errorClass, 
  loadingClass, 
  primaryBtn,
  pageWrapper,
  pageTitleClass,
  section,
  tagClass,
  articleExcerpt,
  timestampClass
} from "../styles/common";

function AuthorDashboard() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const logout = useAuth(state => state.logout);
  const user = useAuth(state=>state.currentUser)

  const onLogout = async () => {
    await logout();
    toast.success("Logged Out Successfully!");
    navigate('/login');
  };

  useEffect(() => {
    const author = user?.id || user?._id;
    if(!author)return;
    async function getArticles() {
      setLoading(true);
      try {
        let res = await axios.get(`http://localhost:4000/author-api/article`, { withCredentials: true });
        setArticles(res.data.payload);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    getArticles();
  }, [user]);

  if (loading) return <div className={loadingClass}>Loading your portfolio...</div>;
  if (error) return <div className={pageWrapper}><p className={errorClass}>{error}</p></div>;

  return (
    <div className={pageWrapper}>
      {/* Author Header */}
      <header className={`${section} flex justify-between items-end`}>
        <div>
          <span className={tagClass}>Author Management</span>
          <h1 className={pageTitleClass}>Your Articles</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={onLogout} className={primaryBtn}>
            Logout
          </button>
        </div>
      </header>
      {/* Grid View */}
      <div className={articleGrid}>
        {articles.length === 0 ? (
          <div className="col-span-full py-20 text-center text-[#a1a1a6] bg-[#f5f5f7]">
            You haven't published any articles yet.
          </div>
        ) : (
          articles.map((articleObj) => (
            <div 
              key={articleObj._id || articleObj.id} 
              className={articleCardClass}
              onClick={() => navigate(`/article/${articleObj._id || articleObj.id}`, { state: { article: articleObj } })}
            >
              <span className={tagClass}>Published</span>
              <h2 className={articleTitle}>{articleObj.title}</h2>
              
              <p className={articleExcerpt}>
                {articleObj.content.substring(0, 100)}...
              </p>
              
              <div className={`${timestampClass} mt-4`}>
                <span>
                  Created: {new Date(articleObj.createdAt).toLocaleDateString("en-IN")}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
export default AuthorDashboard