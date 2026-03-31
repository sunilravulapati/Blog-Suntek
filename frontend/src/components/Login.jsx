import { useForm } from 'react-hook-form'
import { useAuth } from '../store/authStore'
import { useEffect } from 'react'
import { useNavigate, NavLink } from 'react-router'
import { loadingClass, errorClass, inputClass, labelClass, formGroup } from '../styles/common'
import { toast } from 'react-hot-toast'

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const login = useAuth(state => state.login)
  const isAuthenticated = useAuth(state => state.isAuthenticated)
  const currentUser = useAuth(state => state.currentUser)
  const loading = useAuth(state => state.loading)
  const error = useAuth(state => state.error)
  const navigate = useNavigate()

  const onUserLogin = async (userCredObj) => {
    await login(userCredObj)
  }

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Logged in successfully")
      if (currentUser.role === 'USER') navigate('/user-dashboard')
      if (currentUser.role === 'AUTHOR') navigate('/author-dashboard')
      if (currentUser.role === 'ADMIN') navigate('/admin-dashboard')
    }
  }, [isAuthenticated, currentUser])

  if (loading) return <p className={loadingClass}>Signing you in…</p>

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Brand mark */}
        <div className="text-center mb-8">
          <span className="text-2xl font-bold text-[#1d1d1f] tracking-tight">BlogApp</span>
          <p className="text-sm text-[#6e6e73] mt-1">Sign in to continue</p>
        </div>

        {/* Card */}
        <div className="bg-[#f5f5f7] rounded-2xl p-8">
          <h1 className="text-xl font-bold text-[#1d1d1f] tracking-tight mb-6">Welcome back</h1>

          {error && (
            <div className={`${errorClass} mb-5`}>{error}</div>
          )}

          <form onSubmit={handleSubmit(onUserLogin)} className="flex flex-col gap-4">
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
                placeholder="••••••••"
                className={inputClass}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" }
                })}
              />
              {errors.password && <p className="text-[#cc2f26] text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-[#0066cc] text-white font-semibold py-2.5 rounded-full hover:bg-[#004499] transition-colors cursor-pointer mt-1 text-sm tracking-tight"
            >
              Sign In
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-[#6e6e73] mt-5">
          Don't have an account?{' '}
          <NavLink to="/register" className="text-[#0066cc] hover:text-[#004499] font-medium transition-colors">
            Register
          </NavLink>
        </p>
      </div>
    </div>
  )
}

export default Login