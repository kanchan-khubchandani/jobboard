
import { useAuth } from "../context/AuthContext";

function Navbar({ setPage }) {
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    setPage("home");
  }

  const navClass = "text-gray-600 hover:text-blue-600";

  return (
    <nav className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
      {/* LOGO */}
      <button
        onClick={() => setPage("home")}
        className="text-2xl font-bold text-blue-600"
      >
        JobBoard
      </button>

      {/* NAVIGATION */}
      <div className="flex items-center gap-6 text-sm font-medium">
        <button onClick={() => setPage("home")} className={navClass}>
          Home
        </button>

        <button onClick={() => setPage("jobs")} className={navClass}>
          Jobs
        </button>

        <button onClick={() => setPage("dashboard")} className={navClass}>
          Dashboard
        </button>

        {/* REAL-TIME CHAT */}
        <button
          onClick={() => setPage("chat")}
          className={navClass}
        >
          Chat
        </button>

        {user ? (
          <>
            <button
              onClick={() => setPage("profile")}
              className={navClass}
            >
              Profile
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => setPage("login")}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
