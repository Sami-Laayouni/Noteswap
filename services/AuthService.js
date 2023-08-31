// AuthService.js

class AuthService {
  constructor(setLoggedIn) {
    this.setLoggedIn = setLoggedIn;
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
      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          this.setLoggedIn(true);
        }
        return data;
      } else {
        return "Incorrect username or password";
      }
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
      this.setLoggedIn(true);
      return data;
    } catch (error) {
      console.error("Login with Google failed", error);
      throw error;
    }
  }
  /* ========== Login with Microsoft ========== */
  async login_with_microsoft(id) {
    if (!id) {
      console.error("No subject id given to login with Microsoft!");
      return;
    }
    try {
      const response = await fetch(`${this.API_URL}/login_with_microsoft`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: id }),
      });
      if (response.ok) {
        const data = await response.json();
        this.setLoggedIn(true);
        return data;
      }
    } catch (error) {
      console.error("Login with Microsoft failed", error);
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
      this.setLoggedIn(true);
      return data;
    } catch (error) {
      console.error("Create user failed", error);
      throw error;
    }
  }

  /* ========== Sign up with Microsoft ========== */
  async create_user_with_microsoft(
    first,
    last,
    email,
    profilePicture,
    id,
    role
  ) {
    if (!email) {
      console.error("No email given to signup with Microsoft!");
      return;
    }
    try {
      const response = await fetch(
        `${this.API_URL}/create_user_with_microsoft`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            first,
            last,
            email,
            profilePicture,
            role,
          }),
        }
      );

      const data = await response.json();
      this.setLoggedIn(true);

      return data;
    } catch (error) {
      console.error("Create user failed", error);
      return error;
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
      this.setLoggedIn(true);
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
      localStorage.removeItem("userInfo");

      // Update the authentication status
      this.setLoggedIn(false);
    } catch (error) {
      console.error("Logout failed", error);
      throw error;
    }
  }
}

export default AuthService;
