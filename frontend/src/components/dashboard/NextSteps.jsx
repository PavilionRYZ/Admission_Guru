import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { dashboardApi } from '../../api/dashboardApi';
import Card from '../common/Card';

const NextSteps = () => {
  const [nextSteps, setNextSteps] = useState([]);

  useEffect(() => {
    const fetchNextSteps = async () => {
      try {
        const response = await dashboardApi.getNextSteps();
        setNextSteps(response.data.data);
      } catch (error) {
        console.error('Failed to fetch next steps', error);
      }
    };

    fetchNextSteps();
  }, []);

  const priorityColors = {
    Urgent: 'text-red-600 bg-red-100',
    High: 'text-orange-600 bg-orange-100',
    Medium: 'text-yellow-600 bg-yellow-100',
    Low: 'text-green-600 bg-green-100',
  };

  return (
    <Card>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Next Steps</h2>
      
      {nextSteps.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-gray-600">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {nextSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-gray-800">{step.title}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        priorityColors[step.priority]
                      }`}
                    >
                      {step.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default NextSteps;
