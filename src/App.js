import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import NovaPublicacao from "./pages/NovaPublicacao";

function App() {
  const [posts, setPosts] = useState([]);

  // Carregar posts do backend ao iniciar
  useEffect(() => {
    fetch("http://localhost:3001/posts")
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error("Erro ao carregar posts:", err));
  }, []);

  // Adicionar post
  const adicionarPost = async (novoPost) => {
    try {
      const resposta = await fetch("http://localhost:3001/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoPost),
      });
      const data = await resposta.json();
      setPosts([...posts, data]);
    } catch (erro) {
      console.error("Erro ao adicionar post:", erro);
    }
  };

  // Excluir post
  const excluirPost = async (id) => {
    try {
      await fetch(`http://localhost:3001/posts/${id}`, { method: "DELETE" });
      setPosts(posts.filter(p => p.id !== id));
    } catch (erro) {
      console.error("Erro ao excluir post:", erro);
    }
  };

  // Editar post
  const editarPost = async (id, postEditado) => {
    try {
      const resposta = await fetch(`http://localhost:3001/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postEditado),
      });
      const data = await resposta.json();
      setPosts(posts.map(p => (p.id === id ? data : p)));
    } catch (erro) {
      console.error("Erro ao editar post:", erro);
    }
  };

  return (
    <Router>
      <div style={{ fontFamily: "Poppins, sans-serif", backgroundColor: "#f2f2f2", minHeight: "100vh" }}>
        <header style={{ backgroundColor: "#ffeb3b", padding: "20px", boxShadow: "0px 2px 5px rgba(0,0,0,0.1)", textAlign: "center" }}>
          <h1 style={{ margin: 0, color: "#333", fontSize: "26px" }}>📒 Post-it Viagens</h1>
          <nav style={{ marginTop: "10px" }}>
            <Link to="/" style={{ textDecoration: "none", color: "#333", marginRight: "15px", fontWeight: "bold" }}>Início</Link>
            <Link to="/nova" style={{ textDecoration: "none", backgroundColor: "#007bff", color: "#fff", padding: "8px 14px", borderRadius: "8px", fontWeight: "bold" }}>+ Nova Publicação</Link>
          </nav>
        </header>

        <main style={{ padding: "30px", maxWidth: "800px", margin: "0 auto" }}>
          <Routes>
            <Route path="/" element={<Home posts={posts} excluirPost={excluirPost} editarPost={editarPost} />} />
            <Route path="/nova" element={<NovaPublicacao adicionarPost={adicionarPost} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
