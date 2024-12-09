import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footerusers from "../Footerusers";
import HeaderUsers from "../HeaderUsers";
import { CartContext } from "./CartContext";
import { Modal, Button, Form, Spinner } from "react-bootstrap"; // Sử dụng modal từ react-bootstrap
import { toast, ToastContainer } from "react-toastify";
import { Lightbox } from "react-modal-image"; // Sử dụng thư viện Lightbox để phóng to ảnh
import Countdown from "react-countdown";

const CuahangChitiet = () => {
  const { id } = useParams(); // Lấy ID sản phẩm từ URL
  const [sanPham, setSanPham] = useState(null); // Thông tin sản phẩm
  const [chiTiet, setChiTiet] = useState({}); // Chi tiết sản phẩm
  const [tab, setTab] = useState("chiTiet"); // Quản lý tab hiển thị (chi tiết hoặc bài viết)
  const { addToCart } = useContext(CartContext); // Hàm thêm sản phẩm vào giỏ hàng từ context
  const [soSao, setSoSao] = useState(0); // Số sao được chọn khi viết đánh giá
  const [showModal, setShowModal] = useState(false); // Hiển thị modal nhập đánh giá
  const [hoTen, setHoTen] = useState(""); // Họ tên của khách hàng
  const [tieude, setTieude] = useState(""); // Tiêu đề đánh giá của khách hàng
  const [noiDung, setNoiDung] = useState(""); // Nội dung đánh giá
  const [hinhanhPhu, setHinhanhPhu] = useState([]); // Danh sách hình ảnh phụ của sản phẩm
  const [largeImage, setLargeImage] = useState(null); // Hình ảnh lớn để hiển thị khi click vào
  const [dangtai, setDangtai] = useState(false);
  useEffect(() => {

    layThongTinSanPham();

  }, [id]);

  // Lấy thông tin sản phẩm và chi tiết
  const layThongTinSanPham = async () => {
    try {
      setDangtai(true);
      const response = await fetch(`${process.env.REACT_APP_BASEURL}/api/sanpham/${id}`);
      const data = await response.json();
      console.log("Dữ liệu sản phẩm:", data);

      setSanPham(data); // Lưu toàn bộ dữ liệu sản phẩm
      setChiTiet(data.chiTiet || {}); // Lưu chi tiết sản phẩm
      setHinhanhPhu(data.images || []); // Lưu danh sách hình ảnh phụ
    } catch (error) {
      console.error("Lỗi khi lấy thông tin sản phẩm:", error);
    } finally {
      setDangtai(false);
    }
  };



  // Hàm mở modal để viết đánh giá
  const moModalVietDanhGia = (soSao) => {
    setSoSao(soSao); // Lưu số sao mà khách hàng chọn
    setShowModal(true); // Hiển thị modal
  };

  // Hàm gửi đánh giá
  const guiDanhGia = async () => {
    if (!hoTen.trim()) {
      toast.error("Họ tên không được bỏ trống!", { position: "top-right", autoClose: 3000 });
      return;
    }
    if (!tieude.trim()) {
      toast.error("Tiêu đề không được bỏ trống!", { position: "top-right", autoClose: 3000 });
      return;
    }
    if (!noiDung.trim()) {
      toast.error("Nội dung không được bỏ trống!", { position: "top-right", autoClose: 3000 });
      return;
    }

    const danhGiaMoi = {
      sanphams_id: id,
      ho_ten: hoTen,
      tieude: tieude,
      so_sao: soSao,
      noi_dung: noiDung,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_BASEURL}/api/danhgiakhachhang`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(danhGiaMoi),
      });

      if (response.ok) {
        toast.success("Đánh giá của bạn đã được gửi!", { position: "top-right", autoClose: 3000 });
        setShowModal(false);
        setHoTen("");
        setTieude("");
        setNoiDung("");
        setSoSao(0);

        // Refetch the product details including the updated reviews
        layThongTinSanPham();
      } else {
        toast.warning("Có lỗi xảy ra, vui lòng thử lại!", { position: "top-right", autoClose: 3000 });
      }
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
    }
  };
  if (dangtai) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (!sanPham) {
    return <div>Không tìm thấy sản phẩm.</div>;
  }
  // Renderer cho Countdown
  const countdownRenderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <span>Khuyến mãi đã kết thúc</span>;
    } else {
      return (
        <span>
          Còn lại: {days} ngày {hours} giờ {minutes} phút {seconds} giây
        </span>
      );
    }
  };

  const sale = sanPham.sanphamSales?.find((sale) => sale.trangthai === "Đang áp dụng");
  const isSaleActive = sale !== undefined;

  return (
    <>
      <div>
        <HeaderUsers />

        {/* Hiển thị thông tin sản phẩm */}
        <div className="container-fluid page-header py-5">
        <div className="text-center">
    <h1 className="display-4 fw-bold text-animation">
      <span className="animated-letter">C</span>
      <span className="animated-letter">h</span>
      <span className="animated-letter">i</span>
      &nbsp;
      <span className="animated-letter">T</span>
      <span className="animated-letter">i</span>
      <span className="animated-letter">ế</span>
      <span className="animated-letter">t</span>
      &nbsp;
      <span className="animated-letter">S</span>
      <span className="animated-letter">ả</span>
      <span className="animated-letter">n</span>
      &nbsp;
      <span className="animated-letter">P</span>
      <span className="animated-letter">h</span>
      <span className="animated-letter">ẩ</span>
      <span className="animated-letter">m</span>
    </h1>
   
  </div>
        </div>

        <div className="container-fluid py-5 mt-5">
          <div className="container py-5">
            <div className="row g-4 mb-5">
              <div className="col-lg-8 col-xl-9">
                <div className="row g-4">
                  <div className="col-lg-6">
                    <div className="border rounded">
                      <img
                        src={sanPham.hinhanh}
                        className="img-fluid w-100 rounded"

                        style={{
                          height: "300px",
                          objectFit: "cover",
                        }}
                        alt={sanPham.tieude}
                        onClick={() => setLargeImage(sanPham.hinhanh)} // Hiển thị trong lightbox khi click
                      />
                    </div>
                    <div className="mt-3">
                      <h5>Hình ảnh khác của sản phẩm:</h5>
                      <div className="d-flex flex-wrap">
                        {hinhanhPhu.length > 0 ? (
                          hinhanhPhu.map((img, index) => (
                            <img
                              key={index}
                              src={img.hinhanh}
                              className="img-thumbnail me-2"
                              alt={`Hình ảnh phụ ${index + 1}`}
                              style={{ width: "100px", height: "100px", cursor: "pointer" }}
                              onClick={() => setLargeImage(img.hinhanh)} // Mở lightbox khi click vào
                            />
                          ))
                        ) : (
                          <p>Không có hình ảnh phụ nào.</p>
                        )}

                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <h4 className="fw-bold mb-3">{sanPham.tieude}</h4>
                    <p className="mb-3">Danh Mục: {sanPham.danhmucsanpham.name}</p>
                    {isSaleActive ? (
                      <div>
                        <p className="text-muted mb-2" style={{ textDecoration: "line-through" }}>
                          Giá gốc: {parseFloat(sanPham.giatien).toLocaleString("vi-VN", { minimumFractionDigits: 3 })}{" "}/ vnđ  ({sanPham.don_vi_tinh})


                        </p>
                        <p className="text-danger fw-bold mb-2">
                          Giá khuyến mãi: {parseFloat(sale.giasale).toLocaleString("vi-VN", { minimumFractionDigits: 3 })}{" "}/ vnđ  ({sanPham.don_vi_tinh})
                        </p>
                        <p className="text-warning">
                          <Countdown date={new Date(sale.thoigianketthuc)} renderer={countdownRenderer} />
                        </p>
                      </div>
                    ) : (
                      <h5 className="fw-bold mb-3">{parseFloat(sanPham.giatien).toLocaleString("vi-VN", { minimumFractionDigits: 3 })}{" "} vnđ / {sanPham.don_vi_tinh}</h5>
                    )}

                    {/* Kiểm tra trạng thái Hết hàng */}
                    {sanPham.trangthai === "Hết hàng" || (isSaleActive && new Date(sale.thoigianketthuc) <= new Date()) ? (
                      <p className="text-danger fw-bold">
                        {sanPham.trangthai === "Hết hàng" ? "Sản phẩm hiện đang hết hàng" : ""}
                      </p>
                    ) : (
                      <button
                        onClick={() => addToCart(sanPham)}
                        className="btn border border-secondary rounded-pill px-3 text-primary"
                      >
                        <i className="fa fa-shopping-bag me-2 text-primary" /> Thêm vào giỏ hàng
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Lightbox để hiển thị hình ảnh lớn */}
            {largeImage && (
              <Lightbox
                large={largeImage}
                onClose={() => setLargeImage(null)} // Đóng lightbox khi nhấn nút đóng
              />
            )}

            {/* Tabs để chọn xem chi tiết sản phẩm, bài viết hoặc đánh giá */}
            <div className="d-flex justify-content-start mb-3">
              <button
                className={`btn ${tab === 'chiTiet' ? 'btn-primary' : 'btn-light'} me-2`}
                onClick={() => setTab("chiTiet")}
              >
                Xem Chi Tiết
              </button>
              <button
                className={`btn ${tab === 'baiViet' ? 'btn-primary' : 'btn-light'} me-2`}
                onClick={() => setTab("baiViet")}
              >
                Bài Viết về {sanPham.tieude}
              </button>
              <button
                className={`btn ${tab === 'danhGia' ? 'btn-primary' : 'btn-light'}`}
                onClick={() => setTab("danhGia")}
              >
                Xem Đánh Giá
              </button>
            </div>

            {/* Hiển thị chi tiết sản phẩm */}
            {tab === "chiTiet" && (
              <div className="container border p-4 rounded shadow-sm bg-light">
                <h4 className="fw-bold text-primary mb-4">
                  <i className="fa fa-info-circle me-2"></i>Chi Tiết Sản Phẩm
                </h4>
                {chiTiet && Object.values(chiTiet).some((value) => value) ? (
                  <div className="row g-3">
                    {/* Mỗi chi tiết được hiển thị dưới dạng card */}
                    {[
                      { label: "Mô tả chung", value: chiTiet.mo_ta_chung },
                      { label: "Hình dáng", value: chiTiet.hinh_dang },
                      { label: "Công dụng", value: chiTiet.cong_dung },
                      { label: "Xuất xứ", value: chiTiet.xuat_xu },
                      { label: "Khối lượng", value: chiTiet.khoi_luong },
                      { label: "Bảo quản", value: chiTiet.bao_quan },
                      { label: "Thành phần dinh dưỡng", value: chiTiet.thanh_phan_dinh_duong },
                      {
                        label: "Ngày thu hoạch",
                        value: chiTiet.ngay_thu_hoach
                          ? new Date(chiTiet.ngay_thu_hoach).toLocaleDateString("vi-VN")
                          : null,
                      },
                      { label: "Hương vị", value: chiTiet.huong_vi },
                      { label: "Nồng độ đường", value: chiTiet.nong_do_duong },
                    ].map((item, index) => (
                      <div className="col-md-6" key={index}>
                        <div
                          className="border rounded p-3 shadow-sm bg-white"
                          style={{
                            transition: "transform 0.3s ease",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        >
                          <h6 className="fw-bold text-secondary mb-1">{item.label}:</h6>
                          <p className="mb-0 text-dark">
                            {item.value || <span className="text-muted">Không có thông tin</span>}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted text-center">
                    <i className="fa fa-exclamation-circle me-2"></i>Không có chi tiết sản phẩm.
                  </p>
                )}
              </div>
            )}



            {/* Hiển thị bài viết */}
            {tab === "baiViet" && (
              <div className="container border p-4 rounded shadow-sm bg-light">
                <h4 className="fw-bold mb-3 text-primary">
                  <i className="fa fa-file-alt me-2"></i> Bài Viết Đánh Giá
                </h4>
                {chiTiet.bai_viet ? (
                  <div
                    className="p-3 bg-white rounded"
                    style={{
                      fontSize: "1rem",
                      lineHeight: "1.6",
                      color: "#333",
                      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                    }}
                    dangerouslySetInnerHTML={{ __html: chiTiet.bai_viet }}
                  />
                ) : (
                  <div
                    className="p-3 bg-white rounded text-center"
                    style={{
                      color: "#6c757d",
                      fontStyle: "italic",
                      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <i className="fa fa-exclamation-circle me-2"></i> Sản phẩm không có bài viết
                  </div>
                )}
              </div>
            )}


            {/* Hiển thị danh sách đánh giá */}
            {/* Hiển thị danh sách đánh giá */}
            {tab === "danhGia" && (
              <div>
                {/* Phần viết đánh giá */}
                <div className="mt-4">
                  <h4 className="fw-bold text-primary">Viết Đánh Giá của bạn</h4>
                  <p className="text-muted">Chọn số sao:</p>
                  <div className="d-flex align-items-center">
                    {[1, 2, 3, 4, 5].map((soSaoItem) => (
                      <span
                        key={soSaoItem}
                        className={`fa fa-star ${soSao >= soSaoItem ? "text-warning" : "text-muted"}`}
                        style={{
                          cursor: "pointer",
                          fontSize: "1.5rem",
                          marginRight: "5px",
                          transition: "color 0.3s ease",
                        }}
                        onClick={() => moModalVietDanhGia(soSaoItem)}
                        onMouseEnter={(e) => (e.target.style.color = "#ffcc00")} // Hover effect on mouse enter
                        onMouseLeave={(e) => (e.target.style.color = soSao >= soSaoItem ? "#ffcc00" : "#6c757d")} // Reset on mouse leave
                      />
                    ))}
                  </div>
                </div>

                {/* Phần hiển thị danh sách đánh giá */}
                {sanPham.danhgiakhachhangs && sanPham.danhgiakhachhangs.length > 0 ? (
                  <div className="container border p-4 rounded mt-4 bg-light shadow-sm">
                    <h4 className="fw-bold text-success mb-4">Đánh Giá Sản Phẩm</h4>
                    {sanPham.danhgiakhachhangs.map((dg, index) => (
                      <div
                        key={index}
                        className="mb-4 p-3 bg-white rounded shadow-sm"
                        style={{
                          transition: "transform 0.3s ease, box-shadow 0.3s ease",
                          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.02)";
                          e.currentTarget.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.2)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
                        }}
                      >
                        <div className="d-flex align-items-center mb-2">
                          <h5 className="mb-0 me-3 fw-bold">{dg.ho_ten}</h5>
                          <div>
                            {Array(dg.so_sao)
                              .fill()
                              .map((_, i) => (
                                <span key={i} className="fa fa-star text-warning"></span>
                              ))}
                            {Array(5 - dg.so_sao)
                              .fill()
                              .map((_, i) => (
                                <span key={i} className="fa fa-star text-muted"></span>
                              ))}
                          </div>
                        </div>
                        <h6 className="fw-bold text-primary">{dg.tieude}</h6>
                        <p className="text-muted mb-2">{dg.noi_dung}</p>
                        <p className="text-secondary small mb-0">
                          Ngày tạo: <b>{new Date(dg.created_at).toLocaleDateString("vi-VN")}</b>
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="container border p-4 rounded mt-4 bg-light shadow-sm">
                    <p className="text-center text-muted">Chưa có đánh giá nào cho sản phẩm này.</p>
                  </div>
                )}
              </div>
            )}



            {/* Modal viết đánh giá */}
            <Modal
              show={showModal}
              onHide={() => {
                setShowModal(false); // Tắt modal khi ấn hủy
                setSoSao(0);
              }}
              centered
            >
              <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title className="fw-bold">
                  <i className="fa fa-star me-2"></i>Viết Đánh Giá
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="bg-light">
                <Form>
                  {/* Họ và tên */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Họ và Tên</Form.Label>
                    <Form.Control
                      type="text"
                      value={hoTen}
                      onChange={(e) => setHoTen(e.target.value)}
                      placeholder="Nhập họ và tên của bạn"
                      className="shadow-sm"
                      style={{ borderRadius: "10px" }}
                      required
                    />
                  </Form.Group>

                  {/* Tiêu đề đánh giá */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Tiêu đề Đánh Giá</Form.Label>
                    <Form.Control
                      type="text"
                      value={tieude}
                      onChange={(e) => setTieude(e.target.value)}
                      placeholder="Nhập tiêu đề đánh giá của bạn"
                      className="shadow-sm"
                      style={{ borderRadius: "10px" }}
                      required
                    />
                  </Form.Group>

                  {/* Nội dung đánh giá */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Nội Dung Đánh Giá</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={noiDung}
                      onChange={(e) => setNoiDung(e.target.value)}
                      placeholder="Nhập nội dung đánh giá của bạn"
                      className="shadow-sm"
                      style={{ borderRadius: "10px" }}
                      required
                    />
                  </Form.Group>

                  {/* Chọn số sao */}
                  <div className="mb-3">
                    <Form.Label className="fw-bold">Đánh Giá Số Sao</Form.Label>
                    <div className="d-flex align-items-center">
                      {[1, 2, 3, 4, 5].map((soSaoItem) => (
                        <span
                          key={soSaoItem}
                          className={`fa fa-star ${soSao >= soSaoItem ? "text-warning" : "text-muted"}`}
                          style={{ cursor: "pointer", fontSize: "1.5rem", marginRight: "5px" }}
                          onClick={() => setSoSao(soSaoItem)}
                        />
                      ))}
                    </div>
                  </div>
                </Form>
              </Modal.Body>
              <Modal.Footer className="d-flex justify-content-between">
                <Button
                  variant="danger"
                  onClick={() => {
                    setShowModal(false);
                    setSoSao(0);
                  }}
                  className="shadow-sm"
                  style={{ borderRadius: "10px" }}
                >
                  <i className="fa fa-times me-2"></i>Hủy
                </Button>
                <Button
                  variant="success"
                  onClick={guiDanhGia}
                  className="shadow-sm"
                  style={{ borderRadius: "10px" }}
                >
                  <i className="fa fa-paper-plane me-2"></i>Gửi Đánh Giá
                </Button>
              </Modal.Footer>
            </Modal>

          </div>
        </div>

        <Footerusers />
        <ToastContainer />
      </div>
    </>
  );
};

export default CuahangChitiet;
