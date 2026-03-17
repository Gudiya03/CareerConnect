import { useEffect, useState } from "react";
import { API } from "../api/api";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [skillInput, setSkillInput] = useState("");

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

  const saveProfile = async () => {
    try {
      await API.put("/auth/profile", profile);
      alert("Profile updated 🚀");
      setEditMode(false);
      fetchProfile();
    } catch {
      alert("Update failed");
    }
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;

    setProfile((prev) => ({
      ...prev,
      skills: [...(prev.skills || []), skillInput.trim()],
    }));

    setSkillInput("");
  };

  if (!profile) return <p className="text-center mt-10">Loading...</p>;

  const avatarLetter = profile.name
    ? profile.name.charAt(0).toUpperCase()
    : "U";

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#020617] p-6 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="bg-gray-50 dark:bg-slate-900 p-6 rounded-xl border border-black dark:border-white shadow mb-6 flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
            {avatarLetter}
          </div>

          <div>
            <h2 className="text-2xl font-bold">{profile.name}</h2>
            <p className="text-gray-600 dark:text-gray-400">{profile.email}</p>
            <p className="text-sm text-indigo-500 capitalize">
              {profile.role}
            </p>
          </div>
        </div>

        {/* CANDIDATE */}
        {profile?.role === "candidate" && (
          <div className="bg-gray-50 dark:bg-slate-900 p-6 rounded-xl border border-black dark:border-white shadow">
            <h3 className="text-xl font-semibold mb-4">Candidate Profile</h3>

            {!editMode ? (
              <>
                <p><strong>Bio:</strong> {profile.bio || "No bio added"}</p>
                <p><strong>Location:</strong> {profile.location || "Not set"}</p>

                <div className="mt-4">
                  <strong>Skills:</strong>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profile.skills?.length ? (
                      profile.skills.map((s, i) => (
                        <span key={i} className="bg-indigo-500 text-white px-3 py-1 rounded-full text-sm">
                          {s}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-400">No skills</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setEditMode(true)}
                  className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg transition"
                >
                  Edit Profile
                </button>
              </>
            ) : (
              <>
                <textarea
                  placeholder="Bio"
                  value={profile.bio || ""}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  className="w-full p-3 mb-3 border border-black dark:border-white rounded bg-white dark:bg-slate-800"
                />

                <input
                  placeholder="Location"
                  value={profile.location || ""}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, location: e.target.value }))
                  }
                  className="w-full p-3 mb-3 border border-black dark:border-white rounded bg-white dark:bg-slate-800"
                />

                <div className="flex gap-2 mb-3">
                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    className="flex-1 p-2 border border-black dark:border-white rounded bg-white dark:bg-slate-800"
                  />
                  <button
                    onClick={addSkill}
                    className="bg-indigo-600 text-white px-3 rounded"
                  >
                    Add
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={saveProfile}
                    className="bg-green-600 px-5 py-2 text-white rounded"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setEditMode(false)}
                    className="bg-gray-400 px-5 py-2 text-white rounded"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* EMPLOYER */}
        {profile?.role === "employer" && (
          <div className="bg-gray-50 dark:bg-slate-900 p-6 rounded-xl border border-black dark:border-white shadow">
            <h3 className="text-xl font-semibold mb-4">Company Profile</h3>

            {!editMode ? (
              <>
                <p><strong>Company:</strong> {profile.companyName || "Not set"}</p>
                <p><strong>Website:</strong> {profile.companyWebsite || "Not set"}</p>
                <p><strong>Location:</strong> {profile.location || "Not set"}</p>
                <p><strong>About:</strong> {profile.bio || "No description"}</p>

                <button
                  onClick={() => setEditMode(true)}
                  className="mt-6 bg-indigo-600 text-white px-5 py-2 rounded"
                >
                  Edit Company
                </button>
              </>
            ) : (
              <>
                <input
                  placeholder="Company Name"
                  value={profile.companyName || ""}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, companyName: e.target.value }))
                  }
                  className="w-full p-3 mb-3 border border-black dark:border-white rounded bg-white dark:bg-slate-800"
                />

                <input
                  placeholder="Website"
                  value={profile.companyWebsite || ""}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, companyWebsite: e.target.value }))
                  }
                  className="w-full p-3 mb-3 border border-black dark:border-white rounded bg-white dark:bg-slate-800"
                />

                <input
                  placeholder="Location"
                  value={profile.location || ""}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, location: e.target.value }))
                  }
                  className="w-full p-3 mb-3 border border-black dark:border-white rounded bg-white dark:bg-slate-800"
                />

                <textarea
                  placeholder="Company Description"
                  value={profile.bio || ""}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  className="w-full p-3 mb-3 border border-black dark:border-white rounded bg-white dark:bg-slate-800"
                />

                <div className="flex gap-3">
                  <button className="bg-green-600 px-5 py-2 text-white rounded" onClick={saveProfile}>
                    Save
                  </button>
                  <button className="bg-gray-400 px-5 py-2 text-white rounded" onClick={() => setEditMode(false)}>
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;