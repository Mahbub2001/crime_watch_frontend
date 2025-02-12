"use client";

import { useState, useEffect } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { toast } from "react-toastify";

export default function CrimeReports() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalPost, setModalPost] = useState(null);

  // Fetch latest crime reports (limit to 4)
  useEffect(() => {
    const fetchCrimes = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/crimes?sortBy=date&limit=4`
        );
        const data = await response.json();
        setPosts(data.crimes);
      } catch (err) {
        setError("Failed to fetch crime reports.");
      }

      setLoading(false);
    };

    fetchCrimes();
  }, []);

  // Handle upvote/downvote actions
  const handleVote = async (id, type) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/crimes/${id}/${type}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      await response.json();
      toast.success(`${type === "upvote" ? "Upvoted" : "Downvoted"} Successfully`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen p-6 mx-auto container">
      <h2 className="text-3xl font-bold mb-6 text-center">Latest Crime Reports</h2>

      {/* Error Handling */}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Loading State */}
      {loading && <p className="text-gray-500 text-center">Loading crime reports...</p>}

      {/* Crime Reports Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {!loading && posts.length === 0 && <p className="text-center">No crime reports found.</p>}
        {posts.map((post) => (
          <div key={post._id} className="bg-white rounded-lg shadow-md p-4">
            {/* Crime Image */}
            {post.media?.length > 0 ? (
              <img src={post.media[0]} alt="Crime" className="w-full h-40 object-cover rounded-lg" />
            ) : (
              <div className="flex justify-center items-center h-40 bg-gray-200 rounded-lg">
                <FiAlertTriangle className="text-gray-400 text-5xl" />
              </div>
            )}

            <h3 className="text-xl font-bold mt-3">{post.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{post.description}</p>
            <p className="text-xs text-gray-500 mt-2">
              <strong>Division:</strong> {post.division} | <strong>District:</strong> {post.district}
            </p>
            <p className="text-xs text-gray-500">
              <strong>Verification Score:</strong> {post.verificationScore}
            </p>

            <div className="mt-3 flex justify-between">
              <button
                onClick={() => handleVote(post._id, "upvote")}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
              >
                Upvote {post.upvotes}
              </button>
              <button
                onClick={() => handleVote(post._id, "downvote")}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm"
              >
                Downvote {post.downvotes}
              </button>
              <button
                onClick={() => setModalPost(post)}
                className="bg-gray-700 text-white px-3 py-1 rounded text-sm"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalPost && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative">
            <button
              onClick={() => setModalPost(null)}
              className="absolute top-4 right-4 bg-red-700 text-white rounded-full p-2 hover:bg-red-600"
            >
              ✕
            </button>

            {modalPost.media?.length > 0 && (
              <img src={modalPost.media[0]} alt="Crime" className="w-full h-56 object-cover rounded-lg mb-4" />
            )}

            <h2 className="text-2xl font-bold text-gray-800">{modalPost.title}</h2>
            <p className="text-gray-600 mt-2">{modalPost.description}</p>
            <div className="mt-4 text-gray-700 border-t pt-4">
              <p>
                <strong>Division:</strong> {modalPost.division} |{" "}
                <strong>District:</strong> {modalPost.district}
              </p>
              <p>
                <strong>Verification Score:</strong> {modalPost.verificationScore}
              </p>
              <p>
                <strong>Upvotes:</strong> {modalPost.upvotes} |{" "}
                <strong>Downvotes:</strong> {modalPost.downvotes}
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
