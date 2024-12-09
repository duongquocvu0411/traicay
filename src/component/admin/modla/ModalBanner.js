import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const ModalBanner = ({ show, handleClose, isEdit, banner, fetchBanners }) => {
  const [tieude, setTieude] = useState(banner?.tieude || '');
  const [phude, setPhude] = useState(banner?.phude || '');
  const [hinhanhs, setHinhanhs] = useState([]);

  // Set initial state when editing or adding a new banner
  useEffect(() => {
    if (isEdit && banner) {
      setTieude(banner.tieude || '');
      setPhude(banner.phude || '');
      const images = banner.bannerImages?.map((img) => ({
        id: img.id, 
        imagePath: img.imagePath, 
      })) || [];
      setHinhanhs(images); 
    } else {
      setTieude('');
      setPhude('');
      setHinhanhs([]);
    }
  }, [isEdit, banner]);

  // Add a new file input field
  const handleAddFileInput = () => {
    setHinhanhs([...hinhanhs, null]);
  };

  // Handle file change for specific input
  const handleFileChange = (index, file) => {
    const updatedHinhanhs = [...hinhanhs];
    updatedHinhanhs[index] = file; 
    setHinhanhs(updatedHinhanhs);
  };

  // Remove a file input field
  const handleRemoveFileInput = (index) => {
    const updatedHinhanhs = hinhanhs.filter((_, i) => i !== index);
    setHinhanhs(updatedHinhanhs);
  };

  // Handle save or update action
  const handleSave = async () => {
   // Kiểm tra xem người dùng có chọn "Lưu thông tin đăng nhập" hay không
   const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true'; // Kiểm tra trạng thái lưu đăng nhập
   const token = isLoggedIn ? localStorage.getItem('adminToken') : sessionStorage.getItem('adminToken'); // Lấy token từ localStorage nếu đã lưu, nếu không lấy từ sessionStorage
    const formData = new FormData();
    formData.append('tieude', tieude);
    formData.append('phude', phude);

    hinhanhs.forEach((file) => {
      if (file) formData.append('hinhanhs', file);
    });

    try {
      if (isEdit) {
        await axios.put(`${process.env.REACT_APP_BASEURL}/api/banners/${banner.id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success('Cập nhật banner thành công!', { position: 'top-right', autoClose: 3000 });
      } else {
        await axios.post(`${process.env.REACT_APP_BASEURL}/api/banners`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success('Thêm banner mới thành công!', { position: 'top-right', autoClose: 3000 });
      }
      fetchBanners();
      handleClose();
      ResetForm();
    } catch (error) {
      console.error('Lỗi khi lưu banner:', error);
      toast.error('Không thể lưu banner!', { position: 'top-right', autoClose: 3000 });
    }
  };

  const ResetForm = () => {
    setHinhanhs([]);
    setPhude('');
    setTieude('');
  };

  // Handle removing a file from the UI and backend
  const handleRemoveFile = async (index) => {
     // Kiểm tra xem người dùng có chọn "Lưu thông tin đăng nhập" hay không
     const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true'; // Kiểm tra trạng thái lưu đăng nhập
     const token = isLoggedIn ? localStorage.getItem('adminToken') : sessionStorage.getItem('adminToken'); // Lấy token từ localStorage nếu đã lưu, nếu không lấy từ sessionStorage
    if (hinhanhs[index]?.id) {
      try {
        await axios.delete(`${process.env.REACT_APP_BASEURL}/api/banners/DeleteImage/${hinhanhs[index].id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const updatedHinhanhs = hinhanhs.filter((_, i) => i !== index);
        setHinhanhs(updatedHinhanhs);
        toast.success('Xóa hình ảnh thành công!', { position: 'top-right', autoClose: 3000 });
      } catch (error) {
        console.error('Lỗi khi xóa hình ảnh:', error);
        toast.error('Không thể xóa hình ảnh!', { position: 'top-right', autoClose: 3000 });
      }
    } else {
      const updatedHinhanhs = hinhanhs.filter((_, i) => i !== index);
      setHinhanhs(updatedHinhanhs);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
    <Modal.Header closeButton className="bg-primary text-white shadow-sm">
      <Modal.Title className="fs-5 fw-bold">
        {isEdit ? 'Chỉnh sửa banner' : 'Thêm banner mới'}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        {/* Tiêu đề */}
        <Form.Group controlId="tieude" className="mb-4">
          <Form.Label className="fw-bold">Tiêu đề</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nhập tiêu đề"
            value={tieude}
            onChange={(e) => setTieude(e.target.value)}
            className="shadow-sm border-0 rounded"
            style={{ backgroundColor: "#f8f9fa", fontSize: "1rem" }}
          />
        </Form.Group>
  
        {/* Phụ đề */}
        <Form.Group controlId="phude" className="mb-4">
          <Form.Label className="fw-bold">Phụ đề</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nhập phụ đề"
            value={phude}
            onChange={(e) => setPhude(e.target.value)}
            className="shadow-sm border-0 rounded"
            style={{ backgroundColor: "#f8f9fa", fontSize: "1rem" }}
          />
        </Form.Group>
  
        {/* Hình ảnh */}
        <Form.Group controlId="hinhanhs" className="mb-4">
          <Form.Label className="fw-bold">Hình ảnh</Form.Label>
          {hinhanhs.map((file, index) => (
            <div key={index} className="d-flex align-items-center mb-3">
              {file?.imagePath ? (
                <img
                  src={`${process.env.REACT_APP_BASEURL}/${file.imagePath}`}
                  alt="Banner"
                  className="rounded shadow-sm border"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    marginRight: "10px",
                  }}
                />
              ) : (
                <Form.Control
                  type="file"
                  onChange={(e) => handleFileChange(index, e.target.files[0])}
                  accept="image/*"
                  className="shadow-sm border-0 rounded"
                  style={{ backgroundColor: "#f8f9fa" }}
                />
              )}
              <Button
                variant="outline-danger"
                className="ms-2 shadow-sm"
                onClick={() => handleRemoveFile(index)}
              >
                Xóa
              </Button>
            </div>
          ))}
          <Button
            variant="outline-secondary"
            onClick={handleAddFileInput}
            className="shadow-sm rounded"
          >
            Thêm ảnh
          </Button>
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer className="bg-light border-0 shadow-sm">
      <Button
        variant="outline-secondary"
        onClick={handleClose}
        className="px-4 py-2 shadow-sm rounded"
      >
        Đóng
      </Button>
      <Button
        variant="success"
        onClick={handleSave}
        className="px-4 py-2 shadow-sm text-white rounded"
      >
        {isEdit ? "Cập nhật" : "Lưu"}
      </Button>
    </Modal.Footer>
  </Modal>
  
  );
};

export default ModalBanner;
