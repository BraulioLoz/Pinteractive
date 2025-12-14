import { useState } from "react";
import { apiDelete } from "../../services/api";
import { useUser } from "../../context/UserContext";

/**
 * Post card component with Pinterest-style design.
 * Shows edit/delete buttons only for post owner.
 */
export default function PostCard({ post, onEdit, onDelete, onClick }) {
  const { user } = useUser();
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isOwner = user && post.owner === user.username;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await apiDelete(`/posts/${post.id}`);
      onDelete(post.id);
    } catch (err) {
      console.error("Error deleting post:", err);
      alert(err.message || "Error al eliminar el post.");
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="post-card-wrapper">
      <div className="post-card" onClick={() => onClick && onClick(post)}>
        <img
          src={post.image_url}
          alt={post.title}
          className="post-image"
          loading="lazy"
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/400x300?text=Image+Not+Found";
          }}
        />

        {/* Overlay with info */}
        <div className="post-overlay">
          <h5 className="post-title">{post.title}</h5>
          {post.description && (
            <p className="post-description">{post.description}</p>
          )}
          <div className="post-meta">
            <span className="post-owner">@{post.owner}</span>
            <span className="post-date">
              {new Date(post.created_at).toLocaleDateString("es-MX")}
            </span>
          </div>
        </div>

        {/* Owner Actions */}
        {isOwner && (
          <div className="post-actions" onClick={(e) => e.stopPropagation()}>
            <button
              className="btn btn-sm btn-light action-btn"
              onClick={() => onEdit(post)}
              title="Editar"
            >
              ✏️
            </button>
            <button
              className="btn btn-sm btn-light action-btn"
              onClick={() => setShowConfirm(true)}
              title="Eliminar"
              disabled={deleting}
            >
              {deleting ? "..." : "🗑️"}
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div
          className="confirm-backdrop"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="confirm-dialog"
            onClick={(e) => e.stopPropagation()}
          >
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

      <style>{`
        .post-card-wrapper {
          position: relative;
        }
        .post-card {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }
        .post-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }
        .post-image {
          width: 100%;
          height: auto;
          display: block;
        }
        .post-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
          color: white;
          padding: 16px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .post-card:hover .post-overlay {
          opacity: 1;
        }
        .post-title {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .post-description {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 8px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .post-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.7);
        }
        .post-owner {
          font-weight: 500;
        }
        .post-actions {
          position: absolute;
          top: 8px;
          right: 8px;
          display: flex;
          gap: 4px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .post-card:hover .post-actions {
          opacity: 1;
        }
        .action-btn {
          width: 32px;
          height: 32px;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 14px;
        }
        .confirm-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10001;
        }
        .confirm-dialog {
          background: white;
          padding: 20px;
          border-radius: 12px;
          max-width: 300px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}

