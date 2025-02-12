"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

function Reports() {
  const [reports, setReports] = useState([]);
  const [comments, setComments] = useState([]);

  // Fetch crime reports
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/crimes`);
        const data = await response.json();
        setReports(data.crimes);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };
    fetchReports();
  }, []);
  console.log(reports);
  
  // Fetch comments
  // useEffect(() => {
  //   const fetchComments = async () => {
  //     try {
  //       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments`);
  //       const data = await response.json();
  //       setComments(data);
  //     } catch (error) {
  //       console.error("Error fetching comments:", error);
  //     }
  //   };
  //   fetchComments();
  // }, []);

  // Delete a crime report
  const handleDeleteReport = async (id) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/crimes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const result = await response.json();
      if (response.ok) {
        setReports(reports.filter((report) => report._id !== id));
        toast.success("Crime report deleted");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error deleting crime report:", error);
    }
  };

  // Delete a comment
  const handleDeleteComment = async (id) => {
    try {
      const response = await fetch(`${API_URL}/comments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const result = await response.json();
      if (response.ok) {
        setComments(comments.filter((comment) => comment._id !== id));
        toast.success("Comment deleted");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold">Manage Content</h1>
      <p className="text-gray-600">View and moderate posts, comments, and user reports</p>

      {/* Crime Reports Table */}
      <div className="mt-6 border p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold">Posts</h2>
        <table className="w-full border-collapse mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th>Title</th>
              <th>Author</th>
              <th>Created</th>
              <th>Reported</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report._id}>
                <td>{report.title}</td>
                <td>{report.author}</td>
                <td>{report.createdAt}</td>
                <td>{report.reported ? "Yes" : "No"}</td>
                <td>{report.status}</td>
                <td>
                  <button
                    onClick={() => handleDeleteReport(report._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Comments Table */}
      <div className="mt-6 border p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold">Comments</h2>
        <table className="w-full border-collapse mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th>Comment</th>
              <th>Author</th>
              <th>Post</th>
              <th>Created</th>
              <th>Reported</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((comment) => (
              <tr key={comment._id}>
                <td>{comment.text}</td>
                <td>{comment.author}</td>
                <td>{comment.post}</td>
                <td>{comment.timestamp}</td>
                <td>{comment.reported ? "Yes" : "No"}</td>
                <td>{comment.status}</td>
                <td>
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Reports;
