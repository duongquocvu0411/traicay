import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Footerusers = () => {
  const [chiTietDiaChi, setChiTietDiaChi] = useState({ diachi: '', email: '', sdt: '' });
  const [tenFooter, setTenFooter] = useState({ tieude: "", phude: "", footerIMG: [] });
  useEffect(() => {
    const fetchCurrentDiaChi = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASEURL}/api/DiaChiChiTiet/getDiaChiHien`);
        if (response.data) {
          setChiTietDiaChi({
            diachi: response.data.diachi, // sử dụng 'diachi' từ API
            email: response.data.email,
            sdt: response.data.sdt // sdt nếu được trả về từ API
          });
        } else {
          console.log('Không có địa chỉ đang sử dụng');
        }
      } catch (err) {
        console.log('Lỗi khi lấy thông tin từ API:', err);
      }
    };
    const fetchTenFooter = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASEURL}/api/TenFooter`);
        if (response.data && response.data.length > 0) {
          setTenFooter({
            tieude: response.data[0].tieude,
            phude: response.data[0].phude,
            footerIMG: response.data[0].footerIMG,
          });
        } else {
          console.log("Không có dữ liệu TenFooter");
        }
      } catch (err) {
        console.log("Lỗi khi lấy thông tin từ API TenFooter:", err);
      }
    };
    fetchTenFooter();

    fetchCurrentDiaChi();
  }, []);

  return (
    <>
      {/* Footer Starts */}
      <div className="container-fluid bg-dark text-white-50 footer pt-5 mt-5">
        <div className="container py-5">
          <div className="pb-4 mb-4" style={{ borderBottom: '1px solid rgba(226, 175, 24, 0.5)' }}>
            <div className="row g-4">
              <div className="col-lg-3">
                <span className="title">
                  <p className="text-primary mb-0 h1">{tenFooter.tieude || "Trái cây"}</p>
                  <p className="text-secondary mb-0 h4 glowing-subtitle">{tenFooter.phude || "Sản phẩm tươi"}</p>
                </span>
              </div>
              <div className="col-lg-3">
                <div className="d-flex justify-content-end pt-3">
                  {tenFooter.footerIMG.map((img, index) => (
                    <Link
                      key={index}
                      className="btn btn-outline-secondary me-2 btn-md-square rounded-circle d-flex align-items-center justify-content-center"
                      to="#"
                      onClick={() => window.open(img.link, "_blank")}
                      style={{
                        width: "50px",
                        height: "50px",
                        overflow: "hidden",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        transition: "transform 0.3s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    >
                      <img
                        src={`${process.env.REACT_APP_BASEURL}${img.imagePath}`}
                        alt={`Social Icon ${index}`}
                        style={{
                          width: "200px",
                          height: "55px",
                          objectFit: "cover",
                          borderRadius: "100%",
                        }}
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="row g-5">
            <div className="col-lg-3 col-md-6">
              <div className="footer-item">
                <h4 className="text-light mb-3 glowing-text-footer">Tại sao bạn chọn chúng tôi?</h4>
                <p className="mb-4">
                  Chúng tôi cung cấp các loại trái cây và rau củ tươi sạch, chất lượng cao, được chọn lọc kỹ lưỡng.
                  Đảm bảo an toàn thực phẩm và nguồn gốc rõ ràng, đem đến bữa ăn bổ dưỡng cho gia đình bạn.
                </p>
                <span className="btn border-secondary py-2 px-4 rounded-pill text-primary">Xem thêm</span>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="d-flex flex-column text-start footer-item">
              <h4 className="text-light mb-3 glowing-text-footer">Thông tin cửa hàng</h4>
                
                <Link className="btn-link" to="/">Về chúng tôi</Link>
                <Link className="btn-link" to="/">Liên hệ</Link>
                <Link className="btn-link" to="/">Chính sách bảo mật</Link>
                <Link className="btn-link" to="/">Điều khoản &amp; điều kiện</Link>
                <Link className="btn-link" to="/">Chính sách hoàn trả</Link>
                <Link className="btn-link" to="/">Câu hỏi thường gặp &amp; Hỗ trợ</Link>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="d-flex flex-column text-start footer-item">
                <h4 className="text-light mb-3 glowing-text-footer">Tài khoản</h4>
                <Link className="btn-link" to="/">Tài khoản của tôi</Link>
                <Link className="btn-link" to="/">Chi tiết cửa hàng</Link>
                <Link className="btn-link" to="/">Giỏ hàng</Link>
                <Link className="btn-link" to="/">Yêu thích</Link>
                <Link className="btn-link" to="/">Lịch sử đặt hàng</Link>
                <Link className="btn-link" to="/">Đơn hàng quốc tế</Link>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
            <h4 className="text-light mb-3 glowing-text-footer">Liên hệ</h4>
            <p>
              Địa chỉ:
              <Link
                to="#"
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(chiTietDiaChi.diachi)}`, '_blank')}
                className="text-decoration-none text-white-50"
              >
                {chiTietDiaChi.diachi}
              </Link>
            </p>
            <p>Email: 
              <Link to={`mailto:${chiTietDiaChi.email}`} className="text-decoration-none text-white-50">{chiTietDiaChi.email}</Link>
            </p>
            <p>Điện thoại:
              <Link to={`tel:${chiTietDiaChi.sdt}`} className="text-decoration-none text-white-50">{chiTietDiaChi.sdt}</Link>
            </p>
            <p>Phương thức thanh toán</p>
            <img src={`${process.env.PUBLIC_URL}/img/payment.png`} className="img-fluid" alt="Payment methods" />
          </div>
        </div>
      </div>
    </div>
  
      {/* Footer End */}
      {/* Copyright Start */}
      <div className="container-fluid bg-dark text-light py-4" style={{ background: "linear-gradient(90deg, rgba(33,37,41,1) 0%, rgba(52,58,64,1) 100%)" }}>
  <div className="container">
    <div className="row justify-content-between align-items-center">
      
      {/* Phần thông tin bản quyền */}
      <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
        <span className="text-light">
          <i className="fas fa-copyright text-light me-2" />
          <Link to="/" className="text-decoration-none text-primary fw-bold">
            Trái Cây Tươi
          </Link> - Tất cả các quyền được bảo hộ.
        </span>
      </div>

      {/* Phần thông tin người thiết kế và phân phối */}
      <div className="col-md-6 text-center text-md-end">
        <p className="mb-0 text-white">
          Thiết kế bởi
          <Link className="text-decoration-none text-primary fw-bold mx-1" to="https://htmlcodex.com">
            HTML Codex
          </Link>
          và phân phối bởi
          <Link className="text-decoration-none text-primary fw-bold ms-1" to="https://themewagon.com">
            ThemeWagon
          </Link>.
        </p>
      </div>

     
    </div>
  </div>
</div>


      {/* Copyright End */}
    </>
  );
}

export default Footerusers;
