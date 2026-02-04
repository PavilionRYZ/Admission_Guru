import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, MapPin } from 'lucide-react';
import Button from '../components/common/Button';
import { ROUTES } from '../routes/routeConstants';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center px-4">
            <div className="max-w-2xl w-full text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Animated 404 */}
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{
                            duration: 0.5,
                            repeat: Infinity,
                            repeatType: 'reverse',
                            repeatDelay: 2,
                        }}
                        className="mb-8"
                    >
                        <h1 className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                            404
                        </h1>
                    </motion.div>

                    {/* Icon */}
                    <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex justify-center mb-6"
                    >
                        <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                            <MapPin className="w-12 h-12 text-white" />
                        </div>
                    </motion.div>

                    {/* Message */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            Oops! Page Not Found
                        </h2>
                        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                            The page you're looking for seems to have wandered off. Let's get you
                            back on track!
                        </p>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-col sm:flex-row justify-center gap-4"
                    >
                        <Button
                            onClick={() => navigate(-1)}
                            variant="outline"
                            icon={ArrowLeft}
                            className="px-8 py-3"
                        >
                            Go Back
                        </Button>
                        <Button
                            onClick={() => navigate(ROUTES.HOME)}
                            icon={Home}
                            className="px-8 py-3"
                        >
                            Go Home
                        </Button>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-12 pt-8 border-t border-gray-200"
                    >
                        <p className="text-sm text-gray-500 mb-4">Quick Links:</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <button
                                onClick={() => navigate(ROUTES.DASHBOARD)}
                                className="text-primary-500 hover:text-primary-600 font-medium transition-colors"
                            >
                                Dashboard
                            </button>
                            <span className="text-gray-300">•</span>
                            <button
                                onClick={() => navigate(ROUTES.UNIVERSITIES)}
                                className="text-primary-500 hover:text-primary-600 font-medium transition-colors"
                            >
                                Universities
                            </button>
                            <span className="text-gray-300">•</span>
                            <button
                                onClick={() => navigate(ROUTES.SHORTLIST)}
                                className="text-primary-500 hover:text-primary-600 font-medium transition-colors"
                            >
                                Shortlist
                            </button>
                            <span className="text-gray-300">•</span>
                            <button
                                onClick={() => navigate(ROUTES.AI_COUNSELLOR)}
                                className="text-primary-500 hover:text-primary-600 font-medium transition-colors"
                            >
                                AI Counsellor
                            </button>
                        </div>
                    </motion.div>

                    {/* Decorative Elements */}
                    <div className="absolute top-20 left-10 w-20 h-20 bg-primary-200 rounded-full opacity-20 blur-2xl" />
                    <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary-200 rounded-full opacity-20 blur-2xl" />
                </motion.div>
            </div>
        </div>
    );
};

export default NotFoundPage;
