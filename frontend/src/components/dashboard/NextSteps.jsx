import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, RefreshCw } from 'lucide-react';
import { getNextSteps } from '../../redux/slices/dashboardSlice';
import Card from '../common/Card';
import Button from '../common/Button';

const NextSteps = () => {
  const dispatch = useDispatch();
  const { nextSteps, isLoading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(getNextSteps());
  }, [dispatch]);

  const priorityColors = {
    Urgent: 'text-red-600 bg-red-100',
    High: 'text-orange-600 bg-orange-100',
    Medium: 'text-yellow-600 bg-yellow-100',
    Low: 'text-green-600 bg-green-100',
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Next Steps</h2>
        {!isLoading && (
          <button
            onClick={() => dispatch(getNextSteps())}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={18} />
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto" />
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button
            variant="outline"
            onClick={() => dispatch(getNextSteps())}
            className="text-sm"
          >
            Try Again
          </Button>
        </div>
      ) : !nextSteps || nextSteps.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-gray-600">You're all caught up!</p>
          <p className="text-sm text-gray-500 mt-1">
            Check back later for new recommendations
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {nextSteps.map((step, index) => (
            <motion.div
              key={step._id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-gray-800">{step.title}</h3>
                    {step.priority && (
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${priorityColors[step.priority] || priorityColors.Medium
                          }`}
                      >
                        {step.priority}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{step.description}</p>
                  {step.dueDate && (
                    <p className="text-xs text-gray-500 mt-1">
                      Due: {new Date(step.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 flex-shrink-0 ml-2 transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default NextSteps;
