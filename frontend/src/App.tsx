import { useContext, useEffect, useState, ChangeEvent } from "react";
import { Button, TextField, Typography } from "@mui/material";
import { AuthContext } from "./main";
import { validateUser } from "./utils/validateUser";

const App = () => {
  const [registered, setRegistered] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const { isAuthenticated, login, logout } = useContext(AuthContext);

  useEffect(() => {
  validateUser(login, logout)
  }, []);

  const registerUser = async () => {
    if (username) {
      const req = await fetch("http://localhost:3000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email }),
      });
      const res = await req.json();

      if (res.username) {
        document.cookie = `user=${JSON.stringify(res)}`;
        login();
      }
    }
  };

  const logInUser = async () => {
    const req = await fetch("http://localhost:3000/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password, email }),
    });
    const res = await req.json();

    if (res && res.username) {
      document.cookie = `user=${JSON.stringify(res)}`;
      login();
    } else if (res && res.error) {
      alert(res.error);
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
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setUsername(e.target.value)
            }
            variant="standard"
            label="Username"
            autoComplete="new-password"
          />
          <TextField
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            variant="standard"
            label="Email"
            type="email"
            autoComplete="new-password"
          />
          <TextField
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            variant="standard"
            label="Password"
            type="password"
            autoComplete="new-password"
          />
          <Button onClick={() => registerUser()} variant="contained">
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
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            variant="standard"
            label="Email"
            type="email"
            autoComplete="new-password"
          />
          <TextField
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            variant="standard"
            label="Password"
            type="password"
           autoComplete="new-password"
          />
          <Button onClick={() => logInUser()} variant="contained">
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
