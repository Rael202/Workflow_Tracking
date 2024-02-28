import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import IssuesPage from "./pages/IssuesPage";
import MembersPage from "./pages/MembersPage";


const App = function AppWrapper() {
  

  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<IssuesPage/>} />
          <Route path="/members" element={<MembersPage />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
