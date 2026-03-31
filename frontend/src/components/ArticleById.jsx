import { useLocation, useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  articlePageWrapper, articleHeader, articleCategory,
  articleMainTitle, articleAuthorRow, authorInfo,
  articleContent, articleFooter, loadingClass, errorClass,
  inputClass
} from "../styles/common";
import { useAuth } from "../store/authStore";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

function ArticleById() {
  const user = useAuth(state => state.currentUser)
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()
  const [article, setArticle] = useState(location.state?.article || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [commenting, setCommenting] = useState(false)
  const { register, handleSubmit, reset } = useForm()

  const addComment = async (data) => {
    setCommenting(true)
    try {
      const res = await axios.put(
        "http://localhost:4000/user-api/users",
        { userId: user._id || user.id, articleId: article._id, comments: data.comment },
        { withCredentials: true }
      )
      setArticle(res.data.payload)
      toast.success("Comment added!")
      reset()
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add comment")
    } finally {
      setCommenting(false)
    }
  }

  useEffect(() => {
    const fetchArticle = async () => {
      if (location.state?.article) { setArticle(location.state.article); return }
      try {
        setLoading(true)
        const res = await axios.get(`http://localhost:4000/author-api/article/${id}`, { withCredentials: true })
        setArticle(res.data.payload)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchArticle()
  }, [id])

  const toggleArticleStatus = async () => {
    const newStatus = !article.isArticleActive
    if (!window.confirm(newStatus ? "Restore this article?" : "Delete this article?")) return
    try {
      const res = await axios.patch(
        `http://localhost:4000/author-api/articles/${id}/status`,
        { isArticleActive: newStatus },
        { withCredentials: true }
      )
      setArticle(res.data.payload)
      toast.success(res.data.message)
    } catch (err) {
      const msg = err.response?.data?.message
      err.response?.status === 400 ? toast(msg) : setError(msg || "Operation failed")
    }
  }

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" })

  if (loading) return <div className={loadingClass}>Opening article…</div>
  if (error) return <p className={errorClass}>{error}</p>
  if (!article) return null

  return (
    <div className="min-h-screen bg-white">
      <div className={articlePageWrapper}>

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-[#6e6e73] hover:text-[#1d1d1f] transition-colors mb-8 flex items-center gap-1 cursor-pointer"
        >
          ← Back
        </button>

        {/* Status banner for inactive articles */}
        {!article.isArticleActive && (
          <div className="bg-[#ff3b30]/10 border border-[#ff3b30]/20 rounded-xl px-4 py-3 text-sm text-[#cc2f26] font-medium mb-6">
            ⚠️ This article has been deleted and is not visible to readers.
          </div>
        )}

        {/* Header */}
        <div className={articleHeader}>
          <span className={articleCategory}>{article.category}</span>
          <h1 className={`${articleMainTitle} uppercase`}>{article.title}</h1>
          <div className={articleAuthorRow}>
            <div className={authorInfo}>
              <div className="w-7 h-7 rounded-full bg-[#e8e8ed] flex items-center justify-center text-xs font-semibold text-[#6e6e73]">
                {article.author?.firstName?.[0]?.toUpperCase() ?? 'A'}
              </div>
              {article.author?.firstName || "Author"}
            </div>
            <span className="text-sm text-[#6e6e73]">{formatDate(article.createdAt)}</span>
          </div>
        </div>

        {/* Content */}
        <div className={articleContent}>{article.content}</div>

        {/* Author actions */}
        {user?.role === "AUTHOR" && (
          <div className="flex gap-3 mt-8 pt-6 border-t border-[#e8e8ed]">
            <button
              onClick={() => navigate("/edit-article", { state: article })}
              className="px-5 py-2 rounded-full bg-[#0066cc] text-white text-sm font-semibold hover:bg-[#004499] transition-colors cursor-pointer"
            >
              Edit Article
            </button>
            <button
              onClick={toggleArticleStatus}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                article.isArticleActive
                  ? 'bg-[#ff3b30]/10 text-[#cc2f26] hover:bg-[#ff3b30]/20'
                  : 'bg-[#34c759]/10 text-[#248a3d] hover:bg-[#34c759]/20'
              }`}
            >
              {article.isArticleActive ? "Delete Article" : "Restore Article"}
            </button>
          </div>
        )}

        {/* Comment form — USER only */}
        {user?.role === "USER" && (
          <div className="mt-10 pt-8 border-t border-[#e8e8ed]">
            <h2 className="text-lg font-bold text-[#1d1d1f] tracking-tight mb-4">Leave a comment</h2>
            <form onSubmit={handleSubmit(addComment)} className="flex flex-col gap-3">
              <textarea
                placeholder="Share your thoughts…"
                rows={4}
                className={`${inputClass} resize-none leading-relaxed`}
                {...register("comment", { required: true })}
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={commenting}
                  className="bg-[#0066cc] text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#004499] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {commenting ? 'Posting…' : 'Post Comment'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Comments section */}
        <div className="mt-10 pt-8 border-t border-[#e8e8ed]">
          <h2 className="text-lg font-bold text-[#1d1d1f] tracking-tight mb-5">
            Comments
            {article.comments?.length > 0 && (
              <span className="ml-2 text-sm font-normal text-[#a1a1a6]">({article.comments.length})</span>
            )}
          </h2>

          {!article.comments?.length ? (
            <div className="text-center py-10 bg-[#f5f5f7] rounded-2xl text-sm text-[#a1a1a6]">
              No comments yet. {user?.role === "USER" ? "Be the first!" : ""}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {article.comments.map((comment, index) => (
                <div key={index} className="bg-[#f5f5f7] rounded-2xl px-5 py-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-[#0066cc]/10 flex items-center justify-center text-xs font-semibold text-[#0066cc]">
                      {(comment.user?.firstName?.[0] ?? comment.user?.email?.[0] ?? 'A').toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-[#1d1d1f]">
                      {comment.user?.firstName || comment.user?.email || "Anonymous"}
                    </span>
                  </div>
                  <p className="text-sm text-[#6e6e73] leading-relaxed pl-9">{comment.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={articleFooter}>Last updated: {formatDate(article.updatedAt)}</div>
      </div>
    </div>
  )
}

export default ArticleById