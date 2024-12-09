import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

const ModalChiTietKhachHang = ({ show, handleClose, chiTietKhachHang, capNhatTrangThai, xoaKhachHang, layTrangThaiDonHang }) => {
  const [showModalXoa, setShowModalXoa] = useState(false); // Quản lý trạng thái hiển thị modal xóa

  const inHoaDon = () => {
    const noiDungIn = document.getElementById('printContent').innerHTML;
    const noiDungGoc = document.body.innerHTML;

    document.body.innerHTML = noiDungIn;
    window.print();
    document.body.innerHTML = noiDungGoc;
    window.location.reload();
  };
  const handleHienThiModalXoa = () => {
    setShowModalXoa(true); // Hiển thị modal xóa
  };

  const handleDongModalXoa = () => {
    setShowModalXoa(false); // Đóng modal xóa
  };

  const handleXacNhanXoa = async () => {
    if (chiTietKhachHang) {
      await xoaKhachHang(chiTietKhachHang.id, `${chiTietKhachHang.ho} ${chiTietKhachHang.ten}`);
      setShowModalXoa(false); // Đóng modal sau khi xóa
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="text-primary">
            <i className="bi bi-person-badge"></i> Chi Tiết Khách Hàng
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {chiTietKhachHang && (
            <div id="printContent">
              {/* Thông tin khách hàng */}
              <div className="card border-primary mb-4">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">
                    <i className="bi bi-info-circle-fill"></i> Thông Tin Khách Hàng
                  </h5>
                </div>
                <div className="card-body">
                  <p><i className="bi bi-person-fill"></i> <strong>Họ Tên:</strong> {chiTietKhachHang.ho} {chiTietKhachHang.ten}</p>
                  <p><i className="bi bi-envelope-fill"></i> <strong>Email:</strong> {chiTietKhachHang.emailDiaChi}</p>
                  <p><i className="bi bi-telephone-fill"></i> <strong>Số Điện Thoại:</strong> {chiTietKhachHang.sdt}</p>
                  <p>
                    <i className="bi bi-geo-alt-fill"></i> <strong>Địa chỉ:</strong> {chiTietKhachHang.diaChiCuThe}, {chiTietKhachHang.xaphuong}, {chiTietKhachHang.tinhthanhquanhuyen}, {chiTietKhachHang.thanhPho}
                  </p>
                  <p><i className="bi bi-pencil-fill"></i> <strong>Ghi chú:</strong> {chiTietKhachHang.ghiChu || "Không có ghi chú"}</p>
                </div>
              </div>

              {/* Danh sách hóa đơn */}
              <div className="card border-success">
                <div className="card-header bg-success text-white">
                  <h5 className="mb-0">
                    <i className="bi bi-receipt"></i> Danh Sách Hóa Đơn
                  </h5>
                </div>
                <div className="card-body">
                  {chiTietKhachHang.hoaDons && chiTietKhachHang.hoaDons.length > 0 ? (
                    chiTietKhachHang.hoaDons.map((bill, index) => (
                      <div key={index} className="border-bottom pb-3 mb-3">
                        <p>
                          <i className="bi bi-calendar-check-fill"></i> <strong>Ngày tạo:</strong> {bill.created_at ? new Date(bill.created_at).toLocaleDateString("vi-VN") : "Không có thông tin"}
                        </p>
                        <p>
                          <i className="bi bi-cash"></i> <strong>Tổng tiền:</strong> {parseFloat(bill.total_price).toLocaleString("vi-VN", { minimumFractionDigits: 3 })} VND
                        </p>
                        <p>
                          <i className="bi bi-circle-fill"></i> <strong>Trạng thái:</strong> <span className={`badge ${layTrangThaiDonHang([bill]).bgColor}`}>{bill.status}</span>
                        </p>
                        <p><i className="bi bi-hash"></i> <strong>Mã đơn hàng:</strong> {bill.order_code}</p>
                        <h6 className="mt-2"><i className="bi bi-cart-check"></i> Chi tiết sản phẩm:</h6>
                        <ul className="list-group list-group-flush mb-3">
                          {bill.hoaDonChiTiets.map((chitiet, idx) => (
                            <li key={idx} className="list-group-item">
                              <i className="bi bi-box"></i> <strong>{chitiet.sanphamNames}</strong> x {chitiet.quantity} {chitiet.sanphamDonViTinh} -{" "}
                              {parseFloat(chitiet.price).toLocaleString("vi-VN", { minimumFractionDigits: 3 })} VND
                            </li>
                          ))}
                        </ul>

                        {/* Hành động */}
                        <div className="d-flex align-items-center">
                          {bill.status === "Hủy đơn" && (
                            <Button
                              variant="danger"
                              onClick={handleHienThiModalXoa}
                              disabled={!chiTietKhachHang || !chiTietKhachHang.hoaDons?.some(hd => hd.status === "Hủy đơn")}
                            >
                              <i className="bi bi-trash-fill"></i> Xóa Khách Hàng
                            </Button>

                          )}

                          {bill.status !== "Hủy đơn" && bill.status !== "Đã giao thành công" && (
                            <Form.Group controlId="formTrangThai" className="ms-3">
                              <Form.Label><i className="bi bi-toggle-on"></i> Cập nhật trạng thái:</Form.Label>
                              <Form.Control
                                as="select"
                                value={bill.status}
                                onChange={(e) => capNhatTrangThai(bill.id, e.target.value)}
                                className="form-select-sm"
                              >
                                <option value="Chờ xử lý">Chờ xử lý</option>
                                <option value="Đang giao">Đang giao</option>
                                <option value="Đã giao thành công">Đã giao thành công</option>
                                <option value="Hủy đơn">Hủy đơn</option>
                                <option value="Giao không thành công">Giao không thành công</option>
                              </Form.Control>
                            </Form.Group>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted"><i className="bi bi-info-circle"></i> Không có hóa đơn nào được ghi nhận.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            <i className="bi bi-x-circle"></i> Đóng
          </Button>
          <Button variant="primary" onClick={inHoaDon}>
            <i className="bi bi-printer"></i> In Hóa Đơn
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal
        show={showModalXoa}
        onHide={handleDongModalXoa}
        centered
        backdrop="static" // Không cho phép đóng khi click ra ngoài
      >
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>
            <i className="bi bi-exclamation-triangle-fill me-2"></i> Xác nhận xóa khách hàng
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <i className="bi bi-person-x-fill fa-4x text-danger mb-3"></i>
            <h5>Bạn có chắc chắn muốn xóa khách hàng này?</h5>
            <p className="text-muted">
              <strong>Họ tên:</strong> {chiTietKhachHang?.ho} {chiTietKhachHang?.ten} <br />
              <strong>Email:</strong> {chiTietKhachHang?.emailDiaChi} <br />
              <strong>Số điện thoại:</strong> {chiTietKhachHang?.sdt}
            </p>
            <p className="text-muted">Hành động này không thể hoàn tác.</p>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="secondary" onClick={handleDongModalXoa}>
            <i className="bi bi-x-circle"></i> Hủy
          </Button>
          <Button variant="danger" onClick={handleXacNhanXoa}>
            <i className="bi bi-check-circle"></i> Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
};

export default ModalChiTietKhachHang;
