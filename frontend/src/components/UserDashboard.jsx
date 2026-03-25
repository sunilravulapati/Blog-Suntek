import { useAuth } from '../store/authStore'
import { useNavigate } from 'react-router'
import { toast } from 'react-hot-toast'
import { useState, useEffect } from "react";
import axios from 'axios'
import { 
  articleBody, 
  articleCardClass, 
  articleGrid, 
  articleTitle, 
  errorClass, 
  loadingClass,
  pageWrapper,
  pageTitleClass,
  section,
  primaryBtn,
  tagClass,
  articleExcerpt,
  timestampClass
} from "../styles/common";

function UserDashboard() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate()
  const logout = useAuth(state => state.logout)
  const currentUser = useAuth(state=>state.currentUser)
  // console.log(currentUser)

  const onLogout = async () => {
    await logout()
    toast.success("Logged Out Successfully!")
    navigate('/login')
  }

  useEffect(() => {
    async function getArticles() {
      setLoading(true);
      try {
        let res = await axios.get("http://localhost:4000/user-api/users", { withCredentials: true })
        setArticles(res.data.payload)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    getArticles()
  }, [])

  if (loading) return <div className={loadingClass}>Loading your feed...</div>;
  if (error) return <div className={pageWrapper}><p className={errorClass}>{error}</p></div>;

  return (
    <div className={pageWrapper}>
      {/* Dashboard Header */}
      <header className={`${section} flex justify-between items-end`}>
        <div>
          <img src={currentUser?.profileImageURL} className='w-14 rounded-full' alt='img'/>
          <span className={tagClass}>{currentUser?.firstName}'s Dashboard</span>
          <h1 className={pageTitleClass}>Your Feed</h1>
        </div>
        <button onClick={onLogout} className={primaryBtn}>
          Log Out
        </button>
      </header>
      {/* Article Grid */}
      <div className={`${articleGrid}`}>
        {articles.map((articleObj) => (
          <div 
            key={articleObj._id || articleObj.id} 
            className={`${articleCardClass} gap-5`}
            onClick={() => navigate(`/article/${articleObj._id || articleObj.id}`, { state: { article: articleObj } })}
          >
            <span className={tagClass}>Article</span>
            <h2 className={articleTitle}>{articleObj.title}</h2>
            {/* Using excerpt style for grid preview */}
            <p className={articleExcerpt}>
              {articleObj.content.substring(0, 120)}...
            </p>
            {/* Formatted Timestamp */}
            <div className={`${timestampClass} mt-4`}>
              <span>Created: {new Date(articleObj.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
      {articles.length === 0 && (
        <div className="text-center py-20 text-[#a1a1a6]">
          No articles available at the moment.
        </div>
      )}
    </div>
  )
}
export default UserDashboard