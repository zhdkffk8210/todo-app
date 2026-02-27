import client from "./client";

export async function fetchTodosApi(params = {}) {
  const res = await client.get("/todos", { params }); // params: { date }
  return res.data; // array
}

export async function createTodoApi({ content, date }) {
  const res = await client.post("/todos", { content, date });
  return res.data; // created todo
}

export async function updateTodoApi(id, { content }) {
  const res = await client.patch(`/todos/${id}`, { content });
  return res.data; // updated todo
}

export async function toggleTodoApi(id) {
  const res = await client.patch(`/todos/${id}/toggle`);
  return res.data; // updated todo
}

export async function deleteTodoApi(id) {
  const res = await client.delete(`/todos/${id}`);
  return res.data; // { message }
}