import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROUTES } from '../../routes/routeConstants';
import Loader from './Loader';

const PublicRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

    if (isLoading) {
        return <Loader fullScreen />;
    }

    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
        return <Navigate to={ROUTES.DASHBOARD} replace />;
    }

    return children;
};

export default PublicRoute;
