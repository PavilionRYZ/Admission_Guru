import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
    GraduationCap,
    Target,
    Sparkles,
    CheckCircle,
    ArrowRight,
    Award,
    Users,
    TrendingUp,
    Globe,
    BookOpen,
    Zap,
    Shield,
    Star,
} from 'lucide-react';
import Button from '../components/common/Button';
import { ROUTES } from '../routes/routeConstants';

const HomePage = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);

    const features = [
        {
            icon: Sparkles,
            title: 'AI-Powered Guidance',
            description:
                'Get personalized university recommendations tailored to your profile, goals, and preferences using advanced AI algorithms.',
            color: 'from-purple-500 to-pink-500',
        },
        {
            icon: Target,
            title: 'Smart Shortlisting',
            description:
                'Organize universities into Dream, Target, and Safe categories with intelligent insights to maximize your acceptance chances.',
            color: 'from-blue-500 to-cyan-500',
        },
        {
            icon: CheckCircle,
            title: 'Task Management',
            description:
                'Stay organized with AI-generated application tasks, deadline tracking, and automated reminders to never miss important dates.',
            color: 'from-green-500 to-emerald-500',
        },
        {
            icon: Globe,
            title: 'Global University Database',
            description:
                'Access comprehensive information on 500+ universities worldwide with detailed program information and admission requirements.',
            color: 'from-orange-500 to-red-500',
        },
        {
            icon: BookOpen,
            title: 'Document Preparation',
            description:
                'Get AI-assisted help with SOPs, LORs, and essays. Receive feedback and suggestions to strengthen your application materials.',
            color: 'from-indigo-500 to-purple-500',
        },
        {
            icon: Shield,
            title: 'Secure & Private',
            description:
                'Your data is encrypted and secure. We prioritize your privacy and never share your information with third parties.',
            color: 'from-teal-500 to-green-500',
        },
    ];

    const stats = [
        { icon: Users, value: '10,000+', label: 'Students Helped', color: 'text-blue-600' },
        { icon: Award, value: '500+', label: 'Universities', color: 'text-purple-600' },
        { icon: TrendingUp, value: '95%', label: 'Success Rate', color: 'text-green-600' },
        { icon: Globe, value: '50+', label: 'Countries', color: 'text-orange-600' },
    ];

    const testimonials = [
        {
            name: 'Sarah Johnson',
            university: 'Stanford University',
            text: 'AdmissionGuru helped me organize my applications and I got into my dream school!',
            rating: 5,
        },
        {
            name: 'Raj Patel',
            university: 'MIT',
            text: 'The AI recommendations were spot-on. Saved me so much time and stress.',
            rating: 5,
        },
        {
            name: 'Emma Chen',
            university: 'Oxford University',
            text: 'Best decision I made. The task management feature kept me on track throughout.',
            rating: 5,
        },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section with improved contrast */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
                {/* Animated background pattern with CSS only */}
                <div className="absolute inset-0 opacity-30">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `
                radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 40% 20%, rgba(255, 255, 255, 0.10) 0%, transparent 50%)
              `,
                        }}
                    ></div>
                </div>

                {/* Animated gradient orbs - Pure CSS */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
                    <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
                    <div className="text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            {/* Logo/Icon with glow effect */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5, type: 'spring' }}
                                className="flex justify-center mb-8"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl opacity-50"></div>
                                    <div className="relative bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20">
                                        <GraduationCap className="w-16 h-16 text-white" />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Main heading with better contrast */}
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                                Your Study Abroad
                                <br />
                                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                                    Journey Starts Here
                                </span>
                            </h1>

                            <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed">
                                AdmissionGuru uses{' '}
                                <span className="font-semibold text-white">AI technology</span> to
                                guide you step-by-step through university selection, application
                                preparation, and decision-making.
                            </p>

                            {/* CTA Buttons with enhanced styling */}
                            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                                {isAuthenticated ? (
                                    <Link to={ROUTES.DASHBOARD}>
                                        <Button
                                            icon={ArrowRight}
                                            className="px-10 py-5 text-lg font-semibold bg-white text-purple-900 hover:bg-gray-100 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200 rounded-xl"
                                        >
                                            Go to Dashboard
                                        </Button>
                                    </Link>
                                ) : (
                                    <>
                                        <Link to={ROUTES.SIGNUP}>
                                            <Button
                                                icon={ArrowRight}
                                                className="px-10 py-5 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200 rounded-xl"
                                            >
                                                Get Started Free
                                            </Button>
                                        </Link>
                                        <Link to={ROUTES.LOGIN}>
                                            <Button
                                                variant="outline"
                                                className="px-10 py-5 text-lg font-semibold bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/20 transform hover:scale-105 transition-all duration-200 rounded-xl"
                                            >
                                                Sign In
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </div>

                            {/* Trust indicators */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="flex flex-wrap justify-center items-center gap-6 text-white/80 text-sm"
                            >
                                <div className="flex items-center gap-2">
                                    <Shield className="w-5 h-5" />
                                    <span>Secure & Private</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Zap className="w-5 h-5" />
                                    <span>AI-Powered</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5" />
                                    <span>Free to Start</span>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>

                {/* Wave separator */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg
                        viewBox="0 0 1440 120"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                            fill="white"
                        />
                    </svg>
                </div>
            </div>

            {/* Stats Section with cards */}
            <div className="bg-white py-16 lg:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group text-center"
                            >
                                <div
                                    className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${index === 0
                                            ? 'from-blue-500 to-cyan-500'
                                            : index === 1
                                                ? 'from-purple-500 to-pink-500'
                                                : index === 2
                                                    ? 'from-green-500 to-emerald-500'
                                                    : 'from-orange-500 to-red-500'
                                        } rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                                >
                                    <stat.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className={`text-4xl lg:text-5xl font-extrabold mb-2 ${stat.color}`}>
                                    {stat.value}
                                </h3>
                                <p className="text-gray-600 text-base font-medium">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Features Section with improved design */}
            <div className="bg-gradient-to-b from-white to-gray-50 py-20 lg:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="text-center mb-16">
                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4"
                            >
                                ✨ Powerful Features
                            </motion.span>
                            <h2 className="text-4xl lg:text-6xl font-extrabold text-gray-900 mb-4 tracking-tight">
                                Everything You Need to Succeed
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Comprehensive tools designed to streamline your university
                                application journey
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-200"
                                >
                                    {/* Gradient border effect on hover */}
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-300`}
                                    ></div>

                                    <div className="relative">
                                        <div
                                            className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300`}
                                        >
                                            <feature.icon className="w-7 h-7 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Testimonials Section */}
            <div className="bg-white py-20 lg:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4"
                        >
                            💬 Student Success Stories
                        </motion.span>
                        <h2 className="text-4xl lg:text-6xl font-extrabold text-gray-900 mb-4">
                            Loved by Students Worldwide
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl p-8 border border-purple-100"
                            >
                                <div className="flex mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className="w-5 h-5 text-yellow-400 fill-current"
                                        />
                                    ))}
                                </div>
                                <p className="text-gray-700 mb-6 italic">
                                    "{testimonial.text}"
                                </p>
                                <div>
                                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                                    <p className="text-sm text-purple-600">
                                        {testimonial.university}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section with improved contrast */}
            <div className="relative bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 py-20 lg:py-28 overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0">
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                            backgroundSize: '40px 40px',
                        }}
                    ></div>
                </div>

                <div className="relative max-w-4xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
                            Ready to Start Your Journey?
                        </h2>
                        <p className="text-xl lg:text-2xl text-gray-200 mb-10 leading-relaxed">
                            Join thousands of students who trusted AdmissionGuru for their study
                            abroad applications.
                        </p>
                        {isAuthenticated ? (
                            <Link to={ROUTES.DASHBOARD}>
                                <Button
                                    variant="secondary"
                                    icon={ArrowRight}
                                    className="px-10 py-5 text-lg font-semibold bg-white text-purple-900 hover:bg-gray-100 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200 rounded-xl"
                                >
                                    Go to Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <Link to={ROUTES.SIGNUP}>
                                <Button
                                    variant="secondary"
                                    icon={ArrowRight}
                                    className="px-10 py-5 text-lg font-semibold bg-white text-purple-900 hover:bg-gray-100 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200 rounded-xl"
                                >
                                    Create Free Account
                                </Button>
                            </Link>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
