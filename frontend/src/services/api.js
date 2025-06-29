import authUtils from "../utils/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    let url = `${this.baseURL}${endpoint}`;
    // Add cache-busting param for GET requests
    if (!options.method || options.method === "GET") {
      const sep = url.includes("?") ? "&" : "?";
      url += `${sep}_=${Date.now()}`;
    }
    const token = authUtils.getToken();
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      if (response.status === 401 || response.status === 403) {
        authUtils.clearAuth();
        window.location.href = "/login";
        return;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async signup(userData) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async updateProfile(profileData) {
    return this.request("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }

  async logout() {
    return this.request("/auth/logout", {
      method: "POST",
    });
  }

  // Asset endpoints
  async getAssets() {
    return this.request("/assets");
  }

  async createAsset(assetData) {
    return this.request("/assets", {
      method: "POST",
      body: JSON.stringify(assetData),
    });
  }

  async updateAsset(id, assetData) {
    return this.request(`/assets/${id}`, {
      method: "PUT",
      body: JSON.stringify(assetData),
    });
  }

  async deleteAsset(id) {
    return this.request(`/assets/${id}`, {
      method: "DELETE",
    });
  }

  // Assignment endpoints
  async getAssignments(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/assignments${query ? "?" + query : ""}`);
  }

  async createAssignment(assignmentData) {
    return this.request("/assignments", {
      method: "POST",
      body: JSON.stringify(assignmentData),
    });
  }

  async updateAssignment(id, assignmentData) {
    return this.request(`/assignments/${id}`, {
      method: "PUT",
      body: JSON.stringify(assignmentData),
    });
  }

  async deleteAssignment(id) {
    return this.request(`/assignments/${id}`, {
      method: "DELETE",
    });
  }

  // Purchase endpoints
  async getPurchases(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/purchases${query ? "?" + query : ""}`);
  }

  async createPurchase(purchaseData) {
    return this.request("/purchases", {
      method: "POST",
      body: JSON.stringify(purchaseData),
    });
  }

  async updatePurchase(id, purchaseData) {
    return this.request(`/purchases/${id}`, {
      method: "PUT",
      body: JSON.stringify(purchaseData),
    });
  }

  async deletePurchase(id) {
    return this.request(`/purchases/${id}`, {
      method: "DELETE",
    });
  }

  // Transfer endpoints
  async getTransfers(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/transfers${query ? "?" + query : ""}`);
  }

  async createTransfer(transferData) {
    return this.request("/transfers", {
      method: "POST",
      body: JSON.stringify(transferData),
    });
  }

  async updateTransfer(id, transferData) {
    return this.request(`/transfers/${id}`, {
      method: "PUT",
      body: JSON.stringify(transferData),
    });
  }

  async deleteTransfer(id) {
    return this.request(`/transfers/${id}`, {
      method: "DELETE",
    });
  }

  // Dashboard endpoints
  async getDashboardStats(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/dashboard/metrics${query ? "?" + query : ""}`);
  }

  // Audit endpoints
  async getAuditLogs(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/audit/logs${query ? "?" + query : ""}`);
  }

  // Base endpoints
  async getBases() {
    return this.request("/bases");
  }

  // User endpoints
  async getUsers() {
    return this.request("/auth/users");
  }
}

export default new ApiService();
