import { useProfile } from '../hooks/useProfile';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';
import { User, Mail, Phone, MapPin, BookOpen, Award } from 'lucide-react';

const ProfilePage = () => {
    const { profile, loading } = useProfile();

    if (loading) return <Loader fullScreen />;
    if (!profile) return <div>Profile not found</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
                <p className="text-gray-600 mt-2">View and manage your profile information</p>
            </div>

            <div className="space-y-6">
                {/* Personal Info */}
                <Card>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                            <User className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">Date of Birth</p>
                                <p className="font-medium text-gray-800">{profile.dateOfBirth}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Phone className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="font-medium text-gray-800">{profile.phoneNumber}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <MapPin className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">Location</p>
                                <p className="font-medium text-gray-800">
                                    {profile.address?.city}, {profile.address?.country}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Academic Info */}
                <Card>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Academic Background</h2>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <BookOpen className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">Highest Education</p>
                                <p className="font-medium text-gray-800">{profile.highestEducation}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Award className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">Institution</p>
                                <p className="font-medium text-gray-800">{profile.institution}</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 mb-1">CGPA</p>
                            <p className="font-medium text-gray-800">
                                {profile.cgpa} / {profile.cgpaScale}
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Study Preferences */}
                <Card>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Study Preferences</h2>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500 mb-2">Preferred Countries</p>
                            <div className="flex flex-wrap gap-2">
                                {profile.preferredCountries?.map((country) => (
                                    <span
                                        key={country}
                                        className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                                    >
                                        {country}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 mb-1">Intended Degree</p>
                            <p className="font-medium text-gray-800">{profile.intendedDegree}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 mb-1">Target Intake</p>
                            <p className="font-medium text-gray-800">
                                {profile.targetIntakeSeason} {profile.targetIntakeYear}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ProfilePage;
