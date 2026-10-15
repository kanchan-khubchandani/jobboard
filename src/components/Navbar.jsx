import { useAuth } from "../context/AuthContext";

function Navbar({ setPage }) {

  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    setPage("home");
  }

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

        <button
          onClick={() => setPage("home")}
          className="text-gray-600 hover:text-blue-600"
        >
          Home
        </button>


        <button
          onClick={() => setPage("jobs")}
          className="text-gray-600 hover:text-blue-600"
        >
          Jobs
        </button>


        <button
          onClick={() => setPage("dashboard")}
          className="text-gray-600 hover:text-blue-600"
        >
          Dashboard
        </button>


        {user ? (

  <>

    <button
      onClick={() => setPage("profile")}
      className="text-gray-600 hover:text-blue-600"
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