import React, { useContext, useEffect, useState } from "react";
import Footerusers from "../Footerusers";
import HeaderUsers from "../HeaderUsers";
import { CartContext } from "./CartContext";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';

const Thanhtoan = () => {
  const [thanhpho, setThanhpho] = useState("");
  const { giohang, xoagiohangthanhtoanthanhcong } = useContext(CartContext);
  const [sdt, setSdt] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [ghichu, setGhichu] = useState("");
  const [orderCode, setOrderCode] = useState("");
  const [danhSachThanhPho, setDanhSachThanhPho] = useState([]); // Danh sách các thành phố
  const [danhSachQuanHuyen, setDanhSachQuanHuyen] = useState([]); // Danh sách quận huyện
  const [danhSachXaPhuong, setDanhSachXaPhuong] = useState([]); // Danh sách xã phường
  const [tinhthanh, setTinhthanh] = useState(""); // Quận huyện
  const [xaphuong, setXaphuong] = useState(""); // Xã phường
  const [tenThanhpho, setTenThanhpho] = useState(""); // Tên thành phố
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    fetchCities();
  }, []);

  const handleInput = (e) => {
    let newSdt = e.target.value.replace(/[^0-9]/g, "");
    if (newSdt.length > 11) {
      newSdt = newSdt.slice(0, 11);
    }
    setSdt(newSdt);
  };

  const handleChonthanhpho = async (e) => {
    const selectedCityCode = e.target.value;
    setThanhpho(selectedCityCode); // Lưu mã thành phố vào thanhpho

    // Gửi request để lấy thông tin về quận huyện của thành phố
    if (selectedCityCode) {
      try {
        const response = await axios.get(`https://provinces.open-api.vn/api/p/${selectedCityCode}?depth=3`);
        setDanhSachQuanHuyen(response.data.districts);

        // Cập nhật tên thành phố
        const selectedCityObj = response.data;
        setTenThanhpho(selectedCityObj.name || '');
      } catch (error) {
        console.error("Error fetching districts:", error);
        toast.error("Không thể tải thông tin quận huyện!", { position: "top-right", autoClose: 5000 });
      }
    }
  };

  // Hàm xử lý khi chọn quận huyện
  const handleChonTinhThanh = async (e) => {
    const selectedDistrict = e.target.value;
    setTinhthanh(selectedDistrict);

    // Lấy thông tin xã phường của huyện được chọn
    if (selectedDistrict) {
      try {
        const districtObj = danhSachQuanHuyen.find(district => district.name === selectedDistrict);
        if (districtObj) {
          setDanhSachXaPhuong(districtObj.wards || []); // Lấy danh sách xã/phường của huyện
        }
      } catch (error) {
        console.error("Error fetching wards:", error);
        toast.error("Không thể tải thông tin xã/phường!", { position: "top-right", autoClose: 5000 });
      }
    }
  };

  // Hàm xử lý khi chọn xã phường
  const handleChonXaPhuong = (e) => {
    setXaphuong(e.target.value);
  };

  const fetchCities = async () => {
    try {
      const response = await axios.get("https://provinces.open-api.vn/api/?depth=3");
      setDanhSachThanhPho(response.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
      toast.error("Không thể tải thông tin thành phố!", { position: "top-right", autoClose: 5000 });
    }
  };

  const tongTienGioHang = giohang.reduce((tong, item) => {
    const giaHienTai = item.sanphamSales?.find((sale) => sale.trangthai === "Đang áp dụng")
      ? parseFloat(item.sanphamSales.find((sale) => sale.trangthai === "Đang áp dụng").giasale)
      : parseFloat(item.gia); // Sử dụng giá giảm nếu có, ngược lại lấy giá gốc
    return tong + giaHienTai * item.soLuong;
  }, 0);

  // hàm thanh toán
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (giohang.length === 0) {
      toast.error("Giỏ hàng của bạn đang trống. Không thể thanh toán!", { position: "top-right", autoClose: 5000 });
      return;
    }

    if (!firstName || !lastName || !address || !thanhpho || !tinhthanh || !xaphuong || !sdt || sdt.length < 10 || sdt.length > 11 || !email) {
      toast.error("Vui lòng kiểm tra và điền đầy đủ các thông tin bắt buộc!", { position: "top-right", autoClose: 5000 });
      return;
    }
    setIsLoading(true)
    const khachhangData = {
      ten: firstName,
      ho: lastName,
      diachicuthe: address,
      thanhpho: tenThanhpho,
      // tenThanhpho: tenThanhpho,
      tinhthanhquanhuyen: tinhthanh,
      xaphuong: xaphuong, // Thêm thông tin xã phường
      sdt: sdt,
      Emaildiachi: email,
      ghichu: ghichu,
    };

    try {
      const khachhangResponse = await axios.post(`${process.env.REACT_APP_BASEURL}/api/khachhang`, khachhangData);
      const khachhangId = khachhangResponse.data.id;

      const billData = {
        KhachHangId: khachhangId,
        SanphamIds: giohang.map((sanpham) => sanpham.id),
        Quantities: giohang.map((sanpham) => sanpham.soLuong),
        Prices: giohang.map((sanpham) => {
          const sale = sanpham.sanphamSales?.find((sale) => sale.trangthai === "Đang áp dụng");
          return sale ? parseFloat(sale.giasale) : parseFloat(sanpham.gia);
        }),
      };

      const billResponse = await axios.post(`${process.env.REACT_APP_BASEURL}/api/HoaDon`, billData);

      const newOrderCode = billResponse.data.order_code;
      setOrderCode(newOrderCode);

      toast.success(`Đặt hàng thành công! Mã đơn hàng của bạn: ${newOrderCode}`, { position: "top-right", autoClose: 10000 });
      xoagiohangthanhtoanthanhcong();
      ResetForm();
      setIsLoading(false);
    } catch (error) {
      console.error("Lỗi khi gửi đơn hàng:", error);
      toast.error("Đã xảy ra lỗi khi gửi đơn hàng. Vui lòng thử lại sau.", { position: "top-right", autoClose: 10000 });
    }
  };

  const ResetForm = () => {
    
    setFirstName("");
    setLastName("");
    setAddress("");
    setThanhpho("");
    setSdt("");
    setEmail("");
    setGhichu("");
  }
  return (
<>
  <div>
    <HeaderUsers />
    {/* Header */}

    <div className="container-fluid page-header text-white py-5">
      <div className="text-center">
      <h1 className="display-4 fw-bold text-animation">
      <span className="animated-letter">T</span>
      <span className="animated-letter">h</span>
      <span className="animated-letter">a</span>
      <span className="animated-letter">n</span>
      <span className="animated-letter">h</span>
      &nbsp;
      <span className="animated-letter">T</span>
      <span className="animated-letter">o</span>
      <span className="animated-letter">á</span>
      <span className="animated-letter">n</span>
    
    </h1>
        {/* <p className="fs-5 mt-2">Nhập mã đơn hàng để xem thông tin chi tiết và trạng thái đơn hàng của bạn.</p> */}
      </div>
    </div>

    {/* Checkout Form */}
    <div className="container py-5">
      <h1 className="mb-5 text-center fw-bold">Chi tiết thanh toán</h1>
      <form onSubmit={handlePlaceOrder}>
        <div className="row g-5">
          {/* Thông tin người nhận */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-lg">
              <div className="card-body p-4">
                <h5 className="card-title fw-bold mb-4 text-success">Thông tin người nhận</h5>
                <div className="row g-3">
                  {/* Tên và Họ */}
                  <div className="col-md-6">
                    <label className="form-label">Tên<sup>*</sup></label>
                    <input
                      type="text"
                      className="form-control border-success"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Nhập tên"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Họ<sup>*</sup></label>
                    <input
                      type="text"
                      className="form-control border-success"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Nhập họ"
                      required
                    />
                  </div>

                  {/* Địa chỉ */}
                  <div className="col-12">
                    <label className="form-label">Địa chỉ chi tiết<sup>*</sup></label>
                    <input
                      type="text"
                      className="form-control border-success"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Số nhà, tên đường, ấp"
                      required
                    />
                  </div>

                  {/* Thành phố */}
                  <div className="col-md-6">
                    <label className="form-label">Thành phố<sup>*</sup></label>
                    <select
                      className="form-select border-success"
                      value={thanhpho}
                      onChange={handleChonthanhpho}
                      required
                    >
                      <option value="" disabled>Chọn thành phố</option>
                      {danhSachThanhPho.map((city) => (
                        <option key={city.code} value={city.code}>{city.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Quận huyện */}
                  <div className="col-md-6">
                    <label className="form-label">Quận/Huyện<sup>*</sup></label>
                    <select
                      className="form-select border-success"
                      value={tinhthanh}
                      onChange={handleChonTinhThanh}
                      disabled={!thanhpho}
                      required
                    >
                      <option value="" disabled>Chọn quận/huyện</option>
                      {danhSachQuanHuyen.map((district) => (
                        <option key={district.code} value={district.name}>{district.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Xã/Phường */}
                  <div className="col-md-6">
                    <label className="form-label">Xã/Phường<sup>*</sup></label>
                    <select
                      className="form-select border-success"
                      value={xaphuong}
                      onChange={handleChonXaPhuong}
                      disabled={!tinhthanh}
                      required
                    >
                      <option value="" disabled>Chọn xã/phường</option>
                      {danhSachXaPhuong.map((ward) => (
                        <option key={ward.code} value={ward.name}>{ward.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Số điện thoại */}
                  <div className="col-md-6">
                    <label className="form-label">Số điện thoại<sup>*</sup></label>
                    <input
                      type="tel"
                      className="form-control border-success"
                      value={sdt}
                      onInput={handleInput}
                      placeholder="Nhập số điện thoại"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="col-12">
                    <label className="form-label">Email<sup>*</sup></label>
                    <input
                      type="email"
                      className="form-control border-success"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Nhập email"
                      required
                    />
                  </div>

                  {/* Ghi chú */}
                  <div className="col-12">
                    <label className="form-label">Ghi chú đặt hàng (tùy chọn)</label>
                    <textarea
                      className="form-control border-success"
                      rows="4"
                      value={ghichu}
                      onChange={(e) => setGhichu(e.target.value)}
                      placeholder="Nhập ghi chú của bạn"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Thông tin giỏ hàng */}
          <div className="col-lg-5">
            <div className="card border-0 shadow-lg">
              <div className="card-body p-4">
                <h5 className="card-title fw-bold mb-4 text-success">Thông tin giỏ hàng</h5>
                <table className="table table-hover align-middle">
                  <thead className="table-success">
                    <tr>
                      <th>Hình</th>
                      <th>Tên</th>
                      <th>Giá</th>
                      <th>Số lượng</th>
                      <th>Tổng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {giohang.length > 0 ? (
                      giohang.map((sanPham, index) => (
                        <tr key={index}>
                          <td>
                            <img
                              src={sanPham.hinhanh}
                              alt={sanPham.tieude}
                              className="img-fluid rounded-circle" 
                              style={{ width: 50, height: 50 }}
                            />
                          </td>
                          <td>{sanPham.tieude}</td>
                          <td className="text-nowrap">
                          {parseFloat(sanPham.gia).toLocaleString("vi-VN", { minimumFractionDigits: 3 })}{" "} {"VND"}
                          </td>
                          <td>{sanPham.soLuong}</td>
                          <td className="text-nowrap">
                            {(sanPham.soLuong * parseFloat(sanPham.gia)).toLocaleString("vi-VN",{ minimumFractionDigits: 3 })} {"VND"}
                   
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">Giỏ hàng trống</td>
                      </tr>
                    )}
                    <tr>
                      <td colSpan="4" className="text-end fw-bold">Tổng cộng:</td>
                      <td className="text-nowrap text-success fw-bold">
                        {/* {tongTienGioHang.toLocaleString("vi-VN")} VND */}
                        {parseFloat(tongTienGioHang).toLocaleString("vi-VN", { minimumFractionDigits: 3 })}{" VND"}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <button
                  type="submit"
                  className="btn btn-success w-100 fw-bold text-uppercase py-3 mt-3"
                  disabled={isLoading}
                >
                  {isLoading ? <span className="spinner-border spinner-border-sm"></span> : "Đặt hàng ngay"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>

    <Footerusers />
    <ToastContainer />
  </div>
</>


  );
};

export default Thanhtoan;
