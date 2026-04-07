import visionInvest from '@entities/vision/assets/vision_invest.webp';
import visionParam from '@entities/vision/assets/vision_param.webp';
import visionSculpt from '@entities/vision/assets/vision_sculpt.webp';
import { VISION_DATA } from '@entities/vision/model/visionData';
import '@widgets/vision/styles/Vision.css';

import { VisionItem } from './VisionItem';

const imageMap = {
  'vision_param.webp': visionParam,
  'vision_sculpt.webp': visionSculpt,
  'vision_invest.webp': visionInvest,
};

export function Vision() {
  return (
    <section className='vision'>
      <div className='vision__title'>
        <div className='vision__title__description'>
          <hr />
          <p>FUTURE VISION</p>
        </div>
        <h2>미래를 향한</h2>
        <h2>세 가지 방향</h2>
      </div>
      <div className='vision__main'>
        {VISION_DATA.map((item, index) => (
          <VisionItem
            key={item.keyword}
            title={item.title}
            description={item.description}
            keyword={item.keyword}
            image={imageMap[item.image as keyof typeof imageMap]}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
