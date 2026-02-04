import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { lockUniversity } from '../../redux/slices/lockSlice';
import { fetchShortlist } from '../../redux/slices/shortlistSlice';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Lock, Calendar, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const LockUniversityModal = ({ isOpen, onClose, shortlistItem }) => {
    const [applicationDeadline, setApplicationDeadline] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    // Get today's date in YYYY-MM-DD format for min date
    const today = new Date().toISOString().split('T')[0];

    const handleLock = async (e) => {
        e.preventDefault();

        if (!applicationDeadline) {
            toast.error('Please select an application deadline');
            return;
        }

        // Validate deadline is in the future
        const selectedDate = new Date(applicationDeadline);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        if (selectedDate < currentDate) {
            toast.error('Application deadline must be in the future');
            return;
        }

        setLoading(true);

        try {
            await dispatch(
                lockUniversity({
                    shortlistId: shortlistItem._id,
                    applicationDeadline,
                })
            ).unwrap();

            toast.success('University locked successfully!');

            // Refresh shortlist data
            dispatch(fetchShortlist());

            // Close modal and reset form
            setApplicationDeadline('');
            onClose();
        } catch (error) {
            toast.error(error || 'Failed to lock university');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setApplicationDeadline('');
        onClose();
    };

    if (!shortlistItem) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Lock University"
            size="md"
        >
            <div className="space-y-4">
                {/* University Info */}
                <div className="p-4 bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                        <Lock className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">
                                {shortlistItem.university?.name || 'University'}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {shortlistItem.program?.name || 'Program'}
                            </p>
                            {shortlistItem.university && (
                                <p className="text-xs text-gray-500 mt-1">
                                    {shortlistItem.university.city}, {shortlistItem.university.country}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Important Notice */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-blue-900 mb-1">
                                Important Notice
                            </p>
                            <p className="text-sm text-blue-800">
                                Locking a university commits you to applying to this institution.
                                Application tasks will be automatically generated to help you prepare
                                your application materials and track deadlines.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleLock} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4" />
                                <span>Application Deadline *</span>
                            </div>
                        </label>
                        <input
                            type="date"
                            value={applicationDeadline}
                            onChange={(e) => setApplicationDeadline(e.target.value)}
                            min={today}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Select the final date to submit your application
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <Button
                            variant="secondary"
                            onClick={handleClose}
                            type="button"
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            loading={loading}
                            icon={Lock}
                        >
                            Lock University
                        </Button>
                    </div>
                </form>

                {/* Additional Info */}
                <div className="text-xs text-gray-500 pt-2 border-t">
                    <p>
                        💡 <strong>Tip:</strong> After locking, you can manage your application
                        tasks from the Tasks section.
                    </p>
                </div>
            </div>
        </Modal>
    );
};

export default LockUniversityModal;
