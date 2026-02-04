import { motion } from 'framer-motion';
import { Star, Target, Shield } from 'lucide-react';
import Card from '../common/Card';
import { Link } from 'react-router-dom';

const ShortlistSummary = ({ shortlists }) => {
  const categories = [
    { name: 'Dream', icon: Star, color: 'text-yellow-500', bgColor: 'bg-yellow-100' },
    { name: 'Target', icon: Target, color: 'text-blue-500', bgColor: 'bg-blue-100' },
    { name: 'Safe', icon: Shield, color: 'text-green-500', bgColor: 'bg-green-100' },
  ];

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Shortlist Summary</h2>
        <Link
          to="/shortlist"
          className="text-sm text-primary-500 hover:text-primary-600 font-medium"
        >
          View All
        </Link>
      </div>

      <div className="space-y-3">
        {categories.map((category, index) => {
          const count = shortlists?.byCategory?.[category.name] || 0;
          
          return (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${category.bgColor}`}>
                  <category.icon className={`w-5 h-5 ${category.color}`} />
                </div>
                <span className="font-medium text-gray-700">{category.name}</span>
              </div>
              <span className="text-2xl font-bold text-gray-800">{count}</span>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Total Universities</span>
          <span className="text-lg font-bold text-primary-600">
            {shortlists?.total || 0}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default ShortlistSummary;
