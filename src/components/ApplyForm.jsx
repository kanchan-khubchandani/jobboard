import { useState } from "react";

function ApplyForm({ job, onClose, onSubmit, user }) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    const form = e.target;

    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    const phone = form.elements.phone.value.trim();
    const message = form.elements.message.value.trim();

    const application = {
      id: Date.now(),
      jobId: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      name: user?.name || name,
      email: (user?.email || email).trim().toLowerCase(),
      phone,
      message,
      status: "Applied",
      appliedAt: new Date().toLocaleString()
    };

    onSubmit(application);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg mx-auto text-center">
        <h2 className="text-2xl font-bold text-green-600">
          Application Submitted!
        </h2>

        <p className="text-gray-600 mt-3">
          Your application for <b>{job.title}</b> at{" "}
          <b>{job.company}</b> has been submitted successfully.
        </p>

        <button
          onClick={onClose}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-gray-800">
        Apply for {job.title}
      </h2>

      <p className="text-gray-600 mt-1">
        {job.company} • {job.location}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          name="name"
          type="text"
          placeholder="Full Name"
          defaultValue={user?.name || ""}
          required
          className="w-full border p-3 rounded-lg"
        />

        <input
          name="email"
          type="email"
          placeholder="Email Address"
          defaultValue={user?.email || ""}
          readOnly={Boolean(user?.email)}
          required
          className="w-full border p-3 rounded-lg"
        />

        <input
          name="phone"
          type="tel"
          placeholder="Phone Number"
          required
          className="w-full border p-3 rounded-lg"
        />

        <textarea
          name="message"
          placeholder="Why are you suitable for this job?"
          rows="4"
          className="w-full border p-3 rounded-lg"
        />

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Submit Application
          </button>

          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 px-6 py-3 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ApplyForm;