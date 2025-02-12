"use client";
import { useContext, useState } from "react";
import { districts } from "@/data/district";
import { divisions } from "@/data/division";
import { imageUpload } from "@/api/imageUploadApi";
import { AuthContext } from "@/hooks/AuthProvider";
import { toast } from "react-toastify";

const Report_Crime = () => {
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [claimCode, setClaimCode] = useState(null);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const { user } = useContext(AuthContext);

  const handleGenerateDescription = async () => {
    if (mediaFiles.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    const formData = new FormData();
    mediaFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await fetch("http://127.0.0.1:5000/describe-images", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setDescription(data.description);
      setTitle(`Report for ${selectedDistrict}, ${selectedDivision}`);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to generate description. Please try again.");
    }
  };

  console.log(description);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // Upload images one by one and collect URLs
  //   const uploadedImages = await Promise.all(
  //     mediaFiles.map(async (file) => {
  //       const uploadedData = await imageUpload(file);
  //       return uploadedData?.data?.url; // Extracting the image URL
  //     })
  //   );
  //   const filteredImages = uploadedImages.filter((url) => url);

  //   const reportData = {
  //     name: isAnonymous ? "Anonymous" : e.target.name.value,
  //     contact: isAnonymous ? "N/A" : e.target.contact.value,
  //     district: selectedDistrict,
  //     division: selectedDivision,
  //     location: e.target.location.value,
  //     description: description,
  //     title: title,
  //     crime_data: selectedDate,
  //     useremail: user?.email,
  //     media: filteredImages,
  //     anonymous: isAnonymous,
  //     claimCode: isAnonymous ? Math.random().toString(36).substr(2, 8) : null,
  //   };

  //   console.log("Submitting Report:", reportData);

  //   if(!user || !user.emailVerified){
  //       alert("Please login to submit a report");
  //       return;
  //   }

  //   fetch(`${process.env.NEXT_PUBLIC_API_URL}/crimes`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(reportData),
  //   }).then((response) => {
  //     if (!response.ok) {
  //       throw new Error("Failed to submit report");
  //     }
  //     toast.success("Report submitted successfully");
  //     return response.json();
  //   });
  //   // return;

  //   if (isAnonymous) {
  //     setClaimCode(reportData.claimCode);
  //     alert(
  //       `Your anonymous report has been submitted. Save this code to claim later: ${reportData.claimCode}`
  //     );
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const image = mediaFiles[0]; 
    const description = e.target.description.value; 

    try {
      // Send image and description to verify API
      const formData = new FormData();
      formData.append("image", image);
      formData.append("description", description);

      const verifyResponse = await fetch("http://127.0.0.1:5000/verify-description", {
        method: "POST",
        body: formData,
      });

      const verifyData = await verifyResponse.json();
      if (verifyResponse.ok) {
        if (verifyData.description_verification !== "real") {
          alert("Description does not match the image.");
          // return; // Stop if the description doesn't match
        }
        console.log("Image and description verified as real.");

        // Proceed with uploading images
        const uploadedImages = await Promise.all(
          mediaFiles.map(async (file) => {
            const uploadedData = await imageUpload(file);
            return uploadedData?.data?.url; 
          })
        );
        const filteredImages = uploadedImages.filter((url) => url);

        const reportData = {
          name: isAnonymous ? "Anonymous" : e.target.name.value,
          contact: isAnonymous ? "N/A" : e.target.contact.value,
          district: selectedDistrict,
          division: selectedDivision,
          location: e.target.location.value,
          description: description,
          title: title,
          crime_data: selectedDate,
          useremail: user?.email,
          media: filteredImages,
          verifyresult: verifyData.description_verification,
          anonymous: isAnonymous,
          claimCode: isAnonymous
            ? Math.random().toString(36).substr(2, 8)
            : null,
        };

        console.log("Submitting Report:", reportData);

        if (!user || !user.emailVerified) {
          alert("Please login to submit a report");
          return;
        }

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/crimes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reportData),
        }).then((response) => {
          if (!response.ok) {
            throw new Error("Failed to submit report");
          }
          toast.success("Report submitted successfully");
          return response.json();
        });

        if (isAnonymous) {
          setClaimCode(reportData.claimCode);
          alert(
            `Your anonymous report has been submitted. Save this code to claim later: ${reportData.claimCode}`
          );
        }
      } else {
        alert("Failed to verify the description and image.");
      }
    } catch (error) {
      console.error("Error during description verification:", error);
      alert("An error occurred during description verification.");
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
            multiple
            onChange={(e) => {
              setMediaFiles((prevFiles) => [
                ...prevFiles,
                ...Array.from(e.target.files),
              ]);
            }}
          />
        </label>

        {/* Generate Description Button */}
        <button
          type="button"
          className="btn btn-secondary w-full max-w-xs mb-4"
          onClick={handleGenerateDescription}
        >
          Generate Title and Description
        </button>

        {/* AI Writing (Title) */}
        <label className="form-control w-full mb-4">
          <div className="label">
            <span className="label-text">Title</span>
          </div>
          <textarea
            name="title"
            className="textarea-bordered h-24"
            placeholder="Write something..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          ></textarea>
        </label>

        {/* AI Writing (Description) */}
        <label className="form-control w-full mb-4">
          <div className="label">
            <span className="label-text">Description</span>
          </div>
          <textarea
            name="description"
            className="textarea textarea-bordered h-24"
            placeholder="Write something..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </label>

        <div className="flex flex-col gap-2">
          <label className="form-control w-full max-w-xs">
            <span className="label-text">Select a Date</span>
            <input
              type="date"
              className="input input-bordered w-full max-w-xs"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </label>

          {selectedDate && <p>Selected Date: {selectedDate}</p>}
        </div>

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
