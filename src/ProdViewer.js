import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import "./ProdViewer.css";

const Image360 = ({ images, currentIndex }) => {
  const textures = useTexture(images); // load in images

  return (
    // Create a mesh with a plane geometry and a basic material
    <mesh color="white">
      {/* Add plane and set size */}
      <planeGeometry
        color="white"
        args={[textures[0].image.width / 130, textures[0].image.height / 100]}
      />
      <meshBasicMaterial color="white" map={textures[currentIndex]} />{" "}
      {/* Draw image to screen */}
    </mesh>
  );
};

const animationDuration = 4000; // time in milliseconds

const ProdViewer = ({ images }) => {
  // Set initial state
  const [currentIndex, setCurrentIndex] = useState(0);

  // Config object to manage play/pause and speed
  const [config, setConfig] = useState({
    play: true,
    totalImages: images.length,
    speed: animationDuration / images.length,
    isDragged: false,
  });

  const isDragging = useRef(false);
  const startX = useRef(0);

  // Constrain number of pixels when moving mouse
  const pixelsPerImage = 300 / config.totalImages;

  // Handle mouse events
  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.clientX;
    setConfig((prevConfig) => ({
      ...prevConfig,
      isDragged: true,
    }));
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    setConfig((prevConfig) => ({
      ...prevConfig,
      isDragged: false,
    }));
  };

  const handleMouseMove = (e) => {
    if (isDragging.current) {
      const dx = e.clientX - startX.current; // Calculate change in x
      const imageIndexChange = Math.floor(dx / pixelsPerImage); // Ensure animation can be achieved with limited movement
      const newIndex =
        (currentIndex + imageIndexChange + config.totalImages) %
        config.totalImages; // Constrain index to be within bounds
      setCurrentIndex(newIndex);
      startX.current = e.clientX; // Update the startX to current position
    }
  };

  const togglePlay = () => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      play: !prevConfig.play,
    }));
  }; // Create a function to toggle play/pause

  useEffect(() => {
    if (config.play && !config.isDragged) {
      const interval = setInterval(() => {
        setCurrentIndex((index) => (index + 1) % config.totalImages);
      }, config.speed);
      return () => clearInterval(interval);
    }
  }, [config.play, config.speed, config.totalImages]); // Performs animation based on speed

  return (
    <div className="viewer-wrapper">
      <div
        className="viewer-container"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp} // Ensure dragging stops if cursor leaves the viewer
      >
        <Suspense fallback={<div>Loading...</div>}>
          <Canvas>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Image360 images={images} currentIndex={currentIndex} />
          </Canvas>
        </Suspense>
      </div>
      <button className="pause-button" onClick={togglePlay}>
        {config.play ? "Pause" : "Play"}
      </button>
    </div>
  );
};

export default ProdViewer;
