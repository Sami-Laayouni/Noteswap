// AuthService.js

class AuthService {
  constructor(authContext) {
    this.authContext = authContext;
    this.API_URL = "/api/auth";
    this.role = "";
  }

  /* ========== Login with email and password ========== */
  async login(email, password) {
    if (!email) {
      console.error("No email given to log in user!");
      return;
    }
    if (!password) {
      console.error("No password given to log in user!");
      return;
    }
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
  /* ========== Login with Google ========== */
  async login_with_google(sub) {
    if (!sub) {
      console.error("No subject id given to login with Google!");
      return;
    }
    try {
      const response = await fetch(`${this.API_URL}/login_with_google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sub }),
      });

      const data = await response.json();
      this.authContext.setLoggedIn(true);
      return data;
    } catch (error) {
      console.error("Login with Metamask failed", error);
      throw error;
    }
  }
  /* ========== Login with Metamask ========== */
  async login_with_metamask(address) {
    if (!address) {
      console.error("No address given to login with Metamask!");
      return;
    }
    try {
      const response = await fetch(`${this.API_URL}/login_with_metamask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address }),
      });

      const data = await response.json();
      this.authContext.setLoggedIn(true);
      return data;
    } catch (error) {
      console.error("Login with Metamask failed", error);
      throw error;
    }
  }
  /* ========== Sign up with Google ========== */
  async create_user_with_google(
    first,
    last,
    email,
    profilePicture,
    googleId,
    role
  ) {
    if (!email) {
      console.error("No email given to signup with Google!");
      return;
    }
    try {
      const response = await fetch(`${this.API_URL}/create_user_with_google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          googleId,
          first,
          last,
          email,
          profilePicture,
          role,
        }),
      });

      const data = await response.json();
      this.authContext.setLoggedIn(true);
      return data;
    } catch (error) {
      console.error("Create user failed", error);
      throw error;
    }
  }

  /* ========== Sign up with Metamask address ========== */
  async create_user_with_metamask(address, first, last, role) {
    if (!address) {
      console.error("No address given to signup with Metamask!");
      return;
    }
    try {
      const response = await fetch(
        `${this.API_URL}/create_user_with_metamask`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ address, first, last, role }),
        }
      );

      const data = await response.json();
      this.authContext.setLoggedIn(true);
      return data;
    } catch (error) {
      console.error("Create user failed", error);
      throw error;
    }
  }

  /* ========== Sign up with email and password ========== */
  async create_user(email, password, first, last, role) {
    if (!email) {
      console.error("No email given to create user!");
      return;
    }
    if (!password) {
      console.error("No password given to create user!");
      return;
    }
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
  /* ========== Get Google Continue URL ========== */
  async get_google_continue_url(redirect) {
    try {
      const response = await fetch(`${this.API_URL}/continue_with_google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ redirect }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Create user failed", error);
      throw error;
    }
  }

  /* ========== Logout ========== */
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
