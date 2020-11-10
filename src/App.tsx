import React, {useEffect} from 'react';
import './App.css';
import HeroCanvas from "./Canvas/HeroCanvas";

function App() {
  const handleScroll = () => {
    const {scrollTop} = document.documentElement;
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  return (
    <HeroCanvas/>
  );
}

export default App;
