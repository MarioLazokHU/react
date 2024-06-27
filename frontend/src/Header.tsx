import { Link } from "react-router-dom";
import { setCookie } from "./utils/cookies";
import { AuthContext } from "./main"; 
import { Button } from "@mui/material";
import { useContext } from "react";

const Header = () => {
const { isAuthenticated, logout } = useContext(AuthContext); 
let content = null

  if (isAuthenticated) {
    content = (
      <header className="w-full h-24 flex justify-around items-center bg-slate-800 text-white">
        <Link to={"/"}>
          <h1 className="font-bold text-3xl">BBX TODO APP</h1>
        </Link>
        <div className="flex gap-5">
          <Link
            to={"/createtodo"}
            className="bg-slate-700 p-3 rounded shadow-md"
          >
            Create Todo
          </Link>
          <Link
            to={"/listtodos"}
            className="bg-slate-700 p-3 rounded shadow-md"
          >
            My Todos
          </Link>
          <Button
            onClick={() => {
              setCookie("user");
              logout()
              window.location.replace('/')
            }}
            className="bg-slate-700 p-3 rounded shadow-md"
          >
            Logout
          </Button>
        </div>
      </header>
    );
  } else {
    content = (
      <header className="w-full h-24 flex justify-around items-center bg-slate-800 text-white">
        <Link to={"/"}>
          <h1 className="font-bold text-3xl">BBX TODO APP</h1>
        </Link>
        <div className="flex gap-5"></div>
      </header>
    );
  }

  return <>{content}</>;
};

export default Header;
