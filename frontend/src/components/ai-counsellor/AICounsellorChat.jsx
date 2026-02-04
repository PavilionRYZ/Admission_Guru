import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, Sparkles, Trash2 } from 'lucide-react';
import {
    sendMessage,
    fetchConversation,
    clearConversation,
} from '../../redux/slices/aiSlice';
import Button from '../common/Button';
import Card from '../common/Card';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const AICounsellorChat = () => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const dispatch = useDispatch();
    const { messages, isLoading } = useSelector((state) => state.ai);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        dispatch(fetchConversation());
    }, [dispatch]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const message = input;
        setInput('');

        try {
            await dispatch(sendMessage(message)).unwrap();
        } catch (error) {
            toast.error(error || 'Failed to send message');
        }
    };

    const handleClearConversation = async () => {
        if (window.confirm('Are you sure you want to clear the conversation?')) {
            try {
                await dispatch(clearConversation()).unwrap();
                toast.success('Conversation cleared');
            } catch (error) {
                toast.error(error || 'Failed to clear conversation');
            }
        }
    };

    const handleQuickPrompt = (prompt) => {
        setInput(prompt);
    };

    const quickPrompts = [
        'Recommend universities for me',
        'Analyze my profile strength',
        'What are my next steps?',
        'Help me with SOP writing',
    ];

    return (
        <div className="h-[calc(100vh-200px)] flex flex-col">
            {/* Header */}
            <Card className="mb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">AI Counsellor</h2>
                            <p className="text-sm text-gray-600">
                                Your personal study abroad assistant
                            </p>
                        </div>
                    </div>
                    {messages.length > 0 && (
                        <Button
                            variant="outline"
                            onClick={handleClearConversation}
                            icon={Trash2}
                            className="text-sm"
                        >
                            Clear Chat
                        </Button>
                    )}
                </div>
            </Card>

            {/* Messages */}
            <Card className="flex-1 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 && !isLoading && (
                        <div className="text-center py-12">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4"
                            >
                                <Sparkles className="w-8 h-8 text-white" />
                            </motion.div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                Welcome to AI Counsellor!
                            </h3>
                            <p className="text-gray-600 mb-6">
                                I'm here to help you with your study abroad journey. Ask me anything!
                            </p>

                            {/* Quick Prompts */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                                {quickPrompts.map((prompt, idx) => (
                                    <motion.button
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        onClick={() => handleQuickPrompt(prompt)}
                                        className="p-4 bg-gray-50 rounded-lg text-left hover:bg-gray-100 transition-colors border border-gray-200"
                                    >
                                        <p className="text-sm text-gray-700">{prompt}</p>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    )}

                    <AnimatePresence>
                        {messages.map((message, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className={`flex items-start space-x-3 ${message.role === 'user'
                                        ? 'flex-row-reverse space-x-reverse'
                                        : ''
                                    }`}
                            >
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === 'user'
                                            ? 'bg-primary-500'
                                            : 'bg-gradient-to-r from-primary-500 to-secondary-500'
                                        }`}
                                >
                                    {message.role === 'user' ? (
                                        <User className="w-5 h-5 text-white" />
                                    ) : (
                                        <Bot className="w-5 h-5 text-white" />
                                    )}
                                </div>

                                <div
                                    className={`flex-1 max-w-3xl ${message.role === 'user' ? 'text-right' : ''
                                        }`}
                                >
                                    <div
                                        className={`inline-block p-4 rounded-2xl ${message.role === 'user'
                                                ? 'bg-primary-500 text-white'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}
                                    >
                                        <p className="whitespace-pre-wrap">{message.content}</p>
                                    </div>
                                    {message.timestamp && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            {format(new Date(message.timestamp), 'hh:mm a')}
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-start space-x-3"
                        >
                            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div className="bg-gray-100 p-4 rounded-2xl">
                                <div className="flex items-center space-x-2">
                                    <Loader2 className="w-5 h-5 text-gray-600 animate-spin" />
                                    <span className="text-sm text-gray-600">Thinking...</span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t">
                    <form onSubmit={handleSubmit} className="flex space-x-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            disabled={isLoading}
                        />
                        <Button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            icon={Send}
                            className="px-6"
                        >
                            Send
                        </Button>
                    </form>
                </div>
            </Card>
        </div>
    );
};

export default AICounsellorChat;
