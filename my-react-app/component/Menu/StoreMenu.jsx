import { useState, useEffect, useCallback } from "react";
import axios from "axios";
// import PropTypes from "prop-types";
import "./StoreMenu.css";
import { useCart } from "../ShopContext/UseCartContext";

const ProductMenu = ({ selectedCategory, selectedTag, skip = 0, setSkip }) => {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState();
  const limit = 8;
  const [loading, setLoading] = useState(false);

  // Mengambil cartItems dan fungsi dari useCart
  const { addToCart } = useCart();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.REACT_APP_API_URL}/api/products`,
        {
          params: {
            skip,
            limit,
            category: selectedCategory,
            tags: selectedTag,
          },
        }
      );
      setProducts(response.data.data);
      setTotalProducts(response.data.count);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [skip, limit, selectedCategory, selectedTag]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="box-product">
      <h3>Product List</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="list-product">
          <ul>
            {products.map((product) => {
              return (
                <li key={product._id}>
                  <h2 className="name-h2">{product.name}</h2>
                  {product.image_url && (
                    <img
                      src={`${
                        import.meta.env.REACT_APP_API_URL
                      }/images/products/${product.image_url}`}
                      alt={product.name}
                      width="200"
                    />
                  )}
                  <div className="product-info">
                    <p className="price">
                      Rp {product.price.toLocaleString("id-ID")}
                    </p>
                    <div className="item-controls">
                      <button
                        className="btn btn-primary"
                        onClick={() => addToCart(product._id, product.name, 1)}
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="pagination">
            {skip > 0 && (
              <button
                onClick={() => {
                  setSkip(skip - limit);
                  window.scrollTo(0, 0);
                }}
                className=" btn btn-secondary"
              >
                Previous
              </button>
            )}
            {skip + limit < totalProducts && (
              <button
                onClick={() => {
                  setSkip(skip + limit);
                  window.scrollTo(0, 0);
                }}
                className=" btn btn-secondary"
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductMenu;
