import { useState } from "react";
import { apiPost } from "../../services/api";

/**
 * Modal component for creating a new post.
 * Uses Bootstrap modal styling.
 */
export default function CreatePostModal({ show, onClose, onPostCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImageUrl("");
    setError("");
  };

  const handleClose = () => {
    resetForm();
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
      const newPost = await apiPost("/posts", {
        title: title.trim(),
        description: description.trim() || null,
        image_url: imageUrl.trim(),
      });

      resetForm();
      onPostCreated(newPost);
      onClose();
    } catch (err) {
      console.error("Error creating post:", err);
      setError(err.message || "Error al crear el post. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal-backdrop-custom" onClick={handleClose}>
      <div
        className="modal-content-custom"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header border-0 pb-0">
          <h5 className="modal-title fw-bold">Crear Nuevo Post</h5>
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
              <label htmlFor="post-title" className="form-label">
                Título <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="post-title"
                placeholder="Ej: Vibes de atardecer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="post-description" className="form-label">
                Descripción
              </label>
              <textarea
                className="form-control"
                id="post-description"
                placeholder="Describe tu imagen..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="post-image" className="form-label">
                URL de la Imagen <span className="text-danger">*</span>
              </label>
              <input
                type="url"
                className="form-control"
                id="post-image"
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
              className="btn btn-success"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  />
                  Creando...
                </>
              ) : (
                "Crear Post"
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
        .modal-content-custom .modal-header {
          padding: 0 0 16px 0;
          margin-bottom: 8px;
        }
        .modal-content-custom .modal-body {
          padding: 0;
        }
        .modal-content-custom .modal-footer {
          padding: 16px 0 0 0;
          margin-top: 8px;
        }
      `}</style>
    </div>
  );
}

