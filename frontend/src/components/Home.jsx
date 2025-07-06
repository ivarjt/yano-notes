import { useEffect, useState } from "react";
import Notes from "./Notes";
import Welcome from "./Welcome";

function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:8000/auth/me", {
          credentials: "include", 
        });
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <p>Loading...</p>; // or a spinner
  }

  return <div>{isAuthenticated ? <Notes /> : <Welcome />}</div>;
}

export default Home;
