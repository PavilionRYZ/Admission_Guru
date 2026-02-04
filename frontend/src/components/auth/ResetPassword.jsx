import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Lock, Key, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { resetPassword } from '../../redux/slices/authSlice';
import { ROUTES } from '../../routes/routeConstants';
import Button from '../common/Button';
import toast from 'react-hot-toast';

const ResetPassword = () => {
    const [formData, setFormData] = useState({
        email: '',
        newPassword: '',
        confirmNewPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [success, setSuccess] = useState(false);

    const { token } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoading } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (formData.newPassword !== formData.confirmNewPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (formData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        if (!formData.email) {
            toast.error('Email is required');
            return;
        }

        try {
            await dispatch(
                resetPassword({
                    token,
                    email: formData.email,
                    newPassword: formData.newPassword,
                    confirmNewPassword: formData.confirmNewPassword,
                })
            ).unwrap();

            setSuccess(true);
            toast.success('Password reset successfully!');

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate(ROUTES.LOGIN);
            }, 2000);
        } catch (error) {
            toast.error(error || 'Failed to reset password');
        }
    };

    const passwordStrength = (password) => {
        if (password.length === 0) return { strength: 0, text: '', color: '' };
        if (password.length < 6) return { strength: 1, text: 'Weak', color: 'red' };
        if (password.length < 10) return { strength: 2, text: 'Medium', color: 'yellow' };
        return { strength: 3, text: 'Strong', color: 'green' };
    };

    const strength = passwordStrength(formData.newPassword);

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center py-12 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full"
                >
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Password Reset Successful!
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Your password has been successfully reset. You can now login with your new password.
                        </p>
                        <Link to={ROUTES.LOGIN}>
                            <Button className="w-full">
                                Go to Login
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center py-12 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full"
            >
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Key className="w-8 h-8 text-white" />
                            </div>
                        </motion.div>
                        <h2 className="text-3xl font-bold text-gray-800">Reset Password</h2>
                        <p className="text-gray-600 mt-2">Enter your new password</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.newPassword}
                                    onChange={(e) =>
                                        setFormData({ ...formData, newPassword: e.target.value })
                                    }
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            {/* Password Strength Indicator */}
                            {formData.newPassword && (
                                <div className="mt-2">
                                    <div className="flex items-center space-x-2">
                                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-300 ${strength.color === 'red'
                                                        ? 'bg-red-500 w-1/3'
                                                        : strength.color === 'yellow'
                                                            ? 'bg-yellow-500 w-2/3'
                                                            : 'bg-green-500 w-full'
                                                    }`}
                                            />
                                        </div>
                                        <span
                                            className={`text-xs font-medium ${strength.color === 'red'
                                                    ? 'text-red-600'
                                                    : strength.color === 'yellow'
                                                        ? 'text-yellow-600'
                                                        : 'text-green-600'
                                                }`}
                                        >
                                            {strength.text}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Password must be at least 6 characters
                                    </p>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={formData.confirmNewPassword}
                                    onChange={(e) =>
                                        setFormData({ ...formData, confirmNewPassword: e.target.value })
                                    }
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {formData.confirmNewPassword &&
                                formData.newPassword !== formData.confirmNewPassword && (
                                    <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
                                )}
                        </div>

                        <Button
                            type="submit"
                            loading={isLoading}
                            className="w-full"
                            disabled={formData.newPassword !== formData.confirmNewPassword}
                        >
                            Reset Password
                        </Button>

                        <div className="text-center">
                            <Link
                                to={ROUTES.LOGIN}
                                className="text-sm text-gray-600 hover:text-gray-800"
                            >
                                Remember your password?{' '}
                                <span className="text-primary-500 font-medium">Login</span>
                            </Link>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
