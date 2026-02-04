import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { lockApi } from '../../api/lockApi';
import Modal from '../common/Modal';
import Button from '../common/Button';
import toast from 'react-hot-toast';

const LockUniversityModal = ({ isOpen, onClose, shortlistItem }) => {
    const [applicationDeadline, setApplicationDeadline] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLock = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await lockApi.lock({
                shortlistId: shortlistItem._id,
                applicationDeadline,
            });
            toast.success('University locked successfully!');
            onClose();
            window.location.reload(); // Refresh to show updated data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to lock university');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Lock University" size="md">
            <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                        <strong>Important:</strong> Locking a university commits you to applying
                        to this institution. Tasks will be generated to help you prepare your
                        application.
                    </p>
                </div>

                <form onSubmit={handleLock} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Application Deadline
                        </label>
                        <input
                            type="date"
                            value={applicationDeadline}
                            onChange={(e) => setApplicationDeadline(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button variant="secondary" onClick={onClose} type="button">
                            Cancel
                        </Button>
                        <Button type="submit" loading={loading}>
                            Lock University
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default LockUniversityModal;
