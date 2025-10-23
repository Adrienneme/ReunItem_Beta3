import { useState } from "react";
import { registerUser } from "../../api/users";
import { useNavigate } from "react-router-dom";
import logo from '../../assets/icons/logo.png'

const Signup = () => {
  const [form, setForm] = useState({ //should match backend schema
    first_name: "",
    last_name: "",
    email: "",
    password_hash: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.first_name || !form.last_name || !form.email || !form.password_hash) {
      setError("Please fill out all fields.");
    }
    else {
      try {
        const response = await registerUser({ ...form, role: "user" });
        console.log("User created: ", response);
        navigate('/login');
        alert("Account created successfully!")
      } catch (error) {
        setError(error.response?.data?.detail || "Something went wrong.");
        console.error(err.detail);
      }
    }
  };

  return (
    <div className="w-[350px] mx-auto my-12 p-8 border-2 border-black rounded-lg text-center bg-gradient-to-b from-[#E6DADA] to-[#274046] shadow-md text-black">
      <div>
        <div className="flex flex-row items-center justify-center mb-5">
          <img className="w-15" src={logo}></img>
          <h1 className="text-4xl"><b>ReunItem</b></h1>
        </div>
        <h2 className="text-2xl font-semibold text-black">
          <b>Create an Account!</b>
        </h2>
      </div>



      <form onSubmit={handleSubmit} className="flex flex-col items-start">
        <label className="text-sm mt-2 text-white">First Name</label>
        <input
          type="text"
          name="first_name"
          value={form.first_name}
          onChange={handleChange}
          placeholder="Enter first name"
          className="w-full p-2 mt-1 border border-black rounded text-black placeholder-gray-300"
        />

        <label className="text-sm mt-3 text-white">Last Name</label>
        <input
          type="text"
          name="last_name"
          value={form.last_name}
          onChange={handleChange}
          placeholder="Enter last name"
          className="w-full p-2 mt-1 border border-black rounded text-black placeholder-gray-300"
        />

        <label className="text-sm mt-3 text-white">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter email"
          className="w-full p-2 mt-1 border border-black rounded text-black placeholder-gray-300"
        />

        <label className="text-sm mt-3 text-white">Password</label>
        <input
          type="password"
          name="password_hash"
          value={form.password_hash}
          onChange={handleChange}
          placeholder="Enter password"
          className="w-full p-2 mt-1 border border-black rounded text-black placeholder-gray-300"
        />

        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

        <button
          type="submit"
          className="mt-5 w-full py-2 bg-black text-white rounded hover:bg-gray-800 transition"
        >
          Sign Up
        </button>
      </form>

      <p className="mt-4 text-sm text-white">
        Already have an account?{" "}
        <a href="/login" className="text-blue-600 hover:underline">
          Login here
        </a>
      </p>
    </div>
  );
};

export default Signup;
