import Register from './components/Register'
import Login from './components/Login'
import AddArticle from './components/AddArticle'
import { createBrowserRouter, RouterProvider } from "react-router"
import RootLayout from './components/RootLayout'
import Home from './components/Home'
import UserDashboard from './components/UserDashboard'
import AuthorDashboard from './components/AuthorDashboard'
import AdminDashboard from './components/AdminDashboard'
import ArticleList from './components/ArticleList'
import Articles from './components/Articles'
import { Toaster } from 'react-hot-toast'


function App() {
  const routerObj = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          path: "",
          element: <Home />
        },
        {
          path: "/register",
          element: <Register />
        },
        {
          path: "/login",
          element: <Login />
        },
        {
          path: "/user-dashboard",
          element: <UserDashboard />
        },
        {
          path: "/author-dashboard",
          element: <AuthorDashboard />
        },
        {
          path: "/admin-dashboard",
          element: <AdminDashboard />
        },
        {
          path: '/article-list',
          element: <ArticleList />
        },
        {
          path: '/articles',
          element: <Articles />
        }
      ]
    }
  ])
  return (
    // <div>
    //   <div className='m-auto'>
    //     {/* <Register/> */}
    //     {/* <Login/> */}
    //     <AddArticle />
    //   </div>
    // </div>
    <>
      <Toaster position="top-order" reverseOrder={false} />
      <RouterProvider router={routerObj} />
    </>
  )
}

export default App