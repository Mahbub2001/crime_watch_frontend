"use client";
import { AuthContext } from "@/hooks/AuthProvider";
import Link from "next/link";
import React, { useContext, useState } from "react";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, logout } = useContext(AuthContext);
  console.log(user);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogOut = () => {
    logout()
      .then((result) => {})
      .catch((error) => {
        // console.log(error);
      });
  };

  return (
    <>
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link href="/" className="flex items-center space-x-3">
            {/* <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-8"
              alt="Flowbite Logo"
            /> */}
            <span className="self-center text-2xl font-semibold dark:text-white">
              Crime Watch
            </span>
          </Link>

          <div className="relative flex items-center md:order-2 space-x-3">
            {user && (
              <>
                <button
                  type="button"
                  className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                  onClick={toggleDropdown}
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="w-8 h-8 rounded-full"
                    // src="d"
                    alt="user photo"
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0  mt-72 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow-lg dark:bg-gray-700 dark:divide-gray-600">
                    <div className="px-4 py-3">
                      <span className="block text-sm dark:text-white">
                        {user?.displayName}
                      </span>
                      <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                        {user?.email}
                      </span>
                    </div>
                    <ul className="py-2">
                      <li>
                        <Link
                          href="/dash"
                          className="block px-4 py-2 text-sm text-gray-700  dark:hover:bg-gray-600 dark:text-gray-200"
                        >
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={handleLogOut}
                          className="block px-4 py-2 text-sm text-gray-700  dark:hover:bg-gray-600 dark:text-gray-200"
                        >
                          Sign out
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </>
            )}
            {!user && (
              <>
                <Link
                  href="/login"
                  className="text-sm text-gray-700 dark:text-gray-200"
                >
                  {" "}
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-sm text-gray-700 dark:text-gray-200"
                >
                  {" "}
                  Register
                </Link>
              </>
            )}
            {/* <Link
              href="/login"
              className="text-sm text-gray-700 dark:text-gray-200"
            >
              {" "}
              Login
            </Link> */}

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 text-sm text-gray-500 rounded-lg md:hidden  focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Open main menu</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 17 14">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`${
              isMobileMenuOpen ? "block" : "hidden"
            } w-full md:flex md:w-auto md:order-1`}
          >
            <ul className="flex flex-col font-thin p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 dark:border-gray-700">
              <li>
                <Link
                  href="#"
                  className="block py-2 px-3 text-blue-700 rounded-sm md:bg-transparent md:p-0 dark:text-blue-500"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="block py-2 px-3  md:hover:text-blue-700 md:p-0 dark:text-white"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/crimes"
                  className="block py-2 px-3  md:hover:text-blue-700 md:p-0 dark:text-white"
                >
                  Crimes Reports
                </Link>
              </li>
              <li>
                <Link
                  href="/report_crimes"
                  className="block py-2 px-3  md:hover:text-blue-700 md:p-0 dark:text-white"
                >
                  Report A Crime
                </Link>
              </li>
              {/* <li>
                <Link
                  href="#"
                  className="block py-2 px-3  md:hover:text-blue-700 md:p-0 dark:text-white"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="block py-2 px-3  md:hover:text-blue-700 md:p-0 dark:text-white"
                >
                  Contact
                </Link>
              </li> */}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
