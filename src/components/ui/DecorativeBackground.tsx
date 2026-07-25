'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Leaf, Sprout, Flower2 } from 'lucide-react';

const LEAVES = [
  { Icon: Leaf, top: '6%', left: '4%', size: 64, rotate: -18, duration: 7 },
  { Icon: Sprout, top: '18%', left: '88%', size: 56, rotate: 12, duration: 8.5 },
  { Icon: Flower2, top: '38%', left: '10%', size: 48, rotate: -8, duration: 6.5 },
  { Icon: Leaf, top: '55%', left: '92%', size: 70, rotate: 25, duration: 9 },
  { Icon: Sprout, top: '72%', left: '6%', size: 52, rotate: -15, duration: 7.5 },
  { Icon: Leaf, top: '88%', left: '80%', size: 60, rotate: 10, duration: 8 },
  { Icon: Flower2, top: '95%', left: '35%', size: 44, rotate: -20, duration: 6 },
] as const;

/**
 * Capa decorativa fija en toda la web: lavado verde claro + hojas verde
 * oscuro con movimiento sutil en loop. Puramente decorativa (pointer-events
 * disabled), opacidad baja para no competir con el fondo crema de marca.
 */
export default function DecorativeBackground() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-secondary/[0.06]">
      {LEAVES.map(({ Icon, top, left, size, rotate, duration }, i) =>
        reduceMotion ? (
          <Icon
            key={i}
            className="absolute text-primary/[0.09]"
            style={{ top, left, width: size, height: size, transform: `rotate(${rotate}deg)` }}
          />
        ) : (
          <motion.div
            key={i}
            className="absolute text-primary/[0.09]"
            style={{ top, left, width: size, height: size }}
            animate={{ rotate: [rotate - 6, rotate + 6, rotate - 6], y: [0, -10, 0] }}
            transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Icon className="h-full w-full" />
          </motion.div>
        )
      )}
    </div>
  );
}
