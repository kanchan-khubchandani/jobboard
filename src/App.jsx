import { useState } from "react";

import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import JobCard from "./components/JobCard";
import ApplyForm from "./components/ApplyForm";

import useFetch from "./hooks/useFetch";

import { useAuth } from "./context/AuthContext";

import Chat from "./Chat";


function App() {

  const [page, setPage] = useState("home");

  const { data: jobs, loading } = useFetch("/jobs.json");

  const [search, setSearch] = useState("");

  const {
    user,
    login,
    register,
    loading: authLoading
  } = useAuth();

  const [selectedJob, setSelectedJob] = useState(null);

  const [loginMode, setLoginMode] = useState(true);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");


  // APPLICATIONS

  const [applications, setApplications] = useState(() => {

    const savedApplications =
      localStorage.getItem("jobboardApplications");

    return savedApplications
      ? JSON.parse(savedApplications)
      : [];

  });


  // SEARCH JOBS

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase())
  );


  // LOGIN

  async function handleLogin(e) {

    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;


    const result = await login(
      email,
      password
    );


    if (!result.success) {

      setError(result.message);
      setSuccess("");

      return;

    }


    setError("");
    setSuccess("");


    // Go to dashboard after successful login

    setPage("dashboard");

  }


  // CREATE ACCOUNT

  async function handleRegister(e) {

    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;


    // Check password confirmation

    if (password !== confirmPassword) {

      setError("Passwords do not match.");
      setSuccess("");

      return;

    }


    const result = await register(
      name,
      email,
      password
    );


    if (!result.success) {

      setError(result.message);
      setSuccess("");

      return;

    }


    setError("");

    setSuccess(
      "Account created successfully! You can now login."
    );


    // Switch to Login

    setLoginMode(true);

  }


  // SHOW LOGIN

  function showLogin() {

    setLoginMode(true);

    setError("");

    setSuccess("");

  }


  // SHOW REGISTER

  function showRegister() {

    setLoginMode(false);

    setError("");

    setSuccess("");

  }


  // ADD APPLICATION

  function handleApplicationSubmit(application) {

    const updatedApplications = [
      application,
      ...applications
    ];


    setApplications(updatedApplications);


    localStorage.setItem(
      "jobboardApplications",
      JSON.stringify(updatedApplications)
    );


    setSelectedJob(null);

  }


  // USER APPLICATIONS

  const userApplications = applications.filter(
    (application) =>
      user &&
      application.email === user.email
  );


  // AUTHENTICATION LOADING

  if (authLoading) {

    return (

      <div className="min-h-screen bg-gray-50 flex items-center justify-center">

        <div className="text-center">

          <h2 className="text-2xl font-bold text-blue-600">
            JobBoard
          </h2>

          <p className="text-gray-500 mt-2">
            Loading your account...
          </p>

        </div>

      </div>

    );

  }


  return (

    <div className="min-h-screen bg-gray-50">

      <Navbar setPage={setPage} />

      {page === "chat" && <Chat />}


      {/* ================= HOME ================= */}

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

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold text-gray-800">
                Latest Jobs
              </h2>


              <button
                onClick={() => setPage("jobs")}
                className="text-blue-600 font-semibold hover:underline"
              >
                View All
              </button>

            </div>


            {loading ? (

              <p>Loading jobs...</p>

            ) : (

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {filteredJobs.length > 0 ? (

                  filteredJobs
                    .slice(0, 3)
                    .map((job) => (

                      <JobCard
                        key={job.id}
                        job={job}
                        onApply={setSelectedJob}
                      />

                    ))

                ) : (

                  <p>No jobs found.</p>

                )}

              </div>

            )}

          </section>


          {selectedJob && (

            <section className="max-w-6xl mx-auto px-6 pb-12">

              <ApplyForm
                job={selectedJob}
                onClose={() => setSelectedJob(null)}
                onSubmit={handleApplicationSubmit}
              />

            </section>

          )}

        </>

      )}


      {/* ================= ALL JOBS ================= */}

      {page === "jobs" && (

        <section className="max-w-6xl mx-auto px-6 py-12">


          <div className="text-center mb-10">

            <h2 className="text-4xl font-bold text-gray-800">
              All Jobs
            </h2>

            <p className="text-gray-500 mt-2">
              Explore all available job opportunities
            </p>

          </div>


          {loading ? (

            <p>Loading jobs...</p>

          ) : selectedJob ? (

            <ApplyForm
              job={selectedJob}
              onClose={() => setSelectedJob(null)}
              onSubmit={handleApplicationSubmit}
            />

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {jobs.map((job) => (

                <JobCard
                  key={job.id}
                  job={job}
                  onApply={setSelectedJob}
                />

              ))}

            </div>

          )}

        </section>

      )}


      {/* ================= LOGIN / CREATE ACCOUNT ================= */}

      {page === "login" && (

        <section className="min-h-[calc(100vh-80px)] flex items-center justify-center px-5 py-10">

          <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg">


            {/* ================= LOGIN ================= */}

            {loginMode ? (

              <>

                <h2 className="text-3xl font-bold text-center text-gray-800">
                  Welcome Back
                </h2>


                <p className="text-gray-500 text-center mt-2">
                  Login to your JobBoard account
                </p>


                {success && (

                  <p className="bg-green-100 text-green-600 text-sm p-3 rounded-lg mt-5 text-center">
                    {success}
                  </p>

                )}


                {error && (

                  <p className="bg-red-100 text-red-600 text-sm p-3 rounded-lg mt-5 text-center">
                    {error}
                  </p>

                )}


                <form
                  onSubmit={handleLogin}
                  className="mt-7"
                >

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>


                  <input
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    className="w-full border border-gray-300 p-3 rounded-lg"
                  />


                  <label className="block text-sm font-medium text-gray-700 mt-5 mb-2">
                    Password
                  </label>


                  <input
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                    className="w-full border border-gray-300 p-3 rounded-lg"
                  />


                  <div className="text-right mt-2">

                    <button
                      type="button"
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Forgot Password?
                    </button>

                  </div>


                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg mt-5 hover:bg-blue-700"
                  >
                    Login
                  </button>

                </form>


                <p className="text-center text-sm text-gray-500 mt-6">

                  Don't have an account?

                  <button
                    type="button"
                    onClick={showRegister}
                    className="text-blue-600 font-semibold ml-1 hover:underline"
                  >
                    Create Account
                  </button>

                </p>

              </>

            ) : (


              /* ================= CREATE ACCOUNT ================= */

              <>

                <h2 className="text-3xl font-bold text-center text-gray-800">
                  Create Account
                </h2>


                <p className="text-gray-500 text-center mt-2">
                  Create your JobBoard account
                </p>


                {success && (

                  <p className="bg-green-100 text-green-600 text-sm p-3 rounded-lg mt-5 text-center">
                    {success}
                  </p>

                )}


                {error && (

                  <p className="bg-red-100 text-red-600 text-sm p-3 rounded-lg mt-5 text-center">
                    {error}
                  </p>

                )}


                <form
                  onSubmit={handleRegister}
                  className="mt-7"
                >

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>


                  <input
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    required
                    className="w-full border border-gray-300 p-3 rounded-lg"
                  />


                  <label className="block text-sm font-medium text-gray-700 mt-5 mb-2">
                    Email
                  </label>


                  <input
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    className="w-full border border-gray-300 p-3 rounded-lg"
                  />


                  <label className="block text-sm font-medium text-gray-700 mt-5 mb-2">
                    Password
                  </label>


                  <input
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    required
                    className="w-full border border-gray-300 p-3 rounded-lg"
                  />


                  <label className="block text-sm font-medium text-gray-700 mt-5 mb-2">
                    Confirm Password
                  </label>


                  <input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    required
                    className="w-full border border-gray-300 p-3 rounded-lg"
                  />


                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700"
                  >
                    Create Account
                  </button>

                </form>


                <p className="text-center text-sm text-gray-500 mt-6">

                  Already have an account?

                  <button
                    type="button"
                    onClick={showLogin}
                    className="text-blue-600 font-semibold ml-1 hover:underline"
                  >
                    Login
                  </button>

                </p>

              </>

            )}

          </div>

        </section>

      )}


      {/* ================= PROFILE ================= */}

      {page === "profile" && user && (

        <section className="max-w-4xl mx-auto px-6 py-12">

          <h2 className="text-3xl font-bold text-gray-800">
            My Profile
          </h2>


          <p className="text-gray-500 mt-2">
            Your authenticated JobBoard profile
          </p>


          <div className="bg-white rounded-xl shadow mt-8 p-8">


            {/* NAME */}

            <div className="mb-6">

              <p className="text-sm text-gray-500">
                Name
              </p>

              <p className="text-xl font-semibold text-gray-800 mt-1">
                {user.name}
              </p>

            </div>


            {/* EMAIL */}

            <div className="mb-6">

              <p className="text-sm text-gray-500">
                Email
              </p>

              <p className="text-xl font-semibold text-gray-800 mt-1">
                {user.email}
              </p>

            </div>


            {/* AUTHENTICATION STATUS */}

            <div className="bg-green-50 border border-green-200 rounded-lg p-5">

              <p className="text-green-700 font-semibold">
                ✓ Authenticated User
              </p>

              <p className="text-sm text-green-600 mt-1">
                Your profile is protected using JWT authentication.
              </p>

            </div>


            {/* SECURITY INFORMATION */}

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">

              <div className="border rounded-lg p-4">

                <p className="text-sm text-gray-500">
                  Authentication
                </p>

                <p className="font-semibold text-blue-600 mt-1">
                  JWT
                </p>

              </div>


              <div className="border rounded-lg p-4">

                <p className="text-sm text-gray-500">
                  Password
                </p>

                <p className="font-semibold text-blue-600 mt-1">
                  Hashed
                </p>

              </div>


              <div className="border rounded-lg p-4">

                <p className="text-sm text-gray-500">
                  Access
                </p>

                <p className="font-semibold text-green-600 mt-1">
                  Protected
                </p>

              </div>

            </div>

          </div>

        </section>

      )}


      {/* ================= DASHBOARD ================= */}

      {page === "dashboard" && (

        <section className="max-w-6xl mx-auto px-6 py-10">


          <h2 className="text-3xl font-bold text-gray-800">
            Dashboard
          </h2>


          <p className="text-gray-500 mt-2">
            Welcome back! Here's your application overview.
          </p>


          {/* STATISTICS */}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mt-8">


            {/* APPLICATIONS */}

            <div className="bg-white p-6 rounded-xl shadow">

              <p className="text-gray-500">
                Applications
              </p>

              <h3 className="text-3xl font-bold text-blue-600 mt-2">
                {userApplications.length}
              </h3>

            </div>


            {/* INTERVIEWS */}

            <div className="bg-white p-6 rounded-xl shadow">

              <p className="text-gray-500">
                Interviews
              </p>

              <h3 className="text-3xl font-bold text-green-600 mt-2">

                {
                  userApplications.filter(
                    (application) =>
                      application.status === "Interview"
                  ).length
                }

              </h3>

            </div>


            {/* SAVED JOBS */}

            <div className="bg-white p-6 rounded-xl shadow">

              <p className="text-gray-500">
                Saved Jobs
              </p>

              <h3 className="text-3xl font-bold text-purple-600 mt-2">
                0
              </h3>

            </div>


            {/* OFFERS */}

            <div className="bg-white p-6 rounded-xl shadow">

              <p className="text-gray-500">
                Offers
              </p>

              <h3 className="text-3xl font-bold text-orange-500 mt-2">

                {
                  userApplications.filter(
                    (application) =>
                      application.status === "Offer"
                  ).length
                }

              </h3>

            </div>

          </div>


          {/* ================= RECENT APPLICATIONS ================= */}

          <div className="bg-white rounded-xl shadow mt-8 p-6">


            <h3 className="text-lg font-bold text-gray-800 mb-5">
              Recent Applications
            </h3>


            {userApplications.length === 0 ? (

              <div className="text-center py-10">

                <p className="text-gray-500">
                  You haven't applied for any jobs yet.
                </p>


                <button
                  onClick={() => setPage("jobs")}
                  className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                >
                  Browse Jobs
                </button>

              </div>

            ) : (

              <div className="space-y-3">

                {userApplications
                  .slice(0, 5)
                  .map((application) => (

                    <div
                      key={application.id}
                      className="border border-gray-200 rounded-lg p-4 flex items-center justify-between"
                    >

                      {/* JOB DETAILS */}

                      <div>

                        <h4 className="font-semibold text-gray-800">
                          {application.title}
                        </h4>


                        <p className="text-sm text-gray-500 mt-1">
                          {application.company} · {application.location}
                        </p>

                      </div>


                      {/* STATUS */}

                      <span
                        className={`text-sm font-medium ${
                          application.status === "Interview"
                            ? "text-green-600"
                            : application.status === "Offer"
                            ? "text-orange-500"
                            : "text-blue-600"
                        }`}
                      >
                        {application.status}
                      </span>

                    </div>

                  ))}

              </div>

            )}

          </div>


        </section>

      )}


      {/* ================= FOOTER ================= */}

      <footer className="bg-gray-900 text-gray-400 text-center py-6">

        © 2026 JobBoard. All rights reserved.

      </footer>


    </div>

  );

}


export default App;