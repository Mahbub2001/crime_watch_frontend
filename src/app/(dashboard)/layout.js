"use client";
import "../globals.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/hooks/AuthProvider";
import Link from "next/link";
import { getUserRole } from "@/api/user";
import DashboardSidebar from "@/components/DashboardSideBar/DashboardSideBard";

function RootLayout({ children }) {
  const { user } = useContext(AuthContext);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      setLoading(true);
      getUserRole(user.email).then((data) => {
        setRole(data);
        setLoading(false);
      });
    }
  }, [user]);

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex min-h-screen">
          <DashboardSidebar role={role} />
          <div className="flex-1 flex flex-col pt-20 pl-20 px-10 text-black">
            {children}
          </div>
        </div>
      )}
    </>
  );
}

export default RootLayout;
