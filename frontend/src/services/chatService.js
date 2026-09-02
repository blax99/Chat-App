import api from "./api";


// Get all users
export const getUsers = async (token) => {
  const response = await api.get("/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};


// Get chat history with a user
export const getChatHistory = async (
  userId,
  token
) => {
  const response = await api.get(
    `/messages/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getStats = async (token) => {
  const response = await api.get("/stats", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};