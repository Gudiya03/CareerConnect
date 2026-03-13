import { useEffect, useState } from "react";
import { API } from "../api/api";

const Profile = () => {
  const [profile, setProfile] = useState({
    bio: "",
    location: "",
    skills: [],
  });

  const [skillInput, setSkillInput] = useState("");

  // ================= FETCH PROFILE =================
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

  // ================= UPDATE PROFILE =================
  const saveProfile = async () => {
    try {
      await API.put("/auth/profile", profile);
      alert("Profile updated successfully");
    } catch (err) {
      alert("Update failed");
    }
  };

  // ================= ADD SKILL =================
  const addSkill = () => {
    if (!skillInput) return;

    setProfile({
      ...profile,
      skills: [...profile.skills, skillInput],
    });

    setSkillInput("");
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-bold mb-8 text-indigo-400">
        My Profile
      </h1>

      {/* BIO */}
      <div className="mb-6">
        <label className="block mb-2">Bio</label>
        <textarea
          value={profile.bio || ""}
          onChange={(e) =>
            setProfile({ ...profile, bio: e.target.value })
          }
          className="w-full p-3 rounded bg-gray-800"
        />
      </div>

      {/* LOCATION */}
      <div className="mb-6">
        <label className="block mb-2">Location</label>
        <input
          value={profile.location || ""}
          onChange={(e) =>
            setProfile({ ...profile, location: e.target.value })
          }
          className="w-full p-3 rounded bg-gray-800"
        />
      </div>

      {/* SKILLS */}
      <div className="mb-6">
        <label className="block mb-2">Skills</label>

        <div className="flex gap-3 mb-3">
          <input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            className="p-2 rounded bg-gray-800 flex-1"
          />
          <button
            onClick={addSkill}
            className="bg-indigo-600 px-4 rounded"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {profile.skills?.map((skill, index) => (
            <span
              key={index}
              className="bg-indigo-600 px-3 py-1 rounded text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={saveProfile}
        className="bg-green-600 px-6 py-3 rounded"
      >
        Save Profile
      </button>
    </div>
  );
};

export default Profile;