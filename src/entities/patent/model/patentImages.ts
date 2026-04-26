import img0 from '../assets/0.webp';
import img1 from '../assets/1.webp';
import img2 from '../assets/2.webp';
import img3 from '../assets/3.webp';
import img4 from '../assets/4.webp';

const PATENT_IMAGES = [img0, img1, img2, img3, img4];

export function getPatentImage(id: number): string {
  const image = PATENT_IMAGES[id];
  if (!image) {
    console.warn(`[patent] image not found for id: ${id}`);
    return '';
  }
  return image;
}
