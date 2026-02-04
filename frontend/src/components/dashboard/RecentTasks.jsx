import { motion } from 'framer-motion';
import { Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../common/Card';
import { format } from 'date-fns';

const RecentTasks = ({ tasks }) => {
    return (
        <Card>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Recent Tasks</h2>
                <Link
                    to="/tasks"
                    className="text-sm text-primary-500 hover:text-primary-600 font-medium"
                >
                    View All
                </Link>
            </div>

            {tasks.length === 0 ? (
                <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No pending tasks</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {tasks.map((task, index) => (
                        <motion.div
                            key={task._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-800">{task.title}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                                    {task.dueDate && (
                                        <div className="flex items-center space-x-1 mt-2 text-xs text-gray-500">
                                            <Clock size={12} />
                                            <span>Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
                                        </div>
                                    )}
                                </div>
                                <span
                                    className={`px-2 py-1 text-xs rounded-full ${task.priority === 'High'
                                            ? 'bg-red-100 text-red-600'
                                            : task.priority === 'Medium'
                                                ? 'bg-yellow-100 text-yellow-600'
                                                : 'bg-green-100 text-green-600'
                                        }`}
                                >
                                    {task.priority}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </Card>
    );
};

export default RecentTasks;
