import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft } from 'lucide-react';
import { verifyOtp, signup } from '../../redux/slices/authSlice';
import { ROUTES } from '../../routes/routeConstants';
import Button from '../common/Button';
import toast from 'react-hot-toast';

const VerifyOTP = () => {
    const [otp, setOtp] = useState('');
    const [resending, setResending] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoading, error } = useSelector((state) => state.auth);
    const email = location.state?.email;

    if (!email) {
        toast.error('Please signup first');
        navigate(ROUTES.SIGNUP);
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (otp.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP');
            return;
        }

        try {
            const result = await dispatch(verifyOtp({ email, otp })).unwrap();
            console.log('Verification Success:', result);

            toast.success('Email verified successfully!');

            // User is now logged in, redirect to dashboard
            setTimeout(() => {
                navigate(ROUTES.DASHBOARD);
            }, 1000);
        } catch (error) {
            console.error('Verification Failed:', error);
            toast.error(error || 'Verification failed. Please try again.');
        }
    };

    const handleResend = async () => {
        setResending(true);
        try {
            // Get the signup data from location state
            const signupData = location.state?.signupData || { email };

            await dispatch(signup(signupData)).unwrap();
            toast.success('OTP resent successfully! Check your email.');
            setOtp('');
        } catch (error) {
            toast.error(error || 'Failed to resend OTP');
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center py-12 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full"
            >
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <button
                        onClick={() => navigate(ROUTES.SIGNUP)}
                        className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
                    >
                        <ArrowLeft size={20} className="mr-2" />
                        Back to Signup
                    </button>

                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                        </motion.div>
                        <h2 className="text-3xl font-bold text-gray-800">Verify Email</h2>
                        <p className="text-gray-600 mt-2">
                            Enter the 6-digit OTP sent to
                        </p>
                        <p className="text-primary-600 font-medium mt-1">{email}</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                6-Digit OTP
                            </label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) =>
                                    setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center text-2xl tracking-widest font-semibold"
                                placeholder="000000"
                                maxLength={6}
                                required
                                autoFocus
                            />
                            <p className="text-xs text-gray-500 mt-2 text-center">
                                Please check your email inbox and spam folder
                            </p>
                        </div>

                        <Button type="submit" loading={isLoading} className="w-full">
                            Verify Email
                        </Button>
                    </form>

                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-600 mb-2">
                            Didn't receive the code?
                        </p>
                        <button
                            onClick={handleResend}
                            disabled={resending || isLoading}
                            className="text-sm text-primary-500 hover:text-primary-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {resending ? 'Resending...' : 'Resend OTP'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default VerifyOTP;
