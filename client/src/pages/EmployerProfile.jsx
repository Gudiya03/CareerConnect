import { useState } from "react";

const EmployerProfile = () => {

  const [company, setCompany] = useState("CareerConnect");
  const [website, setWebsite] = useState("https://careerconnect.com");
  const [location, setLocation] = useState("India");
  const [industry, setIndustry] = useState("Technology");
  const [about, setAbout] = useState(
    "We are building a modern job portal connecting employers with talented developers."
  );

  return (
    <div className="max-w-4xl space-y-8">

      {/* TITLE */}

      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Company Profile
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your company information
        </p>
      </div>


      {/* PROFILE CARD */}

      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-8">

        {/* LOGO */}

        <div className="flex items-center gap-6 mb-6">

          <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
            {company.charAt(0)}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              {company}
            </h2>

            <p className="text-gray-500 dark:text-gray-400">
              {industry}
            </p>
          </div>

        </div>


        {/* DETAILS */}

        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <p className="text-sm text-gray-500">Website</p>
            <p className="font-medium">{website}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium">{location}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Industry</p>
            <p className="font-medium">{industry}</p>
          </div>

        </div>


        {/* ABOUT */}

        <div className="mt-6">

          <p className="text-sm text-gray-500 mb-2">
            About Company
          </p>

          <p className="text-gray-700 dark:text-gray-300">
            {about}
          </p>

        </div>

      </div>

    </div>
  );
};

export default EmployerProfile;