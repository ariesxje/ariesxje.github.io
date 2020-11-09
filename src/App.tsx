import React, {useRef, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';

const currentFrame = (index:number):string => (
  `https://www.apple.com/105/media/us/airpods-pro/2019/1299e2f5_9206_4470_b28e_08307a42f19b/anim/sequence/large/01-hero-lightpass/${index.toString().padStart(4, '0')}.jpg`
)

const html = document.documentElement;
const frameCount = 147;

function App() {
  const canvasRef = useRef<any>(null);
  const imgRef = useRef<any>(new Image());

  const updateImage = (context: any, index: number) => {
    imgRef.current.src = currentFrame(index);
    context.drawImage(imgRef.current, 0, 0);
  }

  for(let i = 0; i <= frameCount; i++) {
    const preloadImg = new Image();
    preloadImg.src = currentFrame(i);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 1158;
      canvas.height = 770;
      const context = canvas.getContext('2d');
      imgRef.current.src = currentFrame(1); // we'll make this dynamic in the next step, for now we'll just load image 1 of our sequence
      imgRef.current.onload=function(){
        context.drawImage(imgRef.current, 0, 0);
      }
      window.addEventListener('scroll', () => {
        const scrollTop = html.scrollTop;
        const maxScrollTop = (html.scrollHeight - window.innerHeight) / 4;
        const scrollFraction = scrollTop / maxScrollTop;
        const frameIndex = Math.min(
          frameCount - 1,
          Math.floor(scrollFraction * frameCount)
        );
        requestAnimationFrame(() => updateImage(context, frameIndex + 1))
      })
    }
  }, [])
  return (
    <canvas id="hero-lightpass" ref={canvasRef} />
  );
}

export default App;
