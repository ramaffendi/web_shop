import { useEffect, useState } from "react";
import axios from "axios";
// import PropTypes from "prop-types";
import "./Tags.css";

const Tags = ({ onTagClick, selectedCategory }) => {
  const [tags, setTags] = useState([]); // Inisialisasi dengan array kosong
  const [activeTag, setActiveTag] = useState(false); // State untuk tag yang aktif

  // Mengambil data tags dari API
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.REACT_APP_API_URL}/api/tags`
        );

        if (Array.isArray(response.data)) {
          setTags(response.data);
        } else {
          console.error("Expected an array but got:", response.data);
        }
      } catch (err) {
        console.error("Error fetching tags:", err);
      }
    };

    fetchTags();
  }, []);

  // Reset aktif tag ketika kategori berubah
  useEffect(() => {
    setActiveTag(false);
  }, [selectedCategory]);

  // Fungsi untuk menangani klik pada tag
  const handleTagClick = (tagName) => {
    setActiveTag(tagName);
    if (onTagClick) {
      onTagClick(tagName);
    }
  };

  return (
    <div className="box-tags">
      <p>Tags</p>
      {Array.isArray(tags) && tags.length > 0 ? (
        <ul className="tag-list">
          {tags.map((tag) => (
            <li
              key={tag._id || tag.name}
              className={`tag-item ${activeTag === tag.name ? "active" : ""}`}
              onClick={() => handleTagClick(tag.name)}
            >
              {tag.name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No tags available</p>
      )}
    </div>
  );
};

export default Tags;
