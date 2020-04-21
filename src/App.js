import React from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [allPlayers, setAllPlayers] = React.useState([]);
  const [allStats, setAllStats] = React.useState([]);
  const [selectedPlayerId, setSelectedPlayerId] = React.useState("");
  const getStats = () => {
    axios.get("http://localhost:3000/stats").then((res) => {
      setAllStats(res.data);
      return null;
    });
  };
  const addStat = async () => {
    await axios.post("http://localhost:3000/stats", {
      playerId: selectedPlayerId,
    });
    setSelectedPlayerId("");
    return getStats();
  };
  const deleteStat = (id) => async () => {
    await axios.delete(`http://localhost:3000/stats/`, { params: { id: id } });
    return getStats();
  };
  const AddButton = () => <button onClick={addStat}>Add</button>;
  const DeleteButton = ({ id }) => {
    return <button onClick={deleteStat(id)}>Delete</button>;
  };

  React.useEffect(() => {
    const unsubscribe = axios
      .get("http://localhost:3000/players")
      .then((res) => {
        setAllPlayers(res.data);
        return null;
      });
    return () => unsubscribe();
  }, []);
  React.useEffect(() => {
    const unsubscribe = getStats();
    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h2>Simple StatKeeper</h2>
        <p>Add and remove stats to all players in the database</p>
        <br />
        <form style={{ display: "flex" }} onSubmit={addStat}>
          <select
            value={selectedPlayerId}
            onChange={(e) => setSelectedPlayerId(e.target.value)}
          >
            <option value=""></option>
            {allPlayers.map((x) => (
              <option value={x._id} key={x._id}>
                {x.name}
              </option>
            ))}
          </select>
          <AddButton />
        </form>

        <table>
          <thead>
            <tr>
              <td>Name</td>
              <td>Time</td>
              <td>Action</td>
            </tr>
          </thead>
          <tbody>
            {allStats.map((x, index) => (
              <tr key={index}>
                <td>{x.playerId.name}</td>
                <td>{new Date(x.createdAt).toDateString()}</td>
                <td>
                  <DeleteButton id={x._id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </header>
    </div>
  );
}

export default App;
