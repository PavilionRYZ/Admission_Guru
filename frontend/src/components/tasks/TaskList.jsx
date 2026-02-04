import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Plus, Filter } from 'lucide-react';
import { fetchTasks } from '../../redux/slices/taskSlice';
import TaskCard from './TaskCard';
import CreateTaskModal from './CreateTaskModal';
import Button from '../common/Button';
import Loader from '../common/Loader';

const TaskList = () => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        category: '',
    });
    const dispatch = useDispatch();
    const { list, loading } = useSelector((state) => state.tasks);

    useEffect(() => {
        dispatch(fetchTasks(filters));
    }, [dispatch, filters]);

    const statuses = ['All', 'Pending', 'In Progress', 'Completed'];
    const priorities = ['All', 'High', 'Medium', 'Low'];

    const filteredTasks = list.filter((task) => {
        if (filters.status && filters.status !== 'All' && task.status !== filters.status)
            return false;
        if (filters.priority && filters.priority !== 'All' && task.priority !== filters.priority)
            return false;
        return true;
    });

    const groupedTasks = {
        pending: filteredTasks.filter((t) => t.status === 'Pending' || t.status === 'In Progress'),
        completed: filteredTasks.filter((t) => t.status === 'Completed'),
    };

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Tasks</h1>
                        <p className="text-gray-600 mt-1">
                            {groupedTasks.pending.length} pending • {groupedTasks.completed.length} completed
                        </p>
                    </div>
                    <Button onClick={() => setShowCreateModal(true)} icon={Plus}>
                        Create Task
                    </Button>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                                {statuses.map((status) => (
                                    <option key={status} value={status === 'All' ? '' : status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Priority
                            </label>
                            <select
                                value={filters.priority}
                                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                                {priorities.map((priority) => (
                                    <option key={priority} value={priority === 'All' ? '' : priority}>
                                        {priority}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-end">
                            <Button
                                variant="secondary"
                                onClick={() => setFilters({ status: '', priority: '', category: '' })}
                                className="w-full"
                            >
                                Clear Filters
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Tasks */}
                {loading ? (
                    <Loader />
                ) : (
                    <div className="space-y-6">
                        {/* Pending Tasks */}
                        {groupedTasks.pending.length > 0 && (
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 mb-4">
                                    Pending Tasks ({groupedTasks.pending.length})
                                </h2>
                                <div className="space-y-4">
                                    {groupedTasks.pending.map((task, index) => (
                                        <motion.div
                                            key={task._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <TaskCard task={task} />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Completed Tasks */}
                        {groupedTasks.completed.length > 0 && (
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 mb-4">
                                    Completed Tasks ({groupedTasks.completed.length})
                                </h2>
                                <div className="space-y-4">
                                    {groupedTasks.completed.map((task, index) => (
                                        <motion.div
                                            key={task._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <TaskCard task={task} />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {filteredTasks.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">No tasks found</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <CreateTaskModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
            />
        </>
    );
};

export default TaskList;
