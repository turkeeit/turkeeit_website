import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function CarouselComponent() {
  return (
    <>
      <div id="mainCarousel" className="carousel slide" data-bs-ride="carousel">
        {/* Indicators */}
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#mainCarousel"
            data-bs-slide-to="0"
            className="active"
          ></button>
          <button
            type="button"
            data-bs-target="#mainCarousel"
            data-bs-slide-to="1"
          ></button>
          <button
            type="button"
            data-bs-target="#mainCarousel"
            data-bs-slide-to="2"
          ></button>
        </div>

        {/* Slides */}
        <div className="carousel-inner" style={{ height: "400px" }}>
          <div className="carousel-item active ">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw6Za_zJkKor0z7pXenqESfddYIl_wT-7dEA&s"
              className="d-block w-100"
              alt="Slide 1"
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw6Za_zJkKor0z7pXenqESfddYIl_wT-7dEA&s"
              className="d-block w-100"
              alt="Slide 2"
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw6Za_zJkKor0z7pXenqESfddYIl_wT-7dEA&s"
              className="d-block w-100"
              alt="Slide 3"
            />
          </div>
        </div>

        {/* Controls */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#mainCarousel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon"></span>
        </button>

        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#mainCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>
    </>
  );
}
