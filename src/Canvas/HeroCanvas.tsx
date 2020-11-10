import React, {useEffect, useRef} from 'react';
import {easeOutQuart} from "../utils/ease-functions";

const currentFrame = (index:number):string => (
  `https://www.apple.com/105/media/us/airpods-pro/2019/1299e2f5_9206_4470_b28e_08307a42f19b/anim/sequence/large/01-hero-lightpass/${index.toString().padStart(4, '0')}.jpg`
)

const frameCount = 147;
const animateDuration = 450; //millisecond

const HeroCanvas = () => {
  const imageCacheRef = useRef<Array<any>>([]);
  const canvasRef = useRef<any>(null);
  const imgRef = useRef<any>(new Image());
  const timeRef = useRef<Date>(new Date());
  const currentFrameRef = useRef<number>(1);
  const startFrameRef = useRef<number>(1);
  const destinationFrameRef = useRef<number>(1);
  const animationIsOn = useRef<Boolean>(false);

  const animate = () => {
    const now: Date = new Date();
    const timeElapsed = +now - +timeRef.current;
    const timeProgress = timeElapsed/animateDuration;
    if (timeElapsed > animateDuration) {
      animationIsOn.current = false;
      return;
    }
    const currentFrame = Math.floor(easeOutQuart(timeProgress) * (destinationFrameRef.current - startFrameRef.current) + startFrameRef.current);
    animationIsOn.current = true;
    const context = canvasRef.current.getContext('2d');
    updateImage(context, currentFrame);
    requestAnimationFrame(animate)
  }

  const updateImage = (context: any, index: number) => {
    currentFrameRef.current = index;
    context.drawImage(imageCacheRef.current[index], 0, 0);
  }

  const handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop;
    const maxScrollTop = (document.documentElement.scrollHeight - window.innerHeight) / 4;
    const scrollFraction = scrollTop / maxScrollTop;
    const frameIndex = Math.max(1,
      Math.min(
        frameCount - 1,
        Math.floor(scrollFraction * frameCount)
      ));
    destinationFrameRef.current = frameIndex;
    if (!animationIsOn.current) {
      timeRef.current = new Date();
      startFrameRef.current = currentFrameRef.current;
      requestAnimationFrame(animate);
    }
  }

  useEffect(() => {
    //preload images
    //TODO: there must be a better way
    for(let i = 0; i <= frameCount; i++) {
      const preloadImg = new Image();
      preloadImg.src = currentFrame(i);
      imageCacheRef.current[i] = preloadImg;
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
      window.addEventListener('scroll', handleScroll)
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  return (
    <canvas id="hero-lightpass" ref={canvasRef} />
  );
}

export default HeroCanvas;