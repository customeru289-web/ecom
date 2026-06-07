import { motion } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="p-2.5 rounded-full glass hover:bg-white/90 dark:hover:bg-zinc-800/90 transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? <FiSun className="w-5 h-5 text-gold-400" /> : <FiMoon className="w-5 h-5 text-gold-600" />}
    </motion.button>
  );
};

export default ThemeToggle;
