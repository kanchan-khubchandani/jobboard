function JobCard({ job, onApply }) {

  return (

    <div className="bg-white rounded-xl shadow-md p-6">

      <span className="text-sm text-blue-600 font-semibold">
        {job.type}
      </span>

      <h2 className="text-xl font-bold text-gray-800 mt-2">
        {job.title}
      </h2>

      <p className="text-gray-600 mt-1">
        {job.company}
      </p>

      <p className="text-gray-500 mt-1">
        📍 {job.location}
      </p>

      <button
        onClick={() => onApply(job)}
        className="mt-5 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
      >
        Apply Now
      </button>

    </div>

  );
}

export default JobCard;