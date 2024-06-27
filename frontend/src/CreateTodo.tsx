import {
  TextField,
  Input,
  Button,
  Card,
  Select,
  MenuItem,
  Typography
} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import Grid from "@mui/material/Grid";
import { ChangeEvent, useState, useEffect, useContext } from "react";
import type { Todo } from "./interface/todo";
import { getCookie } from "./utils/cookies";
import { AuthContext } from "./main";
import { validateUser } from "./utils/validateUser";
import { handleChangeStatus, handleDelete } from "./handlers/handleTodos";

const CreateTodo = () => {
  const {login, logout } = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<Todo>({
    title: "",
    description: "",
    hours: "",
    deadline: "",
  });

  useEffect(()=>{
    validateUser(login, logout);
  },[])

  useEffect(() => {
    getTodos();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTodo((prevTodo) => ({
      ...prevTodo,
      [name]: value,
    }));
  };

  const getTodos = async () => {
    const req = await fetch("http://localhost:3000/todos/get-todo");
    const res = await req.json();
    setTodos(res);
  };

  const handleSave = async () => {
    const user = getCookie("user");
    if (user && user.token) {
      const req = await fetch(
        `http://localhost:3000/todos/create-todo/${user.token}/${user.username}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTodo),
        }
      );
      const res = await req.json();

      if (res) {
        setNewTodo({
          title: "",
          description: "",
          hours: "",
          deadline: "",
        });
        getTodos();
      }
    }
  };

  return (
    <>
      <div className="flex flex-col w-full justify-left items-center">
        <div className="w-full h-full flex flex-col justify-center items-center">
          <Card className="w-96 p-5 mb-5 flex flex-col gap-5">
            <Typography variant="h4">Create new todo</Typography>
            <TextField
              name="title"
              value={newTodo.title}
              onChange={handleInputChange}
              label="Todo Title"
              variant="standard"
            />
            <TextField
              name="description"
              value={newTodo.description}
              multiline={true}
              rows={4}
              onChange={handleInputChange}
              label="Todo Description"
              variant="standard"
            />
            <Input
              name="hours"
              value={newTodo.hours}
              onChange={handleInputChange}
              type="number"
              placeholder="Expected number of hours"
            />
            <Input
              name="deadline"
              value={newTodo.deadline}
              onChange={handleInputChange}
              type="date"
              placeholder="Deadline"
            />
          </Card>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </div>
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
                      onChange={(e) => handleChangeStatus(to.id as string, e.target.value as 'pending' | 'done' | 'deferred', getTodos )}
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
                    {to.status === 'pending' ? <PendingIcon className="text-blue-500"/> : to.status === 'done' ? <CheckCircleIcon className="text-green-500"/> : <AccessTimeFilledIcon className="text-red-400"/> }
                  </Grid>
                </Grid>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default CreateTodo;
