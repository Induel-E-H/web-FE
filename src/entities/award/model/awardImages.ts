import img0 from '../assets/0.webp';
import img1 from '../assets/1.webp';
import img2 from '../assets/2.webp';
import img3 from '../assets/3.webp';
import img4 from '../assets/4.webp';
import img5 from '../assets/5.webp';
import img6 from '../assets/6.webp';
import img7 from '../assets/7.webp';
import img8 from '../assets/8.webp';
import img9 from '../assets/9.webp';

const AWARD_IMAGES = [
  img0,
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
];

export function getAwardImage(id: number): string {
  const image = AWARD_IMAGES[id];
  if (!image) {
    console.warn(`[award] image not found for id: ${id}`);
    return '';
  }
  return image;
}
