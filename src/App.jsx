import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CharacterListing from "./components/CharacterListing";
import CharacterDetails from "./components/CharacterDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CharacterListing />} />
        <Route path="/details/:characterId" element={<CharacterDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
