import { useAuth } from '../store/authStore'
import { useNavigate } from 'react-router'
import { primaryBtn } from '../styles/common'
import { toast } from 'react-hot-toast'
import { articleBody, articleCardClass, articleGrid, articleTitle, errorClass, loadingClass } from "../styles/common";
import { useState } from "react";
import { useEffect } from "react";
import axios from 'axios'
function UserDashboard() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate()

  const logout = useAuth(state => state.logout)

  const onLogout = async () => {
    //logout
    await logout()
    //navigate to home/login
    toast.success("LoggedOut Successfully!")
    navigate('/login')
  }

  useEffect(() => {
    setLoading(true);
    async function getArticles() {
      try {
        let res = await axios.get("http://localhost:4000/user-api/users", { withCredentials: true })
        setArticles(res.data.payload)
        console.log(articles)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    getArticles()
  }, [])
  if (loading) {
    return <p className={loadingClass}>Loading...</p>
  } if (error) {
    return <p className={errorClass}>{error}</p>
  }


  return (
    <div>
      <div className='text-center mt-3'>UserProfile</div>
      <button onClick={onLogout} className={primaryBtn}>Logout</button>
      <div className={`${articleGrid} gap-white`}>
        {/* read the articles of all authors */}
        {/* display them in the form of grids */}
        {
          articles.map((articleObj) => (
            <div key={articleObj.id} className={`${articleCardClass}`}>
              <h2 className={articleTitle}>{articleObj.title}</h2>
              <p className={articleBody}>{articleObj.content}</p>
              <p className='ml-30 text-xs'>Created At: {articleObj.createdAt}</p>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default UserDashboard