import { useState, useEffect } from "react";
import { apiPut } from "../../services/api";

/**
 * Modal component for editing an existing post.
 * Uses Bootstrap modal styling.
 */
export default function EditPostModal({ show, post, onClose, onPostUpdated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Populate form when post changes
  useEffect(() => {
    if (post) {
      setTitle(post.title || "");
      setDescription(post.description || "");
      setImageUrl(post.image_url || "");
    }
  }, [post]);

  const handleClose = () => {
    setError("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!title.trim()) {
      return setError("El título es requerido.");
    }
    if (!imageUrl.trim()) {
      return setError("La URL de la imagen es requerida.");
    }

    // Simple URL validation
    try {
      new URL(imageUrl);
    } catch {
      return setError("Por favor ingresa una URL válida.");
    }

    setLoading(true);

    try {
      const updatedPost = await apiPut(`/posts/${post.id}`, {
        title: title.trim(),
        description: description.trim() || null,
        image_url: imageUrl.trim(),
      });

      onPostUpdated(updatedPost);
      onClose();
    } catch (err) {
      console.error("Error updating post:", err);
      if (err.message.includes("403") || err.message.includes("permisos")) {
        setError("No tienes permisos para editar este post.");
      } else {
        setError(err.message || "Error al actualizar el post. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!show || !post) return null;

  return (
    <div className="modal-backdrop-custom" onClick={handleClose}>
      <div
        className="modal-content-custom"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header border-0 pb-0">
          <h5 className="modal-title fw-bold">Editar Post</h5>
          <button
            type="button"
            className="btn-close"
            onClick={handleClose}
            aria-label="Cerrar"
          />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="alert alert-danger py-2" role="alert">
                {error}
              </div>
            )}

            <div className="mb-3">
              <label htmlFor="edit-title" className="form-label">
                Título <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="edit-title"
                placeholder="Ej: Vibes de atardecer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="edit-description" className="form-label">
                Descripción
              </label>
              <textarea
                className="form-control"
                id="edit-description"
                placeholder="Describe tu imagen..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="edit-image" className="form-label">
                URL de la Imagen <span className="text-danger">*</span>
              </label>
              <input
                type="url"
                className="form-control"
                id="edit-image"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
              />
              {imageUrl && (
                <div className="mt-2">
                  <small className="text-muted">Vista previa:</small>
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="img-fluid rounded mt-1"
                    style={{ maxHeight: "150px" }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer border-0 pt-0">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  />
                  Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-backdrop-custom {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: 20px;
        }
        .modal-content-custom {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}

