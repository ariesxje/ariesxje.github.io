import React, {useEffect, useRef} from 'react';
import {useSpring, animated, interpolate} from "react-spring";
import {easeOutQuart, easeOutCirc} from "../utils/ease-functions";

const currentFrame = (index:number):string => (
  `https://www.apple.com/105/media/us/airpods-pro/2019/1299e2f5_9206_4470_b28e_08307a42f19b/anim/sequence/large/01-hero-lightpass/${index.toString().padStart(4, '0')}.jpg`
)

const frameCount = 140;
const SCALE_MIN = 0.25;
const SCALE_MAX = 0.45;

const HeroCanvas = (props: any) => {
  const imageCacheRef = useRef<Array<any>>([]);
  const canvasRef = useRef<any>(null);
  const imgRef = useRef<any>(new Image());
  const requestAnimationFrameRef = useRef<number>(0);

  const [scrollTopProps, setScrollTop] = useSpring(() => ({scrollTop: document.documentElement.scrollTop}));
  const interpScale = scrollTopProps.scrollTop.interpolate(scrollTop => {
    const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
    const scale = scrollTop / maxScrollTop * (SCALE_MIN - SCALE_MAX) + SCALE_MAX;
    // canvas animation start
    const scrollFraction = scrollTop / (maxScrollTop * 0.25);
    const frameIndex = Math.max(1,
      Math.min(
        frameCount - 1,
        Math.floor(scrollFraction * frameCount)
      ));
    if (!isNaN(frameIndex)) {
      requestAnimationFrameRef.current = requestAnimationFrame(() => {
        updateImage(canvasRef.current, imageCacheRef.current[frameIndex])
      })
    }
    // canvas animation end
    return `matrix(${scale},0,0,${scale},0,0)`});

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
      imgRef.current = imageCacheRef.current[0];
      imgRef.current.onload=function(){
        updateImage(canvas, imgRef.current)
      }
      window.addEventListener('scroll', handleScroll)
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.cancelAnimationFrame(requestAnimationFrameRef.current);
    }
  }, [])
  return (
    <animated.canvas id="hero-lightpass" width={1458} height={820} ref={canvasRef} style={{width: 1458, height: 820, transform: interpScale}}/>
  );
}

export default HeroCanvas;
