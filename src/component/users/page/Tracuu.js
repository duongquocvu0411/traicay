import React, { useState } from "react";
import axios from "axios";
import HeaderUsers from './../HeaderUsers';
import Footerusers from './../Footerusers';
import { toast, ToastContainer } from "react-toastify";

const Tracuu = () => {
  const [madonhang, setmadonhang] = useState("");
  const [dathangchitiet, setDathangchitiet] = useState(null);
  const [error, setError] = useState("");

  // Hàm xử lý tra cứu đơn hàng
  const handleLookupOrder = async (e) => {
    e.preventDefault();

    if (!madonhang) {
      setError("Vui lòng nhập mã đơn hàng.");
      return;
    }

    try {
      const response = await axios.get(`${process.env.REACT_APP_BASEURL}/api/hoadon/tracuu/${madonhang}`);
      setDathangchitiet(response.data);
      setError("");
    } catch (error) {
      console.error("Lỗi khi tra cứu đơn hàng:", error);
      setError("Không tìm thấy đơn hàng với mã này.");
      setDathangchitiet(null);
    }
  };

  const handleCancelOrder = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_BASEURL}/api/hoadon/tracuu/${madonhang}/huydon`);
      setDathangchitiet({ ...dathangchitiet, status: "Hủy đơn" });
      toast.success("Đơn hàng của bạn đã hủy thành công", {
        position: 'top-right',
        autoClose: 3000
      });
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);
      toast.error('Có lỗi khi hủy đơn hàng của bạn. Vui lòng thử lại.', {
        position: 'top-right',
        autoClose: 3000
      });
    }
  };
 
  // hàm để chọn class cho trạng thái đơn hàng
  const getStatusClass = (status) => {
    switch (status) {
      case 'Đang giao':
        return 'bg-warning text-dark';  // Màu vàng cho đang giao
      case 'Đã giao thành công':
        return 'bg-success text-white';  // Màu xanh cho giao thành công
      case 'Giao không thành công':
        return 'bg-danger text-white';  // Màu đỏ cho không thành công
      case 'Hủy đơn':
        return 'bg-secondary text-white';  // Màu xám cho hủy đơn
      case 'Chờ xử lý':
        return 'bg-info text-white';  // Màu xanh da trời cho chờ xử lý
      default:
        return '';  // Không có class nếu không có trạng thái
    }
  };
  return (
    <>
    <HeaderUsers />
    
    <div className="container-fluid page-header text-white py-5" >
      <div className="text-center">
        <h1 className="display-4 fw-bold text-animation">
          <span className="animated-letter">T</span>
          <span className="animated-letter">r</span>
          <span className="animated-letter">a</span>
          &nbsp;
          <span className="animated-letter">C</span>
          <span className="animated-letter">ứ</span>
          <span className="animated-letter">u</span>
          &nbsp;
          <span className="animated-letter">Đ</span>
          <span className="animated-letter">ơ</span>
          <span className="animated-letter">n</span>
          &nbsp;
          <span className="animated-letter">H</span>
          <span className="animated-letter">à</span>
          <span className="animated-letter">n</span>
          <span className="animated-letter">g</span>
        </h1>
      </div>
    </div>
  
    <div className="container my-5 py-5">
      {/* Form tra cứu đơn hàng */}
      <form onSubmit={handleLookupOrder} className="mb-5">
        <div className="input-group input-group-lg shadow-sm">
          <input
            type="text"
            className="form-control border-primary"
            placeholder="Nhập mã đơn hàng của bạn"
            value={madonhang}
            onChange={(e) => setmadonhang(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">
            <i className="fas fa-search"></i> Tra cứu
          </button>
        </div>
      </form>
  
      {/* Hiển thị lỗi nếu có */}
      {error && <div className="alert alert-danger text-center">{error}</div>}
  
      {/* Chi tiết đơn hàng */}
      {dathangchitiet && (
        <div className="card shadow-lg border-0 mb-5">
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Chi tiết đơn hàng: {dathangchitiet.orderCode}</h5>
            <small className="text-white">Ngày đặt hàng: {new Date(dathangchitiet.created_at).toLocaleDateString()}</small>
          </div>
          <div className="card-body">
            <p className="card-text">
              <strong>Trạng thái đơn hàng:</strong>{" "}
              <span className={`badge ${getStatusClass(dathangchitiet.status)}`}>{dathangchitiet.status}</span>
            </p>
  
            {/* Chi tiết sản phẩm */}
            <h6 className="mt-4 text-primary">Chi tiết sản phẩm:</h6>
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-primary">
                  <tr>
                    <th scope="col">Sản phẩm</th>
                    <th scope="col">Số lượng</th>
                    <th scope="col">Giá</th>
                  </tr>
                </thead>
                <tbody>
                  {dathangchitiet.hoaDonChiTiets && Array.isArray(dathangchitiet.hoaDonChiTiets) ? (
                    dathangchitiet.hoaDonChiTiets.map((item, index) => (
                      <tr key={index}>
                        <td>{item.sanPhamNames}</td>
                        <td>{item.quantity} {item.sanPhamDonViTinh}</td>
                        <td>{parseFloat(item.price).toLocaleString("vi-VN", { minimumFractionDigits: 3 })} VND</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center">Không có chi tiết sản phẩm</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
  
            {/* Tổng giá trị đơn hàng */}
            <p className="card-text">
              <strong>Tổng giá trị đơn hàng:</strong> {parseFloat(dathangchitiet.total_price).toLocaleString("vi-VN", { minimumFractionDigits: 3 })} VND
            </p>
  
            {/* Nút hủy đơn hàng */}
            {dathangchitiet.status === "Chờ xử lý" && (
              <div className="text-center mt-4">
                <button className="btn btn-danger" onClick={handleCancelOrder}>
                  <i className="fas fa-times"></i> Hủy đơn hàng
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  
    <ToastContainer />
    <Footerusers />
  </>
  
  
  );
};

export default Tracuu;
