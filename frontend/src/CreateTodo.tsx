import { TextField, Typography, Input, Button, Card } from "@mui/material";
import Grid from "@mui/material/Grid";
import { ChangeEvent, useState, useEffect } from "react";
import type { Todo } from "./interface/todo";
import { getCookie } from "./utils/cookies";


const CreateTodo = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<Todo>({
    title: "",
    description: "",
    hours: "",
    deadline: "",
  });

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
    const req = await fetch(`http://localhost:3000/todos/create-todo/${getCookie('user').id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTodo),
    });
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
  };

  const handleDelete = async (id: string) => {
    const req = await fetch("http://localhost:3000/todos/delete-todo", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    });
    const res = await req.json()

    if(res.success){
      getTodos()
    }
  };

  useEffect(() => {
    getTodos();
  }, []);
  return (
    <>
      <div className="w-full h-full flex flex-col justify-center items-center">
        <Typography variant="h2" component="h2">
          Create a new todo
        </Typography>
        <div className="w-96 flex flex-col gap-5 mt-20 mb-16">
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
        </div>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
        <Card className="w-full p-4 flex mt-20">
          <Grid container>
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
              <Grid container>
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
                <Grid item xs>
                  <Button onClick={()=>handleDelete(to.id as string)} variant="outlined">Delete</Button>
                </Grid>
              </Grid>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default CreateTodo;
