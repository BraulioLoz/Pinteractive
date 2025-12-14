import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

export default function Explore() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const hasQuery = search.trim().length > 0;

    const endpoint = hasQuery
      ? `/discovery/search?query=${encodeURIComponent(search)}&page=${page}&per_page=12`
      : `/discovery/photos?page=${page}&per_page=12&order_by=popular`;

    apiFetch(endpoint)
      .then((data) => {
        if (!isMounted) return;
        const list = Array.isArray(data) ? data : data?.results ?? [];
        setPhotos((prev) => (page === 1 ? list : [...prev, ...list]));
        setLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setPhotos([]);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [search, page]);

  return (
  <div style={{ padding: "2rem", paddingTop: "140px" }}>
    {/* Barra fija */}
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: "white",
        borderBottom: "1px solid #eee",
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
      }}
    >
      <h1
        style={{
          margin: 0,
          fontWeight: 700,
          fontSize: "1.6rem",
          color: "#7a9b3a",
          letterSpacing: "-0.5px",
        }}
      >
        Pinteractive
      </h1>

      <div style={{ flex: 1, maxWidth: "520px" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Busca un mood: "chill", "sad", "party"...'
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: "10px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      <button
        onClick={() => {
          setPage(1);
          setSearch(query);
        }}
        style={{
          padding: "10px 14px",
          borderRadius: "10px",
          border: "none",
          background: "#7a9b3a",
          color: "white",
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        Buscar
      </button>
    </div>

    {/* Contenido */}
    {photos.length === 0 && loading ? (
      <div style={{ height: "40vh" }} />
    ) : photos.length === 0 ? (
      <p>No hubo resultados.</p>
    ) : (
      <div
        style={{
          background: "#fafafa",
          minHeight: "100vh",
          padding: "24px 0",
        }}
      >
        <div className="container" style={{ maxWidth: "1200px" }}>
          <div className="masonry">
            {photos.map((photo) => (
              <div key={photo.id} className="masonry-item">
                <img
                  src={photo.url}
                  alt={photo.description || "Imagen"}
                  loading="lazy"
                  className="img-fluid rounded shadow-sm"
                  style={{ display: "block" }}
                />
              </div>
            ))}
          </div>

          {/* Botón de cargar más */}
          <div className="d-flex justify-content-center my-4">
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={loading}
              className="btn btn-outline-secondary"
            >
              {loading ? "Cargando..." : "Cargar más"}
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
}