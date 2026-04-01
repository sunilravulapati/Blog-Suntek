import { useForm } from 'react-hook-form'
import { errorClass, inputClass, labelClass, formGroup, loadingClass } from '../styles/common.js'
import { useEffect, useState } from 'react'
import { useNavigate, NavLink } from 'react-router'
import axios from 'axios'

function Register() {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview) }
  }, [preview])

  const onSubmit = async (formObj) => {
    setLoading(true)
    setError(null)

    const formData = new FormData()
    const { role, profileImageURL, ...userObj } = formObj

    // Append all text fields
    Object.keys(userObj).forEach((key) => formData.append(key, userObj[key]))

    // Only append image if a file was actually selected
    const file = profileImageURL?.[0]
    if (file) {
      formData.append("profileImage", file)
    }

    try {
      const endpoint = role === 'author'
        ? "http://localhost:4000/author-api/users"
        : "http://localhost:4000/user-api/users"

      const resObj = await axios.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      if (resObj.status === 201) navigate('/login')
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <p className={loadingClass}>Creating your account…</p>

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-[#f5f5f7] rounded-2xl p-8">
          <h1 className="text-xl text-center font-bold text-[#1d1d1f] tracking-tight mb-6">Get started!</h1>

          {error && <div className={`${errorClass} mb-5`}>{error}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

            {/* Role selector */}
            <div className={formGroup}>
              <span className={labelClass}>I want to</span>
              <div className="flex gap-3">
                {[
                  { value: 'user', label: 'Read', icon: '📖' },
                  { value: 'author', label: 'Write', icon: '✍️' },
                ].map(({ value, label, icon }) => (
                  <label
                    key={value}
                    className="flex-1 flex flex-col items-center gap-1.5 bg-white border border-[#d2d2d7] rounded-xl py-3 text-sm font-medium text-[#1d1d1f] cursor-pointer has-checked:border-[#0066cc] has-checked:bg-[#0066cc]/5 transition"
                  >
                    <input
                      type="radio"
                      value={value}
                      className="sr-only"
                      {...register("role", { required: "Role is required" })}
                    />
                    <span className="text-lg">{icon}</span>
                    {label}
                  </label>
                ))}
              </div>
              {errors.role && <p className="text-[#cc2f26] text-xs mt-1">{errors.role.message}</p>}
            </div>

            {/* Name row */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className={labelClass}>First name</label>
                <input
                  type="text"
                  placeholder="Jane"
                  className={inputClass}
                  {...register("firstName", { required: "Required" })}
                />
                {errors.firstName && <p className="text-[#cc2f26] text-xs mt-1">{errors.firstName.message}</p>}
              </div>
              <div className="flex-1">
                <label className={labelClass}>Last name</label>
                <input
                  type="text"
                  placeholder="Doe"
                  className={inputClass}
                  {...register("lastName", { required: "Required" })}
                />
                {errors.lastName && <p className="text-[#cc2f26] text-xs mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            {/* Email */}
            <div className={formGroup}>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className={inputClass}
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <p className="text-[#cc2f26] text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className={formGroup}>
              <label className={labelClass}>Password</label>
              <input
                type="password"
                placeholder="Min. 6 characters"
                className={inputClass}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" }
                })}
              />
              {errors.password && <p className="text-[#cc2f26] text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Profile image */}
            <div className={formGroup}>
              <label className={labelClass}>Profile photo</label>
              <div className="flex items-center gap-4">
                {/* Avatar preview */}
                <div className="w-14 h-14 rounded-full bg-[#e8e8ed] border border-[#d2d2d7] overflow-hidden flex items-center justify-center shrink-0">
                  {preview
                    ? <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    : <span className="text-xl">👤</span>
                  }
                </div>
                <label className="flex-1 cursor-pointer">
                  <div className="w-full bg-white border border-dashed border-[#d2d2d7] rounded-xl px-4 py-3 text-center text-sm text-[#6e6e73] hover:border-[#0066cc] hover:text-[#0066cc] transition-colors">
                    {preview ? 'Change photo' : 'Upload JPG or PNG · max 2MB'}
                  </div>
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/png, image/jpeg"
                    {...register("profileImageURL", {
                      required: "Profile photo is required",
                      onChange: (e) => {
                        const file = e.target.files[0]
                        if (!file) return
                        if (!["image/jpeg", "image/png"].includes(file.type)) {
                          setError("Only JPG or PNG allowed"); return
                        }
                        if (file.size > 2 * 1024 * 1024) {
                          setError("File size must be under 2MB"); return
                        }
                        setPreview(URL.createObjectURL(file))
                        setError(null)
                      }
                    })}
                  />
                </label>
              </div>
              {errors.profileImageURL && (
                <p className="text-[#cc2f26] text-xs mt-1">{errors.profileImageURL.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#0066cc] text-white font-semibold py-2.5 rounded-full hover:bg-[#004499] transition-colors cursor-pointer mt-1 text-sm tracking-tight"
            >
              Create Account
            </button>
            <p className="text-center text-sm text-[#6e6e73] mt-5">
              Already have an account?{' '}
              <NavLink to="/login" className="text-[#0066cc] hover:text-[#004499] font-medium transition-colors">
                Sign in
              </NavLink>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register