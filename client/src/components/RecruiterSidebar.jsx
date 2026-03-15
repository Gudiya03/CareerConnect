import { Link, useLocation } from "react-router-dom";

const RecruiterSidebar = () => {

  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/employer", icon: "📊" },
    { name: "Jobs", path: "/employer/jobs", icon: "💼" },
    { name: "Applicants", path: "/employer/applicants", icon: "👥" },
    { name: "Analytics", path: "/employer/analytics", icon: "📈" }
  ];

  return (

    <aside
      className="
      fixed
      top-16
      left-0
      w-60
      h-[calc(100vh-64px)]
      bg-white
      dark:bg-slate-900
      border-r
      border-gray-200
      dark:border-slate-700
      p-6
      hidden
      md:flex
      flex-col
      "
    >

      {/* TITLE */}

      <h2 className="text-indigo-600 dark:text-indigo-400 font-bold text-lg mb-8">
        Recruiter Panel
      </h2>

      {/* MENU */}

      <ul className="space-y-3">

        {menu.map((item) => {

          const active = location.pathname === item.path;

          return (

            <Link key={item.name} to={item.path}>

              <li
                className={`
                  flex items-center gap-3
                  px-3 py-2
                  rounded-lg
                  cursor-pointer
                  transition
                  ${
                    active
                      ? "bg-indigo-600 text-white shadow"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                  }
                `}
              >

                <span className="text-lg">{item.icon}</span>

                <span className="text-sm font-medium">
                  {item.name}
                </span>

              </li>

            </Link>

          );

        })}

      </ul>

    </aside>

  );

};

export default RecruiterSidebar;