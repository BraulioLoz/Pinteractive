import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";
import { useUser } from "../context/UserContext";
import {
  CreatePostModal,
  EditPostModal,
  PostCard,
  PostDetailModal,
} from "../components/Post";
import "./Landing.css";
import albumHumbe from "../assets/album-humbe.jpg";
import albumEminem from "../assets/album-eminem.jpg";
import albumBls from "../assets/album-loom.jpg";
import albumZoe from "../assets/album-zoe.jpg";

// Static images for hero collage
const heroImages = [albumHumbe, albumEminem, albumBls, albumZoe];

// LocalStorage keys for caching
const FEED_POSTS_KEY = "feed_posts";
const FEED_TIMESTAMP_KEY = "feed_timestamp";

// Cache expiration time (5 minutes)
const CACHE_EXPIRY_MS = 5 * 60 * 1000;

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    loadFeed();
  }, []);

  /**
   * Load feed from localStorage or API
   */
  const loadFeed = async () => {
    setLoading(true);
    setError(null);

    try {
      const cachedPosts = localStorage.getItem(FEED_POSTS_KEY);
      const cachedTimestamp = localStorage.getItem(FEED_TIMESTAMP_KEY);

      if (cachedPosts && cachedTimestamp) {
        const parsedPosts = JSON.parse(cachedPosts);
        const timestamp = new Date(cachedTimestamp);
        const now = new Date();
        const isExpired = now - timestamp > CACHE_EXPIRY_MS;

        setPosts(parsedPosts);
        setLoading(false);

        if (!isExpired) {
          fetchNewPosts(cachedTimestamp, parsedPosts);
        } else {
          await fetchAllPosts();
        }
      } else {
        await fetchAllPosts();
      }
    } catch (err) {
      console.error("Error loading feed:", err);
      setError("Error cargando el feed. Intenta de nuevo.");
      setLoading(false);
    }
  };

  const fetchAllPosts = async () => {
    try {
      const data = await apiFetch("/posts?limit=50");
      setPosts(data);

      const now = new Date().toISOString();
      localStorage.setItem(FEED_POSTS_KEY, JSON.stringify(data));
      localStorage.setItem(FEED_TIMESTAMP_KEY, now);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Error cargando posts. Verifica que el backend esté corriendo.");
      setLoading(false);
    }
  };

  const fetchNewPosts = async (afterDate, existingPosts) => {
    try {
      const data = await apiFetch(
        `/posts?after_date=${encodeURIComponent(afterDate)}&limit=50`
      );

      if (data.length > 0) {
        const newPostIds = new Set(data.map((p) => p.id));
        const filteredExisting = existingPosts.filter(
          (p) => !newPostIds.has(p.id)
        );
        const mergedPosts = [...data, ...filteredExisting];

        setPosts(mergedPosts);

        const now = new Date().toISOString();
        localStorage.setItem(FEED_POSTS_KEY, JSON.stringify(mergedPosts));
        localStorage.setItem(FEED_TIMESTAMP_KEY, now);
      }
    } catch (err) {
      console.error("Error fetching new posts:", err);
    }
  };

  const handleRefresh = () => {
    localStorage.removeItem(FEED_POSTS_KEY);
    localStorage.removeItem(FEED_TIMESTAMP_KEY);
    loadFeed();
  };

  // CRUD handlers
  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
    // Update localStorage
    const updatedPosts = [newPost, ...posts];
    localStorage.setItem(FEED_POSTS_KEY, JSON.stringify(updatedPosts));
    localStorage.setItem(FEED_TIMESTAMP_KEY, new Date().toISOString());
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
    );
    // Update localStorage
    const updatedPosts = posts.map((p) =>
      p.id === updatedPost.id ? updatedPost : p
    );
    localStorage.setItem(FEED_POSTS_KEY, JSON.stringify(updatedPosts));
  };

  const handlePostDeleted = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    // Update localStorage
    const updatedPosts = posts.filter((p) => p.id !== postId);
    localStorage.setItem(FEED_POSTS_KEY, JSON.stringify(updatedPosts));
  };

  const handleEditPost = (post) => {
    setSelectedPost(post);
    setShowEditModal(true);
  };

  const handleViewPost = (post) => {
    setSelectedPost(post);
    setShowDetailModal(true);
  };

  return (
    <div className="landing-page">
      {/* Hero Section with Collage */}
      <div className="landing-wrapper container-fluid">
        <div className="row justify-content-center align-items-center">
          <div className="col-lg-6 col-12 d-flex justify-content-center mb-4 mb-lg-0">
            <div className="landing-collage">
              <img className="img img-1" src={heroImages[0]} alt="Album 1" />
              <img className="img img-2" src={heroImages[1]} alt="Album 2" />
              <img className="img img-3" src={heroImages[2]} alt="Album 3" />
              <img className="img img-4" src={heroImages[3]} alt="Album 4" />
            </div>
          </div>
          <div className="col-lg-6 col-12 landing-text text-lg-start text-center">
            <h1>Encuentra imágenes con la vibe de canciones</h1>
            <p>
              Descubre música según tu mood. Busca emociones como
              <strong> "chill"</strong>, <strong>"sad"</strong> o
              <strong> "party"</strong>, y deja que tu vibe te encuentre.
            </p>
            <button
              className="btn-explore"
              onClick={() => navigate("/explore")}
            >
              Explorar
            </button>
          </div>
        </div>
      </div>

      {/* Feed Section */}
      <div className="feed-section container-fluid py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <h2 className="feed-title mb-0">Feed de la Comunidad</h2>
            <div className="d-flex gap-2">
              {user && (
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => setShowCreateModal(true)}
                >
                  + Crear Post
                </button>
              )}
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={handleRefresh}
                disabled={loading}
              >
                {loading ? "Cargando..." : "Actualizar"}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-warning" role="alert">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading && posts.length === 0 && (
            <div className="text-center py-5">
              <div className="spinner-border text-secondary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-3 text-muted">Cargando feed...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && posts.length === 0 && !error && (
            <div className="text-center py-5">
              <p className="text-muted fs-5">
                Aún no hay posts.{" "}
                {user
                  ? "¡Sé el primero en compartir!"
                  : "Inicia sesión para compartir."}
              </p>
              {user && (
                <button
                  className="btn btn-success"
                  onClick={() => setShowCreateModal(true)}
                >
                  Crear mi primer post
                </button>
              )}
            </div>
          )}

          {/* Posts Grid - Pinterest/Masonry Style with PostCard */}
          {posts.length > 0 && (
            <div className="masonry-feed">
              {posts.map((post) => (
                <div key={post.id} className="masonry-item-feed">
                  <PostCard
                    post={post}
                    onEdit={handleEditPost}
                    onDelete={handlePostDeleted}
                    onClick={handleViewPost}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreatePostModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onPostCreated={handlePostCreated}
      />

      <EditPostModal
        show={showEditModal}
        post={selectedPost}
        onClose={() => {
          setShowEditModal(false);
          setSelectedPost(null);
        }}
        onPostUpdated={handlePostUpdated}
      />

      <PostDetailModal
        show={showDetailModal}
        post={selectedPost}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedPost(null);
        }}
        onEdit={handleEditPost}
        onDelete={handlePostDeleted}
      />
    </div>
  );
}
