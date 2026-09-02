import { useState } from "react";
import { loginUser } from "../services/authService";

function Login({ onLogin }) {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");

const handleSubmit = async (event) => {
event.preventDefault();

try {
  setError("");

  const data = await loginUser(email, password);

  // Pass login data to App
  onLogin(data);
} catch (error) {
  setError(
    error.response?.data?.message ||
      "Login failed"
  );
}


};

return ( <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4"> <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">

    {/* Header */}
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-bold text-gray-800">
        Welcome Back
      </h1>

      <p className="mt-2 text-sm text-gray-500">
        Login to continue to your account
      </p>
    </div>

    {/* Error Message */}
    {error && (
      <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
        {error}
      </div>
    )}

    {/* Login Form */}
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* Email */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Email Address
        </label>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Password */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Password
        </label>

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Login Button */}
      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 active:scale-[0.98]"
      >
        Login
      </button>
    </form>

    {/* Footer */}
    <p className="mt-6 text-center text-sm text-gray-500">
      Chat Application
    </p>
  </div>
</div>

);
}

export default Login;
