import Cookies from "js-cookie";
const refreshAccessToken = async () => {
  const refreshToken = Cookies.get("refreshToken");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ refreshToken }),
      }
    );

    const result = await response.json();

    if (result.accessToken) {
      // Update the access token in cookies
      Cookies.set("accessToken", result.accessToken, {
        expires: 15 / (24 * 60),
      }); // 15 minutes
      return result.accessToken;
    } else {
      throw new Error("Failed to refresh access token.");
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};

export const getUserRole = async (email) => {
    let token = Cookies.get("ny-token");
  
    let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },
      credentials: "include",
    });
  
    if (response.status === 401) {
      const newAccessToken = await refreshAccessToken(); 
  
      if (newAccessToken) {
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${email}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${newAccessToken}`, 
          },
          credentials: "include",
        });
      } else {
        throw new Error("Failed to refresh access token. Please log in again.");
      }
    }
  
    let user;
    try {
      user = await response.json();
    } catch (err) {
      throw new Error("Failed to parse response.");
    }
  
    return user?.role;
  };
  
// export const getUserProfile = async (email) => {
//   const token = Cookies.get("ny-token");

//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/user/${email}`,
//     {
//       method: "GET",
//       headers: {
//         "content-type": "application/json",
//         authorization: `Bearer ${token}`,
//       },
//     }
//   );
//   const user = await response.json();
//   return user;
// };
