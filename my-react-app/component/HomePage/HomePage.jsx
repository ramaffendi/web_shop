import { Container, Row, Col } from "react-bootstrap";
import logo2 from "../../src/assets/logo2.jpg";
import "./HomePage.css";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import { Swiper, SwiperSlide } from "swiper/react";
import { dataSwiper } from "../../src/data/index";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const handleOrderNow = () => {
    navigate("/"); // Ganti '/order' dengan path yang diinginkan
  };
  return (
    <>
      <Navbar />
      <div className="home-page">
        <header className="header w-100 min-vh-100">
          <Container>
            <Row>
              <Col>
                <h1>Pesan makanan mu disini !!</h1>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Fugiat at laborum voluptas soluta numquam rerum,adipisicing
                  elit. Fugiat at laborum voluptas soluta numquam rerum
                </p>
                <button onClick={handleOrderNow}>Order now</button>
              </Col>
              <Col>
                <img src={logo2} alt="logo2" />
              </Col>
            </Row>
          </Container>
        </header>
      </div>
      <div className="header-testi w-100 min-vh-100">
        <Container>
          <Row>
            <Col>
              <h2 className="text-center fw-bold py-3">Rating Customer</h2>
              <p className="text-center">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab sint
                possimus id tempora et temporibus voluptatum.
              </p>
            </Col>
          </Row>
          <Row>
            <Col>
              <Swiper
                slidesPerView={1}
                spaceBetween={10}
                pagination={{
                  clickable: true,
                }}
                breakpoints={{
                  400: {
                    slidesPerView: 2,
                    spaceBetween: 30,
                  },
                  768: {
                    slidesPerView: 3,
                    spaceBetween: 40,
                  },
                  994: {
                    slidesPerView: 3,
                    spaceBetween: 50,
                  },
                  1200: {
                    slidesPerView: 3,
                    spaceBetween: 50,
                  },
                }}
                modules={[Pagination]}
                className="mySwiper"
              >
                {dataSwiper.map((data) => {
                  return (
                    <SwiperSlide key={data.id} className="shadow">
                      <p className="desc-text">{data.desc}</p>
                      <div className="box-rating">
                        <img src={data.image} />
                        <h5>{data.name}</h5>
                        <div className="rating">
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default HomePage;
