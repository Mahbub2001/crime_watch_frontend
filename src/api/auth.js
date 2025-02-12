import Cookies from "js-cookie";

export const setAuthToken = async (data) => {
  const currentUser = {
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    role: data.role,
    phone_number: data.phone_number,
    display_url: data.display_url,
  };

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/${currentUser.email}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies
        body: JSON.stringify(currentUser),
      }
    );

    const result = await response.json();
    if (result.accessToken && result.refreshToken) {
      setCookie("accessToken", result.accessToken, { expires: 15 / (24 * 60) });
      setCookie("refreshToken", result.refreshToken, { expires: 7 }); 
    }

    if (result) {
      console.log("User updated and tokens set in cookies");
    } else {
      console.error("Error updating user");
    }
  } catch (err) {
    console.error("Error saving user or token:", err);
  }
};

export const setAuthToken1 = async (data) => {
  const currentUser = {
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    role: data.role,
    phone_number: data.phone_number,
    display_url: data.display_url,
  };

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/${currentUser.email}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies
        body: JSON.stringify(currentUser),
      }
    );

    const result = await response.json();

    if (result) {
      console.log("User updated and tokens set in cookies");
    } else {
      console.error("Error updating user");
    }
  } catch (err) {
    console.error("Error saving user or token:", err);
  }
};
export const fetchWithAuth = async (url, options = {}) => {
  let accessToken = Cookies.get("accessToken");

  if (!accessToken) {
    throw new Error("No access token found. Please log in.");
  }

  // Add the access token to the headers
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    let response = await fetch(url, { ...options, headers });

    // If the access token is expired, refresh it and retry the request
    if (response.status === 401) {
      const newAccessToken = await refreshAccessToken();

      if (newAccessToken) {
        // Update the access token in the headers
        headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry the original request with the new access token
        response = await fetch(url, { ...options, headers });
      } else {
        throw new Error("Failed to refresh access token. Please log in again.");
      }
    }

    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
// Function to refresh the access token
// Function to refresh the access token
const refreshAccessToken = async () => {
  const refreshToken = Cookies.get("refreshToken");

  if (!refreshToken) {
    throw new Error("No refresh token found. Please log in.");
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ refreshToken }),
    });

    const result = await response.json();

    if (result.accessToken) {
      // Update the access token in cookies
      Cookies.set("accessToken", result.accessToken, { expires: 15 / (24 * 60) }); // 15 minutes
      return result.accessToken;
    } else {
      throw new Error("Failed to refresh access token.");
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};
// Function to logout
export const logoutApiCall = async () => {
  try {
    // Step 1: Check if the access token is expired
    let accessToken = Cookies.get("accessToken");

    if (!accessToken) {
      throw new Error("No access token found. Please log in.");
    }

    // Step 2: Attempt to logout with the current access token
    let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 401) {
      const newAccessToken = await refreshAccessToken();

      if (newAccessToken) {
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
          },
        });
      } else {
        throw new Error("Failed to refresh access token. Please log in again.");
      }
    }

    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    console.log("Logged out successfully");
  } catch (err) {
    console.error("Error during logout:", err);
    throw err;
  }
};
