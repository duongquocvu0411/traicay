import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const ModalTenFooterAdmin = ({ show, handleClose, isEdit, tenFooter, fetchTenFooters }) => {
  const [tieude, setTieude] = useState('');
  const [phude, setPhude] = useState('');
  const [hinhanhs, setHinhanhs] = useState([]); // Hình ảnh mới thêm
  const [links, setLinks] = useState([]); // Link cho hình ảnh mới
  const [hienCo, setHienCo] = useState([]); // Hình ảnh và link hiện có từ API

  useEffect(() => {
    if (isEdit && tenFooter) {
      setTieude(tenFooter.tieude || '');
      setPhude(tenFooter.phude || '');

      // Lấy danh sách hình ảnh và link hiện có
      const existingImages = tenFooter.footerIMG?.map((img) => ({
        id: img.id,
        imagePath: img.imagePath,
        link: img.link,
      })) || [];
      setHienCo(existingImages);

      setHinhanhs([]); // Xóa danh sách hình ảnh mới
      setLinks([]); // Xóa danh sách link mới
    } else {
      setTieude('');
      setPhude('');
      setHienCo([]);
      setHinhanhs([]);
      setLinks([]);
    }
  }, [isEdit, tenFooter]);

  const handleAddFileInput = () => {
    setHinhanhs([...hinhanhs, null]);
    setLinks([...links, '']);
  };

  const handleFileChange = (index, file) => {
    const updatedHinhanhs = [...hinhanhs];
    updatedHinhanhs[index] = file;
    setHinhanhs(updatedHinhanhs);
  };

  const handleLinkChange = (index, link) => {
    const updatedLinks = [...links];
    updatedLinks[index] = link;
    setLinks(updatedLinks);
  };


  const handleRemoveExistingImage = async (imageId) => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true'; // Kiểm tra trạng thái lưu đăng nhập
    const token = isLoggedIn ? localStorage.getItem('adminToken') : sessionStorage.getItem('adminToken'); // Lấy token từ localStorage nếu đã lưu, nếu không lấy từ sessionStorage
  
   
  
    try {
      await axios.delete(`${process.env.REACT_APP_BASEURL}/api/TenFooter/DeleteImage/${imageId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
      });
      setHienCo(hienCo.filter((img) => img.id !== imageId)); // Xóa khỏi danh sách hiện có
      toast.success('Xóa hình ảnh thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa hình ảnh:', error);
      toast.error('Không thể xóa hình ảnh!');
    }
  };

  const handleSave = async () => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true'; // Kiểm tra trạng thái lưu đăng nhập
    const token = isLoggedIn ? localStorage.getItem('adminToken') : sessionStorage.getItem('adminToken'); // Lấy token từ localStorage nếu đã lưu, nếu không lấy từ sessionStorage
  
    // Kiểm tra nếu không có token thì yêu cầu đăng nhập lại
    if (!token) {
      toast.error("Vui lòng đăng nhập để tiếp tục!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
  
    const formData = new FormData();
    formData.append('tieude', tieude);
    formData.append('phude', phude);
  
    // Xử lý hình ảnh hiện có (thay đổi link hoặc cập nhật hình ảnh)
    hienCo.forEach((img) => {
      if (img.newFile) {
        // Nếu hình ảnh mới được chọn, gửi cả file và ID để thay đổi
        formData.append('existingImages', JSON.stringify({ id: img.id, link: img.link }));
        formData.append('newFiles', img.newFile);
      } else {
        // Chỉ cập nhật link nếu không có file mới
        formData.append('existingLinks', JSON.stringify({ id: img.id, link: img.link }));
      }
    });
  
    // Thêm hình ảnh mới
    hinhanhs.forEach((file, i) => {
      if (file) {
        formData.append('images', file);
        formData.append('links', links[i]);
      }
    });
  
    try {
      if (isEdit) {
        await axios.put(`${process.env.REACT_APP_BASEURL}/api/TenFooter/${tenFooter.id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
        });
        toast.success('Cập nhật TenFooter thành công!');
      } else {
        await axios.post(`${process.env.REACT_APP_BASEURL}/api/TenFooter`, formData, {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
        });
        toast.success('Thêm TenFooter thành công!');
      }
      fetchTenFooters();
      handleClose();
      ResetForm();
    } catch (error) {
      console.error('Lỗi khi lưu TenFooter:', error);
      toast.error('Không thể lưu TenFooter!');
    }
  };
  
const ResetForm = () => {
  setTieude("");
  setPhude("");
  setLinks([]);
  setHienCo([]);
  setHinhanhs([]);

}


  return (
    <Modal show={show} onHide={handleClose} centered>
    <Modal.Header closeButton className="bg-primary text-white shadow-sm">
      <Modal.Title className="fs-5 fw-bold">
        {isEdit ? 'Chỉnh sửa TenFooter' : 'Thêm TenFooter mới'}
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
  
        {/* Hình ảnh hiện có */}
        <Form.Group controlId="hienCo" className="mb-4">
          <Form.Label className="fw-bold">Hình ảnh hiện có</Form.Label>
          {hienCo.map((img, index) => (
            <div key={img.id} className="d-flex align-items-center mb-3">
              <img
                src={`${process.env.REACT_APP_BASEURL}${img.imagePath}`}
                alt="Footer"
                className="rounded shadow-sm border"
                style={{
                  width: "100px",
                  height: "50px",
                  objectFit: "cover",
                  marginRight: "10px",
                }}
              />
              <Form.Control
                type="text"
                placeholder="Link mới"
                value={img.link}
                onChange={(e) => {
                  const updatedHienCo = [...hienCo];
                  updatedHienCo[index].link = e.target.value;
                  setHienCo(updatedHienCo);
                }}
                className="me-2 shadow-sm rounded"
              />
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const updatedHienCo = [...hienCo];
                  updatedHienCo[index].newFile = e.target.files[0];
                  setHienCo(updatedHienCo);
                }}
                className="me-2 shadow-sm rounded"
              />
              <Button
                variant="outline-danger"
                onClick={() => handleRemoveExistingImage(img.id)}
                className="shadow-sm"
              >
                Xóa
              </Button>
            </div>
          ))}
        </Form.Group>
  
        {/* Thêm hình ảnh mới */}
        <Form.Group controlId="hinhanhs" className="mb-4">
          <Form.Label className="fw-bold">Thêm hình ảnh mới</Form.Label>
          {hinhanhs.map((file, index) => (
            <div key={index} className="d-flex align-items-center mb-3">
              <Form.Control
                type="file"
                onChange={(e) => handleFileChange(index, e.target.files[0])}
                accept="image/*"
                className="shadow-sm rounded"
              />
              <Form.Control
                type="text"
                placeholder="Link hình ảnh"
                value={links[index]}
                onChange={(e) => handleLinkChange(index, e.target.value)}
                className="ms-2 shadow-sm rounded"
              />
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

export default ModalTenFooterAdmin;
