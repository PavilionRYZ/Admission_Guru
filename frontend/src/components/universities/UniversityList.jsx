import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { fetchUniversities, setFilters } from '../../redux/slices/universitySlice';
import UniversityCard from './UniversityCard';
import UniversityFilters from './UniversityFilters';
import Loader from '../common/Loader';

const UniversityList = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const dispatch = useDispatch();
    const { list, loading, filters } = useSelector((state) => state.universities);

    useEffect(() => {
        dispatch(fetchUniversities(filters));
    }, [dispatch, filters]);

    const handleSearch = (e) => {
        e.preventDefault();
        dispatch(fetchUniversities({ ...filters, search: searchQuery }));
    };

    return (
        <div className="space-y-6">
            {/* Search and Filter Bar */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <form onSubmit={handleSearch} className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search universities..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>
                    </form>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center space-x-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                        <SlidersHorizontal size={20} />
                        <span>Filters</span>
                    </button>
                </div>

                {showFilters && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-6 pt-6 border-t"
                    >
                        <UniversityFilters />
                    </motion.div>
                )}
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between">
                <p className="text-gray-600">
                    Found <span className="font-bold text-gray-800">{list.length}</span> universities
                </p>
            </div>

            {/* University Grid */}
            {loading ? (
                <Loader />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {list.map((university, index) => (
                        <motion.div
                            key={university._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <UniversityCard university={university} />
                        </motion.div>
                    ))}
                </div>
            )}

            {!loading && list.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No universities found matching your criteria</p>
                </div>
            )}
        </div>
    );
};

export default UniversityList;
