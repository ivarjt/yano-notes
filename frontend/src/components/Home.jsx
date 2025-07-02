import Notes from "./Notes";
import Welcome from "./Welcome";

function Home({ token }) {
  return (
    <div>
      {token ? <Notes token={token} /> : <Welcome />}
    </div>
  );
}

export default Home;
