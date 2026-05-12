import { Outlet } from 'react-router'
import Header from './Header'
import Footer from './Footer'
import { useEffect } from 'react'
import { useAuth } from '../store/authStore'

function RootLayout() {
  const checkAuth = useAuth(state => state.checkAuth)

  //check user authentication status on app load
  useEffect(() => {
    checkAuth()
  }, [])
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