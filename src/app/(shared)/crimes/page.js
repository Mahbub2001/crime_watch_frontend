"use client";

import { useState, useEffect } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { toast } from "react-toastify";

export default function CrimeReports() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState("date");
  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalPost, setModalPost] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  

  const postsPerPage = 3;

  // Fetch crime reports from backend
  useEffect(() => {
    const fetchCrimes = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/crimes?search=${searchQuery}&sortBy=${sortKey}&division=${division}&district=${district}&page=${currentPage}&limit=${postsPerPage}`
        );
        const data = await response.json();

        setPosts(data.crimes);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError("Failed to fetch crime reports.");
      }

      setLoading(false);
    };

    fetchCrimes();
  }, [searchQuery, sortKey, division, district, currentPage]);

  //   console.log(posts);

  const handleDownVote = async (id) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/crimes/${id}/downvote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      //   setPosts(data.crimes);
      toast.success("Downvoted Successfully");
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpVote = async (id) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/crimes/${id}/upvote`, // FIXED HERE
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      //   setPosts(data.crimes);
      toast.success("Upvoted Successfully");
    } catch (err) {
      console.error(err);
    }
  };
  

  return (
    <div className="min-h-screen p-6 mx-auto container ">
      {/* Search & Filter */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search crime reports..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          className="border p-2 rounded"
          onChange={(e) => setSortKey(e.target.value)}
        >
          <option value="date">Sort by Date</option>
          <option value="upvotes">Sort by Upvotes</option>
          <option value="downvotes">Sort by Downvotes</option>
          <option value="verificationScore">Sort by Verification Score</option>
        </select>
        <select
          className="border p-2 rounded"
          onChange={(e) => setDivision(e.target.value)}
        >
          <option value="">All Divisions</option>
          <option value="Rajshahi">Rajshahi</option>
          <option value="Dhaka">Dhaka</option>
          {/* Add more divisions */}
        </select>
        <select
          className="border p-2 rounded"
          onChange={(e) => setDistrict(e.target.value)}
        >
          <option value="">All Districts</option>
          <option value="Faridpur">Faridpur</option>
          {/* Add more districts */}
        </select>
      </div>

      {/* Error Handling */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Loading State */}
      {loading && <p className="text-gray-500">Loading crime reports...</p>}

      {/* Crime Posts */}
      {!loading && posts.length === 0 && <p>No crime reports found.</p>}
      {posts.map((post) => (
        <div
          key={post._id}
          className="hero bg-white rounded-lg shadow-md p-6 mb-4"
        >
          <div className="hero-content flex-col lg:flex-row">
            {/* Crime Image */}
            {post.media?.length > 0 ? (
              <img
                src={post.media[0]}
                alt="Crime"
                className="max-w-sm rounded-lg shadow-2xl"
              />
            ) : (
              <FiAlertTriangle className="text-gray-400 text-6xl" />
            )}
            <div>
              <h1 className="text-3xl font-bold">{post.title}</h1>
              <p className="py-4">{post.description}</p>
              <p className="text-sm text-gray-500">
                Division: {post.division} | District: {post.district}
              </p>
              <p className="text-sm text-gray-500">
                Verification Score: {post.verificationScore} | Upvotes:{" "}
                {post.upvotes} | Downvotes: {post.downvotes}
              </p>
              <button
                onClick={() => setModalPost(post)}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 border rounded"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-4 py-2 border rounded ${
              currentPage === index + 1 ? "bg-gray-300" : ""
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          className="px-4 py-2 border rounded"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {modalPost && (
        <div className="fixed w-xl inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative">
            <button
              onClick={() => setModalPost(null)}
              className="absolute top-4 right-4 bg-red-700 text-white rounded-full p-2 hover:bg-red-600"
            >
              ✕
            </button>

            {modalPost.media?.length > 0 && (
              <img
                src={modalPost.media[0]}
                alt="Crime"
                className="w-full h-56 object-cover rounded-lg mb-4"
              />
            )}

            <h2 className="text-2xl font-bold text-gray-800">
              {modalPost.title}
            </h2>
            <p className="text-gray-600 mt-2">{modalPost.description}</p>
            <div className="mt-4 text-gray-700 border-t pt-4">
              <p>
                <strong>Division:</strong> {modalPost.division} |{" "}
                <strong>District:</strong> {modalPost.district}
              </p>
              <p>
                <strong>Verification Score:</strong>{" "}
                {modalPost.verificationScore}
              </p>
              <p>
                <strong>Upvotes:</strong> {modalPost?.upvotes} |{" "}
                <strong>Downvotes:</strong> {modalPost?.downvotes}
                <button
                  onClick={() => handleUpVote(modalPost._id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
                >
                  Upvote
                </button>
                <button
                  onClick={() => handleDownVote(modalPost._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded ml-2"
                >
                  Downvote
                </button>
              </p>
            </div>

            <button
              onClick={() => setModalPost(null)}
              className="mt-6 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
