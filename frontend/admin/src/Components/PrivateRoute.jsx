import { Navigate, Outlet } from 'react-router-dom'
import Cookies from 'js-cookie'

const PrivateRoute = () => {
  const token = Cookies.get('token')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default PrivateRoute
