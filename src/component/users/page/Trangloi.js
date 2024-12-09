import React from "react";
import Footerusers from "../Footerusers";
import { Link } from "react-router-dom";
import HeaderUsers from "../HeaderUsers";

const Trangloi = () => {
  return (
    <>
      <HeaderUsers />
      <div>
        {/* Single Page Header start */}
        <div className="container-fluid page-header py-5 bg-dark text-white text-center">
          <h1 className="display-4"></h1>
          {/* <ol className="breadcrumb justify-content-center mb-0">
            <li className="breadcrumb-item">
              <Link to="#">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="#">Pages</Link>
            </li>
            <li className="breadcrumb-item active text-white">404</li>
          </ol> */}
        </div>
        {/* Single Page Header End */}
        {/* 404 Start */}
        <div className="container py-5">
          <section className="page_404 text-center">
            <div className="row justify-content-center">
              <div className="col-sm-10">
                <div className="four_zero_four_bg">
                  <h1 className="text-center">404</h1>
                </div>
                <div className="contant_box_404">
                  <h3 className="h2">Có vẻ như bạn bị lạc</h3>
                  <p>Trang bạn đang tìm kiếm không có sẵn!!</p>
                  <Link to="/" className="btn btn-success link_404">
                    Trở về trang chủ
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
        {/* 404 End */}
      </div>
      <Footerusers />
    </>
  );
};

export default Trangloi;
