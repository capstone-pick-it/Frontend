import React from 'react';
import searchIcon from '../../assets/images/Recruit/icon-search.svg';

const SearchBar = ({
  value,
  onChange,
  onSearch,
  placeholder = '이름을 검색하세요',
}) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch?.();
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-bar__input"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />

      <button
        type="button"
        className="search-bar__button"
        onClick={onSearch}
      >
        <img src={searchIcon} alt="검색" />
      </button>
    </div>
  );
};

export default SearchBar;