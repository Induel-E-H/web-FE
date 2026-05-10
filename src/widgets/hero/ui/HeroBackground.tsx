import fallbackBg from '../assets/background-fallback.webp';
import { useWaveBackground } from '../model/useWaveBackground';

function HeroBackground() {
  const { canvasRef, webglSupported } = useWaveBackground();

  if (!webglSupported) {
    return (
      <img
        src={fallbackBg}
        className='hero__background hero__background--fallback'
        aria-hidden='true'
        alt=''
      />
    );
  }

  return (
    <canvas ref={canvasRef} className='hero__background' aria-hidden='true' />
  );
}

export default HeroBackground;
