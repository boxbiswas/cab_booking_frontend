import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute() {
    const { isAuthenticated } = useSelector((state) => state.auth);

    // If the user is not authenticated, kick them back to the login page
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // If they are authenticated, render the requested page (like the Dashboard)
    return <Outlet />;
}