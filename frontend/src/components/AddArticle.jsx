import { useForm } from 'react-hook-form'
import { useAuth } from '../store/authStore'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router'
import axios from 'axios'
import { inputClass, labelClass, formGroup, errorClass } from '../styles/common'

const CATEGORIES = ['Technology', 'Education', 'AI', 'Programming', 'Design', 'Career']

function AddArticle() {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const user = useAuth(state => state.currentUser)

  const contentValue = watch("content", "")

  const onSubmit = async (formObj) => {
    try {
      await axios.post(
        "http://localhost:4000/author-api/articles",
        formObj,
        { withCredentials: true }
      )
      toast.success("Article published!")
      navigate('/author-dashboard')
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to publish")
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-[#6e6e73] hover:text-[#1d1d1f] transition-colors mb-6 flex items-center gap-1 cursor-pointer"
          >
            ← Back
          </button>
          <span className="text-[0.65rem] font-semibold text-[#0066cc] uppercase tracking-widest block mb-2">
            New Article
          </span>
          <h1 className="text-4xl font-bold text-[#1d1d1f] tracking-tight leading-none">
            Write something great
          </h1>
          <p className="text-sm text-[#6e6e73] mt-2">
            Signed in as <span className="font-medium text-[#1d1d1f]">{user?.firstName} {user?.lastName}</span>
          </p>
        </div>

        {/* Form card */}
        <div className="bg-[#f5f5f7] rounded-2xl p-8 flex flex-col gap-5">

          {/* Title */}
          <div className={formGroup}>
            <label className={labelClass}>Article title</label>
            <input
              type="text"
              placeholder="Give your article a clear, compelling title"
              className={inputClass}
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && <p className="text-[#cc2f26] text-xs mt-1">{errors.title.message}</p>}
          </div>

          {/* Category */}
          <div className={formGroup}>
            <label className={labelClass}>Category</label>
            <select
              className={`${inputClass} cursor-pointer`}
              {...register("category", { required: "Please select a category" })}
            >
              <option value="">Select a category…</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="text-[#cc2f26] text-xs mt-1">{errors.category.message}</p>}
          </div>

          {/* Content */}
          <div className={formGroup}>
            <div className="flex items-center justify-between mb-1.5">
              <label className={labelClass}>Content</label>
              <span className="text-[11px] text-[#a1a1a6]">{contentValue.length} chars</span>
            </div>
            <textarea
              placeholder="Start writing your article here…"
              rows={12}
              className={`${inputClass} resize-none leading-relaxed`}
              {...register("content", { required: "Content is required" })}
            />
            {errors.content && <p className="text-[#cc2f26] text-xs mt-1">{errors.content.message}</p>}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-[#e8e8ed]">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-sm text-[#6e6e73] hover:text-[#1d1d1f] font-medium transition-colors cursor-pointer"
            >
              Discard
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              className="bg-[#0066cc] text-white font-semibold px-6 py-2.5 rounded-full hover:bg-[#004499] transition-colors cursor-pointer text-sm tracking-tight"
            >
              Publish Article →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddArticle