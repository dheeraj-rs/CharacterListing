import React, { useEffect, useState } from "react";
import "../styles/CharacterListing.css";
import search from "../assets/search.png";
import axios from "axios";
import { Link } from "react-router-dom";

const ANY = "Any"
const INITIAL_VALUE = 10

function CharacterListing() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState(ANY);
  const [selectedGender, setSelectedGender] = useState(ANY);
  const [selectedRace, setSelectedRace] = useState(ANY);
  const [sortedData, setSortedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [charactersPerPage, setCharactersPerPage] = useState(INITIAL_VALUE);

  useEffect(() => {
    fetchData();
  },[]);

  useEffect(() => {
    handleFilterAndSort();
  },[data]);

  const fetchData = async () => {
    console.log("🚀 Requests .......");
    try {
      const response = await axios.get("https://the-one-api.dev/v2/character", {
        headers: {
          Authorization: "Bearer MkIs5B5Li54W9BMpv1Mk",
        },
      });
      const characterData = response.data.docs;
      console.log("🚀 ~ file: CharacterListing.jsx:30 ~ fetchData ~ characterData:", characterData)
      setData(characterData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleGenderFilter = (gender) => {
    setSelectedGender(gender);
  };

  const handleRaceFilter = (race) => {
    setSelectedRace(race);
  };

  const handleSearchSubmit = () => {
    handleFilterAndSort()
    setSearchQuery("");

  };


  const handleFilterAndSort = () => {
    const filteredData = data.filter(
      (character) =>
      character.name.toLowerCase().startsWith(searchQuery.toLowerCase())&&
        (selectedGender === ANY || character.gender === selectedGender) &&
        (selectedRace === ANY || character.race === selectedRace)
    );

    const newSortedData = [...filteredData];
    newSortedData.sort((a, b) => {
      if (sortOption === "asc") {
        return a.name.localeCompare(b.name);
      } else if (sortOption === "dsc") {
        return b.name.localeCompare(a.name);
      }
    });

    setSortedData(newSortedData);
  };


  const handleReset = () => {
    setSearchQuery("");
    setSortOption(ANY);
    setSelectedGender(ANY);
    setSelectedRace(ANY);
    handleFilterAndSort()
  };

  const pagesToShow = 4;
  const margin = Math.floor(pagesToShow / 2);

  const totalPages = Math.ceil(sortedData.length / charactersPerPage);

  let startPage = Math.max(1, currentPage - margin);
  let endPage = Math.min(totalPages, startPage + pagesToShow - 1);

  if (endPage - startPage + 1 < pagesToShow) {
    startPage = Math.max(1, endPage - pagesToShow + 1);
  }

  const indexOfLastCharacter = currentPage * charactersPerPage;
  const indexOfFirstCharacter = indexOfLastCharacter - charactersPerPage;
  const currentCharacters = sortedData.slice(
    indexOfFirstCharacter,
    indexOfLastCharacter
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <section>
      <main>
        <header>
          <p>Character</p>
        </header>
        <div className="main-container">
          <div className="search-container">
            <p className="label">Search</p>
            <input
              type="text"
              placeholder="by name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <img src={search} alt="search"  onClick={handleSearchSubmit} />
          </div>
          <span></span>
          <div className="sort-container">
            <p className="label">Sort By</p>
            <select
              className="sort-option"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value={ANY} disabled>
                by name (asc / dsc)
              </option>
              <option value="asc">asc</option>
              <option value="dsc">dsc</option>
            </select>
          </div>
        </div>

        <div className="main-container">
          <div className="race-container">
          <p>Race</p>
          <select
            className="race-option"
            value={selectedRace}
            onChange={(e) => handleRaceFilter(e.target.value)}
          >
            <option value={ANY} disabled>
              list of races, multiection
            </option>
            <option value="Human">Human</option>
            <option value="Elf">Elf</option>
            <option value="Dwarf">Dwarf</option>
            <option value="Hobbit">Hobbit</option>
            <option value="Men">Men</option>
          </select>
          </div>
          <div className="gender-container">
          <p className="label">Gender</p>
          <select
            className="gender-option"
            value={selectedGender}
            onChange={(e) => handleGenderFilter(e.target.value)}
          >
            <option value={ANY} disabled>
              male/female/any
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value={ANY}>Any</option>
          </select>
          </div>
          <span></span>
          <button className="submit-btn" onClick={handleFilterAndSort}>
            Submit
          </button>
          <button className="reset-btn" onClick={handleReset}>
            Reset
          </button>
        </div>
        <hr />
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Race</th>
                <th>Gender</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentCharacters?.map((character, index) => (
                <tr key={character._id}>
                  <td>{index + 1}</td>
                  <td>{character.name}</td>
                  <td>{character.race}</td>
                  <td>{character.gender}</td>
                  <td>
                    <Link
                      className="details-text"
                      to={`/details/${character._id}`}
                    >
                      Details ˃˃
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <hr />
        <footer>
          <div className="pagination">
            <button
              onClick={() => paginate(1)}
              className={currentPage === 1 ? "active" : ""}
            >
              1
            </button>

            {startPage > 3 && <span>...</span>}
            {Array.from({ length: endPage - startPage + 1 }).map((_, index) => (
              <button
                key={startPage + index + 1}
                onClick={() => paginate(startPage + index + 1)}
                className={
                  currentPage === startPage + index + 1 ? "active" : ""
                }
              >
                {startPage + index + 1}
              </button>
            ))}
            {endPage < totalPages - 1 && <span>...</span>}
            {totalPages > 2 && (
              <button
                onClick={() => paginate(totalPages)}
                className={currentPage === totalPages ? "active" : ""}
              >
                {totalPages}
              </button>
            )}
          </div>

          <div className="limit-container">
            <div className="limit-div">
            <p>Limit</p>
            <select
              value={charactersPerPage}
              onChange={(e) => setCharactersPerPage(e.target.value)}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="40">40</option>
              <option value="50">50</option>
              <option value="60">60</option>
              <option value="70">70</option>
              <option value="80">80</option>
              <option value="90">90</option>
              <option value="100">100</option>
            </select>
            </div>
          </div>
        </footer>
      </main>
    </section>
  );
}

export default CharacterListing;
