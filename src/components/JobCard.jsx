function JobCard({ job }) {

    return (
  
      <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg">
  
        <span className="text-sm font-semibold text-blue-600">
          {job.type}
        </span>
  
        <h3 className="text-xl font-bold mt-2 text-gray-800">
          {job.title}
        </h3>
  
        <p className="text-gray-500 mt-2">
          {job.company}
        </p>
  
        <p className="text-gray-400 text-sm">
          {job.location}
        </p>
  
        <button className="mt-5 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Apply Now
        </button>
  
      </div>
  
    );
  }
  
  export default JobCard;