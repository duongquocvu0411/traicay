import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const ModlaAdddanhsachsanpham = ({ show, handleClose, isEdit, danhmuc, fetchdanhmucs }) => {
  const [name, setName] = useState('');


  useEffect(() => {
    if (isEdit && danhmuc) {
      setName(danhmuc.name);

    } else {
      setName('');

    }
  }, [isEdit, danhmuc]);
  const handleSubmit = async () => {
    try {
      // Kiểm tra xem người dùng có chọn "Lưu thông tin đăng nhập" hay không
      const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true'; // Kiểm tra trạng thái lưu đăng nhập
      const token = isLoggedIn ? localStorage.getItem('adminToken') : sessionStorage.getItem('adminToken'); // Lấy token từ localStorage nếu đã lưu, nếu không lấy từ sessionStorage
      if (isEdit) {
        // Cập nhật danh mục hiện tại
        await axios.put(
          `${process.env.REACT_APP_BASEURL}/api/danhmucsanpham/${danhmuc.id}`,
          { name }
          ,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Thêm token vào header
            },
          }
        );

        toast.success(`Danh mục ${name} đã được cập nhật thành công!`, {
          position: 'top-right',
          autoClose: 3000,
        });

        fetchdanhmucs(); // Làm mới danh sách
        resetForm();
        handleClose(); // Đóng modal

      } else {
        // Thêm mới danh mục
        await axios.post(
          `${process.env.REACT_APP_BASEURL}/api/danhmucsanpham`,
          { name }
          ,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Thêm token vào header
            },
          }
        );

        toast.success(`Danh mục ${name} đã được thêm thành công!`, {
          position: 'top-right',
          autoClose: 3000,
        });

        fetchdanhmucs(); // Làm mới danh sách
        resetForm();
        handleClose(); // Đóng modal
      }
    } catch (error) {
      console.error(isEdit ? "Có lỗi khi sửa danh mục!" : "Có lỗi xảy ra khi thêm mới danh mục.", error);

      // Hiển thị thông báo lỗi
      toast.error(
        isEdit ? "Có lỗi xảy ra khi cập nhật danh mục. Vui lòng thử lại." : `Có lỗi xảy ra khi thêm mới danh mục ${name}`,
        {
          position: 'top-right',
          autoClose: 3000,
        }
      );
    }
  };

  const resetForm = () => {
    setName("");
  }


  return (
    <Modal show={show} onHide={handleClose} centered>
  <Modal.Header closeButton className="bg-primary text-white">
    <Modal.Title>{isEdit ? "Chỉnh sửa danh mục" : "Thêm mới danh mục"}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      {/* Input Tên Danh Mục */}
      <Form.Group className="mb-4">
        <Form.Label className="fw-bold">Tên danh mục</Form.Label>
        <Form.Control
          type="text"
          placeholder="Nhập tên danh mục"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="shadow-sm"
          style={{ borderRadius: "8px" }}
        />
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
      Hủy
    </Button>
    <Button
      variant="primary"
      onClick={handleSubmit}
      className="shadow-sm text-white"
      style={{ borderRadius: "8px" }}
    >
      {isEdit ? "Cập nhật" : "Thêm mới"}
    </Button>
  </Modal.Footer>
</Modal>

  );
};

export default ModlaAdddanhsachsanpham;
