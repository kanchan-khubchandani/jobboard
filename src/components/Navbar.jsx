import { useAuth } from "../context/AuthContext";


function Navbar({ setPage }) {

  const { user, logout } = useAuth();


  return (

    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">

      <button
        onClick={() => setPage("home")}
        className="text-2xl font-bold text-blue-600"
      >
        JobBoard
      </button>


      <div className="flex gap-5 items-center">

        <button
          onClick={() => setPage("home")}
          className="text-gray-600 hover:text-blue-600"
        >
          Home
        </button>


        <button
          onClick={() => setPage("dashboard")}
          className="text-gray-600 hover:text-blue-600"
        >
          Dashboard
        </button>


        {user ? (

          <>
            <span className="text-gray-600">
              {user.email}
            </span>

            <button
              onClick={() => {
                logout();
                setPage("home");
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </>

        ) : (

          <button
            onClick={() => setPage("login")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>

        )}

      </div>

    </nav>

  );
}

export default Navbar;