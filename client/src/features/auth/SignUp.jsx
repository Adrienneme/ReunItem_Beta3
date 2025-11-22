import { useState } from "react";
import { registerUser } from "../../api/users";
import { useNavigate } from "react-router-dom";
import logo from '../../assets/icons/logo.png'


const checkPasswordStrength = (password) => {
    
    const minLength = 8;
    
    const hasAlphaNumeric = /[a-zA-Z]/.test(password) && /\d/.test(password); 
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (password.length === 0) {
        return { status: 'none', color: 'text-gray-400', text: 'Enter a password' };
    } else if (password.length < minLength) {
        return { status: 'weak', color: 'text-red-900', text: `Weak: Must be at least ${minLength} characters.` };
    } else if (password.length >= minLength && hasAlphaNumeric && hasSpecialChar) {
        return { status: 'strong', color: 'text-green-500', text: 'Strong: Excellent password.' };
    } else if (password.length >= minLength && hasAlphaNumeric) {
        return { status: 'good', color: 'text-yellow-500', text: 'Good: Add a special character for max strength.' };
    } else {
        return { status: 'weak', color: 'text-red-900', text: 'Weak: Requires letters, numbers, and at least 8 characters.' };
    }
};


const Signup = () => {
    const [form, setForm] = useState({ //should match backend schema
        first_name: "",
        last_name: "",
        email: "",
        password_hash: "",
    });

  
    const [passwordStrength, setPasswordStrength] = useState(checkPasswordStrength("")); 
    
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError(""); 
    };


    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        
        setForm({ ...form, [e.target.name]: newPassword });
        
        
        setPasswordStrength(checkPasswordStrength(newPassword));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); 

        if (!form.first_name || !form.last_name || !form.email || !form.password_hash) {
            setError("Please fill out all fields.");
            return; 
        }

        
        if (passwordStrength.status === 'weak') {
            setError("Password is too weak. Please choose a stronger password.");
            return; 
        }
        
        try {
            const response = await registerUser({ ...form, role: "user" });
            console.log("User created: ", response);
            navigate('/login');
            alert("Account created successfully!")
        } catch (err) {
            setError(err.response?.data?.detail || "Something went wrong.");
            console.error(err.response?.data?.detail || err);
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
                    onChange={handlePasswordChange}
                    placeholder="Enter password"
                    className="w-full p-2 mt-1 border border-black rounded text-black placeholder-gray-300"
                />
                
                {/* --- 4. Display Password Strength Status below the input --- */}
                {form.password_hash && ( // Only show if password field has content
                    <p className={`text-sm mt-2 font-medium ${passwordStrength.color}`}>
                        {passwordStrength.text}
                    </p>
                )}
                {/* --- End Display Password Strength Status --- */}

                {/* Display general errors or success messages */}
                {error && <p className="text-red-900 text-sm mt-2">{error}</p>}
                {message && <p className="text-green-600 text-sm mt-2">{message}</p>}
                
                <button
                    type="submit"
                    className="mt-5 w-full py-2 bg-black text-white rounded hover:bg-gray-800 transition"
                >
                    Sign Up
                </button>
            </form>

            <p className="mt-4 text-sm text-white">
                Already have an account?{" "}
                <a href="/login" className="text-blue-500 hover:underline">
                    Login here
                </a>
            </p>
        </div>
    );
};

export default Signup;