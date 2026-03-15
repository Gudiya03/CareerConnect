import { useEffect, useState } from "react";
import { API } from "../api/api";

const Profile = () => {

  const [profile, setProfile] = useState({
    bio: "",
    location: "",
    skills: [],
  });

  const [skillInput, setSkillInput] = useState("");
  const [editMode, setEditMode] = useState(false);

  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");

  const avatarLetter = userName
    ? userName.charAt(0).toUpperCase()
    : "U";

  // FETCH PROFILE
  const fetchProfile = async () => {
    try {
      const res = await API.get("/auth/profile");
      setProfile(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // SAVE PROFILE
  const saveProfile = async () => {
    try {
      await API.put("/auth/profile", profile);
      alert("Profile updated");
      setEditMode(false);
    } catch {
      alert("Update failed");
    }
  };

  // ADD SKILL
  const addSkill = () => {
    if (!skillInput) return;

    setProfile({
      ...profile,
      skills: [...profile.skills, skillInput],
    });

    setSkillInput("");
  };

  return (
    <div className="w-full min-h-screen bg-white dark:bg-[#020617] text-gray-900 dark:text-white">

      <div className="max-w-4xl mx-auto px-6 py-12">

        <h1 className="text-3xl font-bold mb-10 text-indigo-600 dark:text-indigo-400">
          My Profile
        </h1>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-gray-200 dark:border-slate-700">

          {/* PROFILE HEADER */}

          <div className="flex items-center gap-4 mb-8">

            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
              {avatarLetter}
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                {userName || "User"}
              </h2>

              <p className="text-gray-500 dark:text-gray-400">
                {userEmail || "No email"}
              </p>
            </div>

          </div>

          {/* VIEW MODE */}

          {!editMode && (
            <div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-1">Bio</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {profile.bio || "No bio added"}
                </p>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-1">Location</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {profile.location || "No location added"}
                </p>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Skills</h2>

                <div className="flex flex-wrap gap-2">
                  {profile.skills?.length > 0 ? (
                    profile.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-400">No skills added</p>
                  )}
                </div>
              </div>

              <button
                onClick={() => setEditMode(true)}
                className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded text-white"
              >
                Edit Profile
              </button>

            </div>
          )}

          {/* EDIT MODE */}

          {editMode && (
            <div>

              {/* BIO */}
              <div className="mb-6">
                <label className="block mb-2 font-medium">Bio</label>

                <textarea
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  className="w-full p-3 rounded bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700"
                />
              </div>

              {/* LOCATION */}
              <div className="mb-6">
                <label className="block mb-2 font-medium">Location</label>

                <input
                  value={profile.location}
                  onChange={(e) =>
                    setProfile({ ...profile, location: e.target.value })
                  }
                  className="w-full p-3 rounded bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700"
                />
              </div>

              {/* SKILLS */}
              <div className="mb-6">

                <label className="block mb-2 font-medium">Skills</label>

                <div className="flex gap-3 mb-3">

                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    className="flex-1 p-3 rounded bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700"
                  />

                  <button
                    onClick={addSkill}
                    className="bg-indigo-600 px-4 rounded text-white"
                  >
                    Add
                  </button>

                </div>

                <div className="flex flex-wrap gap-2">

                  {profile.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}

                </div>

              </div>

              <div className="flex gap-4">

                <button
                  onClick={saveProfile}
                  className="bg-green-600 px-6 py-2 rounded text-white"
                >
                  Save
                </button>

                <button
                  onClick={() => setEditMode(false)}
                  className="bg-gray-500 px-6 py-2 rounded text-white"
                >
                  Cancel
                </button>

              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default Profile;