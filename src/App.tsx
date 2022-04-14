import React, { Fragment } from "react";
import { Route, Routes } from "react-router-dom";
import Footer from "./components/elements/Footer";
import Header from "./components/elements/Header";
import Home from "./pages/Home";

function App() {
  return (
    <Fragment>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
    </Fragment>
  );
}

export default App;
