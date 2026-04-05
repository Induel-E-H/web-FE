import { useWaveBackground } from '../model/useWaveBackground';

function HeroBackground() {
  const canvasRef = useWaveBackground();

  return (
    <canvas ref={canvasRef} className='hero__background' aria-hidden='true' />
  );
}

export default HeroBackground;
