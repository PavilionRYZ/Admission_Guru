import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToShortlist } from '../../redux/slices/shortlistSlice';
import Modal from '../common/Modal';
import Button from '../common/Button';
import toast from 'react-hot-toast';

const AddToShortlistModal = ({ isOpen, onClose, university }) => {
    const [formData, setFormData] = useState({
        program: '',
        category: 'Target',
        acceptanceChance: 50,
        fitReason: '',
        risks: '',
        costLevel: 'Medium',
        notes: '',
    });
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = {
                universityId: university._id,
                program: formData.program,
                category: formData.category,
                acceptanceChance: formData.acceptanceChance,
                fitReason: formData.fitReason,
                risks: formData.risks ? formData.risks.split(',').map((r) => r.trim()) : [],
                costLevel: formData.costLevel,
                notes: formData.notes,
            };

            await dispatch(addToShortlist(data)).unwrap();
            toast.success('University added to shortlist!');
            onClose();
        } catch (error) {
            toast.error(error.message || 'Failed to add to shortlist');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add to Shortlist" size="lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Program
                    </label>
                    <input
                        type="text"
                        value={formData.program}
                        onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="e.g., MS in Computer Science"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                    </label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                        <option value="Dream">Dream</option>
                        <option value="Target">Target</option>
                        <option value="Safe">Safe</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Acceptance Chance: {formData.acceptanceChance}%
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={formData.acceptanceChance}
                        onChange={(e) =>
                            setFormData({ ...formData, acceptanceChance: parseInt(e.target.value) })
                        }
                        className="w-full"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Why does this university fit?
                    </label>
                    <textarea
                        value={formData.fitReason}
                        onChange={(e) => setFormData({ ...formData, fitReason: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        rows={3}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Risks (comma-separated)
                    </label>
                    <input
                        type="text"
                        value={formData.risks}
                        onChange={(e) => setFormData({ ...formData, risks: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="High competition, Location concerns"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cost Level
                    </label>
                    <select
                        value={formData.costLevel}
                        onChange={(e) => setFormData({ ...formData, costLevel: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes (Optional)
                    </label>
                    <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        rows={2}
                    />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <Button variant="secondary" onClick={onClose} type="button">
                        Cancel
                    </Button>
                    <Button type="submit" loading={loading}>
                        Add to Shortlist
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default AddToShortlistModal;
