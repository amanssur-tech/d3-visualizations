import { motion } from 'framer-motion';

const Footer = () => (
  <motion.footer
    className="border-t border-white/60 bg-white/60 px-4 py-6 text-center text-sm text-slate-500 backdrop-blur dark:border-white/5 dark:bg-neutral-950/70 dark:text-slate-400"
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: 'easeOut', delay: 0.25 }}
  >
    <p>
      Built with React, D3, and ☕️ by Amanullah Manssur.
    </p>
  </motion.footer>
);

export default Footer;
