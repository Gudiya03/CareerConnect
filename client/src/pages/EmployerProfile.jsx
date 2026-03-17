import { useEffect, useState } from "react";
import { API } from "../api/api";

const EmployerProfile = () => {

const [profile, setProfile] = useState({
companyName: "",
companyWebsite: "",
location: "",
industry: "",
bio: ""
});

const [editMode, setEditMode] = useState(false);

// ===== FETCH DATA =====
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

// ===== SAVE =====
const saveProfile = async () => {
try {
await API.put("/auth/profile", profile);
alert("Profile updated");
setEditMode(false);
fetchProfile();
} catch {
alert("Update failed");
}
};

return ( <div className="max-w-4xl mx-auto p-6">


  <h1 className="text-3xl font-bold mb-6">Company Profile</h1>

  <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border">

    {/* VIEW MODE */}
    {!editMode && (
      <>
        <div className="flex items-center gap-4 mb-6">

          <div className="w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold">
            {profile.companyName
              ? profile.companyName.charAt(0)
              : "C"}
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              {profile.companyName || "Company Name"}
            </h2>

            <p className="text-gray-500">
              {profile.industry || "Industry"}
            </p>
          </div>

        </div>

        <p><b>Website:</b> {profile.companyWebsite || "Not set"}</p>
        <p><b>Location:</b> {profile.location || "Not set"}</p>
        <p><b>Industry:</b> {profile.industry || "Not set"}</p>

        <div className="mt-4">
          <p className="text-sm text-gray-500">About</p>
          <p>{profile.bio || "No description"}</p>
        </div>

        <button
          onClick={() => setEditMode(true)}
          className="mt-6 bg-indigo-600 text-white px-5 py-2 rounded"
        >
          Edit Profile
        </button>
      </>
    )}

    {/* EDIT MODE */}
    {editMode && (
      <>
        <input
          placeholder="Company Name"
          value={profile.companyName}
          onChange={(e) =>
            setProfile({ ...profile, companyName: e.target.value })
          }
          className="w-full p-3 mb-3 border rounded"
        />

        <input
          placeholder="Website"
          value={profile.companyWebsite}
          onChange={(e) =>
            setProfile({ ...profile, companyWebsite: e.target.value })
          }
          className="w-full p-3 mb-3 border rounded"
        />

        <input
          placeholder="Location"
          value={profile.location}
          onChange={(e) =>
            setProfile({ ...profile, location: e.target.value })
          }
          className="w-full p-3 mb-3 border rounded"
        />

        <input
          placeholder="Industry"
          value={profile.industry}
          onChange={(e) =>
            setProfile({ ...profile, industry: e.target.value })
          }
          className="w-full p-3 mb-3 border rounded"
        />

        <textarea
          placeholder="About Company"
          value={profile.bio}
          onChange={(e) =>
            setProfile({ ...profile, bio: e.target.value })
          }
          className="w-full p-3 mb-3 border rounded"
        />

        <div className="flex gap-4">
          <button
            onClick={saveProfile}
            className="bg-green-600 text-white px-5 py-2 rounded"
          >
            Save
          </button>

          <button
            onClick={() => setEditMode(false)}
            className="bg-gray-500 text-white px-5 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </>
    )}

  </div>

</div>


);
};

export default EmployerProfile;
