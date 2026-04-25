import {
  VISION_DATA,
  VISION_IMAGE_MAP,
  VISION_SRCSET_MAP,
} from '@entities/vision';

import '../styles/Vision.css';
import { VisionItem } from './VisionItem';
import { VisionTitle } from './VisionTitle';

export function Vision() {
  return (
    <section id='vision' className='vision' aria-label='미래 비전'>
      <VisionTitle />
      <div className='vision__main'>
        {VISION_DATA.map((item, index) => (
          <VisionItem
            key={item.keyword}
            title={item.title}
            description={item.description}
            keyword={item.keyword}
            image={VISION_IMAGE_MAP[item.image]}
            imageSrcSet={VISION_SRCSET_MAP[item.image]}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
