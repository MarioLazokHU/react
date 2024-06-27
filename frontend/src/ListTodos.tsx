import { useState, useEffect, useContext } from "react";
import { Todo } from "./interface/todo";
import { Button, Card, MenuItem, Select, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { validateUser } from "./utils/validateUser";
import { AuthContext } from "./main";
import { getCookie } from "./utils/cookies";
import { handleChangeStatus, handleDelete } from "./handlers/handleTodos";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";

const ListTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const { login, logout } = useContext(AuthContext);
  const user = getCookie("user");

  const getTodos = async () => {
    const req = await fetch(
      `http://localhost:3000/todos/get-todo/${user.token}`
    );
    const res = await req.json();
    setTodos(res);
  };

  useEffect(() => {
    getTodos();
  }, []);
  useEffect(() => {
    validateUser(login, logout);
  }, []);

  return (
    <>
    <Typography variant="h4">My Todos</Typography>
      <div className="w-full h-[600px]">
        <Card className="w-full p-4 flex mt-20">
          <Grid container>
            <Grid item xs>
              <div>Creator</div>
            </Grid>
            <Grid item xs>
              <div>Title</div>
            </Grid>
            <Grid item xs>
              <div>Description</div>
            </Grid>
            <Grid item xs>
              <div>Hours</div>
            </Grid>
            <Grid item xs>
              <div>Deadline</div>
            </Grid>
            <Grid item xs>
              <div>Status</div>
            </Grid>
            <Grid item xs>
              <div>Options</div>
            </Grid>
          </Grid>
        </Card>
        {todos.map((to, i) => {
          return (
            <Card
              key={i}
              className="w-full p-4 flex hover:bg-slate-300 items-center mt-2"
            >
              <Grid className="flex items-center" container>
                <Grid item xs>
                  <div>{to.creator}</div>
                </Grid>
                <Grid item xs>
                  <div>{to.title}</div>
                </Grid>
                <Grid item xs>
                  <div>{to.description}</div>
                </Grid>
                <Grid item xs>
                  <div>{to.hours}</div>
                </Grid>
                <Grid item xs>
                  <div>{to.deadline}</div>
                </Grid>
                <Grid item lg>
                  <Select
                    className="h-9"
                    value={to.status}
                    onChange={(e) =>
                      handleChangeStatus(
                        to.id as string,
                        e.target.value as "pending" | "done" | "deferred",
                        getTodos
                      )
                    }
                  >
                    <MenuItem value={"pending"}>Pending</MenuItem>
                    <MenuItem value={"done"}>Done</MenuItem>
                    <MenuItem value={"deferred"}>Deferred</MenuItem>
                  </Select>
                </Grid>

                <Grid className="flex items-center gap-5" item xs>
                  <Button
                    onClick={() => handleDelete(to.id as string, getTodos)}
                    variant="outlined"
                  >
                    Delete
                  </Button>
                  {to.status === "pending" ? (
                    <PendingIcon className="text-blue-500" />
                  ) : to.status === "done" ? (
                    <CheckCircleIcon className="text-green-500" />
                  ) : (
                    <AccessTimeFilledIcon className="text-red-400" />
                  )}
                </Grid>
              </Grid>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default ListTodos;
