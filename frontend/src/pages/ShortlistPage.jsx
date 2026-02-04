import ShortlistView from '../components/shortlist/ShortlistView';

const ShortlistPage = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">My Shortlist</h1>
                <p className="text-gray-600 mt-2">
                    Universities you're considering for your application
                </p>
            </div>

            <ShortlistView />
        </div>
    );
};

export default ShortlistPage;
