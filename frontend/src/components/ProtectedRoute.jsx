// import { useAuth } from '../store/authStore'
// import { Navigate } from 'react-router'

// function ProtectedRoute({ children,allowedRoles }) {
//     //get user login status from store
//     let { loading, currentUser, isAuthenticated } = useAuth()

//     //loading state
//     if (loading) {
//         return <p>Loading....</p>
//     }
//     //if the user is not logged in
//     if (!isAuthenticated) {
//         //redirect to login
//         return <Navigate to='/login' replace />
//     }
//     //CHECK ROLES
//     if (allowedRoles && !allowedRoles.includes(currentUser?.role)) {
//         return <Navigate to='/unauth' redirectTo='/' />
//         // return <Navigate to='/unauthorized' redirectTo='/' />
//     }
//     return children
// }
// export default ProtectedRoute

import { useAuth } from "../store/authStore";
import { Navigate } from "react-router";

function ProtectedRoute({ children, allowedRoles }) {
  //get user login status from store
  const { loading, currentUser, isAuthenticated, logout } = useAuth();
  //loading state
  if (loading) {
    return <p>Loading...</p>;
  }
  //if user not loggedin
  if (!isAuthenticated) {
    //redirect to Login
    return <Navigate to="/login" replace />;
  }

  console.log("current user role", currentUser.role);
  console.log("aloowed role", allowedRoles);
  console.log(allowedRoles.includes(currentUser?.role));
  //check roles
  if (allowedRoles && !allowedRoles.includes(currentUser?.role)) {
    console.log("first");
    //redirect to Login
    return <Navigate to="/unauth" replace state={{ redirectTo: "/" }} />;
  }

  return children;
}

export default ProtectedRoute;