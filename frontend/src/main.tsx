import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import CreateTodo from "./CreateTodo.tsx";
import ListTodos from "./ListTodos.tsx";
import Header from "./Header.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router >
      <Header />
      <div className="p-20">
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/createtodo" element={<CreateTodo />} />
          <Route path="/listtodos" element={<ListTodos />} />
        </Routes>
      </div>
    </Router>
  </React.StrictMode>
);
