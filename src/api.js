import axios from "axios";

const api = axios.create({
  baseURL: "https://my-personal-assistant-ppsy.onrender.com",
});

export default api;