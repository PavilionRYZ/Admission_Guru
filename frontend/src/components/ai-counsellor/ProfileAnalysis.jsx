import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    Award,
    AlertCircle,
    CheckCircle,
    Target,
    BookOpen,
    RefreshCw,
} from 'lucide-react';
import { getProfileAnalysis } from '../../redux/slices/aiSlice';
import Card from '../common/Card';
import Loader from '../common/Loader';
import Button from '../common/Button';

const ProfileAnalysis = () => {
    const dispatch = useDispatch();
    const { analysis, isLoading, error } = useSelector((state) => state.ai);

    useEffect(() => {
        dispatch(getProfileAnalysis());
    }, [dispatch]);

    const strengthColor = (score) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-orange-600';
    };

    const getStrengthBgColor = (score) => {
        if (score >= 80) return 'bg-green-500';
        if (score >= 60) return 'bg-yellow-500';
        return 'bg-orange-500';
    };

    const getStrengthText = (score) => {
        if (score >= 80) return 'Excellent profile!';
        if (score >= 60) return 'Good profile with room for improvement';
        return 'Consider strengthening your profile';
    };

    if (isLoading) {
        return <Loader fullScreen />;
    }

    if (error) {
        return (
            <Card className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={() => dispatch(getProfileAnalysis())}>Try Again</Button>
            </Card>
        );
    }

    if (!analysis) {
        return (
            <Card className="text-center py-12">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                    No analysis available yet. Complete your profile to get insights.
                </p>
                <Button onClick={() => dispatch(getProfileAnalysis())}>
                    Generate Analysis
                </Button>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Profile Analysis</h2>
                        <p className="text-gray-600">AI-powered insights on your application</p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    onClick={() => dispatch(getProfileAnalysis())}
                    icon={RefreshCw}
                    className="text-sm"
                >
                    Refresh
                </Button>
            </div>

            {/* Overall Strength */}
            <Card>
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        Overall Profile Strength
                    </h3>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="relative inline-flex items-center justify-center w-32 h-32 mb-4"
                    >
                        <svg className="w-32 h-32 transform -rotate-90">
                            <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="#e5e7eb"
                                strokeWidth="8"
                                fill="none"
                            />
                            <motion.circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="url(#gradient)"
                                strokeWidth="8"
                                fill="none"
                                strokeLinecap="round"
                                initial={{ strokeDasharray: '0 352' }}
                                animate={{
                                    strokeDasharray: `${(analysis.profileStrength?.overall || 0) * 3.52} 352`,
                                }}
                                transition={{ duration: 1.5 }}
                            />
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#667eea" />
                                    <stop offset="100%" stopColor="#764ba2" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-3xl font-bold text-gray-800">
                                {analysis.profileStrength?.overall || 0}
                            </span>
                        </div>
                    </motion.div>
                    <p className="text-gray-600 font-medium">
                        {getStrengthText(analysis.profileStrength?.overall || 0)}
                    </p>
                </div>
            </Card>

            {/* Strengths */}
            {analysis.strengths && analysis.strengths.length > 0 && (
                <Card>
                    <div className="flex items-center space-x-2 mb-4">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <h3 className="text-lg font-semibold text-gray-800">Strengths</h3>
                    </div>
                    <ul className="space-y-3">
                        {analysis.strengths.map((strength, idx) => (
                            <motion.li
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg"
                            >
                                <TrendingUp className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700">{strength}</span>
                            </motion.li>
                        ))}
                    </ul>
                </Card>
            )}

            {/* Areas for Improvement */}
            {analysis.improvements && analysis.improvements.length > 0 && (
                <Card>
                    <div className="flex items-center space-x-2 mb-4">
                        <AlertCircle className="w-5 h-5 text-orange-600" />
                        <h3 className="text-lg font-semibold text-gray-800">
                            Areas for Improvement
                        </h3>
                    </div>
                    <ul className="space-y-3">
                        {analysis.improvements.map((improvement, idx) => (
                            <motion.li
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg"
                            >
                                <Target className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700">{improvement}</span>
                            </motion.li>
                        ))}
                    </ul>
                </Card>
            )}

            {/* Recommendations */}
            {analysis.recommendations && analysis.recommendations.length > 0 && (
                <Card>
                    <div className="flex items-center space-x-2 mb-4">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-800">Recommendations</h3>
                    </div>
                    <ul className="space-y-3">
                        {analysis.recommendations.map((recommendation, idx) => (
                            <motion.li
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg"
                            >
                                <p className="text-sm text-blue-900">{recommendation}</p>
                            </motion.li>
                        ))}
                    </ul>
                </Card>
            )}

            {/* Component Breakdown */}
            {analysis.profileStrength && (
                <Card>
                    <div className="flex items-center space-x-2 mb-4">
                        <Award className="w-5 h-5 text-purple-600" />
                        <h3 className="text-lg font-semibold text-gray-800">
                            Profile Component Breakdown
                        </h3>
                    </div>
                    <div className="space-y-4">
                        {Object.entries(analysis.profileStrength)
                            .filter(([key]) => key !== 'overall')
                            .map(([key, value], idx) => (
                                <motion.div
                                    key={key}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-4 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700 capitalize">
                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                        </span>
                                        <span className={`text-sm font-bold ${strengthColor(value)}`}>
                                            {value}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${value}%` }}
                                            transition={{ duration: 1, delay: idx * 0.1 }}
                                            className={`h-3 rounded-full ${getStrengthBgColor(value)}`}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                    </div>
                </Card>
            )}

            {/* Additional Insights */}
            {analysis.insights && analysis.insights.length > 0 && (
                <Card>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Additional Insights
                    </h3>
                    <div className="space-y-3">
                        {analysis.insights.map((insight, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500"
                            >
                                <p className="text-sm text-purple-900">{insight}</p>
                            </motion.div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
};

export default ProfileAnalysis;
