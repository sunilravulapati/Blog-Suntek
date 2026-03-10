import { useForm } from 'react-hook-form'
import { useAuth } from '../store/authStore'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { loadingClass, errorClass } from '../styles/common'
import { toast } from 'react-hot-toast'

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const login = useAuth(state => state.login)
  const isAuthenticated = useAuth(state => state.isAuthenticated)
  // console.log(isAuthenticated)
  const currentUser = useAuth(state => state.currentUser)
  const loading = useAuth(state => state.loading)
  const error = useAuth(state => state.error)

  const navigate = useNavigate()

  const onUserLogin = async (userCredObj) => {
    await login(userCredObj)
    // console.log(isAuthenticated) dont place it here as the login funciton is in await so before that is done, this statement will be printed
  }
  useEffect(() => {
    if (isAuthenticated) {
      if (currentUser.role === 'USER') {
        toast.success("LoggedIn successfully")
        navigate('/user-dashboard')
      }
      if (currentUser.role === 'AUTHOR') {
        toast.success("LoggedIn successfully")
        navigate('/author-dashboard')
      }
      if (currentUser.role === 'ADMIN') {
        toast.success("LoggedIn successfully")
        navigate('/admin-dashboard')
      }
    }
  }, [isAuthenticated, currentUser])
  if (loading) {
    return <p className={loadingClass}>Loading...</p>
  }
  return (
    <div>
      <div className='min-h-screen flex flex-col items-center justify-center sm:*'>
        <form onSubmit={handleSubmit(onUserLogin)} className='p-10 rounded-lg max-w-lg shadow-lg'>
          <h1 className='text-2xl text-center font-bold'>Login</h1>
          {/* role */}
          {/* <div className='flex gap-6 justify-items-end items-center '>
            <h2 className='text-xl'>Select Your Role: </h2>
            <label>
              <input type="radio" value="user" {...register("role", { required: "Role is required" })} />
              <span className="ml-2">User</span>
            </label>
            <label>
              <input type="radio" value="author" {...register("role", { required: "Role is required" })} />
              <span className="ml-2">Author</span>
            </label>
            <label>
              <input type="radio" value="admin" {...register("role", { required: "Role is required" })} />
              <span className="ml-2">Admin</span>
            </label>
          </div> */}
          {/* {
            errors.role && (<p className='text-red-500 text-sm'>{errors.role.message}</p>)
          } */}

          {/* error message */}
          {
            error && <p className={errorClass}>{error}</p>
          }
          {/* email */}
          <input type="email" placeholder='enter your email'
            {...register("email", { required: "email is required(so that we can spam you! jk)" })}
            className='border rounded w-full mt-5 p-2'
          />
          {
            errors.email && (<p className='text-red-500'>{errors.email.message}</p>)
          }
          {/* password */}
          <input type="password" placeholder='enter your password'
            {...register("password", { required: "password is required", minLength: { value: 6, message: "Minimum 6 characters" } })}
            className='border rounded w-full mt-5 p-2'
          />
          {
            errors.password && (<p className='text-red-500'>{errors.password.message}</p>)
          }
          {/* submit button */}
          <div className='flex justify-center'>
            <button className='bg-blue-400 text-white rounded mt-5 px-7 py-2'>Login</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login