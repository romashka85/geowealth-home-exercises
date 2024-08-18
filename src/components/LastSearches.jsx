import React from "react";
import "./lastSearch.scss"; 

const LastSearches = ({lastSearches}) => {
  return (
	<div className="search-history">
		<h2>Last 10 searches</h2>
		{lastSearches.length > 0 ?
		lastSearches.map((item, index) => (
			<li key={index}>{item}</li>
		)) : (
			<p>There is no searches yet</p>
		)
	} 
	</div>
  )
}
export default LastSearches;