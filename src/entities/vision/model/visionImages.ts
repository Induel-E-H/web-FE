import visionInvest from '../assets/vision_invest.webp';
import visionInvest480 from '../assets/vision_invest@480.webp';
import visionInvest768 from '../assets/vision_invest@768.webp';
import visionInvest1200 from '../assets/vision_invest@1200.webp';
import visionParam from '../assets/vision_param.webp';
import visionParam480 from '../assets/vision_param@480.webp';
import visionParam768 from '../assets/vision_param@768.webp';
import visionParam1200 from '../assets/vision_param@1200.webp';
import visionSculpt from '../assets/vision_sculpt.webp';
import visionSculpt480 from '../assets/vision_sculpt@480.webp';
import visionSculpt768 from '../assets/vision_sculpt@768.webp';
import visionSculpt1200 from '../assets/vision_sculpt@1200.webp';

export const VISION_IMAGE_MAP: Record<string, string> = {
  'vision_param.webp': visionParam,
  'vision_sculpt.webp': visionSculpt,
  'vision_invest.webp': visionInvest,
};

export const VISION_SRCSET_MAP: Record<string, string> = {
  'vision_param.webp': `${visionParam480} 480w, ${visionParam768} 768w, ${visionParam1200} 1200w`,
  'vision_sculpt.webp': `${visionSculpt480} 480w, ${visionSculpt768} 768w, ${visionSculpt1200} 1200w`,
  'vision_invest.webp': `${visionInvest480} 480w, ${visionInvest768} 768w, ${visionInvest1200} 1200w`,
};
