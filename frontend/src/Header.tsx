import { Link } from "react-router-dom";
import { getCookie, setCookie } from "./utils/cookies";
import checkUser from "./utils/checkUser";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";

const Header = () => {
  const [userValidated, setUserValidated] = useState(false);

  let content = null;

  useEffect(() => {
    const validateUser = async () => {
      const userCookie = getCookie("user");
      if (userCookie) {
        const validUser = await checkUser(userCookie.id);
        if (validUser.id) {
          return setUserValidated(true);
        } else {
          return setUserValidated(false);
        }
      } else {
        return setUserValidated(false);
      }
    };
    validateUser();
  }, [userValidated]);

  if (userValidated) {
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
            Todos
          </Link>
          <Button
            onClick={() => {
              setCookie("user");
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
