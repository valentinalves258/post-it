import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function NovaPublicacao({ adicionarPost }) {
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [imagem, setImagem] = useState(null);
  const [infoLugar, setInfoLugar] = useState(null);

  const buscarInformacoes = async (tituloLugar) => {
    if (!tituloLugar) return;

    try {
      const resposta = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(tituloLugar)}`);
      const dados = await resposta.json();
      if (dados.title) {
        setInfoLugar({ titulo: dados.title, descricao: dados.extract, imagem: dados.thumbnail?.source || null });
      } else {
        setInfoLugar({ titulo: tituloLugar, descricao: "Nenhuma informação encontrada.", imagem: null });
      }
    } catch (erro) {
      console.error("Erro ao buscar informações:", erro);
      setInfoLugar({ titulo: tituloLugar, descricao: "Erro na consulta.", imagem: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo.trim()) { alert("Preencha o título antes de publicar!"); return; }

    const novoPost = { titulo, conteudo, imagem, infoLugar, data: new Date().toLocaleDateString("pt-BR") };
    await adicionarPost(novoPost);
    navigate("/");
  };

  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    if (file) setImagem(URL.createObjectURL(file));
  };

  return (
    <div style={{ backgroundColor: "#ffffffff", padding: "30px", borderRadius: "12px", boxShadow: "2px 2px 6px rgba(0,0,0,0.1)", maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>✍️ Nova Publicação</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
          <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Digite o título da publicação" style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #ccc", backgroundColor: "#f9f9f9" }} />
          <button type="button" onClick={() => buscarInformacoes(titulo)} style={{ backgroundColor: "#4caf50", color: "#fff", border: "none", padding: "10px 15px", borderRadius: "8px", cursor: "pointer" }}>🔎 Buscar Info</button>
        </div>

        {infoLugar && (
          <div style={{ marginBottom: "15px", padding: "10px", backgroundColor: "#e0f7fa", borderRadius: "8px" }}>
            <h4>{infoLugar.titulo}</h4>
            {infoLugar.imagem && <img src={infoLugar.imagem} alt={infoLugar.titulo} style={{ width: "100%", maxHeight: "200px", objectFit: "cover", borderRadius: "8px", marginBottom: "10px" }} />}
            <p>{infoLugar.descricao}</p>
          </div>
        )}

        <label style={{ fontWeight: "bold", display: "block", marginBottom: "6px" }}>Conteúdo:</label>
        <textarea value={conteudo} onChange={(e) => setConteudo(e.target.value)} style={{ width: "100%", minHeight: "120px", padding: "10px", borderRadius: "8px", border: "1px solid #ccc", backgroundColor: "#f9f9f9", marginBottom: "15px" }} placeholder="Compartilhe sua experiência de viagem (opcional)..." />

        <label style={{ fontWeight: "bold", display: "block", marginBottom: "6px" }}>Imagem (opcional):</label>
        <input type="file" accept="image/*" onChange={handleImagemChange} style={{ marginBottom: "15px" }} />
        {imagem && <div style={{ marginBottom: "15px", textAlign: "center" }}><img src={imagem} alt="Pré-visualização" style={{ maxWidth: "100%", borderRadius: "10px", boxShadow: "2px 2px 5px rgba(0,0,0,0.1)" }} /></div>}

        <button type="submit" style={{ backgroundColor: "#007bff", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", display: "block", margin: "0 auto" }}>📤 Publicar</button>
      </form>
    </div>
  );
}

export default NovaPublicacao;
