import { useState } from "react";
import CategoryMenu from "./Categories/Categories";
import ProductMenu from "./Menu/StoreMenu";
import AppDownload from "./AppDownload/AppDownload";
import Footer from "./Footer/Footer";
import Navbar from "./Navbar/Navbar";
import { useCart } from "../component/ShopContext/UseCartContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Style/App.css";
import Tags from "./Tags/Tags";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(false); // Menyimpan kategori yang dipilih
  const [skip, setSkip] = useState(0); // Mengatur halaman produk
  const { cartItems } = useCart(); // Mengambil data dari context
  const [selectedTag, setSelectedTag] = useState(false);
  const [resetCategory, setResetCategory] = useState(false); // Menyimpan tag yang dipilih

  // Fungsi untuk memilih kategori
  const handleSelectCategory = (categoryName) => {
    setSelectedCategory(categoryName); // Set kategori yang dipilih
    setSelectedTag(false);
    setResetCategory(false); // Reset tag yang dipilih
    setSkip(0); // Reset pagination saat kategori berubah
  };

  // Fungsi untuk menampilkan semua produk tanpa filter kategori
  const handleShowAllProducts = () => {
    setSelectedCategory(false);
    setResetCategory(false); // Reset kategori
    setSkip(0); // Reset pagination
  };

  // Menghitung total item dalam cart
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  // Fungsi untuk menangani klik pada tag
  const handleTagClick = (tagId) => {
    setSelectedTag(tagId); // Set tag yang dipilih
    setSelectedCategory(false);
    setResetCategory(true);
    setSkip(0); // Reset pagination saat tag berubah
  };

  return (
    <>
      <Navbar
        totalItems={totalItems}
        setSelectedCategory={handleShowAllProducts} // Memberikan fungsi untuk menampilkan semua produk
      />
      <div className="home">
        <div className="box-content">
          <div className="content-container">
            <CategoryMenu
              onSelectCategory={handleSelectCategory}
              resetCategory={resetCategory} // Prop untuk mereset kategori
            />
            <Tags
              onTagClick={handleTagClick}
              selectedCategory={selectedCategory}
            />
          </div>
          {/* Menampilkan ProductMenu dan memberikan props untuk filter */}
          <ProductMenu
            selectedCategory={selectedCategory}
            skip={skip}
            setSkip={setSkip}
            selectedTag={selectedTag}
          />
        </div>
        <AppDownload />
      </div>
      <Footer />
    </>
  );
};

export default Home;
