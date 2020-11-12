import React, {useEffect} from 'react';
import styled from 'styled-components';
import './App.css';
import HeroCanvas from "./Canvas/HeroCanvas";

const HERO_CANVAS_SCALE_MIN = 0.25;
const HERO_CANVAS_SCALE_MAX = 0.45;

const CanvasContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
`;

function App() {
  const handleScroll = () => {
    const {scrollTop} = document.documentElement;
    const maxScrollTop = (document.documentElement.scrollHeight - window.innerHeight)
    // console.log(scrollTop)
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  return (
    <div className="scroll-sequence">
      <div className="sequence-container">
        <div className="canvas-sequence">
          <CanvasContainer>
            <div style={{width: '1458px', height: 820, zIndex: 11,opacity: 1}}>
              <HeroCanvas/>
            </div>
          </CanvasContainer>
        </div>
      </div>
    </div>

  );
}

export default App;
