import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Star, Target, Shield, Lock } from 'lucide-react';
import { fetchShortlist } from '../../redux/slices/shortlistSlice';
import ShortlistCard from './ShortlistCard';
import Loader from '../common/Loader';

const ShortlistView = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const dispatch = useDispatch();
    const { items, loading } = useSelector((state) => state.shortlist);

    useEffect(() => {
        const category = selectedCategory === 'all' ? null : selectedCategory;
        dispatch(fetchShortlist(category));
    }, [dispatch, selectedCategory]);

    const categories = [
        { value: 'all', label: 'All', icon: null },
        { value: 'Dream', label: 'Dream', icon: Star },
        { value: 'Target', label: 'Target', icon: Target },
        { value: 'Safe', label: 'Safe', icon: Shield },
    ];

    const filteredItems =
        selectedCategory === 'all'
            ? items
            : items.filter((item) => item.category === selectedCategory);

    return (
        <div className="space-y-6">
            {/* Category Tabs */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex flex-wrap gap-3">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <button
                                key={category.value}
                                onClick={() => setSelectedCategory(category.value)}
                                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${selectedCategory === category.value
                                        ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {Icon && <Icon size={20} />}
                                <span>{category.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-md p-6"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total</p>
                            <p className="text-2xl font-bold text-gray-800">{items.length}</p>
                        </div>
                        <Lock className="w-8 h-8 text-gray-400" />
                    </div>
                </motion.div>

                {['Dream', 'Target', 'Safe'].map((cat, idx) => {
                    const count = items.filter((item) => item.category === cat).length;
                    return (
                        <motion.div
                            key={cat}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-xl shadow-md p-6"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">{cat}</p>
                                    <p className="text-2xl font-bold text-gray-800">{count}</p>
                                </div>
                                {cat === 'Dream' && <Star className="w-8 h-8 text-yellow-500" />}
                                {cat === 'Target' && <Target className="w-8 h-8 text-blue-500" />}
                                {cat === 'Safe' && <Shield className="w-8 h-8 text-green-500" />}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Shortlist Items */}
            {loading ? (
                <Loader />
            ) : (
                <>
                    {filteredItems.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No universities in shortlist</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {filteredItems.map((item, index) => (
                                <motion.div
                                    key={item._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <ShortlistCard item={item} />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ShortlistView;
