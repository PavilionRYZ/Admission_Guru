import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
    MapPin,
    DollarSign,
    Trash2,
    Lock,
    Eye,
    AlertTriangle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { removeFromShortlist } from '../../redux/slices/shortlistSlice';
import Card from '../common/Card';
import Button from '../common/Button';
import LockUniversityModal from '../locks/LockUniversityModal';
import toast from 'react-hot-toast';

const ShortlistCard = ({ item }) => {
    const [showLockModal, setShowLockModal] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleRemove = async () => {
        if (item.isLocked) {
            toast.error('Cannot remove locked university');
            return;
        }

        if (window.confirm('Are you sure you want to remove this university?')) {
            try {
                await dispatch(removeFromShortlist(item._id)).unwrap();
                toast.success('University removed from shortlist');
            } catch (error) {
                toast.error('Failed to remove university');
            }
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'Dream':
                return 'bg-yellow-100 text-yellow-700 border-yellow-300';
            case 'Target':
                return 'bg-blue-100 text-blue-700 border-blue-300';
            case 'Safe':
                return 'bg-green-100 text-green-700 border-green-300';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-300';
        }
    };

    return (
        <>
            <Card className="relative">
                {item.isLocked && (
                    <div className="absolute top-6 right-6">
                        <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                            <Lock size={12} />
                            <span>Locked</span>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {/* Header */}
                    <div>
                        <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl font-bold text-gray-800 pr-16">
                                {item.university?.name}
                            </h3>
                        </div>

                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                            <MapPin size={16} />
                            <span>
                                {item.university?.city}, {item.university?.country}
                            </span>
                        </div>

                        <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(
                                item.category
                            )}`}
                        >
                            {item.category}
                        </span>
                    </div>

                    {/* Program */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Program</p>
                        <p className="font-medium text-gray-800">{item.program}</p>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Acceptance Chance</p>
                            <p className="font-semibold text-gray-800">
                                {item.acceptanceChance}%
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Cost Level</p>
                            <p className="font-semibold text-gray-800">{item.costLevel}</p>
                        </div>
                    </div>

                    {/* Fit Reason */}
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                            <strong>Why it fits:</strong> {item.fitReason}
                        </p>
                    </div>

                    {/* Risks */}
                    {item.risks && item.risks.length > 0 && (
                        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                            <div className="flex items-start space-x-2">
                                <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-semibold text-orange-800 mb-1">
                                        Risks:
                                    </p>
                                    <ul className="text-xs text-orange-700 space-y-1">
                                        {item.risks.map((risk, idx) => (
                                            <li key={idx}>• {risk}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="grid grid-cols-3 gap-2 pt-4 border-t">
                        <Button
                            variant="outline"
                            onClick={() => navigate(`/universities/${item.university._id}`)}
                            icon={Eye}
                            className="text-sm py-2"
                        >
                            View
                        </Button>
                        {!item.isLocked && (
                            <>
                                <Button
                                    onClick={() => setShowLockModal(true)}
                                    icon={Lock}
                                    className="text-sm py-2"
                                >
                                    Lock
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={handleRemove}
                                    icon={Trash2}
                                    className="text-sm py-2"
                                >
                                    Remove
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </Card>

            <LockUniversityModal
                isOpen={showLockModal}
                onClose={() => setShowLockModal(false)}
                shortlistItem={item}
            />
        </>
    );
};

export default ShortlistCard;
