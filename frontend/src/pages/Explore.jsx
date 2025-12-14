import { useEffect, useState } from "react";

export default function Explore() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/discovery/photos?page=1&per_page=12&order_by=popular")
      .then((res) => res.json())
      .then((data) => {
        setPhotos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching photos:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p style={{ padding: "2rem" }}>Cargando imágenes...</p>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Explorar</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "16px",
        }}
      >
        {photos.map((photo) => (
          <div key={photo.id}>
            <img
              src={photo.url}
              alt={photo.description || "Imagen"}
              style={{ width: "100%", borderRadius: "12px" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

