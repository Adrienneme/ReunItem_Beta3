import { useState } from "react";
import { loginUser } from "../../api/users";
import { useNavigate } from "react-router-dom";
import logo from '../../assets/icons/logo.png'

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please enter both email and password.");
    } else {
      try {
        const response = await loginUser(form);

        localStorage.setItem("token", response.access_token)
        localStorage.setItem("user", JSON.stringify(response.user))

        console.log("User Logged in", response);
        alert("successfully logged in!");

        if (response.user.role === 'user') {
          navigate('/user/home');
        } else if (response.user.role === 'admin') {
          navigate('/admin/home');
        }

      } catch (error) {
        setError(error.response?.data?.detail || "Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="w-[350px] mx-auto my-12 p-8 border-2 border-black rounded-lg text-center bg-gradient-to-b from-[#E6DADA] to-[#274046] shadow-md text-gray-900">
      <div>
        <div className="flex flex-row items-center justify-center mb-5">
          <img className="w-15" src={logo}></img>
          <h1 className="text-4xl"><b>ReunItem</b></h1>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900"><b>Welcome Back!</b></h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col items-start">
        <label className="text-sm mt-2 text-white">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter email"
          className="w-full p-2 mt-1 border border-black rounded text-gray-900 placeholder-gray-300"
        />

        <label className="text-sm mt-3 text-white">Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter password"
          className="w-full p-2 mt-1 border border-black rounded text-gray-900 placeholder-gray-300"
        />

        {error && <p className="text-red-800 text-sm mt-2">{error}</p>}

        <button
          type="submit"
          className="mt-5 w-full py-2 bg-black text-white rounded hover:bg-gray-800 transition"
        >
          Login
        </button>
      </form>

      <p className="mt-4 text-sm text-white">
        Don’t have an account?{" "}
        <a href="/signup" className="text-blue-500 hover:underline">
          Signup here
        </a>
      </p>
    </div>
  );
};

export default Login;
