import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Converter from "./components/Converter/Converter";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Converter />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
