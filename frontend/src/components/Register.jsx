import { useState } from "react";
import { registerUser } from "../services/authService";

function Register({ onRegisterSuccess, onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");

      await registerUser(name, email, password);

      onRegisterSuccess();
    } catch (error) {
      setError(
        error.response?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold">
          Create Account
        </h1>

        {error && (
          <p className="mb-4 text-center text-red-500">
            {error}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="rounded border p-3 outline-none focus:border-blue-500"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="rounded border p-3 outline-none focus:border-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="rounded border p-3 outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            className="rounded bg-blue-600 p-3 font-medium text-white hover:bg-blue-700"
          >
            Register
          </button>
        </form>

        <button
          onClick={onLogin}
          className="mt-4 w-full text-sm text-blue-600 hover:underline"
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}

export default Register;