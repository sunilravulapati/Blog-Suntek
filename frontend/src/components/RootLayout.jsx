import { Outlet } from 'react-router'
import Header from './Header'
import Footer from './Footer'
import { useEffect } from 'react'
import { useAuth } from '../store/authStore'

function RootLayout() {

  const checkAuth = useAuth(state=>state.checkAuth)
  const loading = useAuth(state=>state.loading)
  const user = useAuth(state=>state.currentUser)

  useEffect(()=>{
    checkAuth()
    // console.log(user)
  },[])

  if(loading){
    return <p className='text-center mt-10'>Loading...</p>
  }

  return (
    <div>
      <Header />
      <div className='min-h-screen'>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default RootLayout