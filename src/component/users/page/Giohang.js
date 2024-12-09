import React, { useContext } from "react";
import Footerusers from "../Footerusers";
import HeaderUsers from "../HeaderUsers";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "./CartContext";
import { toast, ToastContainer } from "react-toastify";

const Giohang = () => {
  const { giohang, XoaGioHang, TangSoLuong, GiamSoLuong, CapnhatSoLuong, Xoatoanbogiohang } = useContext(CartContext);
  const navigate = useNavigate();

  // Tính tổng giá trị của giỏ hàng và định dạng theo kiểu tiền tệ Việt Nam
  const tongTienGioHang = giohang.reduce(
    (tong, item) => tong + parseFloat(item.gia) * item.soLuong, // Sử dụng `gia` thay vì `giatien`
    0
  );

  const handleThanhtoan = () => {
    if (giohang.length === 0) {
      toast.warning("Giỏ hàng trống, không thể thanh toán", {
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      navigate("/thanhtoan");
    }
  };

  return (
<>
  <div>
    <HeaderUsers />
    {/* Single Page Header */}
    <div className="container-fluid py-5 page-header text-white">
      <div className="text-center py-5">
      <h1 className="display-4 fw-bold text-animation">
      <span className="animated-letter">G</span>
      <span className="animated-letter">i</span>
      <span className="animated-letter">ỏ</span>
      &nbsp;
      <span className="animated-letter">H</span>
      <span className="animated-letter">à</span>
      <span className="animated-letter">n</span>
      <span className="animated-letter">g</span>
    </h1>
       
      </div>
    </div>
    {/* Cart Page */}
    <div className="container-fluid py-5">
      <div className="container">
        <div className="table-responsive">
          {/* <table className="table table-bordered text-center align-middle"> */}
          <table className="table table-bordered table-hover table-striped">
            <thead className="table-dark">
              <tr>
                <th scope="col">Hình ảnh</th>
                <th scope="col">Tên sản phẩm</th>
                <th scope="col">Gía</th>
                <th scope="col">Số lượng</th>
                <th scope="col">Tổng tiền</th>
                <th scope="col">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {giohang && giohang.length > 0 ? (
                giohang.map((sanPham, index) => (
                  <tr key={index}>
                    <td>
                      <img
                        src={sanPham.hinhanh}
                        className="img-thumbnail rounded-circle"
                        style={{ width: "60px", height: "60px" }}
                        alt={sanPham.tieude}
                      />
                    </td>
                    <td>{sanPham.tieude}</td>
                    <td>
                      {parseFloat(sanPham.gia).toLocaleString("vi-VN", { minimumFractionDigits: 3 })} {"VND"}
                       / {sanPham.don_vi_tinh}
                    </td>
                    <td>
                      <div className="input-group justify-content-center">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => GiamSoLuong(sanPham.id)}
                        >
                          <i className="bi bi-dash"></i>
                        </button>
                        <input
                          type="number"
                          className="form-control text-center"
                          value={sanPham.soLuong || 1}
                          min="1"
                          onChange={(e) => CapnhatSoLuong(sanPham.id, e.target.value)}
                          style={{ maxWidth: "60px" }}
                        />
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => TangSoLuong(sanPham.id)}
                        >
                          <i className="bi bi-plus"></i>
                        </button>
                      </div>
                    </td>
                    <td>
                      {(parseFloat(sanPham.gia) * sanPham.soLuong).toLocaleString("vi-VN", {
                        minimumFractionDigits: 3,
                      })} {"VND "}
                      
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => XoaGioHang(sanPham.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    <p className="mb-3">Giỏ hàng của bạn trống.</p>
                    <Link to="/cuahang" className="btn btn-primary btn-sm">
                      Mua sắm ngay
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="row g-4 justify-content-end mt-4">
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h3 className="card-title text-center mb-4">Tổng Giỏ hàng</h3>
                <div className="d-flex justify-content-between border-bottom pb-2">
                  <span className="fw-bold">Tổng:</span>
                  <span>
                    {tongTienGioHang.toLocaleString("vi-VN", { minimumFractionDigits: 3 })} vnđ
                  </span>
                </div>
                <div className="mt-4">
                  <button
                    className="btn btn-primary w-100 mb-2"
                    onClick={handleThanhtoan}
                  >
                    Thanh toán
                  </button>
                  <button
                    className="btn btn-outline-danger w-100"
                    onClick={Xoatoanbogiohang}
                  >
                    Xóa hết sản phẩm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footerusers />
  <ToastContainer />
</>


  );
};

export default Giohang;
