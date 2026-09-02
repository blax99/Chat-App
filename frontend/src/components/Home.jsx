function Home({ onLogin, onRegister }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-md">
        <h1 className="mb-3 text-3xl font-bold">
          Chat App
        </h1>

        <p className="mb-8 text-gray-500">
          Connect with people and start chatting.
        </p>

        <div className="flex gap-4">
          <button
            onClick={onLogin}
            className="flex-1 rounded bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
          >
            Login
          </button>

          <button
            onClick={onRegister}
            className="flex-1 rounded border border-blue-600 px-4 py-3 font-medium text-blue-600 hover:bg-blue-600 hover:text-white"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;