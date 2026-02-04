import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    MapPin,
    DollarSign,
    Calendar,
    Award,
    Users,
    Globe,
    BookOpen,
    ArrowLeft,
    Plus,
} from 'lucide-react';
import { universityApi } from '../../api/universityApi';
import Button from '../common/Button';
import Card from '../common/Card';
import Loader from '../common/Loader';
import AddToShortlistModal from '../shortlist/AddToShortlistModal';

const UniversityDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [university, setUniversity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchUniversity = async () => {
            try {
                const response = await universityApi.getById(id);
                setUniversity(response.data.data);
            } catch (error) {
                console.error('Failed to fetch university', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUniversity();
    }, [id]);

    if (loading) return <Loader fullScreen />;
    if (!university) return <div>University not found</div>;

    return (
        <>
            <div className="space-y-6">
                {/* Back Button */}
                <Button
                    variant="secondary"
                    onClick={() => navigate('/universities')}
                    icon={ArrowLeft}
                >
                    Back to Universities
                </Button>

                {/* Header */}
                <Card className="relative overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <h1 className="text-3xl font-bold text-gray-800 mb-4">
                                {university.name}
                            </h1>

                            <div className="space-y-3">
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <MapPin size={20} />
                                    <span>
                                        {university.city}, {university.country}
                                    </span>
                                </div>

                                {university.website && (
                                    <div className="flex items-center space-x-2 text-gray-600">
                                        <Globe size={20} />
                                        <a
                                            href={university.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary-500 hover:underline"
                                        >
                                            {university.website}
                                        </a>
                                    </div>
                                )}

                                <div className="flex items-center space-x-2 text-gray-600">
                                    <Users size={20} />
                                    <span>{university.studentCount?.toLocaleString()} students</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center items-center md:items-end">
                            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-6 rounded-xl text-center">
                                <Award className="w-8 h-8 mx-auto mb-2" />
                                <p className="text-sm">QS Ranking</p>
                                <p className="text-3xl font-bold">{university.ranking?.qs || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Annual Tuition</p>
                                <p className="text-xl font-bold text-gray-800">
                                    ${university.cost?.tuitionPerYear?.min?.toLocaleString()} -{' '}
                                    ${university.cost?.tuitionPerYear?.max?.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Calendar className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Application Deadline</p>
                                <p className="text-xl font-bold text-gray-800">
                                    {university.applicationDeadline || 'Varies by Program'}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <BookOpen className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Programs Offered</p>
                                <p className="text-xl font-bold text-gray-800">
                                    {university.programs?.length || 0}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* About */}
                <Card>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">About</h2>
                    <p className="text-gray-600 leading-relaxed">
                        {university.description ||
                            'This is a prestigious institution known for its academic excellence and research contributions.'}
                    </p>
                </Card>

                {/* Programs */}
                {university.programs && university.programs.length > 0 && (
                    <Card>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Programs</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {university.programs.map((program, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-4 bg-gray-50 rounded-lg"
                                >
                                    <h3 className="font-semibold text-gray-800 mb-2">
                                        {program.name}
                                    </h3>
                                    <div className="space-y-1 text-sm text-gray-600">
                                        <p>Degree: {program.degree}</p>
                                        <p>Duration: {program.duration}</p>
                                        <p>
                                            Tuition: ${program.tuition?.toLocaleString()} per year
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </Card>
                )}

                {/* Admission Requirements */}
                {university.admissionRequirements && (
                    <Card>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Admission Requirements
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2">
                                    Minimum GPA
                                </h3>
                                <p className="text-gray-600">
                                    {university.admissionRequirements.minimumGPA || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2">
                                    English Test
                                </h3>
                                <p className="text-gray-600">
                                    IELTS: {university.admissionRequirements.ieltsScore || 'N/A'} |
                                    TOEFL: {university.admissionRequirements.toeflScore || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Action Button */}
                <Button
                    onClick={() => setShowModal(true)}
                    icon={Plus}
                    className="w-full md:w-auto"
                >
                    Add to Shortlist
                </Button>
            </div>

            <AddToShortlistModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                university={university}
            />
        </>
    );
};

export default UniversityDetail;
