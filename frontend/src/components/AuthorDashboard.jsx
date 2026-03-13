import { useNavigate } from "react-router";
import { toast } from 'react-hot-toast';
import { articleBody, articleCardClass, articleGrid, articleTitle, errorClass, loadingClass, primaryBtn } from "../styles/common";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from '../store/authStore';

function AuthorDashboard() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const logout = useAuth(state => state.logout);

  const onLogout = async () => {
    await logout();
    toast.success("LoggedOut Successfully!");
    navigate('/login');
  };

  useEffect(() => {
    setLoading(true);
    async function getArticles() {
      try {
        let res = await axios.get("http://localhost:4000/author-api/article/698975252c161d99734b0283", { withCredentials: true });
        setArticles(res.data.payload);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    getArticles();
  }, []);

  if (loading) return <p className={loadingClass}>Loading...</p>;
  if (error) return <p className={errorClass}>{error}</p>;

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div className="text-center font-bold">Author Profile</div>
        <button onClick={onLogout} className={primaryBtn}>Logout</button>
      </div>

      <div className={articleGrid}>
        {articles.length === 0 ? (
          <p className="text-center text-[#a1a1a6] py-10">No articles found.</p>
        ) : (
          articles.map((articleObj) => (
            <div 
              key={articleObj._id || articleObj.id} 
              className={articleCardClass}
              onClick={() => navigate(`/article/${articleObj._id || articleObj.id}`, { state: { article: articleObj } })}
            >
              <h2 className={articleTitle}>{articleObj.title}</h2>
              <p className={articleBody}>{articleObj.content}</p>
              <p className="ml-30 text-xs">
                Created At: {new Date(articleObj.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AuthorDashboard;