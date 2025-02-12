"use client";
import { useState } from "react";
import { districts } from "@/data/district";
import { divisions } from "@/data/division";

const Report_Crime = () => {
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [claimCode, setClaimCode] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const reportData = {
      name: isAnonymous ? "Anonymous" : e.target.name.value,
      contact: isAnonymous ? "N/A" : e.target.contact.value,
      district: selectedDistrict,
      division: selectedDivision,
      location: e.target.location.value,
      description: e.target.description.value,
      media: e.target.media.files[0] || null,
      anonymous: isAnonymous,
      claimCode: isAnonymous ? Math.random().toString(36).substr(2, 8) : null,
    };

    // Simulate backend request
    console.log("Submitting Report:", reportData);

    if (isAnonymous) {
      setClaimCode(reportData.claimCode);
      alert(
        `Your anonymous report has been submitted. Save this code to claim later: ${reportData.claimCode}`
      );
    }
  };

  return (
    <div>
      <p className="text-center font-xxl">Report with Information</p>
      <form
        onSubmit={handleSubmit}
        className="form-control w-full max-w-3xl mx-auto p-4 bg-base-200 rounded-lg shadow-md"
      >
        <label className="form-control p-4 w-full">
          <div className="label">
            <span className="label-text">What is your name?</span>
          </div>
          <input
            type="text"
            name="name"
            placeholder="Type your name"
            className="input input-bordered w-full max-w-xl"
            disabled={isAnonymous}
          />
        </label>

        <label className="form-control p-4 w-full">
          <div className="label">
            <span className="label-text">Contact No</span>
          </div>
          <input
            type="text"
            name="contact"
            placeholder="Type your contact number"
            className="input input-bordered w-full max-w-xl"
            disabled={isAnonymous}
          />
        </label>

        <div className="flex items-center p-4">
          <input
            type="checkbox"
            id="anonymous"
            className="mr-2"
            checked={isAnonymous}
            onChange={() => setIsAnonymous(!isAnonymous)}
          />
          <label htmlFor="anonymous" className="text-lg">
            Report Anonymously
          </label>
        </div>

        <div className="p-4">
          <label htmlFor="district" className="block text-lg font-medium">
            Select a District
          </label>
          <select
            id="district"
            className="mt-2 block w-full p-2 border border-gray-300 rounded-lg"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
          >
            <option value="" disabled>
              -- Select --
            </option>
            {districts.map((district, index) => (
              <option key={index} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        <div className="p-4">
          <label htmlFor="division" className="block text-lg font-medium">
            Select a Division
          </label>
          <select
            id="division"
            className="mt-2 block w-full p-2 border border-gray-300 rounded-lg"
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
          >
            <option value="" disabled>
              -- Select --
            </option>
            {divisions.map((division, index) => (
              <option key={index} value={division}>
                {division}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <label className="form-control p-4 w-full">
          <div className="label">
            <span className="label-text">Location</span>
          </div>
          <input
            type="text"
            name="location"
            placeholder="Location"
            className="input input-bordered w-full max-w-xl"
          />
        </label>

        {/* Upload Media */}
        <label className="form-control w-full mb-4">
          <div className="label">
            <span className="label-text">Upload Picture, Video, or Audio</span>
          </div>
          <input
            type="file"
            name="media"
            className="file-input file-input-bordered w-full max-w-xl"
            accept="image/*, video/*, audio/*"
          />
        </label>

        {/* AI Writing (Description) */}
        <label className="form-control w-full mb-4">
          <div className="label">
            <span className="label-text">AI Writing</span>
          </div>
          <textarea
            name="description"
            className="textarea textarea-bordered h-24"
            placeholder="Write something..."
          ></textarea>
        </label>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary w-full max-w-xs">
          Submit
        </button>

        {/* Claim Code Display */}
        {claimCode && (
          <p className="text-center mt-4 text-sm text-gray-600">
            Save this code: <strong>{claimCode}</strong> to claim your report
            later.
          </p>
        )}
      </form>
    </div>
  );
};

export default Report_Crime;
