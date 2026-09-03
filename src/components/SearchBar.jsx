import { useState } from "react";

function SearchBar({ onSearch }) {

  const [search, setSearch] = useState("");

  function handleSubmit(e) {

    e.preventDefault();

    onSearch(search);

  }

  return (

    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto mt-8 bg-white p-2 rounded-lg flex"
    >

      <input
        type="text"
        placeholder="Search for jobs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 px-4 py-3 text-gray-700 outline-none"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 rounded-lg hover:bg-blue-700"
      >
        Search
      </button>

    </form>

  );
}

export default SearchBar;