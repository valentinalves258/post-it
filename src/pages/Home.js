import React, { useState } from "react";

function Home({ posts, editarPost, excluirPost }) {
  const [editId, setEditId] = useState(null);
  const [editConteudo, setEditConteudo] = useState("");
  const [search, setSearch] = useState("");

  const handleEditar = (post) => {
    setEditId(post.id);
    setEditConteudo(post.conteudo || "");
  };

  const handleSalvar = async (id) => {
    const postEditado = { ...posts.find(p => p.id === id), conteudo: editConteudo };
    await editarPost(id, postEditado);
    setEditId(null);
  };

  const handleRemoverInfo = async (id) => {
    const postAtualizado = { ...posts.find(p => p.id === id), infoLugar: null };
    await editarPost(id, postAtualizado);
  };

  const postsFiltrados = posts.filter(post =>
    post.titulo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto" }}>
      <h1 style={{ textAlign: "center" }}>📸 Feed de Viagens</h1>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="🔎 Pesquise pelo título..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "80%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc", backgroundColor: "#f9f9f9" }}
        />
      </div>

      {postsFiltrados.length === 0 && <p style={{ textAlign: "center" }}>Nenhuma publicação encontrada.</p>}

      {postsFiltrados.map(post => (
        <div key={post.id} style={{ backgroundColor: "#fdfdfd", padding: "20px", marginBottom: "20px", borderRadius: "12px", boxShadow: "2px 2px 6px rgba(0,0,0,0.1)" }}>
          <h2>{post.titulo}</h2>

          {editId === post.id ? (
            <>
              <textarea
                value={editConteudo}
                onChange={(e) => setEditConteudo(e.target.value)}
                style={{ width: "100%", minHeight: "80px", padding: "8px", marginBottom: "10px", borderRadius: "6px", border: "1px solid #ccc", backgroundColor: "#fdfdfd" }}
              />
              <button onClick={() => handleSalvar(post.id)} style={{ backgroundColor: "#4caf50", color: "#fff", border: "none", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", marginRight: "10px" }}>💾 Salvar</button>
              <button onClick={() => setEditId(null)} style={{ backgroundColor: "#f44336", color: "#fff", border: "none", padding: "6px 10px", borderRadius: "6px", cursor: "pointer" }}>❌ Cancelar</button>
            </>
          ) : (
            <>
              {post.conteudo && <p>{post.conteudo}</p>}
              {post.imagem && <img src={post.imagem} alt={post.titulo} style={{ width: "100%", maxHeight: "250px", objectFit: "cover", borderRadius: "10px", marginBottom: "10px" }} />}
              {post.infoLugar && (
                <div style={{ backgroundColor: "#e0f7fa", padding: "10px", borderRadius: "8px", marginBottom: "10px" }}>
                  <h4>{post.infoLugar.titulo}</h4>
                  {post.infoLugar.imagem && <img src={post.infoLugar.imagem} alt={post.infoLugar.titulo} style={{ width: "100%", maxHeight: "150px", objectFit: "cover", borderRadius: "8px", marginBottom: "5px" }} />}
                  <p>{post.infoLugar.descricao}</p>
                  <button onClick={() => handleRemoverInfo(post.id)} style={{ backgroundColor: "#f44336", color: "#fff", border: "none", padding: "6px 10px", borderRadius: "6px", cursor: "pointer" }}>🗑 Remover Info Wikipedia</button>
                </div>
              )}
              <small style={{ display: "block", marginTop: "10px", color: "#666" }}>Publicado em: {post.data}</small>
              <button onClick={() => handleEditar(post)} style={{ backgroundColor: "#007bff", color: "#fff", border: "none", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", marginRight: "10px" }}>✏️ Editar Conteúdo</button>
              <button onClick={() => excluirPost(post.id)} style={{ backgroundColor: "#f44336", color: "#fff", border: "none", padding: "8px 12px", borderRadius: "6px", cursor: "pointer" }}>🗑 Excluir</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default Home;
