function UserList({
  users,
  selectedUser,
  onSelectUser,
  onLogout,
}) {
  return (
    <div className="h-full bg-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-white p-4">
        <h2 className="text-xl font-bold">
          Chats
        </h2>

        <button
          onClick={onLogout}
          className="text-sm text-red-500 hover:text-red-700"
        >
          Logout
        </button>
      </div>

      {/* User List */}
      <div>
        {users.map((user) => {
          const isSelected =
            selectedUser?._id === user._id;

          return (
            <button
              key={user._id}
              onClick={() => onSelectUser(user)}
              className={`
                w-full border-b p-4 text-left
                transition
                ${isSelected
                  ? "bg-blue-100"
                  : "bg-white hover:bg-gray-100"
                }
              `}
            >
              <div className="flex items-center gap-2">
                <div className="font-semibold">
                  {user.name}
                </div>

                <span
                  className={`
      h-2
      w-2
      rounded-full
      ${user.isOnline
                      ? "bg-green-500"
                      : "bg-gray-400"
                    }
    `}
                />
              </div>

              <div className="text-sm text-gray-500">
                {user.isOnline
                  ? "Online"
                  : "Offline"}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default UserList;