import { useContext, useEffect, useState, ChangeEvent } from "react";
import { Button, TextField, Typography } from "@mui/material";
import { AuthContext } from "./main"; 
import { getCookie } from "./utils/cookies";
import checkUser from "./utils/checkUser";

const App = () => {
  const [registered, setRegistered] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState('')
  const { isAuthenticated, login, logout } = useContext(AuthContext); 

  useEffect(() => {
    const validateUser = async () => {
      const userCookie = getCookie("user");
      if (userCookie) {
        const validUser = await checkUser(userCookie.token);
        if (validUser.id) {
          login(); 
        } else {
          logout();
        }
      } else {
        logout();
      }
    };
    validateUser();
  }, [login, logout]);

  const registerUser = async () => {
    if (username) {
      const req = await fetch("http://localhost:3000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: password, email: email }),
      });
      const res = await req.json();

      if (res.username) {
        document.cookie = `user=${JSON.stringify(res)}`;
        login(); 
      }
    }
  };

  const logInUser = async (email: string) => {
    if (email) {
      const req = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: password, email: email  }),
      });
      const res = await req.json();

      if (res && res.username) {
        document.cookie = `user=${JSON.stringify(res)}`;
        login();
      } else if (res && res.error) {
        alert(res.error);
      }
    }
  };

  let content = null;

  if (isAuthenticated) {
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
            onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
            variant="standard"
            label="Username"
          />
           <TextField
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            variant="standard"
            label="Email"
          />
           <TextField
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            variant="standard"
            label="Password"
          />
          <Button onClick={() => registerUser()} variant="contained">
            Register
          </Button>
          <Button onClick={() => setRegistered(true)}>You have an account?</Button>
        </div>
      );
    } else {
      content = (
        <div className="flex flex-col shadow-lg bg-slate-400 w-full p-5 justify-center items-center gap-5">
          <Typography variant="h2">Login</Typography>
           <TextField
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            variant="standard"
            label="Email"
          />
           <TextField
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            variant="standard"
            label="Password"
          />
          <Button onClick={() => logInUser(email)} variant="contained">
            LogIn
          </Button>
          <Button onClick={() => setRegistered(false)}>You haven't account?</Button>
        </div>
      );
    }
  }

  return <>{content}</>;
};

export default App;
