// src/App.js
import React from "react";
import ProdViewer from "./ProdViewer";
import "./App.css";
import banner from "./Banner.png";
import paymentComp from "./PaymentComp.png";

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
    <>
      <img src={banner} alt="Banner" style={{ width: "100%" }} />
      <div className="App">
        <div className="viewer-payment-container">
          <ProdViewer images={images} />
          <img src={paymentComp} alt="paymentComp" className="payment-image" />
        </div>
      </div>
    </>
  );
}

export default App;
