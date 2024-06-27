import React, { createContext, useState, ReactNode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import CreateTodo from "./CreateTodo.tsx";
import ListTodos from "./ListTodos.tsx";
import Header from "./Header.tsx";


interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {}
});


const AuthContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
const [isAuthenticated, setIsAuthenticated] = useState(false); 

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: isAuthenticated,
        login:  ()=>setIsAuthenticated(true),
        logout: ()=>setIsAuthenticated(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <AuthContextProvider>
        <Header />
        <div className="p-20">
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/createtodo" element={<CreateTodo />} />
            <Route path="/listtodos" element={<ListTodos />} />
          </Routes>
        </div>
      </AuthContextProvider>
    </Router>
  </React.StrictMode>
);
