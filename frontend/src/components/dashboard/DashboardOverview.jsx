import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, CheckCircle, AlertCircle } from 'lucide-react';
import { fetchDashboardStats } from '../../redux/slices/dashboardSlice';
import Card from '../common/Card';
import Loader from '../common/Loader';
import StageProgress from './StageProgress';
import NextSteps from './NextSteps';
import RecentTasks from './RecentTasks';
import ShortlistSummary from './ShortlistSummary';

const DashboardOverview = () => {
  const dispatch = useDispatch();
  const { stats, isLoading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (isLoading) {
    return <Loader fullScreen />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const statCards = [
    {
      icon: BookOpen,
      label: 'Shortlisted',
      value: stats?.shortlists?.total || 0,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
    },
    {
      icon: GraduationCap,
      label: 'Locked Universities',
      value: stats?.locks?.total || 0,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100',
    },
    {
      icon: CheckCircle,
      label: 'Tasks Completed',
      value: stats?.tasks?.completed || 0,
      color: 'text-green-500',
      bgColor: 'bg-green-100',
    },
    {
      icon: AlertCircle,
      label: 'Pending Tasks',
      value: stats?.tasks?.pending || 0,
      color: 'text-orange-500',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Stage Progress */}
      <StageProgress progress={stats?.progress} />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NextSteps />
        <ShortlistSummary shortlists={stats?.shortlists} />
      </div>

      {/* Recent Tasks */}
      <RecentTasks tasks={stats?.tasks?.recent || []} />
    </div>
  );
};

export default DashboardOverview;
