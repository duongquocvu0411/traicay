import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ModalChiTietSanPham = ({ show, handleClose, noiDungChiTiet }) => {
  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Chi Tiết Sản Phẩm</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Mô tả chung:</strong> {noiDungChiTiet.mo_ta_chung}</p>
        <p><strong>Hình dáng:</strong> {noiDungChiTiet.hinh_dang}</p>
        <p><strong>Công dụng:</strong> {noiDungChiTiet.cong_dung}</p>
        <p><strong>Xuất xứ:</strong> {noiDungChiTiet.xuat_xu}</p>
        <p><strong>Khối lượng:</strong> {noiDungChiTiet.khoi_luong}</p>
        <p><strong>Bảo quản:</strong> {noiDungChiTiet.bao_quan}</p>
        <p><strong>Thành phần dinh dưỡng:</strong> {noiDungChiTiet.thanh_phan_dinh_duong}</p>
        <p><strong>Ngày thu hoạch:</strong> {noiDungChiTiet.ngay_thu_hoach}</p>
        <p><strong>Hương vị:</strong> {noiDungChiTiet.huong_vi}</p>
        <p><strong>Nồng độ đường:</strong> {noiDungChiTiet.nong_do_duong}</p>
        <div dangerouslySetInnerHTML={{ __html: noiDungChiTiet.bai_viet }} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalChiTietSanPham;
