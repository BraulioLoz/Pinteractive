/**
 * Centralized API utility with automatic header injection.
 * All API calls should use this to ensure x-user-id header is sent.
 */

// Use VITE_API_URL from environment variable in production, or /api proxy in development
const BASE_URL = import.meta.env.VITE_API_URL || "/api";

/**
 * Make an API request with automatic header injection.
 * @param {string} endpoint - The API endpoint (e.g., "/posts", "/discovery/photos")
 * @param {object} options - Fetch options (method, body, etc.)
 * @returns {Promise<any>} - JSON response or null for 204 responses
 */
export async function apiFetch(endpoint, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Inject x-user-id header if user is logged in
  const storedUser = sessionStorage.getItem("user");
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      // Use username as the identifier, fallback to email
      const userId = user.username || user.email;
      if (userId) {
        headers["x-user-id"] = userId;
      }
    } catch (e) {
      console.error("Error parsing user from sessionStorage:", e);
    }
  }

  const config = {
    ...options,
    headers,
  };

  // If body is an object, stringify it
  if (config.body && typeof config.body === "object") {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  // Handle errors
  if (!response.ok) {
    let errorMessage = `Error ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.detail) {
        errorMessage = errorData.detail;
      }
    } catch (e) {
      // JSON parse failed, use default error message
    }
    throw new Error(errorMessage);
  }

  // Return null for 204 No Content responses
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

/**
 * GET request helper
 * @param {string} endpoint - The API endpoint
 * @returns {Promise<any>} - JSON response
 */
export async function apiGet(endpoint) {
  return apiFetch(endpoint, { method: "GET" });
}

/**
 * POST request helper
 * @param {string} endpoint - The API endpoint
 * @param {object} data - Request body data
 * @returns {Promise<any>} - JSON response
 */
export async function apiPost(endpoint, data) {
  return apiFetch(endpoint, {
    method: "POST",
    body: data,
  });
}

/**
 * PUT request helper
 * @param {string} endpoint - The API endpoint
 * @param {object} data - Request body data
 * @returns {Promise<any>} - JSON response
 */
export async function apiPut(endpoint, data) {
  return apiFetch(endpoint, {
    method: "PUT",
    body: data,
  });
}

/**
 * DELETE request helper
 * @param {string} endpoint - The API endpoint
 * @returns {Promise<null>} - null (204 response)
 */
export async function apiDelete(endpoint) {
  return apiFetch(endpoint, { method: "DELETE" });
}
