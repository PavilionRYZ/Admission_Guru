import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Lightbulb, BarChart3 } from 'lucide-react';
import AICounsellorChat from '../components/ai-counsellor/AICounsellorChat';
import AIRecommendations from '../components/ai-counsellor/AIRecommendations';
import ProfileAnalysis from '../components/ai-counsellor/ProfileAnalysis';

const AICounsellorPage = () => {
    const [activeTab, setActiveTab] = useState('chat');

    const tabs = [
        { id: 'chat', label: 'AI Chat', icon: MessageSquare },
        { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
        { id: 'analysis', label: 'Profile Analysis', icon: BarChart3 },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Tabs */}
            <div className="mb-6">
                <div className="flex flex-wrap gap-3">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${activeTab === tab.id
                                        ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                    }`}
                            >
                                <Icon size={20} />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Tab Content */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {activeTab === 'chat' && <AICounsellorChat />}
                {activeTab === 'recommendations' && <AIRecommendations />}
                {activeTab === 'analysis' && <ProfileAnalysis />}
            </motion.div>
        </div>
    );
};

export default AICounsellorPage;
