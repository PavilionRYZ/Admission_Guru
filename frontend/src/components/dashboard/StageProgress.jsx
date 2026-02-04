import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Card from '../common/Card';

const StageProgress = ({ progress }) => {
  const stages = [
    'Building Profile',
    'Discovering Universities',
    'Finalizing Universities',
    'Preparing Applications',
  ];

  const currentIndex = stages.indexOf(progress?.currentStage || 'Building Profile');

  return (
    <Card>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Your Journey</h2>
      
      <div className="space-y-4">
        {stages.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          
          return (
            <div key={stage} className="flex items-center space-x-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isCurrent
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {isCompleted ? <Check size={20} /> : index + 1}
              </motion.div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3
                    className={`font-medium ${
                      isCurrent ? 'text-primary-600' : 'text-gray-700'
                    }`}
                  >
                    {stage}
                  </h3>
                  {isCurrent && (
                    <span className="text-sm font-medium text-primary-500">
                      {progress?.currentStageProgress || 0}% Complete
                    </span>
                  )}
                </div>
                {isCurrent && (
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress?.currentStageProgress || 0}%` }}
                      transition={{ duration: 1 }}
                      className="bg-primary-500 h-2 rounded-full"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Overall Progress</span>
          <span className="text-lg font-bold text-primary-600">
            {progress?.overallProgress || 0}%
          </span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress?.overallProgress || 0}%` }}
            transition={{ duration: 1.5 }}
            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full"
          />
        </div>
      </div>
    </Card>
  );
};

export default StageProgress;
