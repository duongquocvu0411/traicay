import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const ModalDiaChiChiTiet = ({ show, handleClose, isEdit, detail, fetchDetails }) => {
  const [diachi, setDiachi] = useState('');
  const [email, setEmail] = useState('');
  const [sdt,setSdt] = useState('');

  // Cập nhật state khi mở modal để chỉnh sửa
  useEffect(() => {
    if (isEdit && detail) {
      setDiachi(detail.diachi);
      setEmail(detail.email);
      setSdt(detail.sdt);
    } else {
      setDiachi('');
      setEmail('');
      setSdt('');
    }
  }, [isEdit, detail]);     

  // Xử lý khi nhấn nút "Save"
  const handleSave = () => {
      // Kiểm tra xem người dùng có chọn "Lưu thông tin đăng nhập" hay không
      const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true'; // Kiểm tra trạng thái lưu đăng nhập
      const token = isLoggedIn ? localStorage.getItem('adminToken') : sessionStorage.getItem('adminToken'); // Lấy token từ localStorage nếu đã lưu, nếu không lấy từ sessionStorage
    if (isEdit) {
      // Chỉnh sửa chi tiết địa chỉ
      axios.put(`${process.env.REACT_APP_BASEURL}/api/diachichitiet/${detail.id}`, { diachi, email, sdt },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
        }
      )
      .then(() => {
        toast.success("Địa chỉ đã được sửa thành công", {
          position: "top-right",
          autoClose: 3000,
        });
        fetchDetails(); // Cập nhật danh sách sau khi chỉnh sửa
        ResetForm();
        handleClose();
      })
      .catch((loi) => {
        if (loi.response?.status === 422) {
          const errors = loi.response.data.errors || {};
          if (errors.email) {
            toast.error("Email đã tồn tại. Vui lòng sử dụng email khác.", {
              position: "top-right",
              autoClose: 3000,
            });
          }
        } else {
          console.error("Có lỗi xảy ra khi sửa địa chỉ:", loi); // Ghi lỗi vào console để kiểm tra
        }
      });
  } else {
      // Thêm mới chi tiết địa chỉ
      axios.post(`${process.env.REACT_APP_BASEURL}/api/diachichitiet`, { diachi, email, sdt },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
        }
      )
          .then(() => {
              toast.success("Địa chỉ đã được thêm thành công", {
                  position: "top-right",
                  autoClose: 3000,
              });
              fetchDetails(); // Cập nhật danh sách sau khi thêm mới
              ResetForm();
              handleClose();
          })
          .catch(loi => {
              if (loi.response && loi.response.status === 422) {
                  const loiXacThuc = loi.response.data.errors;
                  if (loiXacThuc.email) {
                      toast.error("Email đã tồn tại. Vui lòng sử dụng email khác.", {
                          position: "top-right",
                          autoClose: 3000,
                      });
                  } else {
                      toast.error("Lỗi xác thực dữ liệu. Vui lòng kiểm tra thông tin.", {
                          position: "top-right",
                          autoClose: 3000,
                      });
                  }
              } else { 
                  console.error('Lỗi khi thêm địa chỉ:', loi);
                  toast.error("Có lỗi xảy ra khi thêm địa chỉ. Vui lòng thử lại.", {
                      position: "top-right",
                      autoClose: 3000,
                  });
              }
          });
  }
};
const ResetForm = () => {
  setDiachi('');
  setEmail('');
  setSdt('');
}

// Xử lý nhập số điện thoại, chỉ cho phép số và giới hạn 11 ký tự
const handleSdtChange = (e) => {
  const value = e.target.value;
  if (/^\d*$/.test(value) && value.length <= 11) {
    setSdt(value);
  }
};
//pattern="\d{0,11}": Thuộc tính pattern của trường nhập liệu (input) đảm bảo rằng chỉ các ký tự số có độ dài từ 0 đến 11 
//mới được chấp nhận. Điều này cung cấp xác thực ở phía trình duyệt.

  return (
    <Modal show={show} onHide={handleClose} centered>
    <Modal.Header closeButton className="bg-primary text-white">
      <Modal.Title>{isEdit ? "Chỉnh sửa Địa chỉ" : "Thêm Địa chỉ"}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        {/* Input Địa chỉ */}
        <Form.Group controlId="formDiaChi" className="mb-3">
          <Form.Label className="fw-bold">Địa Chỉ</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nhập địa chỉ"
            value={diachi}
            onChange={(e) => setDiachi(e.target.value)}
            className="shadow-sm"
            style={{ borderRadius: "8px" }}
          />
        </Form.Group>
  
        {/* Input Email */}
        <Form.Group controlId="formEmail" className="mb-3">
          <Form.Label className="fw-bold">Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Nhập email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow-sm"
            style={{ borderRadius: "8px" }}
          />
        </Form.Group>
  
        {/* Input Số điện thoại */}
        <Form.Group controlId="formSdt" className="mb-3">
          <Form.Label className="fw-bold">Số Điện Thoại</Form.Label>
          <Form.Control
            type="tel"
            placeholder="Nhập số điện thoại"
            value={sdt}
            onChange={handleSdtChange}
            pattern="\d{0,11}"
            className="shadow-sm"
            style={{ borderRadius: "8px" }}
          />
          <Form.Text className="text-muted">
            Chỉ nhập số, tối đa 11 chữ số.
          </Form.Text>
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button
        variant="secondary"
        onClick={handleClose}
        className="shadow-sm"
        style={{ borderRadius: "8px" }}
      >
        Đóng
      </Button>
      <Button
        variant="success"
        onClick={handleSave}
        className="shadow-sm text-white"
        style={{ borderRadius: "8px" }}
      >
        Lưu
      </Button>
    </Modal.Footer>
  </Modal>
  
  );
};

export default ModalDiaChiChiTiet;
