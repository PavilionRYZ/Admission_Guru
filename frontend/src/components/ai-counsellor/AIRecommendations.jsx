import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, MapPin, DollarSign, Award } from 'lucide-react';
import { getRecommendations } from '../../redux/slices/aiSlice';
import { ROUTES, getUniversityDetailRoute } from '../../routes/routeConstants';
import Card from '../common/Card';
import Button from '../common/Button';
import Loader from '../common/Loader';
import { useNavigate } from 'react-router-dom';

const AIRecommendations = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { recommendations, isLoading, error } = useSelector((state) => state.ai);

    useEffect(() => {
        dispatch(getRecommendations());
    }, [dispatch]);

    if (isLoading) {
        return <Loader fullScreen />;
    }

    if (error) {
        return (
            <Card className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={() => dispatch(getRecommendations())}>
                    Try Again
                </Button>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">AI Recommendations</h2>
                    <p className="text-gray-600">Universities matched to your profile</p>
                </div>
            </div>

            {!recommendations || recommendations.length === 0 ? (
                <Card className="text-center py-12">
                    <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                        No recommendations available yet. Complete your profile to get personalized suggestions.
                    </p>
                    <Button onClick={() => navigate(ROUTES.PROFILE)}>
                        Complete Profile
                    </Button>
                </Card>
            ) : (
                <div className="space-y-4">
                    {recommendations.map((rec, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="hover:shadow-lg transition-shadow">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* University Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                                    {rec.universityName || rec.universityData?.name}
                                                </h3>
                                                {rec.universityData && (
                                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                        <MapPin size={16} />
                                                        <span>
                                                            {rec.universityData.city}, {rec.universityData.country}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            {(rec.ranking || rec.universityData?.ranking?.qs) && (
                                                <div className="flex items-center space-x-1 bg-yellow-100 px-3 py-1 rounded-full">
                                                    <Award className="w-4 h-4 text-yellow-600" />
                                                    <span className="text-sm font-semibold text-yellow-700">
                                                        #{rec.ranking || rec.universityData.ranking.qs}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Match Score */}
                                        {rec.matchScore && (
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium text-gray-700">
                                                        Match Score
                                                    </span>
                                                    <span className="text-lg font-bold text-primary-600">
                                                        {rec.matchScore}%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${rec.matchScore}%` }}
                                                        transition={{ duration: 1 }}
                                                        className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Reason */}
                                        {rec.reason && (
                                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                                                <p className="text-sm text-blue-800">
                                                    <strong>Why it fits:</strong> {rec.reason}
                                                </p>
                                            </div>
                                        )}

                                        {/* Pros & Cons */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            {rec.pros && rec.pros.length > 0 && (
                                                <div>
                                                    <h4 className="text-sm font-semibold text-green-700 mb-2">
                                                        Strengths
                                                    </h4>
                                                    <ul className="space-y-1">
                                                        {rec.pros.slice(0, 3).map((pro, idx) => (
                                                            <li
                                                                key={idx}
                                                                className="text-sm text-gray-600 flex items-start"
                                                            >
                                                                <TrendingUp className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                                                <span>{pro}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {rec.cons && rec.cons.length > 0 && (
                                                <div>
                                                    <h4 className="text-sm font-semibold text-orange-700 mb-2">
                                                        Considerations
                                                    </h4>
                                                    <ul className="space-y-1">
                                                        {rec.cons.slice(0, 3).map((con, idx) => (
                                                            <li
                                                                key={idx}
                                                                className="text-sm text-gray-600 flex items-start"
                                                            >
                                                                <span className="text-orange-500 mr-2 flex-shrink-0">
                                                                    •
                                                                </span>
                                                                <span>{con}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>

                                        {/* Cost */}
                                        {rec.universityData?.cost?.tuitionPerYear && (
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <DollarSign size={16} />
                                                <span>
                                                    $
                                                    {rec.universityData.cost.tuitionPerYear.min?.toLocaleString() ||
                                                        'N/A'}{' '}
                                                    -{' '}
                                                    $
                                                    {rec.universityData.cost.tuitionPerYear.max?.toLocaleString() ||
                                                        'N/A'}{' '}
                                                    /year
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col space-y-2 md:w-40">
                                        {rec.universityData?._id && (
                                            <Button
                                                onClick={() =>
                                                    navigate(getUniversityDetailRoute(rec.universityData._id))
                                                }
                                                className="w-full text-sm"
                                            >
                                                View Details
                                            </Button>
                                        )}
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                navigate(ROUTES.SHORTLIST, {
                                                    state: { university: rec.universityData },
                                                })
                                            }
                                            className="w-full text-sm"
                                        >
                                            Add to Shortlist
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AIRecommendations;
