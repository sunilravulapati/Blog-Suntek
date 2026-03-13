import { useLocation, useParams } from "react-router";
import { useState, useEffect } from "react";
import axios from "axios";
import { articleTitle, articleBody, loadingClass, errorClass } from "../styles/common";

function ArticleByID() {
  const location = useLocation();
  const { id } = useParams();
  const [article, setArticle] = useState(location.state?.article || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!article) {
      setLoading(true);
      axios.get(`http://localhost:4000/article-api/article/${id}`, { withCredentials: true })
        .then(res => setArticle(res.data.payload))
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id, article]);

  if (loading) return <p className={loadingClass}>Loading...</p>;
  if (error) return <p className={errorClass}>{error}</p>;
  if (!article) return <p>No article found.</p>;

  return (
    <div className="p-6">
      <h1 className={articleTitle}>{article.title}</h1>
      <p className="text-sm text-gray-500">Category: {article.category}</p>
      <p className={articleBody}>{article.content}</p>
      <p className="text-xs mt-2">
        Author: {article.author?.name} | 
        Created At: {new Date(article.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
      </p>
    </div>
  );
}

export default ArticleByID;