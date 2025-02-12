"use client";
import { getUserRole } from "@/api/user";
import { AuthContext } from "@/hooks/AuthProvider";
import React, { useContext, useEffect, useState } from "react";

const emergencyContacts = {
  Dhaka: { hospital: "+8801712345678", police: "+8801712345689" },
  Chattogram: { hospital: "+8801723456789", police: "+8801723456790" },
  Sylhet: { hospital: "+8801734567890", police: "+8801734567891" },
  Rajshahi: { hospital: "+8801745678901", police: "+8801745678902" },
  Barishal: { hospital: "+8801756789012", police: "+8801756789013" },
  Khulna: { hospital: "+8801767890123", police: "+8801767890124" },
  Rangpur: { hospital: "+8801778901234", police: "+8801778901235" },
  Mymensingh: { hospital: "+8801789012345", police: "+8801789012346" },
};

function Dash() {
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

  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [contacts, setContacts] = useState({ hospital: "", police: "" });

  const divisions = Object.keys(emergencyContacts);
  const districts = Object.keys(emergencyContacts[selectedDivision] || {});

  const handleDivisionChange = (e) => {
    const division = e.target.value;
    setSelectedDivision(division);
    setSelectedDistrict("");
    setContacts({ hospital: "", police: "" });
  };

  const handleDistrictChange = (e) => {
    const district = e.target.value;
    setSelectedDistrict(district);
    setContacts(
      emergencyContacts[selectedDivision] || { hospital: "", police: "" }
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
      {role === "user" && (
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
          <h1 className="text-2xl font-semibold text-center text-blue-600 mb-6">
            Emergency Contact Information
          </h1>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="division"
                className="block text-lg font-medium text-gray-700"
              >
                Select Division:
              </label>
              <select
                id="division"
                value={selectedDivision}
                onChange={handleDivisionChange}
                className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">--Select Division--</option>
                {divisions.map((division) => (
                  <option key={division} value={division}>
                    {division}
                  </option>
                ))}
              </select>
            </div>

            {selectedDivision && (
              <div>
                <label
                  htmlFor="district"
                  className="block text-lg font-medium text-gray-700"
                >
                  Select District:
                </label>
                <select
                  id="district"
                  value={selectedDistrict}
                  onChange={handleDistrictChange}
                  className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">--Select District--</option>
                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedDistrict && (
              <div className="mt-6 bg-gray-50 p-4 rounded-md border border-gray-200">
                <h2 className="text-xl font-medium text-blue-600">
                  Emergency Contacts for {selectedDistrict}, {selectedDivision}
                </h2>
                <div className="mt-4 space-y-2">
                  <p>
                    <strong className="text-lg">Hospital:</strong>{" "}
                    <span className="text-gray-700">{contacts.hospital}</span>
                  </p>
                  <p>
                    <strong className="text-lg">Police:</strong>{" "}
                    <span className="text-gray-700">{contacts.police}</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dash;
