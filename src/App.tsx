import React, {useRef, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';

const currentFrame = (index:number):string => (
  `https://www.apple.com/105/media/us/airpods-pro/2019/1299e2f5_9206_4470_b28e_08307a42f19b/anim/sequence/large/01-hero-lightpass/${index.toString().padStart(4, '0')}.jpg`
)

const html = document.documentElement;
const frameCount = 147;
const animateDuration = 100; //millisecond

function App() {
  const canvasRef = useRef<any>(null);
  const imgRef = useRef<any>(new Image());
  const timeRef = useRef<Date>(new Date());
  const currentFrameRef = useRef<number>(1);
  const destinationFrameRef = useRef<number>(1);

  const animate = (context:any) => {
    const now: Date = new Date();
    const timeElapsed = +now - +timeRef.current;
    if (timeElapsed > animateDuration) {
      return;
    }
    const currentFrame = Math.floor(timeElapsed / animateDuration * (destinationFrameRef.current - currentFrameRef.current) + currentFrameRef.current);
    updateImage(context, currentFrame);
    requestAnimationFrame(() => animate(context))
  }

  const updateImage = (context: any, index: number) => {
    currentFrameRef.current = index;
    imgRef.current.src = currentFrame(index);
    context.drawImage(imgRef.current, 0, 0);
  }

  const interpolate = (to:number) => {

  }

  useEffect(() => {
    //preload images
    //TODO: there must be a better way
    for(let i = 0; i <= frameCount; i++) {
      const preloadImg = new Image();
      preloadImg.src = currentFrame(i);
    }
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 1158;
      canvas.height = 770;
      const context = canvas.getContext('2d');
      imgRef.current.src = currentFrame(currentFrameRef.current);
      imgRef.current.onload=function(){
        context.drawImage(imgRef.current, 0, 0);
      }
      window.addEventListener('scroll', () => {
        const scrollTop = html.scrollTop;
        const maxScrollTop = (html.scrollHeight - window.innerHeight) / 4;
        const scrollFraction = scrollTop / maxScrollTop;
        const frameIndex = Math.max(1,
          Math.min(
            frameCount - 1,
            Math.floor(scrollFraction * frameCount)
        ));
        timeRef.current = new Date();
        destinationFrameRef.current = frameIndex;
        requestAnimationFrame(() => animate(context));
      })
    }
  }, [])
  return (
    <canvas id="hero-lightpass" ref={canvasRef} />
  );
}

export default App;
