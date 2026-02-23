// // import { useState } from "react";
// // import api from "../api/axios";
// // import { useNavigate } from "react-router-dom";

// // const Register = () => {
// //   const [name, setName] = useState("");
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");

// //   const navigate = useNavigate();

// //   const handleRegister = async () => {
// //     try {
// //       await api.post("/auth/register", {
// //         name,
// //         email,
// //         password,
// //       });

// //       alert("Registered successfully");
// //       navigate("/login");
// //     } catch (err) {
// //       alert("Register failed");
// //     }
// //   };

// //   return (
// //     <div>
// //       <h2>Register</h2>

// //       <input
// //         placeholder="Name"
// //         onChange={(e) => setName(e.target.value)}
// //       />

// //       <input
// //         placeholder="Email"
// //         onChange={(e) => setEmail(e.target.value)}
// //       />

// //       <input
// //         placeholder="Password"
// //         type="password"
// //         onChange={(e) => setPassword(e.target.value)}
// //       />

// //       <button onClick={handleRegister}>Register</button>
// //     </div>
// //   );
// // };

// // export default Register;
















// import { useState } from "react";
// import { API } from "../api/api";
// import { useNavigate } from "react-router-dom";

// const Register = () => {
//   const [name,setName]=useState("");
//   const [email,setEmail]=useState("");
//   const [password,setPassword]=useState("");
//   const navigate = useNavigate();

//   const submit = async () => {
//     try{
//       await API.post("/auth/register",{name,email,password});
//       alert("Registered!");
//       navigate("/login");
//     }catch (err) {
//   console.log("REGISTER ERROR:", err.response?.data);
//   alert(err.response?.data?.message || "Register failed");
// }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-100">
//       <div className="bg-white p-8 shadow rounded w-96">
//         <h2 className="text-2xl font-bold mb-6">Register</h2>

//         <input className="w-full p-3 mb-4 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Name" onChange={e=>setName(e.target.value)} />
//         <input className="w-full p-3 mb-4 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Email" onChange={e=>setEmail(e.target.value)} />
//         <input className="w-full p-3 mb-4 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Password" type="password" onChange={e=>setPassword(e.target.value)} />

//         <button onClick={submit} className="w-full bg-indigo-600 text-white py-2 rounded">
//           Register
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Register;


import { useState } from "react";
import { API } from "../api/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("candidate");

  const navigate = useNavigate();

  const submit = async () => {
    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      alert("Registered!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 shadow rounded w-96">
        <h2 className="text-2xl font-bold mb-6">Register</h2>

        <input
          className="w-full p-3 mb-4 rounded bg-gray-800 text-white"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full p-3 mb-4 rounded bg-gray-800 text-white"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full p-3 mb-4 rounded bg-gray-800 text-white"
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
          className="w-full p-3 mb-4 rounded bg-gray-800 text-white"
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="candidate">Candidate</option>
          <option value="employer">Employer</option>
        </select>

        <button
          onClick={submit}
          className="w-full bg-indigo-600 text-white py-2 rounded"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Register;