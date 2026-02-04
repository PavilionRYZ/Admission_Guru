import UniversityList from '../components/universities/UniversityList';

const UniversitiesPage = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Explore Universities</h1>
                <p className="text-gray-600 mt-2">
                    Find the perfect universities that match your profile
                </p>
            </div>

            <UniversityList />
        </div>
    );
};

export default UniversitiesPage;
