import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Menu, X, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { logout } from '../../redux/slices/authSlice';
import { ROUTES } from '../../routes/routeConstants';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      toast.success('Logged out successfully');
      navigate(ROUTES.HOME);
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const navLinks = [
    { name: 'Dashboard', path: ROUTES.DASHBOARD },
    { name: 'Universities', path: ROUTES.UNIVERSITIES },
    { name: 'Shortlist', path: ROUTES.SHORTLIST },
    { name: 'Tasks', path: ROUTES.TASKS },
    { name: 'AI Counsellor', path: ROUTES.AI_COUNSELLOR },
  ];

  // Hide navbar only on auth pages
  const hideNavbarPages = [
    ROUTES.LOGIN,
    ROUTES.SIGNUP,
    ROUTES.VERIFY_OTP,
    ROUTES.FORGOT_PASSWORD,
  ];

  const shouldHideNavbar =
    hideNavbarPages.includes(location.pathname) ||
    location.pathname.includes('reset-password');

  if (shouldHideNavbar) {
    return null;
  }

  const isHomePage = location.pathname === ROUTES.HOME;

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${isHomePage
          ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/50'
          : 'bg-white shadow-md'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6, type: 'spring' }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-xl">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              AdmissionGuru
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Only show nav links if authenticated */}
            {isAuthenticated && (
              <>
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="relative group px-4 py-2"
                    >
                      <span
                        className={`font-medium transition-colors ${isActive
                            ? 'text-purple-600'
                            : 'text-gray-700 group-hover:text-purple-600'
                          }`}
                      >
                        {link.name}
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="navbar-indicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600"
                          initial={false}
                          transition={{
                            type: 'spring',
                            stiffness: 500,
                            damping: 30,
                          }}
                        />
                      )}
                    </Link>
                  );
                })}

                {/* Profile Dropdown */}
                <div className="relative ml-3">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors group"
                  >
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                        {user?.firstName?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-600 transition-transform ${profileMenuOpen ? 'rotate-180' : ''
                        }`}
                    />
                  </button>

                  <AnimatePresence>
                    {profileMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setProfileMenuOpen(false)}
                        />

                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-20"
                        >
                          {/* Profile Header */}
                          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 px-4 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-lg font-bold border-2 border-white/30">
                                {user?.firstName?.[0]?.toUpperCase() || 'U'}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white font-semibold truncate">
                                  {user?.firstName} {user?.lastName}
                                </p>
                                <p className="text-white/80 text-xs truncate">
                                  {user?.email}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Menu Items */}
                          <div className="py-2">
                            <Link
                              to={ROUTES.PROFILE}
                              className="flex items-center px-4 py-3 text-gray-700 hover:bg-purple-50 transition-colors group"
                              onClick={() => setProfileMenuOpen(false)}
                            >
                              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center mr-3 group-hover:bg-purple-200 transition-colors">
                                <User className="w-4 h-4 text-purple-600" />
                              </div>
                              <span className="font-medium">My Profile</span>
                            </Link>
                            <Link
                              to={ROUTES.DASHBOARD}
                              className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors group"
                              onClick={() => setProfileMenuOpen(false)}
                            >
                              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                                <Settings className="w-4 h-4 text-blue-600" />
                              </div>
                              <span className="font-medium">Settings</span>
                            </Link>
                          </div>

                          {/* Logout */}
                          <div className="border-t border-gray-100 py-2">
                            <button
                              onClick={() => {
                                setProfileMenuOpen(false);
                                handleLogout();
                              }}
                              className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors group"
                            >
                              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center mr-3 group-hover:bg-red-200 transition-colors">
                                <LogOut className="w-4 h-4 text-red-600" />
                              </div>
                              <span className="font-medium">Logout</span>
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}

            {/* Show Login/Signup only if NOT authenticated */}
            {!isAuthenticated && (
              <div className="flex items-center space-x-3 ml-4">
                <Link
                  to={ROUTES.LOGIN}
                  className="text-gray-700 hover:text-purple-600 font-medium transition-colors px-4 py-2"
                >
                  Login
                </Link>
                <Link
                  to={ROUTES.SIGNUP}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <X size={24} className="text-gray-700" />
            ) : (
              <Menu size={24} className="text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {isAuthenticated ? (
                <>
                  {/* User Info */}
                  <div className="pb-4 mb-4 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center text-white text-lg font-bold">
                        {user?.firstName?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  {navLinks.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`block py-3 px-4 rounded-xl font-medium transition-colors ${isActive
                            ? 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600 border border-purple-100'
                            : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    );
                  })}

                  {/* Profile Link */}
                  <Link
                    to={ROUTES.PROFILE}
                    className="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors mt-4 border-t border-gray-100 pt-4"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5 mr-3" />
                    <span className="font-medium">Profile</span>
                  </Link>

                  {/* Logout Button */}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center w-full py-3 px-4 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    <span className="font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to={ROUTES.LOGIN}
                    className="block py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to={ROUTES.SIGNUP}
                    className="block py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-lg rounded-xl transition-all text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
