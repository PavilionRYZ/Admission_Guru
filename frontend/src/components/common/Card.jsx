import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = true, ...props }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' } : {}}
      className={`bg-white rounded-xl shadow-md p-6 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
