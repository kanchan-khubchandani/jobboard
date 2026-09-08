import { createContext, useContext, useState } from "react";

const AuthContext = createContext();


export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);


  // CREATE ACCOUNT

  function register(name, email, password) {

    const users =
      JSON.parse(localStorage.getItem("jobboardUsers")) || [];


    // Check existing email

    const existingUser = users.find(
      (u) => u.email === email
    );


    if (existingUser) {

      return {
        success: false,
        message: "Account already exists with this email."
      };

    }


    // Create new user

    const newUser = {
      name: name,
      email: email,
      password: password
    };


    users.push(newUser);


    // Save users

    localStorage.setItem(
      "jobboardUsers",
      JSON.stringify(users)
    );


    return {
      success: true,
      message: "Account created successfully."
    };

  }


  // LOGIN

  function login(email, password) {

    const users =
      JSON.parse(localStorage.getItem("jobboardUsers")) || [];


    const existingUser = users.find(
      (u) =>
        u.email === email &&
        u.password === password
    );


    if (!existingUser) {

      return {
        success: false,
        message: "Invalid email or password."
      };

    }


    setUser(existingUser);


    return {
      success: true,
      message: "Login successful."
    };

  }


  // LOGOUT

  function logout() {

    setUser(null);

  }


  return (

    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout
      }}
    >

      {children}

    </AuthContext.Provider>

  );

}


export function useAuth() {

  return useContext(AuthContext);

}