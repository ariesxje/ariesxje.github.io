import React, {useEffect, useRef} from 'react';
import {useSpring, animated, interpolate} from "react-spring";
import {easeOutQuart, easeOutCirc} from "../utils/ease-functions";

const currentFrame = (index:number):string => (
  `https://www.apple.com/105/media/us/airpods-pro/2019/1299e2f5_9206_4470_b28e_08307a42f19b/anim/sequence/large/01-hero-lightpass/${index.toString().padStart(4, '0')}.jpg`
)

const frameCount = 140;
const animateDuration = 450; //millisecond
const SCALE_MIN = 0.25;
const SCALE_MAX = 0.45;

const HeroCanvas = (props: any) => {
  const imageCacheRef = useRef<Array<any>>([]);
  const canvasRef = useRef<any>(null);
  const imgRef = useRef<any>(new Image());
  const timeRef = useRef<Date>(new Date());
  const currentFrameRef = useRef<number>(1);
  const startFrameRef = useRef<number>(1);
  const destinationFrameRef = useRef<number>(1);
  const animationIsOn = useRef<Boolean>(false);

  const [scrollTopProps, setScrollTop] = useSpring(() => ({scrollTop: document.documentElement.scrollTop}));
  const interpScale = scrollTopProps.scrollTop.interpolate(scrollTop => {
    const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
    const scale = scrollTop / maxScrollTop * (SCALE_MIN - SCALE_MAX) + SCALE_MAX;
    return `matrix(${scale},0,0,${scale},0,0)`});

  const animate = () => {
    const now: Date = new Date();
    const timeElapsed = +now - +timeRef.current;
    const timeProgress = timeElapsed/animateDuration;
    if (timeElapsed > animateDuration) {
      animationIsOn.current = false;
      return;
    }
    const currentFrameIndex = Math.floor(easeOutCirc(timeProgress) * (destinationFrameRef.current - startFrameRef.current) + startFrameRef.current);
    animationIsOn.current = true;
    currentFrameRef.current = currentFrameIndex;
    console.log(currentFrameIndex)
    updateImage(canvasRef.current, imageCacheRef.current[currentFrameIndex]);
    requestAnimationFrame(animate)
  }

  const updateImage = (canvas: any, image: any) => {
    var wrh = image.width / image.height;
    var newWidth = canvas.width;
    var newHeight = newWidth / wrh;
    if (newHeight > canvas.height) {
      newHeight = canvas.height;
      newWidth = newHeight * wrh;
    }
    var xOffset = newWidth < canvas.width ? ((canvas.width - newWidth) / 2) : 0;
    var yOffset = newHeight < canvas.height ? ((canvas.height - newHeight) / 2) : 0;
    canvas.getContext('2d').drawImage(image, xOffset, yOffset, newWidth, newHeight);
  }

  const handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop;
    setScrollTop({scrollTop});
    const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
    const scrollFraction = scrollTop / (maxScrollTop * 0.25);
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
      canvas.width = 1458;
      canvas.height = 820;
      const context = canvas.getContext('2d');
      imgRef.current.src = currentFrame(currentFrameRef.current);
      imgRef.current.onload=function(){
        updateImage(canvas, imgRef.current)
      }
      window.addEventListener('scroll', handleScroll)
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  return (
    <animated.canvas id="hero-lightpass" width={1458} height={820} ref={canvasRef} style={{width: 1458, height: 820, transform: interpScale}}/>
  );
}

export default HeroCanvas;
