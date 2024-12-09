import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const ModalMenu = ({ show, handleClose, isEdit, menu, fetchMenuList }) => {
  const [name, setName] = useState('');
  const [thutuhien, setThutuhien] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (isEdit && menu && menu.id) {
      setName(menu.name);
      setThutuhien(menu.thutuhien);
      setUrl(menu.url);
    } else {
      setName('');
      setThutuhien('');
      setUrl('');
    }
  }, [isEdit, menu]);
  

  const handleSubmit = async () => {
    const menuData = { name, thutuhien, url };
   // Kiểm tra xem người dùng có chọn "Lưu thông tin đăng nhập" hay không
   const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true'; // Kiểm tra trạng thái lưu đăng nhập
   const token = isLoggedIn ? localStorage.getItem('adminToken') : sessionStorage.getItem('adminToken'); // Lấy token từ localStorage nếu đã lưu, nếu không lấy từ sessionStorage
    try {
      if (isEdit && menu && menu.id) {
        // PUT request
        await axios.put(`${process.env.REACT_APP_BASEURL}/api/menu/${menu.id}` ,menuData,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Thêm token vào header
            }
          });
        toast.success('Cập nhật menu thành công', { position: 'top-right', autoClose: 3000 });
      } else {
        // POST request
        await axios.post(`${process.env.REACT_APP_BASEURL}/api/menu` ,menuData,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Thêm token vào header
            }
          });
        toast.success('Thêm mới menu thành công', { position: 'top-right', autoClose: 3000 });
      }
      fetchMenuList();
      resetForm();
      handleClose();
    } catch (error) {
      console.error('Lỗi khi xử lý PUT:', error.response?.data || error.message);
      toast.error(`Có lỗi khi xử lý: ${error.response?.data?.message || error.message}`, { position: 'top-right', autoClose: 3000 });
    }
  };
  
  const resetForm = () => {
    setName("");
    setThutuhien("");
    setUrl("");
  }
  return (
    
    <Modal show={show} onHide={handleClose} centered>
    <Modal.Header closeButton className="bg-success text-white shadow-sm">
      <Modal.Title className="fs-5 fw-bold">
        {isEdit ? "Chỉnh sửa menu" : "Thêm mới menu"}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Group controlId="menuName" className="mb-4">
          <Form.Label className="fw-bold">Tên menu</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên menu"
            className="shadow-sm border-0 rounded"
            style={{
              backgroundColor: "#f8f9fa",
              fontSize: "1rem",
            }}
          />
        </Form.Group>
        <Form.Group controlId="menuThutuhien" className="mb-4">
          <Form.Label className="fw-bold">Thứ tự hiển thị</Form.Label>
          <Form.Control
            type="number"
            value={thutuhien}
            onChange={(e) => setThutuhien(e.target.value)}
            placeholder="Nhập thứ tự hiển thị"
            className="shadow-sm border-0 rounded"
            style={{
              backgroundColor: "#f8f9fa",
              fontSize: "1rem",
            }}
          />
        </Form.Group>
        <Form.Group controlId="menuUrl" className="mb-4">
          <Form.Label className="fw-bold">URL</Form.Label>
          <Form.Control
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Nhập URL"
            readOnly
            className="shadow-sm border-0 rounded bg-light"
            style={{
              fontSize: "1rem",
            }}
          />
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer className="bg-light border-0 shadow-sm">
      <Button variant="outline-secondary" onClick={handleClose} className="px-4 py-2 shadow-sm rounded">
        Đóng
      </Button>
      <Button
        variant={isEdit ? "warning" : "success"}
        onClick={handleSubmit}
        className="px-4 py-2 shadow-sm text-white rounded"
      >
        {isEdit ? "Cập nhật" : "Thêm"}
      </Button>
    </Modal.Footer>
  </Modal>
  
  );
};

export default ModalMenu;
