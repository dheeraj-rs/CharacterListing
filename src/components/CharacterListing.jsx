import React, { useEffect, useState } from "react";
import "../styles/CharacterListing.css";
import search from "../assets/search.png";
import axios from "axios";
import { Link } from "react-router-dom";

const ANY = "Any";
const INITIAL_PERPAGE = 10;
const INITIAL_PAGE = 1;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function CharacterListing() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState(ANY);
  const [selectedGender, setSelectedGender] = useState(ANY);
  const [selectedRace, setSelectedRace] = useState(ANY);
  const [sortedData, setSortedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(INITIAL_PAGE);
  const [charactersPerPage, setCharactersPerPage] = useState(INITIAL_PERPAGE);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    handleFilterAndSort();
  }, [data]);

    // useEffect(() => {
  //   handleFilterAndSort();
  // }, [data, searchQuery, sortOption, selectedGender, selectedRace]);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://the-one-api.dev/v2/character", {
        headers: {
          Authorization: `${API_BASE_URL}`,
        },
      });
      const characterData = response.data.docs;
      setData(characterData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleFilterAndSort();
    setSearchQuery("");
  };

  const handleFilterAndSort = () => {
    const filteredData = data.filter(
      (character) =>
        character.name.toLowerCase().startsWith(searchQuery.toLowerCase()) &&
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
          <form onSubmit={handleSearchSubmit} className="search-container">
            <p className="label">Search</p>
            <input
              type="text"
              placeholder="by name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">
              <img src={search} alt="search" className="search-img" />
            </button>
          </form>
          <span></span>
          <div className="sort-container">
            <p className="label">Sort By</p>
            <select
              className="sort-option"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value={ANY}>by name (asc / dsc)</option>
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
              onChange={(e) => setSelectedRace(e.target.value)}
            >
              <option value={ANY}>list of races, multiection</option>
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
              onChange={(e) => setSelectedGender(e.target.value)}
            >
              <option value={ANY}>male/female/any</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value={ANY}>Any</option>
            </select>
          </div>
          <span></span>
          <button className="submit-btn" onClick={handleFilterAndSort}>
            Submit
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
              </select>
            </div>
          </div>
        </footer>
      </main>
    </section>
  );
}

export default CharacterListing;
