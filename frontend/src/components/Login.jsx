import { useForm } from 'react-hook-form'

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = (formObj) => {
    console.log(formObj)
  }
  return (
    <div>
      <div className='min-h-screen flex flex-col items-center justify-center'>
        <h1 className='text-2xl text-center font-bold'>Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className='p-10 rounded-lg max-w-lg shadow-lg'>
          {/* role */}
          <div className='flex gap-6 justify-items-end items-center '>
            <h2 className='text-xl'>Select Your Role: </h2>
            <label>
              <input type="radio" value="user" {...register("role", { required: "Role is required" })} />
              <span className="ml-2">User</span>
            </label>
            <label>
              <input type="radio" value="author" {...register("role", { required: "Role is required" })} />
              <span className="ml-2">Author</span>
            </label>
          </div>
          {
            errors.role && (<p className='text-red-500 text-sm'>{errors.role.message}</p>)
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