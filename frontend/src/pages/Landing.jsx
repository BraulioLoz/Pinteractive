import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";
import { useUser } from "../context/UserContext";
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

  useEffect(() => {
    loadFeed();
  }, []);

  /**
   * Load feed from localStorage or API
   * Implements caching strategy per requirements:
   * 1. Check localStorage for cached posts
   * 2. If valid cache: display it, then fetch new posts in background
   * 3. If no cache/expired: fetch from API, save to localStorage
   */
  const loadFeed = async () => {
    setLoading(true);
    setError(null);

    try {
      // Check localStorage for cached posts
      const cachedPosts = localStorage.getItem(FEED_POSTS_KEY);
      const cachedTimestamp = localStorage.getItem(FEED_TIMESTAMP_KEY);

      if (cachedPosts && cachedTimestamp) {
        const parsedPosts = JSON.parse(cachedPosts);
        const timestamp = new Date(cachedTimestamp);
        const now = new Date();
        const isExpired = now - timestamp > CACHE_EXPIRY_MS;

        // Display cached posts immediately
        setPosts(parsedPosts);
        setLoading(false);

        if (!isExpired) {
          // Cache is valid, fetch new posts with after_date in background
          fetchNewPosts(cachedTimestamp, parsedPosts);
        } else {
          // Cache expired, do a full refresh
          await fetchAllPosts();
        }
      } else {
        // No cache, fetch all posts
        await fetchAllPosts();
      }
    } catch (err) {
      console.error("Error loading feed:", err);
      setError("Error cargando el feed. Intenta de nuevo.");
      setLoading(false);
    }
  };

  /**
   * Fetch all posts from API and save to localStorage
   */
  const fetchAllPosts = async () => {
    try {
      const data = await apiFetch("/posts?limit=50");
      setPosts(data);
      
      // Save to localStorage
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

  /**
   * Fetch new posts after a given date and merge with cached posts
   */
  const fetchNewPosts = async (afterDate, existingPosts) => {
    try {
      const data = await apiFetch(`/posts?after_date=${encodeURIComponent(afterDate)}&limit=50`);
      
      if (data.length > 0) {
        // Merge new posts with existing (new posts first)
        const newPostIds = new Set(data.map(p => p.id));
        const filteredExisting = existingPosts.filter(p => !newPostIds.has(p.id));
        const mergedPosts = [...data, ...filteredExisting];
        
        setPosts(mergedPosts);
        
        // Update localStorage
        const now = new Date().toISOString();
        localStorage.setItem(FEED_POSTS_KEY, JSON.stringify(mergedPosts));
        localStorage.setItem(FEED_TIMESTAMP_KEY, now);
      }
    } catch (err) {
      console.error("Error fetching new posts:", err);
      // Silent fail for background fetch
    }
  };

  /**
   * Refresh feed (force reload from API)
   */
  const handleRefresh = () => {
    localStorage.removeItem(FEED_POSTS_KEY);
    localStorage.removeItem(FEED_TIMESTAMP_KEY);
    loadFeed();
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
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="feed-title">Feed de la Comunidad</h2>
            <button 
              className="btn btn-outline-secondary btn-sm"
              onClick={handleRefresh}
              disabled={loading}
            >
              {loading ? "Cargando..." : "Actualizar"}
            </button>
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
                Aún no hay posts. {user ? "¡Sé el primero en compartir!" : "Inicia sesión para compartir."}
              </p>
            </div>
          )}

          {/* Posts Grid - Pinterest/Masonry Style */}
          {posts.length > 0 && (
            <div className="masonry-feed">
              {posts.map((post) => (
                <div key={post.id} className="masonry-item-feed">
                  <div className="post-card">
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="post-image"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
                      }}
                    />
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
