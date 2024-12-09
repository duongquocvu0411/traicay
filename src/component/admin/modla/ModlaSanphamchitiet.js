import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
const MoadlChitietsanpham = ({ show, handleClose, chiTiet, setChiTiet, handleSaveChiTiet,isEdit }) => {
  return (
    <Modal show={show} onHide={handleClose} size="xl" centered>
    <Modal.Header closeButton className="bg-primary text-white">
    <Modal.Title className="fw-bold">
          {isEdit ? "Chỉnh sửa chi tiết sản phẩm" : "Thêm chi tiết sản phẩm"}
        </Modal.Title>
</Modal.Header>

    <Modal.Body>
      <Form>
        {/* Mô tả chung */}
        <Form.Group controlId="moTaChung" className="mb-4">
          <Form.Label className="fw-bold">Mô tả chung</Form.Label>
          <Form.Control
            type="text"
            value={chiTiet.moTaChung || ""}
            onChange={(e) =>
              setChiTiet({ ...chiTiet, moTaChung: e.target.value })
            }
            placeholder="Nhập mô tả chung"
            className="shadow-sm"
          />
        </Form.Group>
  
        {/* Các trường thông tin */}
        {[
          { id: "hinhDang", label: "Hình dáng", value: chiTiet.hinhDang },
          { id: "congDung", label: "Công dụng", value: chiTiet.congDung },
          { id: "xuatXu", label: "Xuất xứ", value: chiTiet.xuatXu },
          { id: "khoiLuong", label: "Khối lượng", value: chiTiet.khoiLuong },
          { id: "baoQuan", label: "Bảo quản", value: chiTiet.baoQuan },
          {
            id: "thanhPhanDinhDuong",
            label: "Thành phần dinh dưỡng",
            value: chiTiet.thanhPhanDinhDuong,
          },
          { id: "huongVi", label: "Hương vị", value: chiTiet.huongVi },
          {
            id: "nongDoDuong",
            label: "Nồng độ đường",
            value: chiTiet.nongDoDuong,
          },
        ].map((field) => (
          <Form.Group controlId={field.id} className="mb-4" key={field.id}>
            <Form.Label className="fw-bold">{field.label}</Form.Label>
            <Form.Control
              type="text"
              value={field.value || ""}
              onChange={(e) =>
                setChiTiet({ ...chiTiet, [field.id]: e.target.value })
              }
              placeholder={`Nhập ${field.label.toLowerCase()}`}
              className="shadow-sm"
            />
          </Form.Group>
        ))}
  
        {/* Ngày thu hoạch */}
        <Form.Group controlId="ngayThuHoach" className="mb-4">
          <Form.Label className="fw-bold">Ngày thu hoạch</Form.Label>
          <Form.Control
            type="date"
            value={
              chiTiet.ngayThuHoach
                ? new Date(chiTiet.ngayThuHoach).toISOString().split("T")[0]
                : ""
            }
            onChange={(e) =>
              setChiTiet({ ...chiTiet, ngayThuHoach: e.target.value })
            }
            className="shadow-sm"
          />
        </Form.Group>
  
        {/* Bài viết chi tiết */}
        <Form.Group controlId="baiViet" className="mb-4">
          <Form.Label className="fw-bold">Bài viết</Form.Label>
          <CKEditor
            editor={ClassicEditor}
            data={chiTiet.baiViet || ""}
            config={{
              ckfinder: {
                uploadUrl: `${process.env.REACT_APP_BASEURL}/api/Sanpham/upload-image`,
              },
              mediaEmbed: {
                previewsInData: true,
              },
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              setChiTiet({ ...chiTiet, baiViet: data });
            }}
          />
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer className="bg-light">
      <Button
        variant="outline-secondary"
        onClick={handleClose}
        className="px-4 py-2 shadow-sm rounded"
      >
        Đóng
      </Button>
      <Button
        variant="success"
        onClick={handleSaveChiTiet}
        className="px-4 py-2 shadow-sm text-white rounded"
      >
        {isEdit ? "Cập nhật" : "Lưu"}
      </Button>
    </Modal.Footer>
  </Modal>
  
  );
};

export default MoadlChitietsanpham;
