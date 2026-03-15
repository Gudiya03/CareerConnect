import { Link, Outlet, useLocation } from "react-router-dom";

const EmployerLayout = () => {

  const location = useLocation();

 
    const menu = [
  { name: "Dashboard", path: "/employer", icon: "📊" },
  { name: "Jobs", path: "/employer/jobs", icon: "💼" },
  { name: "Applicants", path: "/employer/applicants", icon: "👥" },
  { name: "Analytics", path: "/employer/analytics", icon: "📈" },
  { name: "Profile", path: "/employer/profile", icon: "👤" }
];
  

  return (

    <div className="flex min-h-screen bg-white dark:bg-[#020617] text-gray-900 dark:text-white">

      {/* SIDEBAR */}

      <aside className="w-64 border-r border-gray-200 dark:border-slate-800 p-6 bg-white dark:bg-slate-900">

        <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-8">
          Recruiter Panel
        </h2>

        <nav className="space-y-3">

          {menu.map((item) => {

            const active = location.pathname === item.path;

            return (

              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                  active
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                }`}
              >

                {/* ICON */}
                <span className="text-lg">
                  {item.icon}
                </span>

                {/* TEXT */}
                <span>
                  {item.name}
                </span>

              </Link>

            );

          })}

        </nav>

      </aside>

      {/* PAGE CONTENT */}

      <main className="flex-1 p-6">
        <Outlet />
      </main>

    </div>

  );

};

export default EmployerLayout;