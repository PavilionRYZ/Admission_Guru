import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
    CheckCircle,
    Circle,
    Clock,
    Trash2,
    Edit,
    AlertCircle,
} from 'lucide-react';
import { completeTask, deleteTask } from '../../redux/slices/taskSlice';
import Card from '../common/Card';
import Button from '../common/Button';
import { format, isPast } from 'date-fns';
import toast from 'react-hot-toast';

const TaskCard = ({ task }) => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleComplete = async () => {
        setLoading(true);
        try {
            await dispatch(completeTask(task._id)).unwrap();
            toast.success('Task completed!');
        } catch (error) {
            toast.error('Failed to complete task');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await dispatch(deleteTask(task._id)).unwrap();
                toast.success('Task deleted');
            } catch (error) {
                toast.error('Failed to delete task');
            }
        }
    };

    const priorityColors = {
        High: 'bg-red-100 text-red-700 border-red-300',
        Medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
        Low: 'bg-green-100 text-green-700 border-green-300',
    };

    const statusColors = {
        Pending: 'text-gray-600',
        'In Progress': 'text-blue-600',
        Completed: 'text-green-600',
    };

    const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'Completed';

    return (
        <Card hover={false} className={task.status === 'Completed' ? 'opacity-60' : ''}>
            <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                        <button
                            onClick={handleComplete}
                            disabled={task.status === 'Completed' || loading}
                            className="mt-1"
                        >
                            {task.status === 'Completed' ? (
                                <CheckCircle className="w-6 h-6 text-green-500 fill-green-500" />
                            ) : (
                                <Circle className="w-6 h-6 text-gray-400 hover:text-primary-500 transition-colors" />
                            )}
                        </button>

                        <div className="flex-1">
                            <h3
                                className={`text-lg font-semibold ${task.status === 'Completed'
                                        ? 'line-through text-gray-500'
                                        : 'text-gray-800'
                                    }`}
                            >
                                {task.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${priorityColors[task.priority]
                                }`}
                        >
                            {task.priority}
                        </span>
                    </div>
                </div>

                {/* Meta Information */}
                <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                        <span className={`font-medium ${statusColors[task.status]}`}>
                            {task.status}
                        </span>
                    </div>

                    {task.category && (
                        <span className="text-gray-600">
                            <strong>Category:</strong> {task.category}
                        </span>
                    )}

                    {task.dueDate && (
                        <div className="flex items-center space-x-1">
                            {isOverdue ? (
                                <AlertCircle className="w-4 h-4 text-red-500" />
                            ) : (
                                <Clock className="w-4 h-4 text-gray-400" />
                            )}
                            <span className={isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}>
                                Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                            </span>
                        </div>
                    )}

                    {task.generatedBy === 'AI' && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                            AI Generated
                        </span>
                    )}
                </div>

                {/* Related University */}
                {task.relatedUniversity && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Related University</p>
                        <p className="text-sm font-medium text-gray-800">
                            {task.relatedUniversity.name}
                        </p>
                    </div>
                )}

                {/* Actions */}
                {task.status !== 'Completed' && (
                    <div className="flex space-x-2 pt-4 border-t">
                        <Button
                            variant="outline"
                            onClick={handleComplete}
                            loading={loading}
                            icon={CheckCircle}
                            className="text-sm py-2"
                        >
                            Mark Complete
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleDelete}
                            icon={Trash2}
                            className="text-sm py-2"
                        >
                            Delete
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default TaskCard;
