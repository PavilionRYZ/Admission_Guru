import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { createOrUpdateProfile } from '../../redux/slices/profileSlice';
import Button from '../common/Button';
import toast from 'react-hot-toast';
import PersonalInfoStep from './steps/PersonalInfoStep';
import AcademicStep from './steps/AcademicStep';
import TestScoresStep from './steps/TestScoresStep';
import PreferencesStep from './steps/PreferencesStep';
import DocumentsStep from './steps/DocumentsStep';

const steps = [
    { id: 1, name: 'Personal Info', component: PersonalInfoStep },
    { id: 2, name: 'Academic', component: AcademicStep },
    { id: 3, name: 'Test Scores', component: TestScoresStep },
    { id: 4, name: 'Preferences', component: PreferencesStep },
    { id: 5, name: 'Documents', component: DocumentsStep },
];

const OnboardingForm = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Personal Info
        dateOfBirth: '',
        phoneNumber: '',
        address: {
            street: '',
            city: '',
            state: '',
            country: '',
            zipCode: '',
        },

        // Academic
        highestEducation: '',
        institution: '',
        fieldOfStudy: '',
        cgpa: '',
        cgpaScale: 10,
        graduationYear: '',
        intendedDegree: '',

        // Test Scores
        englishTest: {
            type: '',
            score: '',
            date: '',
            status: 'Not Taken',
        },
        standardizedTest: {
            type: 'None',
            score: '',
            date: '',
            status: 'Not Taken',
        },

        // Preferences
        preferredCountries: [],
        preferredCities: [],
        budgetPerYear: {
            min: 0,
            max: 50000,
            currency: 'USD',
        },
        targetIntakeYear: 2026,
        targetIntakeSeason: 'Fall',
        priorities: [],

        // Documents
        sopStatus: 'Not Started',
        lorStatus: 'Not Started',
        resumeStatus: 'Not Started',
        transcriptsStatus: 'Not Started',
    });

    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await dispatch(createOrUpdateProfile(formData)).unwrap();
            toast.success('Profile created successfully!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.message || 'Failed to save profile');
        } finally {
            setLoading(false);
        }
    };

    const updateFormData = (data) => {
        setFormData({ ...formData, ...data });
    };

    const CurrentStepComponent = steps[currentStep - 1].component;

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex items-center flex-1">
                                <div className="flex flex-col items-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep > step.id
                                                ? 'bg-green-500 text-white'
                                                : currentStep === step.id
                                                    ? 'bg-primary-500 text-white'
                                                    : 'bg-gray-200 text-gray-500'
                                            }`}
                                    >
                                        {currentStep > step.id ? <Check size={20} /> : step.id}
                                    </motion.div>
                                    <span className="mt-2 text-xs font-medium text-gray-600">
                                        {step.name}
                                    </span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div
                                        className={`flex-1 h-1 mx-2 ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-xl p-8"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <CurrentStepComponent
                                formData={formData}
                                updateFormData={updateFormData}
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-6 border-t">
                        <Button
                            variant="secondary"
                            onClick={handleBack}
                            disabled={currentStep === 1}
                            icon={ChevronLeft}
                        >
                            Back
                        </Button>

                        {currentStep < steps.length ? (
                            <Button onClick={handleNext} icon={ChevronRight}>
                                Next
                            </Button>
                        ) : (
                            <Button onClick={handleSubmit} loading={loading} icon={Check}>
                                Complete Profile
                            </Button>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default OnboardingForm;
