import { motion } from 'framer-motion';

interface FooterProps {
  compact?: boolean;
}

export default function Footer({ compact = false }: FooterProps) {
  return (
    <motion.footer
      className={`text-center ${compact ? 'py-4' : 'py-8'} px-4`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      <div className="border-t border-stone-500/30 pt-4 max-w-md mx-auto">
        <p className="font-cinzel text-stone-700 text-xs tracking-wider leading-relaxed">
          <span className="font-semibold">DANMAN</span>
          <span className="mx-2">-</span>
          <span className="text-stone-600">
            DATA And NUMBERS METRICS And NETWORKS
          </span>
        </p>
        <p className="font-crimson text-stone-600 text-xs mt-1 italic">
          Carrier Enterprise Tech Team Pilot Project
        </p>
      </div>
    </motion.footer>
  );
}
