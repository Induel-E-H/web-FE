import visionInvest from '@widgets/vision/assets/vision_invest.webp';
import visionParam from '@widgets/vision/assets/vision_param.webp';
import visionSculpt from '@widgets/vision/assets/vision_sculpt.webp';
import '@widgets/vision/style/Vision.css';

import { VISION_DATA } from '../model/VisionData';
import { useScrollFadeIn } from './ScrollFadeIn';
import { VisionItem } from './VisionItem';

const imageMap = {
  'vision_param.webp': visionParam,
  'vision_sculpt.webp': visionSculpt,
  'vision_invest.webp': visionInvest,
};

export function Vision() {
  useScrollFadeIn();

  return (
    <>
      {VISION_DATA.map((item, index) => (
        <section className='vision' key={item.title}>
          <VisionItem
            title={item.title}
            description={item.description}
            keyword={item.keyword}
            image={imageMap[item.image as keyof typeof imageMap]}
            reverse={index % 2 === 1}
          />
        </section>
      ))}
    </>
  );
}
