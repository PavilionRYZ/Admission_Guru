import { GraduationCap, Mail, MapPin, Phone, Facebook, Twitter, Instagram, Linkedin, Heart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROUTES } from '../../routes/routeConstants';

const Footer = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const location = useLocation();

    // Hide footer only on auth pages (login, signup, etc) - NOT on home page
    const hideFooterPages = [
        ROUTES.LOGIN,
        ROUTES.SIGNUP,
        ROUTES.VERIFY_OTP,
        ROUTES.FORGOT_PASSWORD,
    ];

    const shouldHideFooter =
        hideFooterPages.includes(location.pathname) ||
        location.pathname.includes('reset-password');

    if (shouldHideFooter) {
        return null;
    }

    return (
        <footer className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white mt-20 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                        backgroundSize: '40px 40px',
                    }}
                ></div>
            </div>

            {/* Gradient Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <Link to={ROUTES.HOME} className="flex items-center space-x-3 mb-6 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                                <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-xl">
                                    <GraduationCap className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                AdmissionGuru
                            </span>
                        </Link>
                        <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
                            Your AI-powered companion for study abroad applications. Make informed
                            decisions with personalized guidance and smart recommendations.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3 text-gray-300">
                                <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <span className="text-sm">support@admissionguru.com</span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-300">
                                <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <span className="text-sm">+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-300">
                                <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <span className="text-sm">San Francisco, CA 94102</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            Quick Links
                        </h3>
                        <ul className="space-y-3">
                            {isAuthenticated ? (
                                <>
                                    <li>
                                        <Link
                                            to={ROUTES.DASHBOARD}
                                            className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2 group"
                                        >
                                            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full group-hover:scale-150 transition-transform"></span>
                                            <span>Dashboard</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to={ROUTES.UNIVERSITIES}
                                            className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2 group"
                                        >
                                            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full group-hover:scale-150 transition-transform"></span>
                                            <span>Universities</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to={ROUTES.SHORTLIST}
                                            className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2 group"
                                        >
                                            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full group-hover:scale-150 transition-transform"></span>
                                            <span>Shortlist</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to={ROUTES.AI_COUNSELLOR}
                                            className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2 group"
                                        >
                                            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full group-hover:scale-150 transition-transform"></span>
                                            <span>AI Counsellor</span>
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link
                                            to={ROUTES.HOME}
                                            className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2 group"
                                        >
                                            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full group-hover:scale-150 transition-transform"></span>
                                            <span>Home</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to={ROUTES.LOGIN}
                                            className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2 group"
                                        >
                                            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full group-hover:scale-150 transition-transform"></span>
                                            <span>Login</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to={ROUTES.SIGNUP}
                                            className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2 group"
                                        >
                                            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full group-hover:scale-150 transition-transform"></span>
                                            <span>Sign Up</span>
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>

                    {/* Support & Legal */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            Support & Legal
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2 group"
                                >
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full group-hover:scale-150 transition-transform"></span>
                                    <span>Help Center</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2 group"
                                >
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full group-hover:scale-150 transition-transform"></span>
                                    <span>Contact Us</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2 group"
                                >
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full group-hover:scale-150 transition-transform"></span>
                                    <span>Privacy Policy</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2 group"
                                >
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full group-hover:scale-150 transition-transform"></span>
                                    <span>Terms of Service</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2 group"
                                >
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full group-hover:scale-150 transition-transform"></span>
                                    <span>Cookie Policy</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Social Links & Copyright */}
                <div className="border-t border-white/10 mt-12 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        {/* Social Media */}
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-400">Follow us:</span>
                            <div className="flex space-x-3">
                                <a
                                    href="#"
                                    className="w-9 h-9 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110"
                                >
                                    <Facebook className="w-4 h-4" />
                                </a>
                                <a
                                    href="#"
                                    className="w-9 h-9 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110"
                                >
                                    <Twitter className="w-4 h-4" />
                                </a>
                                <a
                                    href="#"
                                    className="w-9 h-9 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110"
                                >
                                    <Instagram className="w-4 h-4" />
                                </a>
                                <a
                                    href="#"
                                    className="w-9 h-9 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110"
                                >
                                    <Linkedin className="w-4 h-4" />
                                </a>
                            </div>
                        </div>

                        {/* Copyright */}
                        <div className="flex items-center space-x-2 text-gray-400 text-sm">
                            <p>© 2026 AdmissionGuru. Made with</p>
                            <Heart className="w-4 h-4 text-red-500 fill-current" />
                            <p>for students worldwide</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
