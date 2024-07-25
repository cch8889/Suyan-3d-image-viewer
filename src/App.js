// src/App.js
import React from "react";
import ProdViewer from "./ProdViewer";
import "./App.css";

function createImageArray(
  amount = 1,
  uri = "https://scaleflex.cloudimg.io/v7/demo/earbuds",
  fnameTemplate = "i.jpg"
) {
  const images = [];
  for (let i = 1; i <= amount; i++) {
    const fname = fnameTemplate.replace("i", i);
    images.push(`${uri}/${fname}`);
  }
  return images;
}

const images = createImageArray(
  233,
  "https://scaleflex.cloudimg.io/v7/demo/earbuds",
  "i.jpg"
);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to the 3D Product Viewer</h1>
        <ProdViewer images={images} />
      </header>
    </div>
  );
}

export default App;
