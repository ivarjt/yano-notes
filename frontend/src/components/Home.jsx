import React from "react";

function Home({ username, onLogout }) {
  return (
    <div>
      {username ? (
        <>
          <h2>Welcome {username}!</h2>
          <button onClick={onLogout}>Logout</button>
        </>
      ) : (
        <>
          <p>Welcome!</p>
          <p>Please log in or register.</p>
        </>
      )}
    </div>
  );
}

export default Home;
