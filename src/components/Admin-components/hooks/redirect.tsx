import { NavigateFunction } from "react-router-dom";

export const redirectBasedOnRole = (navigate: NavigateFunction) => {
  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    const user = JSON.parse(storedUser);
    if (user.role === "Admin") {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  }
};