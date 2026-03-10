import { useNavigate, useNavigation } from "react-router"
import {toast} from 'react-hot-toast'
import { articleBody, articleCardClass, articleGrid, articleTitle, errorClass, loadingClass } from "../styles/common";
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
    <div className={articleGrid}>
      {/* read the articles of all authors */}
      {/* display them in the form of grids */}
      {
        articles.map((productObj)=>(
          <div key={productObj.id} className={articleCardClass}>
            <h2 className={articleTitle}>{productObj.title}</h2>
            <p className={articleBody}>{productObj.content}</p>
          </div>
        ))
      }
    </div>
  )
}

export default ArticleList