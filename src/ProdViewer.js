// src/ProdViewer.js
import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import "./ProdViewer.css";

const Image360 = ({ images, config, currentIndex }) => {
  const textures = useTexture(images); // load in images

  return (
    // Create a mesh with a plane geometry and a basic material
    <mesh>
      // add plane and set size todo: improve calculation to work with other
      image sizes
      <planeGeometry
        args={[textures[0].image.width / 100, textures[0].image.height / 100]}
      />
      <meshBasicMaterial map={textures[currentIndex]} /> // draw image to screen
    </mesh>
  );
};

const animationDuration = 4000; // time in milliseconds

const ProdViewer = ({ images }) => {
  // set initial state
  const [currentIndex, setCurrentIndex] = useState(0);

  // config object to manage play/pause and speed
  const [config, setConfig] = useState({
    play: true,
    totalImages: images.length,
    speed: animationDuration / images.length,
    isDragged: false,
  });

  const isDragging = useRef(false);
  const startX = useRef(0);

  // constrain number of pixels when moving mouse
  const pixelsPerImage = 300 / config.totalImages;

  // handle mouse events
  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.clientX;
    config.isDragged = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e) => {
    if (isDragging.current) {
      const dx = e.clientX - startX.current; // calculate change in x
      const imageIndexChange = Math.floor(dx / pixelsPerImage); // ensure animation can be achieved with limited movement
      const newIndex =
        (currentIndex + imageIndexChange + config.totalImages) %
        config.totalImages; // constrain index to be within bounds
      setCurrentIndex(newIndex);
      startX.current = e.clientX; // Update the startX to current position
    }
  };

  const togglePlay = () => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      play: !prevConfig.play,
    }));
  }; // create a function to toggle play/pause

  useEffect(() => {
    if (config.play && !config.isDragged) {
      const interval = setInterval(() => {
        setCurrentIndex((index) => (index + 1) % config.totalImages);
      }, config.speed);
      return () => clearInterval(interval);
    }
  }, [config.play, config.speed, config.totalImages]); // performs animation based on speed

  return (
    <div className="viewer-wrapper">
      <div
        className="viewer-container"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp} // Ensure dragging stops if cursor leaves the viewer
      >
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Image360
            images={images}
            config={config}
            currentIndex={currentIndex}
          />
        </Canvas>
      </div>
      <button className="pause-button" onClick={togglePlay}>
        {config.play ? "Pause" : "Play"}
      </button>{" "}
      // button to play/pause animation
    </div>
  );
};

export default ProdViewer;
