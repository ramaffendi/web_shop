import { useEffect, useState } from "react";
import axios from "axios";
// import PropTypes from "prop-types"; // Import PropTypes
import "./Categories.css";

const CategoryMenu = ({ onSelectCategory, resetCategory }) => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(false); // Tambahkan state untuk kategori aktif
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.REACT_APP_API_URL}/api/categories`
      );
      console.log("Fetched categories:", response.data);

      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        throw new Error("Expected an array but got invalid response");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to load categories. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Reset kategori jika resetCategory berubah
  useEffect(() => {
    console.log("reset", resetCategory);
    if (resetCategory) {
      setActiveCategory(false); // Reset kategori aktif
    }
  }, [resetCategory]);

  if (loading) {
    return <p>Loading categories...</p>;
  }

  if (error) {
    return <p className="error-message">Error: {error}</p>;
  }

  if (categories.length === 0) {
    return <p>No categories available.</p>;
  }

  const handleCategoryClick = (categoryName) => {
    setActiveCategory(categoryName); // Set kategori yang aktif
    onSelectCategory(categoryName); // Panggil fungsi dari prop
  };

  return (
    <div className="category-menu">
      <div className="box-category">
        <h2>Categories</h2>
      </div>
      <div className="btn-category">
        <ul>
          {/* All Products Button */}
          <li
            className={`btn-all ${activeCategory === null ? "active" : ""}`}
            onClick={() => handleCategoryClick(null)}
            role="button"
          >
            All Products
          </li>

          {/* Dynamic Category List */}
          {categories.map((category) => (
            <li
              key={category._id}
              className={`category-item ${
                activeCategory === category.name ? "active" : ""
              }`}
              onClick={() => handleCategoryClick(category.name)}
              role="button"
            >
              {category.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryMenu;
