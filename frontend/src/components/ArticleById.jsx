import { useLocation, useParams } from "react-router";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  articleTitle,
  articleBody,
  loadingClass,
  errorClass,
  pageWrapper,
  tagClass,
  mutedText,
  divider,
  pageTitleClass,
  section
} from "../styles/common";
import { useNavigate } from "react-router";

function ArticleByID() {
  const navigate = useNavigate()
  const location = useLocation();
  const { id } = useParams();
  // Try to grab from navigation state first (instant load), otherwise fallback to null
  const [article, setArticle] = useState(location.state?.article || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      // If navigation state exists
      if (location.state?.article) {
        setArticle(location.state.article);
        return;
      }
      try {
        setLoading(true);
        //fetch the data using axios
        const res = await axios.get(
          `http://localhost:4000/article-api/article/${id}`,
          { withCredentials: true }
        );
        setArticle(res.data.payload);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) return <div className={loadingClass}>Opening article...</div>;
  if (error) return <div className={pageWrapper}><p className={errorClass}>{error}</p></div>;
  if (!article) return <div className={pageWrapper}><p className={mutedText}>No article found.</p></div>;

  return (
    <div className={pageWrapper}>
      <div>
        <button onClick={() => navigate(-1)}>← Back</button>
      </div>
      {/* Article Header */}
      <header className={section}>
        <div className="flex items-center gap-3 mb-4">
          <span className={tagClass}>{article.category || "General"}</span>
          <span className={mutedText}>•</span>
          <span className={mutedText}>
            {new Date(article.createdAt).toLocaleDateString("en-IN", {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </span>
        </div>
        <h1 className={`${pageTitleClass} mb-6`}>{article.title}</h1>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#e8e8ed] flex items-center justify-center text-[10px] font-bold">
            {article.author?.name?.charAt(0) || "A"}
          </div>
          <p className="text-sm font-medium text-[#1d1d1f]">
            {article.author?.firstName || "Anonymous Author"}
          </p>
        </div>
      </header>
      <hr className={divider} />
      <article className="animate-in fade-in duration-700">
        <div className={articleBody}>
          <p className="whitespace-pre-wrap leading-relaxed text-[#424245]">
            {article.content}
          </p>
        </div>
      </article>
      <footer className={`${divider} pt-6`}>
        <p className={mutedText}>
          Last updated: {new Date(article.createdAt).toLocaleTimeString("en-IN")}
        </p>
      </footer>
    </div>
  );
}

export default ArticleByID;