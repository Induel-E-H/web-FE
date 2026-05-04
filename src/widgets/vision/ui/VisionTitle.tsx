import { useScrollAnimation } from '@shared/lib/animation/useScrollAnimation';
import { SectionTitle } from '@shared/ui/SectionTitle';
import { motion } from 'framer-motion';

export function VisionTitle() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();

  return (
    <motion.div
      ref={ref}
      className='vision__title'
      initial={false}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <SectionTitle subTitle='CONCEPT' title='미래를 향한' variant='reverse' />
    </motion.div>
  );
}
