import { useNavigate, useNavigation } from "react-router"
import {toast} from 'react-hot-toast'
import { 
  articleCardClass, 
  articleGrid, 
  articleTitle, 
  errorClass, 
  loadingClass, 
  pageWrapper, 
  pageTitleClass, 
  articleExcerpt, 
  tagClass,
  section } from "../styles/common";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
// import { useNavigate } from "react-router";

function ArticleList() {
  // const navigate = useNavigate()
  const [articles,setArticles] = useState([])
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(null);
  // const gotoArticles = (articleObj) => {
  //   navigate('/articles',{state:{articles:articleObj}})
  // }

  useEffect(()=>{
    setLoading(true);
    async function getArticles(){
      try{
        let res = await axios.get("http://localhost:4000/user-api/users",{withCredentials:true})
        setArticles(res.data.payload)
        console.log(articles)
      }catch(err){
        setError(err.message)
      }finally{
        setLoading(false)
      }
    }
    getArticles()
  },[])
  if(loading){
    return <p className={loadingClass}>Loading...</p>
  }if(error){
    return <p className={errorClass}>{error}</p>
  }
  return (
    <div className={pageWrapper}>
      {/* Header Section */}
      <header className={section}>
        <span className={tagClass}>Featured Content</span>
        <h1 className={pageTitleClass}>Articles</h1>
      </header>

      {/* Article Grid */}
      <div className={articleGrid}>
        {articles.length > 0 ? (
          articles.map((articleObj) => (
            <div key={articleObj.id || articleObj._id} className={articleCardClass}>
              {/* Category Tag (Optional - using "General" as placeholder) */}
              <span className={tagClass}>Insight</span>
              
              <h2 className={articleTitle}>{articleObj.title}</h2>
              
              {/* Using articleExcerpt for the grid view for better readability */}
              <p className={articleExcerpt}>
                {articleObj.content.substring(0, 100)}...
              </p>
              
              {/* Optional: Add a "Read More" hint */}
              <span className="text-[#0066cc] text-xs font-medium mt-auto">Read article →</span>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-[#a1a1a6]">
            No articles found.
          </div>
        )}
      </div>
    </div>
  );
}

export default ArticleList