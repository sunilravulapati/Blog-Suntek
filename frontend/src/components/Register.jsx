import { useForm } from 'react-hook-form'
import { errorClass, formCard, inputClass, loadingClass, submitBtn } from '../styles/common.js'
import { useEffect,useState } from 'react'
import { useNavigate } from 'react-router'
import axios from 'axios'

function Register() {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)

  //clean up - once the preview is shown then remove it from the browser's memory
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const onSubmit = async (formObj) => {
    setLoading(true)
    console.log(formObj)
    // Create form data object
    const formData = new FormData();
    //get user object
    let { role, profileImageURL, ...userObj } = formObj;
    //add all fields except profilePic to FormData object
    Object.keys(userObj).forEach((key) => {
      formData.append(key, userObj[key]);
    });
    // add profilePic to Formdata object
    formData.append("profileImage", profileImageURL[0]);
    //make the api request to user/author registration
    try {
      if (role === 'user') {
        //make req to user-api
        let resObj = await axios.post("http://localhost:4000/user-api/users", formData)
        if (resObj.status === 201) {
          navigate('/login')
        }
      }
      if (role === 'author') {
        //make req to author-api
        let resObj = await axios.post("http://localhost:4000/author-api/users", formData)
        if (resObj.status === 201) {
          navigate('/login')
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || "Registration Failed")

    } finally {
      setLoading(false)
    }
  }
  if (loading) {
    return <p className={loadingClass}></p>
  }
  // if(error){
  //   return <p className={errorClass}>{error.message}</p>
  // }
  return (
    <div>
      <div className='min-h-screen flex flex-col items-center justify-center'>
        <form onSubmit={handleSubmit(onSubmit)} className={formCard}>
          {/* title */}
          <h1 className='text-2xl text-center font-bold'>Register to Our App</h1>
          {/* error message */}
          {
            error && <p className={errorClass}>{error}</p>
          }
          {/* role */}
          <div className='flex gap-6 justify-items-end items-center mt-4 '>
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
                // className={inputClass}
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
                // className={inputClass}
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
            //className={inputClass}
            className='border rounded w-full mt-5 p-2'
          />
          {
            errors.email && (<p className='text-red-500'>{errors.email.message}</p>)
          }
          {/* password */}
          <input type="password" placeholder='enter your password'
            {...register("password", { required: "password is required", minLength: { value: 6, message: "Minimum 6 characters" } })}
            // className={inputClass}
            className='border rounded w-full mt-5 p-2'
          />
          {
            errors.password && (<p className='text-red-500'>{errors.password.message}</p>)
          }
          {/* profile image upload */}
          <input
            type="file"
            className='border rounded w-full mt-5 p-2'
            accept="image/png, image/jpeg"
            {...register("profileImageURL", {
              required: "Profile Image is required",
              onChange: (e) => {
                const file = e.target.files[0];

                if (file) {
                  // type validation
                  if (!["image/jpeg", "image/png"].includes(file.type)) {
                    setError("Only JPG or PNG allowed");
                    return;
                  }

                  // size validation
                  if (file.size > 2 * 1024 * 1024) {
                    setError("File size must be less than 2MB");
                    return;
                  }
                  // preview
                  const previewUrl = URL.createObjectURL(file);
                  setPreview(previewUrl);
                  setError(null);
                }
              }
            })}
          />
          {preview && (
            <div className="mt-3 flex justify-center">
              <img
                src={preview}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-full border"
              />
            </div>
          )}
          {
            errors.profileImageURL && (<p className='text-red-500'>{errors.profileImageURL.message}</p>)
          }
          {/* submit button */}
          <div className='flex justify-center'>
            <button /*className='bg-blue-400 text-white rounded mt-5 px-7 py-2'*/ className={submitBtn}>Register</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register