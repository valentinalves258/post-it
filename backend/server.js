const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const DATA_FILE = "data.json";

// ✅ Listar todos os posts
app.get("/posts", (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json(data.posts);
});

// ✅ Criar um novo post
app.post("/posts", (req, res) => {
  const novoPost = req.body;
  if (!novoPost.titulo) {
    return res.status(400).json({ error: "O título é obrigatório" });
  }

  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  novoPost.id = data.posts.length + 1;
  data.posts.push(novoPost);

  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.json(novoPost);
});

// ✅ Editar um post
app.put("/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  const index = data.posts.findIndex(p => p.id === id);

  if (index === -1) return res.status(404).json({ error: "Post não encontrado" });

  data.posts[index] = { id, ...req.body };
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.json(data.posts[index]);
});

// ✅ Deletar um post
app.delete("/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  data.posts = data.posts.filter(p => p.id !== id);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.json({ message: "Post deletado" });
});

// Iniciar o servidor
app.listen(PORT, () => console.log(`Backend rodando em http://localhost:${PORT}`));
