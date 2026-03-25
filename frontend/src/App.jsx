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
import ArticleByID from './components/ArticleById'
import EditArticle from './components/EditArticle'
import ProtectedRoute from './components/ProtectedRoute'
import Unauthorized from './components/Unauthorised'


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
          element:
            <ProtectedRoute allowedRoles={['USER']}>
              <UserDashboard />
            </ProtectedRoute>
        },
        {
          path: "/admin-dashboard",
          element:
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
        },
        {
          path: "/author-dashboard",
          element:
            <ProtectedRoute allowedRoles={['AUTHOR']}>
              <AuthorDashboard />
            </ProtectedRoute>
        },
        {
          path: '/article-list',
          element: <ArticleList />
        },
        {
          path: '/article/:id',
          element: <ArticleByID />
        },
        {
          path: '/add-article',
          element: <AddArticle />
        },
        {
          path: '/edit-article',
          element: <EditArticle />
        },
        {
          path: '/unauth',
          element: <Unauthorized />
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
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.85rem",
            borderRadius: "999px",
            padding: "10px 18px",
          },
        }}
      />
      <RouterProvider router={routerObj} />
    </>
  )
}

export default App