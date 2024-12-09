import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

const ModalDanhGia = ({ show, handleClose, sanphamId }) => {
  const [danhGias, setDanhGias] = useState([]);
  const [trangHienTai, setTrangHienTai] = useState(1);
  const danhGiaMoiTrang = 4;
  const viTriDanhGiaCuoi = trangHienTai * danhGiaMoiTrang;
  const viTriDanhGiaDau = viTriDanhGiaCuoi - danhGiaMoiTrang;
  const danhGiaTheoTrang = Array.isArray(danhGias) ? danhGias.slice(viTriDanhGiaDau, viTriDanhGiaCuoi) : [];
  const tongSoTrang = Math.ceil(danhGias.length / danhGiaMoiTrang);

  useEffect(() => {
    if (sanphamId && show) {
      axios
        .get(`${process.env.REACT_APP_BASEURL}/api/sanpham/${sanphamId}`)
        .then((response) => {
          // Make sure to access the `danhgiakhachhangs` property correctly from the response
          const danhGiasData = response.data.danhgiakhachhangs;
          setDanhGias(Array.isArray(danhGiasData) ? danhGiasData : []);
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            setDanhGias([]); // If no reviews are found, set empty array
          } else {
            console.error("Error fetching reviews:", error);
            toast.error("Unable to fetch reviews", {
              position: "top-right",
              autoClose: 3000,
            });
          }
        });
    }
  }, [sanphamId, show]);

  const phanTrang = (soTrang) => setTrangHienTai(soTrang);

  const xoaDanhGia = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BASEURL}/api/danhgiakhachhang/${id}`);
      toast.success("Review deleted successfully", {
        position: "top-right",
        autoClose: 3000,
      });
      setDanhGias(danhGias.filter((danhGia) => danhGia.id !== id));
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Error deleting review", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Danh sách đánh giá</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {danhGiaTheoTrang.length > 0 ? (
          danhGiaTheoTrang.map((danhGia) => (
            <div key={danhGia.id} className="mb-3">
              <h5>{danhGia.ho_ten}</h5>
              <b>{danhGia.tieude}</b>
              <p>{danhGia.noi_dung}</p>
              <p>
                {Array.from({ length: danhGia.soSao }, (_, i) => (
                  <span key={i} className="fa fa-star text-warning"></span>
                ))}
                {Array.from({ length: 5 - danhGia.soSao }, (_, i) => (
                  <span key={i} className="fa fa-star"></span>
                ))}
              </p>
              <Button variant="danger" onClick={() => xoaDanhGia(danhGia.id)}>
                Xóa đánh giá
              </Button>
            </div>
          ))
        ) : (
          <p>Không có đánh giá có sẵn cho sản phẩm này.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Đóng
        </Button>
        <div className="pagination-container">
          <ul className="pagination pagination-sm m-0">
            <li className={`page-item ${trangHienTai === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => phanTrang(trangHienTai > 1 ? trangHienTai - 1 : 1)}>«</button>
            </li>
            {[...Array(tongSoTrang)].map((_, i) => (
              <li key={i + 1} className={`page-item ${trangHienTai === i + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => phanTrang(i + 1)}>{i + 1}</button>
              </li>
            ))}
            <li className={`page-item ${trangHienTai === tongSoTrang ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => phanTrang(trangHienTai < tongSoTrang ? trangHienTai + 1 : tongSoTrang)}>»</button>
            </li>
          </ul>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDanhGia;
