import React from "react";
import Link from "next/link";

const Banner = () => {
  return (
    <div>
      <div
        className="hero h-[500px] relative !z-10"
        style={{
          backgroundImage: `url('police1.png')`, // Background image
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="hero-overlay bg-black bg-opacity-50 absolute inset-0"></div>
        <div className="relative text-left text-white px-6 md:px-16 lg:px-32">
          <div className="max-w-lg">
            <h1 className="mb-5 text-5xl font-extrabold leading-tight">
              Report Crime, Stay Safe
            </h1>
            <p className="mb-5 text-lg text-gray-200">
              Your voice matters. Report crimes anonymously and help make your
              community safer. Together, we can fight crime and protect lives.
            </p>

            <Link href="/report_crimes">
              <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-lg">
                Report a Crime
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
