import { useState } from "react";

import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import JobCard from "./components/JobCard";

import useFetch from "./hooks/useFetch";

import { useAuth } from "./context/AuthContext";


function App() {

  const [page, setPage] = useState("home");

  const { data: jobs, loading } = useFetch("/jobs.json");

  const [search, setSearch] = useState("");

  const { user, login } = useAuth();


  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase())
  );


  function handleLogin(e) {

    e.preventDefault();

    const email = e.target.email.value;

    login(email);

    setPage("dashboard");
  }


  return (

    <div className="min-h-screen bg-gray-50">

      <Navbar setPage={setPage} />


      {/* HOME */}

      {page === "home" && (

        <>

          <section className="bg-blue-600 text-white text-center py-16 px-5">

            <h2 className="text-4xl font-bold">
              Find Your Dream Job
            </h2>

            <p className="mt-4 text-blue-100">
              Discover opportunities and take the next step in your career.
            </p>

            <SearchBar onSearch={setSearch} />

          </section>


          <section className="max-w-6xl mx-auto px-6 py-12">

            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Latest Jobs
            </h2>


            {loading ? (

              <p>Loading jobs...</p>

            ) : (

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {filteredJobs.length > 0 ? (

                  filteredJobs.map((job) => (

                    <JobCard
                      key={job.id}
                      job={job}
                    />

                  ))

                ) : (

                  <p>No jobs found.</p>

                )}

              </div>

            )}

          </section>

        </>

      )}


      {/* LOGIN */}

      {page === "login" && (

        <section className="min-h-screen flex items-center justify-center px-5">

          <form
            onSubmit={handleLogin}
            className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg"
          >

            <h2 className="text-3xl font-bold text-center">
              Welcome Back
            </h2>

            <p className="text-gray-500 text-center mt-2">
              Login to your JobBoard account
            </p>


            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              required
              className="w-full border p-3 rounded-lg mt-8"
            />


            <input
              type="password"
              placeholder="Enter your password"
              required
              className="w-full border p-3 rounded-lg mt-4"
            />


            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700"
            >
              Login
            </button>

          </form>

        </section>

      )}


      {/* DASHBOARD */}

      {page === "dashboard" && (

        <section className="max-w-6xl mx-auto px-6 py-10">

          <h2 className="text-3xl font-bold text-gray-800">
            Dashboard
          </h2>


          <p className="text-gray-500 mt-2">

            Welcome,

            <span className="font-semibold text-blue-600 ml-1">
              {user ? user.email : "Guest"}
            </span>

          </p>


          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mt-8">


            <div className="bg-white p-6 rounded-xl shadow">

              <p className="text-gray-500">
                Applications
              </p>

              <h3 className="text-3xl font-bold text-blue-600 mt-2">
                12
              </h3>

            </div>


            <div className="bg-white p-6 rounded-xl shadow">

              <p className="text-gray-500">
                Interviews
              </p>

              <h3 className="text-3xl font-bold text-green-600 mt-2">
                4
              </h3>

            </div>


            <div className="bg-white p-6 rounded-xl shadow">

              <p className="text-gray-500">
                Saved Jobs
              </p>

              <h3 className="text-3xl font-bold text-purple-600 mt-2">
                8
              </h3>

            </div>


            <div className="bg-white p-6 rounded-xl shadow">

              <p className="text-gray-500">
                Offers
              </p>

              <h3 className="text-3xl font-bold text-orange-500 mt-2">
                2
              </h3>

            </div>

          </div>

        </section>

      )}


      <footer className="bg-gray-900 text-gray-400 text-center py-6">

        © 2026 JobBoard. All rights reserved.

      </footer>

    </div>

  );
}

export default App;