import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SearchBar() {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        const searchTerm = e.target.value;
        setQuery(searchTerm);

        if (searchTerm.length > 1) {
            try {
                const response = await axios.get(`http://localhost:5000/api/products/search?query=${searchTerm}`);
                setSuggestions(response.data);
            } catch (error) {
                console.error("Error fetching search results:", error);
            }
        } else {
            setSuggestions([]);
        }
    };

    const handleSelect = (productId) => {
        navigate(`/product/${productId}`);
        setSuggestions([]);
        setQuery("");
    };

    return (
        <div className="position-relative">
            <input
                type="text"
                className="form-control"
                placeholder="Search for products..."
                value={query}
                onChange={handleSearch}
            />
            {suggestions.length > 0 && (
                <ul className="list-group position-absolute w-100 mt-1 shadow-lg">
                    {suggestions.map((product) => (
                        <li
                            key={product._id}
                            className="list-group-item list-group-item-action"
                            onClick={() => handleSelect(product._id)}
                        >
                            {product.name} - {product.category}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SearchBar;
