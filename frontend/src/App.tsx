import { Button, TextField, Typography } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { getCookie} from "./utils/cookies";
import checkUser from "./utils/checkUser";

const App = () => {
  const [registered, setRegistered] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  let content = null;

  const registerUser = async (name: string) => {
    if (name) {
      const req = await fetch("http://localhost:3000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: name }),
      });
      const res = await req.json();

      if (res.username) {
        document.cookie = `user=${res}`
        setLoggedIn(true);
      }
    }
  };

  const logInUser = async (name: string) => {
    if (name) {
      const req = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: name }),
      });
      const res = await req.json();
      
      if (res && res.username) {
        document.cookie = `user=${JSON.stringify(res)}`
        setLoggedIn(true);
      }else if(res && res.error){
        alert(res.error)
      }
    }
  };

  useEffect(() => {
    const validateUser = async () => {
      const userCookie = getCookie("user");
      if (userCookie) {
        const validUser = await checkUser(userCookie.id);
        if (validUser.id) {
          return setLoggedIn(true);
        } else {
          return setLoggedIn(false);
        }
      } else {
        return setLoggedIn(false);
      }
    };
    validateUser();
  }, [loggedIn]);

  if (loggedIn) {
    content = (
      <div className="flex flex-col shadow-lg bg-slate-400 w-full p-5 justify-center items-center gap-5">
        <Typography variant="h2">Start creating todos!</Typography>
      </div>
    );
  } else {
    if (!registered) {
      content = (
        <div className="flex flex-col shadow-lg bg-slate-400 w-full p-5 justify-center items-center gap-5">
          <Typography variant="h2">Register User</Typography>
          <TextField
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setUsername(e.target.value);
              console.log(username);
            }}
            variant="standard"
            label="Username"
          />
          <Button onClick={() => registerUser(username)} variant="contained">
            Register
          </Button>
          <Button onClick={() => setRegistered(true)}>
            You have an account?
          </Button>
        </div>
      );
    } else {
      content = (
        <div className="flex flex-col shadow-lg bg-slate-400 w-full p-5 justify-center items-center gap-5">
          <Typography variant="h2">Login</Typography>
          <TextField
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setUsername(e.target.value);
              console.log(username);
            }}
            variant="standard"
            label="Username"
          ></TextField>
          <Button onClick={() => logInUser(username)} variant="contained">
            LogIn
          </Button>
          <Button onClick={() => setRegistered(false)}>
            You haven't account?
          </Button>
        </div>
      );
    }
  }

  return <>{content}</>;
};

export default App;
