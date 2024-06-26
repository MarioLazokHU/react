import { useState, useEffect } from "react";
import { Todo } from "./interface/todo";
import { Card } from "@mui/material";
import Grid from "@mui/material/Grid";

const ListTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const getTodos = async () => {
      const req = await fetch("http://localhost:3000/todos/get-todo");
      const res = await req.json();
      setTodos(res);
    };

    getTodos();
  }, []);

  return (
    <>
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

      {todos.map((to, i) => (
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
              {/* Options */}
            </Grid>
          </Grid>
        </Card>
      ))}
    </>
  );
};

export default ListTodos;
