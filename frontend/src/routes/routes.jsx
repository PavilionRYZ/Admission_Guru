import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import PublicRoute from '../components/common/PublicRoute';

// Public Pages
import HomePage from '../pages/HomePage';
import Login from '../components/auth/Login';
import Signup from '../components/auth/Signup';
import VerifyOTP from '../components/auth/VerifyOTP';
import ForgotPassword from '../components/auth/ForgotPassword';
import ResetPassword from '../components/auth/ResetPassword';

// Protected Pages
import OnboardingPage from '../pages/OnboardingPage';
import DashboardPage from '../pages/DashboardPage';
import UniversitiesPage from '../pages/UniversitiesPage';
import UniversityDetailPage from '../pages/UniversityDetailPage';
import ShortlistPage from '../pages/ShortlistPage';
import TasksPage from '../pages/TasksPage';
import AICounsellorPage from '../pages/AICounsellorPage';
import ProfilePage from '../pages/ProfilePage';

// Error Pages
import NotFoundPage from '../pages/NotFoundPage';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes - Accessible to everyone */}
            <Route path="/" element={<HomePage />} />

            {/* Auth Routes - Redirect to dashboard if already logged in */}
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                }
            />
            <Route
                path="/signup"
                element={
                    <PublicRoute>
                        <Signup />
                    </PublicRoute>
                }
            />
            <Route
                path="/verify-otp"
                element={
                    <PublicRoute>
                        <VerifyOTP />
                    </PublicRoute>
                }
            />
            <Route
                path="/forgot-password"
                element={
                    <PublicRoute>
                        <ForgotPassword />
                    </PublicRoute>
                }
            />
            <Route
                path="/reset-password/:token"
                element={
                    <PublicRoute>
                        <ResetPassword />
                    </PublicRoute>
                }
            />

            {/* Protected Routes - Redirect to login if not authenticated */}
            <Route
                path="/onboarding"
                element={
                    <ProtectedRoute>
                        <OnboardingPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/universities"
                element={
                    <ProtectedRoute>
                        <UniversitiesPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/universities/:id"
                element={
                    <ProtectedRoute>
                        <UniversityDetailPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/shortlist"
                element={
                    <ProtectedRoute>
                        <ShortlistPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/tasks"
                element={
                    <ProtectedRoute>
                        <TasksPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/ai-counsellor"
                element={
                    <ProtectedRoute>
                        <AICounsellorPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                }
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default AppRoutes;
