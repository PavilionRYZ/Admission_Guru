import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, CheckCircle, AlertCircle } from 'lucide-react';
import { dashboardApi } from '../../api/dashboardApi';
import { useState } from 'react';
import Card from '../common/Card';
import StageProgress from './StageProgress';
import NextSteps from './NextSteps';
import RecentTasks from './RecentTasks';
import ShortlistSummary from './ShortlistSummary';

const DashboardOverview = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await dashboardApi.getDashboard();
        setDashboardData(response.data.data);
      } catch (error) {
        console.error('Failed to fetch dashboard', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const stats = [
    {
      icon: BookOpen,
      label: 'Shortlisted',
      value: dashboardData?.shortlists?.total || 0,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
    },
    {
      icon: GraduationCap,
      label: 'Locked Universities',
      value: dashboardData?.locks?.total || 0,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100',
    },
    {
      icon: CheckCircle,
      label: 'Tasks Completed',
      value: dashboardData?.tasks?.completed || 0,
      color: 'text-green-500',
      bgColor: 'bg-green-100',
    },
    {
      icon: AlertCircle,
      label: 'Pending Tasks',
      value: dashboardData?.tasks?.pending || 0,
      color: 'text-orange-500',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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
      <StageProgress progress={dashboardData?.progress} />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NextSteps />
        <ShortlistSummary shortlists={dashboardData?.shortlists} />
      </div>

      {/* Recent Tasks */}
      <RecentTasks tasks={dashboardData?.tasks?.recent || []} />
    </div>
  );
};

export default DashboardOverview;
