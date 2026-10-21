import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

const AuthContext = createContext();

const API_URL = "http://localhost:5001/api/users";

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  // CHECK LOGIN WHEN APPLICATION STARTS

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    fetchProfile(token);

  }, []);


  // GET PROTECTED USER PROFILE

  async function fetchProfile(token) {

    try {

      const response = await fetch(
        `${API_URL}/profile`,
        {
          method: "GET",

          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {

        localStorage.removeItem("token");
        setUser(null);
        setLoading(false);

        return;
      }

      setUser(data.user);

    } catch (error) {

      console.error("Profile error:", error);

      localStorage.removeItem("token");
      setUser(null);

    }

    setLoading(false);
  }


  // CREATE ACCOUNT

  async function register(name, email, password) {

    try {

      const response = await fetch(
        `${API_URL}/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            name,
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {

        return {
          success: false,
          message: data.message || "Registration failed."
        };

      }

      return {
        success: true,
        message: data.message || "Account created successfully."
      };

    } catch (error) {

      console.error("Registration error:", error);

      return {
        success: false,
        message: "Unable to connect to server."
      };

    }
  }


  // LOGIN

  async function login(email, password) {

    try {

      const response = await fetch(
        `${API_URL}/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {

        return {
          success: false,
          message: data.message || "Invalid email or password."
        };

      }


      // Store JWT token

      localStorage.setItem(
        "token",
        data.token
      );


      // Get logged-in user's profile

      await fetchProfile(data.token);


      return {
        success: true,
        message: "Login successful."
      };

    } catch (error) {

      console.error("Login error:", error);

      return {
        success: false,
        message: "Unable to connect to server."
      };

    }
  }


  // LOGOUT

  function logout() {

    localStorage.removeItem("token");

    setUser(null);

  }


  return (

    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading
      }}
    >

      {children}

    </AuthContext.Provider>

  );

}


export function useAuth() {

  return useContext(AuthContext);

}