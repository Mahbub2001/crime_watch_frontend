import React, { useContext, useState } from "react";
import { BsBoxArrowInLeft, BsPeople } from "react-icons/bs";
import { ImProfile } from "react-icons/im";
import { CgHome, CgShoppingCart } from "react-icons/cg";
import { IoMdAdd } from "react-icons/io";
import { MdProductionQuantityLimits, MdSell } from "react-icons/md";
import Link from "next/link";
import { AuthContext } from "@/hooks/AuthProvider";

const DashboardSidebar = ({ role }) => {
  const [open, setOpen] = useState(true);
  const { logout, user } = useContext(AuthContext);

  const handleClick = () => {
    logout()
      .then((result) => {})
      .catch((error) => console.log(error));
  };

  return (
    <div className="fixed lg:block border ">
      <div className="lg:hidden fixed md:block top-5">
        <button
          onClick={() => setOpen(!open)}
          className="navbar-burger flex items-center text-blue-600 p-3 fixed"
        >
          <svg
            className="block h-4 w-4 fill-current"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Mobile menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
          </svg>
        </button>
      </div>
      <div
        className={`min-h-screen lg:flex ${
          open ? "hidden" : "flex"
        } flex-row bg-gray-100`}
      >
        <div className="flex flex-col w-56 bg-white rounded-r-3xl overflow-hidden">
          <div className="flex items-center justify-center h-20 shadow-md">
            <Link href="/" className="text-3xl uppercase text-indigo-500">
              CRIME WATCH
            </Link>
          </div>
          <ul className="flex flex-col py-4">
            <li className="flex flex-col justify-center items-center my-10">
              <img
                className="inline-block h-36 w-36 rounded-full ring-2 ring-white"
                src={user?.photoURL}
                alt=""
              />
              <h5>{user?.displayName}</h5>
            </li>
            {role && role === "user" && (
              <>
                <li>
                  <Link
                    href="/my_reports"
                    className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800"
                  >
                    <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                      <CgShoppingCart className="text-orange-700 opacity-90" />
                    </span>
                    <span className="text-sm font-medium">My Reports</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/my_comments"
                    className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800"
                  >
                    <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                      <CgShoppingCart className="text-orange-700 opacity-90" />
                    </span>
                    <span className="text-sm font-medium">My Comments</span>
                  </Link>
                </li>
              </>
            )}
            {role && role === "admin" && (
              <>
                {/* <li>
                  <Link
                    href="/Home"
                    className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800"
                  >
                    <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                      <CgHome className="text-orange-700 opacity-90" />
                    </span>
                    <span className="text-sm font-medium"> HOME</span>
                  </Link>
                </li> */}
                <li>
                  <Link
                    href="/reports"
                    className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800"
                  >
                    <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                      <MdSell className="text-orange-700 opacity-90" />
                    </span>
                    <span className="text-sm font-medium"> ALL REPORTS</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/all_people"
                    className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800"
                  >
                    <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                      <BsPeople className="text-orange-700 opacity-90" />
                    </span>
                    <span className="text-sm font-medium">ALL PEOPLE</span>
                  </Link>
                </li>
              </>
            )}

            {/* <li>
              <Link
                href="/dashboard/profile"
                className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800"
              >
                <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                  <ImProfile className="text-orange-700 opacity-90" />
                </span>
                <span className="text-sm font-medium">PROFILE</span>
              </Link>
            </li> */}

            <li onClick={handleClick}>
              <button className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
                <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                  <BsBoxArrowInLeft className="text-orange-700 opacity-90" />
                </span>
                <span className="text-sm font-medium">LOG OUT</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
