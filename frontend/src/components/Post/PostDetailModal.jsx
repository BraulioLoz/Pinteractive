import { useState } from "react";
import { apiDelete } from "../../services/api";
import { useUser } from "../../context/UserContext";

/**
 * Modal component for viewing post details.
 * Shows full post information with edit/delete options for owner.
 */
export default function PostDetailModal({
  show,
  post,
  onClose,
  onEdit,
  onDelete,
}) {
  const { user } = useUser();
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!show || !post) return null;

  const isOwner = user && post.owner === user.username;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await apiDelete(`/posts/${post.id}`);
      onDelete(post.id);
      onClose();
    } catch (err) {
      console.error("Error deleting post:", err);
      alert(err.message || "Error al eliminar el post.");
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="modal-backdrop-custom" onClick={onClose}>
      <div
        className="modal-content-detail"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="btn-close-detail"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ✕
        </button>

        <div className="detail-layout">
          {/* Image Section */}
          <div className="detail-image-section">
            <img
              src={post.image_url}
              alt={post.title}
              className="detail-image"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/600x400?text=Image+Not+Found";
              }}
            />
          </div>

          {/* Info Section */}
          <div className="detail-info-section">
            <div className="detail-header">
              <h2 className="detail-title">{post.title}</h2>

              {/* Owner Actions */}
              {isOwner && (
                <div className="detail-actions">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => {
                      onClose();
                      onEdit(post);
                    }}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => setShowConfirm(true)}
                    disabled={deleting}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              )}
            </div>

            {post.description && (
              <p className="detail-description">{post.description}</p>
            )}

            <div className="detail-meta">
              <div className="meta-item">
                <span className="meta-label">Publicado por</span>
                <span className="meta-value">@{post.owner}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Fecha</span>
                <span className="meta-value">
                  {new Date(post.created_at).toLocaleDateString("es-MX", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* Share Section */}
            <div className="share-section">
              <span className="share-label">Compartir:</span>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.origin + `/posts/${post.id}`);
                  alert("¡Enlace copiado!");
                }}
              >
                📋 Copiar enlace
              </button>
            </div>
          </div>
        </div>

        {/* Delete Confirmation */}
        {showConfirm && (
          <div className="confirm-overlay">
            <div className="confirm-box">
              <h6>¿Eliminar este post?</h6>
              <p className="text-muted small mb-3">
                Esta acción no se puede deshacer.
              </p>
              <div className="d-flex gap-2 justify-content-end">
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setShowConfirm(false)}
                  disabled={deleting}
                >
                  Cancelar
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .modal-backdrop-custom {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: 20px;
        }
        .modal-content-detail {
          position: relative;
          background: white;
          border-radius: 20px;
          width: 100%;
          max-width: 900px;
          max-height: 90vh;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        .btn-close-detail {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 36px;
          height: 36px;
          border: none;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          font-size: 18px;
          cursor: pointer;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s ease;
        }
        .btn-close-detail:hover {
          background: white;
        }
        .detail-layout {
          display: flex;
          flex-direction: row;
          max-height: 90vh;
        }
        @media (max-width: 768px) {
          .detail-layout {
            flex-direction: column;
          }
        }
        .detail-image-section {
          flex: 1;
          background: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
          max-height: 90vh;
          overflow: hidden;
        }
        .detail-image {
          max-width: 100%;
          max-height: 90vh;
          object-fit: contain;
        }
        .detail-info-section {
          width: 320px;
          padding: 24px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }
        @media (max-width: 768px) {
          .detail-info-section {
            width: 100%;
            max-height: 50vh;
          }
        }
        .detail-header {
          margin-bottom: 16px;
        }
        .detail-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 12px;
          color: #333;
        }
        .detail-actions {
          display: flex;
          gap: 8px;
        }
        .detail-description {
          color: #666;
          font-size: 15px;
          line-height: 1.6;
          margin-bottom: 24px;
        }
        .detail-meta {
          border-top: 1px solid #eee;
          padding-top: 16px;
          margin-bottom: 24px;
        }
        .meta-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .meta-label {
          color: #999;
          font-size: 13px;
        }
        .meta-value {
          color: #333;
          font-size: 13px;
          font-weight: 500;
        }
        .share-section {
          margin-top: auto;
          padding-top: 16px;
          border-top: 1px solid #eee;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .share-label {
          color: #666;
          font-size: 14px;
        }
        .confirm-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .confirm-box {
          background: white;
          padding: 24px;
          border-radius: 12px;
          max-width: 300px;
        }
      `}</style>
    </div>
  );
}

