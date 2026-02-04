import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, DollarSign, Star, Plus, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import AddToShortlistModal from '../shortlist/AddToShortlistModal';

const UniversityCard = ({ university }) => {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    return (
        <>
            <Card className="h-full flex flex-col">
                {/* University Image */}
                <div className="relative h-48 -m-6 mb-4 rounded-t-xl overflow-hidden">
                    <img
                        src={university.logo || 'https://via.placeholder.com/400x200?text=University'}
                        alt={university.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md">
                        <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-bold text-sm">{university.ranking?.qs || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                {/* University Info */}
                <div className="flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                        {university.name}
                    </h3>

                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                        <MapPin size={16} />
                        <span>
                            {university.city}, {university.country}
                        </span>
                    </div>

                    {/* Cost */}
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                        <DollarSign size={16} />
                        <span>
                            {university.cost?.tuitionPerYear?.min?.toLocaleString()} -{' '}
                            {university.cost?.tuitionPerYear?.max?.toLocaleString()} USD/year
                        </span>
                    </div>

                    {/* Programs */}
                    {university.programs && university.programs.length > 0 && (
                        <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-2">Popular Programs:</p>
                            <div className="flex flex-wrap gap-2">
                                {university.programs.slice(0, 2).map((program, idx) => (
                                    <span
                                        key={idx}
                                        className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full"
                                    >
                                        {program.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="mt-auto grid grid-cols-2 gap-3">
                        <Button
                            variant="outline"
                            onClick={() => navigate(`/universities/${university._id}`)}
                            icon={Eye}
                            className="text-sm py-2"
                        >
                            View
                        </Button>
                        <Button
                            onClick={() => setShowModal(true)}
                            icon={Plus}
                            className="text-sm py-2"
                        >
                            Shortlist
                        </Button>
                    </div>
                </div>
            </Card>

            <AddToShortlistModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                university={university}
            />
        </>
    );
};

export default UniversityCard;
