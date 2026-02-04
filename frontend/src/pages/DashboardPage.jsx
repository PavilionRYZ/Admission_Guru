import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import DashboardOverview from '../components/dashboard/DashboardOverview';
import Loader from '../components/common/Loader';

const DashboardPage = () => {
    const { profile, loading, onboardingComplete } = useProfile();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !onboardingComplete) {
            navigate('/onboarding');
        }
    }, [loading, onboardingComplete, navigate]);

    if (loading) {
        return <Loader fullScreen />;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    Welcome back, {profile?.user?.firstName || 'Student'}!
                </h1>
                <p className="text-gray-600 mt-2">
                    Here's an overview of your study abroad journey
                </p>
            </div>

            <DashboardOverview />
        </div>
    );
};

export default DashboardPage;
