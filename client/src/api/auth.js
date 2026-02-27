import client from "./client";

export async function registerApi({ email, password, name }) {
  const res = await client.post("/auth/register", { email, password, name });
  return res.data; // { token, user }
}

export async function loginApi({ email, password }) {
  const res = await client.post("/auth/login", { email, password });
  return res.data; // { token, user }
}