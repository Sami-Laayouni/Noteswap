// AuthService.js

class AuthService {
  constructor(authContext) {
    this.authContext = authContext;
    this.API_URL = "/api/auth";
  }

  async login(email, password) {
    try {
      const response = await fetch(`${this.API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      this.authContext.setLoggedIn(true);
      return data;
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  }

  async create_user(email, password, first, last, role) {
    try {
      const response = await fetch(`${this.API_URL}/create_user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, first, last, role }),
      });

      const data = await response.json();
      this.authContext.setLoggedIn(true);
      return data;
    } catch (error) {
      console.error("Create user failed", error);
      throw error;
    }
  }

  async logout() {
    try {
      // Clear the user's session or token
      const token = localStorage.getItem("token");

      // Check if the token exists
      if (!token) {
        console.error("Unauthorized");
        return;
      }

      // Clear the token from localStorage
      localStorage.removeItem("token");

      // Update the authentication status
      this.authContext.setLoggedIn(false);
    } catch (error) {
      console.error("Logout failed", error);
      throw error;
    }
  }
}

export default AuthService;
