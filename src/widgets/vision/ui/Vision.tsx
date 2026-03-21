import visionInvest from '@widgets/vision/assets/vision_invest.jpg';
import visionParam from '@widgets/vision/assets/vision_param.jpg';
import visionSculpt from '@widgets/vision/assets/vision_sculpt.jpg';
import '@widgets/vision/style/Vision.css';

import { VisionData } from '../model/VisionData';
import { useScrollFadeIn } from './ScrollFadeIn';
import { VisionItem } from './VisionItem';

const imageMap = {
  'vision_param.jpg': visionParam,
  'vision_sculpt.jpg': visionSculpt,
  'vision_invest.jpg': visionInvest,
};

export function Vision() {
  useScrollFadeIn();

  return (
    <>
      {VisionData.map((item) => (
        <section className='vision' key={item.id}>
          <VisionItem
            title={item.title}
            description={item.description}
            keyword={item.keyword}
            image={imageMap[item.image as keyof typeof imageMap]}
            reverse={item.id === 'sculpt'}
          />
        </section>
      ))}
    </>
  );
}
