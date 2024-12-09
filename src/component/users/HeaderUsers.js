import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CartContext } from './page/CartContext';
import axios from 'axios';
import ScrollToTop from 'react-scroll-to-top';
import { toast } from "react-toastify";

const HeaderUsers = () => {
  const vitriRoute = useLocation();
  const [diachichitiet, setDiachichitiet] = useState({ diachi: ' ', email: '' });
  const [tencuahang, setTencuahang] = useState('');
  const [menuData, setMenuData] = useState([]); // State to store the fetched menu data
  const { giohang } = useContext(CartContext);

  // tính tổng số lượng sản phẩm hiện có trong giỏ hàng
  const tongSoLuong = giohang.reduce((tong, sanPham) => tong + sanPham.soLuong, 0);

  // Gọi API khi component mount
  useEffect(() => {
    fetchCurrentDiaChi();
    fetchTencuahang();
    fetchMenuData(); // Fetch the menu data
  }, []);

  // Khai báo API lấy địa chỉ chi tiết
  const fetchCurrentDiaChi = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASEURL}/api/DiaChiChiTiet/getDiaChiHien`);
      if (response.data) {
        setDiachichitiet({
          diachi: response.data.diachi,
          email: response.data.email,
        });
      } else {
        console.log('Không có địa chỉ đang sử dụng');
      }
    } catch (err) {
      console.log('Lỗi khi lấy thông tin từ API:', err);
    }
  };

  // Khai báo API lấy tên cửa hàng
  const fetchTencuahang = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASEURL}/api/Tencuahang/getHien`);
      if (response.data && response.data.name) {
        setTencuahang(response.data.name);
      } else {
        console.log("Không có tên cửa hàng");
        setTencuahang("Tên cửa hàng mặc định");
      }
    } catch (err) {
      console.log('Lỗi khi lấy tên cửa hàng:', err);
      toast.error("Lỗi khi lấy tên cửa hàng", {
        position: 'top-right',
        autoClose: 3000
      });
    }
  };

  // Fetch the menu data from API
  const fetchMenuData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASEURL}/api/Menu`);
      if (response.data) {
        setMenuData(response.data); // Set the fetched menu data
      } else {
        console.log("Không có dữ liệu menu");
      }
    } catch (err) {
      console.log('Lỗi khi lấy menu:', err);
      toast.error("Lỗi khi lấy menu", {
        position: 'top-right',
        autoClose: 3000
      });
    }
  };

  return (
    <>
      <div className="container-fluid fixed-top">
        <div className="container topbar bg-primary">
          <div className="row d-flex justify-content-between">
            {/* Address section */}
            <div className="col-6 col-sm-auto p-2">
              <small className="text-white d-flex align-items-center">
                <i className="fas fa-map-marker-alt me-2" />
                {diachichitiet.diachi}
              </small>
            </div>

            {/* Email section - now aligned to the right */}
            <div className="col-6 col-sm-auto p-2">
              <small className="text-white d-flex align-items-center justify-content-end">
                <i className="fas fa-envelope me-2" />
                {diachichitiet.email}
              </small>
            </div>
          </div>
        </div>

        <div className="container px-0 ">
          <nav className="navbar navbar-light bg-white navbar-expand-xl">
            <Link to="/" className="navbar-brand">
              <h1 className="text-primary display-6">{tencuahang || "Tên cửa hàng mặc định"}</h1>
            </Link>
            <button
              className="navbar-toggler py-2 px-3"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarCollapse"
            >
              <span className="fa fa-bars text-primary" />
            </button>

            <div className="collapse navbar-collapse bg-white" id="navbarCollapse">
              <div className="navbar-nav mx-auto">
                {/* Dynamically render menu links */}
                {menuData.map((menu) => (
                  <Link
                    key={menu.id}
                    to={menu.url}
                    className={`nav-item nav-link ${vitriRoute.pathname === menu.url ? "active" : ""}`}
                  >
                    {menu.name}
                  </Link>
                ))}
              </div>

              <div className="d-flex m-3 me-0">
                <Link to="/giohang" className="position-relative me-4 my-auto">
                  <i className="fa fa-shopping-bag fa-2x" />
                  {tongSoLuong > 0 && (
                    <span
                      className="position-absolute bg-secondary rounded-circle d-flex align-items-center justify-content-center text-dark"
                      style={{
                        top: "-10px",
                        right: "-10px",
                        width: "20px",
                        height: "20px",
                        fontSize: "12px",
                      }}
                    >
                      {tongSoLuong}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </div>

      <ScrollToTop
        smooth
        className="scroll-to-top"
        component={
          <i className="bi bi-arrow-up-circle-fill text-primary" style={{ fontSize: '3rem' }}></i>
        }
      />
    </>
  );
};

export default HeaderUsers;
