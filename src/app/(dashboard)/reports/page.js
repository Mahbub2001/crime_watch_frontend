import React from "react";

function Reports() {
  const reports = [
    {
      title: "Crime in New York",
      author: "John Smith",
      created: "1 day ago",
      reported: 2,
      status: "Resolved",
    },
    {
      title: "Robbery in Central Park",
      author: "Jane Doe",
      created: "2 days ago",
      reported: 3,
      status: "Unresolved",
    },
    {
      title: "Suspicious Activity in Times Square",
      author: "Sam Johnson",
      created: "3 days ago",
      reported: 1,
      status: "Resolved",
    },
    {
      title: "Vandalism in Brooklyn",
      author: "Emma Wilson",
      created: "4 days ago",
      reported: 4,
      status: "Unresolved",
    },
    {
      title: "Assault in Queens",
      author: "Michael Brown",
      created: "5 days ago",
      reported: 2,
      status: "Resolved",
    },
  ];

  const comments = [
    {
      text: "Great post!",
      author: "John Smith",
      post: "Crime in New York",
      created: "1 day ago",
      reported: 2,
      status: "Resolved",
    },
    {
      text: "I hope they catch the criminal soon.",
      author: "Jane Doe",
      post: "Robbery in Central Park",
      created: "2 days ago",
      reported: 3,
      status: "Unresolved",
    },
    {
      text: "This is a serious issue that needs attention.",
      author: "Sam Johnson",
      post: "Suspicious Activity in Times Square",
      created: "3 days ago",
      reported: 1,
      status: "Resolved",
    },
    {
      text: "I'm shocked by the level of violence in this city.",
      author: "Emma Wilson",
      post: "Vandalism in Brooklyn",
      created: "4 days ago",
      reported: 4,
      status: "Unresolved",
    },
    {
      text: "The safety of our citizens is a top priority.",
      author: "Michael Brown",
      post: "Assault in Queens",
      created: "5 days ago",
      reported: 2,
      status: "Resolved",
    },
  ];
  return (
    <div className="container mx-auto" style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Manage Content</h1>
      <p style={{ color: "gray" }}>
        View and moderate posts, comments, and user reports
      </p>

      <div
        style={{
          marginTop: "20px",
          border: "1px solid #ddd",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>Posts</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f4f4f4" }}>
              <th>Title</th>
              <th>Author</th>
              <th>Created</th>
              <th>Reported</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, index) => (
              <tr key={index}>
                <td>{report.title}</td>
                <td>{report.author}</td>
                <td>{report.created}</td>
                <td>{report.reported}</td>
                <td>{report.status}</td>
                <td>
                  <button
                    style={{
                      background: "red",
                      color: "white",
                      padding: "5px",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        style={{
          marginTop: "20px",
          border: "1px solid #ddd",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>Comments</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f4f4f4" }}>
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
            {comments.map((comment, index) => (
              <tr key={index}>
                <td>{comment.text}</td>
                <td>{comment.author}</td>
                <td>{comment.post}</td>
                <td>{comment.created}</td>
                <td>{comment.reported}</td>
                <td>{comment.status}</td>
                <td>
                  <button
                    style={{
                      background: "red",
                      color: "white",
                      padding: "5px",
                      border: "none",
                      cursor: "pointer",
                    }}
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
