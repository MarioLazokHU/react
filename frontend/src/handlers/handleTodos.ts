export const handleChangeStatus = async (
  id: string,
  status: "pending" | "done" | "deferred",
  getTodos: () => void
) => {
  const req = await fetch("http://localhost:3000/todos/change-todo-status", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, status }),
  });
  const res = await req.json();

  if (res.success) {
    getTodos();
  }
};

export const handleDelete = async (id: string, getTodos: () => void) => {
  const req = await fetch("http://localhost:3000/todos/delete-todo", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: id }),
  });
  const res = await req.json();

  if (res.success) {
    getTodos();
  }
};
