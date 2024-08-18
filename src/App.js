import React, { useEffect, useState } from "react";
import Dropdown from "./components/Dropdown.jsx";
import states from "./us-states.json";
import LastSearches from "./components/LastSearches.jsx";

const App = () => {
  const [lastSearches, setLastSearches] = useState([]);
  const [stateQuery, setStateQuery] = useState("");
  const [userQuery, setUserQuery] = useState("");
  const [gitHubUsers, setGitHubUsers] = useState([]);
  const [usStates, setUsStates] = useState([]);
  const numOfResults = 10;

  useEffect(() => {
    const fetchData = async () => {
      if (userQuery) {
        try {
          const response = await fetch(
            `https://api.github.com/search/users?q=${userQuery}&per_page=&${numOfResults}`
          );
          if (response.status === 403) {
            throw new Error("Rate limit exceeded");
          }
          const data = await response.json();
          const newData =
            data.items?.map(({ login, id }) => ({ name: login, id })) ?? [];
          setGitHubUsers(newData);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      } else {
        setGitHubUsers([]);
      }
    };
    fetchData();
  }, [userQuery]);

  useEffect(() => {
    if (stateQuery) {
      setUsStates(
        states
          .filter((option) =>
            option.name.toLowerCase().includes(stateQuery.toLowerCase())
          )
          .slice(0, numOfResults)
      );
    } else {
      setUsStates([]);
    }
  }, [stateQuery]);

  const addToLastSearches = (item) => {
    setLastSearches((prevState) => {
      const newSearch = [item, ...prevState];
      if (newSearch.length > 10) {
        newSearch.pop();
      }
      return newSearch;
    });
  };

  return (
    <>
      <LastSearches lastSearches={lastSearches} />
      <div className="wrapper">
        <section>
          <h1>Select a State</h1>
          <Dropdown
            query={stateQuery}
            setQuery={setStateQuery}
            options={usStates}
            getLastSearch={addToLastSearches}
          />
        </section>
        <section>
          <h1>Select a gitHub user</h1>
          <Dropdown
            query={userQuery}
            setQuery={setUserQuery}
            options={gitHubUsers}
          />
        </section>
      </div>
    </>
  );
};

export default App;
