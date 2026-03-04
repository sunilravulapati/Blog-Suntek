import { useForm } from 'react-hook-form'

function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = (formObj) => {
    console.log(formObj)
  }
  return (
    <div>
      <div className='min-h-screen flex flex-col items-center justify-center'>
        <h1 className='text-2xl text-center font-bold'>Register to Our App</h1>
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
          <div className='flex justify-even mt-5 gap-4'>
            <div className='w-1/2'>
              {/* first name */}
              <input type="text" placeholder='enter your first name'
                {...register("firstName", { required: "First Name is required" })}
                className='border rounded p-2 w-full'
              />
              {
                errors.firstName && (<p className='text-red-500 text-sm'>{errors.firstName.message}</p>)
              }
            </div>
            <div className='w-1/2'>
              {/* first name */}
              <input type="text" placeholder='enter your last name'
                {...register("lastName", { required: "Last Name is required" })}
                className='border rounded p-2 w-full'
              />
              {
                errors.lastName && (<p className='text-red-500 text-sm'>{errors.lastName.message}</p>)
              }
            </div>
          </div>
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
          {/* profile image link upload */}
          <input type="file" placeholder='place your profile pic image here'
            className='border rounded w-full mt-5 p-2'
            {...register("profile", { required: "Profile Image is required" })}
          />
          {
            errors.profile && (<p className='text-red-500'>{errors.profile.message}</p>)
          }
          {/* submit button */}
          <div className='flex justify-center'>
            <button className='bg-blue-400 text-white rounded mt-5 px-7 py-2'>Register</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register