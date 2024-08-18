import React, { useCallback, useEffect, useState } from "react";
import "./module.scss";

const Dropdown = ({ options, getLastSearch = null, query, setQuery }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const handleQueryChange = (event) => {
    const newQuery = event.target.value;
    setQuery(newQuery);
    setIsDropdownOpen(true);
    setHighlightedIndex(-1);
  };

  const handleOptionClick = useCallback((item) => {
    setQuery(item.name);
    if (getLastSearch) {
      getLastSearch(item.name);
    }
    setIsDropdownOpen(false);
  }, [getLastSearch, setQuery])

  const handleKeyDown = useCallback((e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex === options.length - 1 ? 0 : prevIndex + 1
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex <= 0 ? options.length - 1 : prevIndex - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && options[highlightedIndex]) {
        handleOptionClick(options[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsDropdownOpen(false);
    }
  }, [handleOptionClick, highlightedIndex, options])

  useEffect(() => {
    if (isDropdownOpen) {
      window.addEventListener("keydown", handleKeyDown);
    } else {
      window.removeEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDropdownOpen, highlightedIndex, options, handleKeyDown]);

  const handleClear = () => {
    setQuery("");
    setIsDropdownOpen(false);
  };

  return (
    <div className="dropdown">
      <div className="search-container">
        <input
          className="search-input"
          type="text"
          value={query}
          onChange={handleQueryChange}
          placeholder="search..."
          onClick={() => setIsDropdownOpen(true)}
          onFocus={() => setIsDropdownOpen(true)}
        />
        {query && (
          <button className="clear-button" onClick={handleClear}>
            X
          </button>
        )}
      </div>
      {isDropdownOpen && (
        <ul className="dropdown-list">
          {options.length > 0 ? (
            options.map((option, index) => (
              <li
                className={`dropdown-item ${
                  index === highlightedIndex ? "highlighted" : ""
                }`}
                key={index}
                onClick={() => handleOptionClick(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {option.name}
              </li>
            ))
          ) : (
            <li className="dropdown-item">No results found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
