import React, { useEffect, useState } from 'react';
import Footer from '../Footer';
import axios from 'axios';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { nanoid } from 'nanoid';
import ModalDiaChiChiTiet from '../modla/ModlaDiachichitiet';
import { toast, ToastContainer } from 'react-toastify';
import HeaderAdmin from '../HeaderAdmin';
import SiderbarAdmin from '../SidebarAdmin';
import { Link } from 'react-router-dom';

const DiaChiChiTiet = () => {
  const [danhSachDiaChi, setDanhSachDiaChi] = useState([]);
  const [hienThiModal, setHienThiModal] = useState(false);
  const [chinhSua, setChinhSua] = useState(false);
  const [diaChiHienTai, setDiaChiHienTai] = useState(null);
  const [dangtai, setDangtai] = useState(false);
  const [timKiem, setTimKiem] = useState('');
  const [showModalXoa, setShowModalXoa] = useState(false); // Hiển thị modal xóa
  const [diaChiXoa, setDiaChiXoa] = useState(null); // Lưu thông tin địa chỉ cần xóa


  const [trangHienTai, setTrangHienTai] = useState(1);
  const soHangMoiTrang = 5; // Số hàng mỗi trang

  // Lọc danh sách theo từ khóa tìm kiếm
  const danhSachLoc = danhSachDiaChi.filter((item) =>
    item.diachi.toLowerCase().includes(timKiem.toLowerCase())
  );

  // Lấy danh sách theo trang
  const viTriHangCuoi = trangHienTai * soHangMoiTrang;
  const viTriHangDau = viTriHangCuoi - soHangMoiTrang;
  const danhSachHienThi = danhSachLoc.slice(viTriHangDau, viTriHangCuoi);
  const tongSoTrang = Math.ceil(danhSachLoc.length / soHangMoiTrang);

  const phanTrang = (soTrang) => setTrangHienTai(soTrang);

  useEffect(() => {
    layDanhSachDiaChi();
  }, []);

  const layDanhSachDiaChi = async () => {
    setDangtai(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASEURL}/api/diachichitiet`);
      setDanhSachDiaChi(response.data);
      setDangtai(false);
    } catch (error) {
      console.log('Có lỗi khi lấy danh sách địa chỉ', error);
      toast.error('Có lỗi khi lấy danh sách địa chỉ, vui lòng thử lại sau', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const chinhSuaDiaChi = (diaChi) => {
    setChinhSua(true);
    setDiaChiHienTai(diaChi);
    setHienThiModal(true);
  };

  const xoaDiaChi = async (id) => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    const token = isLoggedIn ? localStorage.getItem('adminToken') : sessionStorage.getItem('adminToken');

    try {
      await axios.delete(`${process.env.REACT_APP_BASEURL}/api/diachichitiet/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Xóa địa chỉ thành công', {
        position: 'top-right',
        autoClose: 3000,
      });
      layDanhSachDiaChi();
    } catch (error) {
      console.log('Có lỗi khi xóa:', error);
      toast.error('Không thể xóa địa chỉ. Vui lòng thử lại.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const themDiaChi = () => {
    setChinhSua(false);
    setDiaChiHienTai(null);
    setHienThiModal(true);
  };

  const suDungDiaChi = async (id) => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    const token = isLoggedIn ? localStorage.getItem('adminToken') : sessionStorage.getItem('adminToken');

    try {
      await axios.post(
        `${process.env.REACT_APP_BASEURL}/api/diachichitiet/setDiaChiHien/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Sử dụng địa chỉ mới thành công', {
        position: 'top-right',
        autoClose: 3000,
      });

      layDanhSachDiaChi();
    } catch (error) {
      console.log('Có lỗi khi sử dụng địa chỉ:', error);
      toast.error('Có lỗi khi sử dụng địa chỉ. Vui lòng thử lại.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };
  const handleHienThiModalXoa = (diaChi) => {
    setDiaChiXoa(diaChi); // Lưu thông tin địa chỉ cần xóa
    setShowModalXoa(true); // Hiển thị modal xóa
  };

  const handleDongModalXoa = () => {
    setDiaChiXoa(null); // Reset thông tin địa chỉ cần xóa
    setShowModalXoa(false); // Đóng modal xóa
  };

  const handleXacNhanXoa = async () => {
    if (diaChiXoa) {
      await xoaDiaChi(diaChiXoa.id); // Gọi hàm xóa địa chỉ
      setDiaChiXoa(null); // Reset thông tin địa chỉ
      setShowModalXoa(false); // Đóng modal xóa
    }
  };

  return (
    <div id="wrapper">
      <SiderbarAdmin />

      <div id="content-wrapper" className="d-flex flex-column">
        {/* Main Content */}
        <div id="content">
          <HeaderAdmin />

          {/* Content Header */}
          <div className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1 className="h3 mb-0 text-gray-800">Danh Sách Địa Chỉ</h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <Link to="/admin/trangchu">Home</Link>
                    </li>
                    <li className="breadcrumb-item active">Danh Sách Địa Chỉ</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* Tìm kiếm */}
          <div className="container-fluid mb-3">
            <div className="row">
              <div className="col-12 col-md-6 col-lg-4 mb-3">
                <label htmlFor="searchAddress" className="form-label">Tìm kiếm địa chỉ:</label>
                <div className="input-group">
                  <input
                    id="searchAddress"
                    type="text"
                    className="form-control"
                    placeholder="Nhập địa chỉ..."
                    value={timKiem}
                    onChange={(e) => setTimKiem(e.target.value)}
                  />
                  <span className="input-group-text">
                    <i className="fas fa-search"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="container-fluid">
            <div className="card shadow mb-4">
              <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <h3 className="m-0 font-weight-bold text-primary">Danh Sách Địa Chỉ</h3>
                <Button className="btn btn-primary" onClick={themDiaChi}>
                  <i className="fas fa-plus-circle"></i> Thêm Địa Chỉ
                </Button>
              </div>
              <div className="card-body table-responsive" style={{ maxHeight: '400px' }}>
                {dangtai ? (
                  <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                    <p>Đang tải dữ liệu...</p>
                  </div>
                ) : (
                  <table className="table table-bordered table-hover table-striped">
                    <thead className="table-dark">
                      <tr>
                        <th scope="col">STT</th>
                        <th scope="col">Địa Chỉ</th>
                        <th scope="col">Email</th>
                        <th scope="col">SĐT</th>
                        <th scope="col">Trạng thái</th>
                        <th scope="col">Chức Năng</th>
                      </tr>
                    </thead>
                    <tbody>
                      {danhSachHienThi.map((diaChi, index) => (
                        <tr key={nanoid()} className="table-row">
                          <td>{viTriHangDau + index + 1}</td>
                          <td>{diaChi.diachi}</td>
                          <td>{diaChi.email}</td>
                          <td>{diaChi.sdt}</td>
                          <td>
                            <span
                              className={`badge ${diaChi.status === 'đang sử dụng' ? 'bg-success' : 'bg-secondary'}`}
                            >
                              {diaChi.status === 'đang sử dụng' ? 'Đang sử dụng' : 'Không sử dụng'}
                            </span>
                          </td>
                          <td>
                            <Button
                              variant="primary me-2"
                              onClick={() => chinhSuaDiaChi(diaChi)}
                              className="btn btn-sm btn-primary"
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                            <Button
                              variant="danger me-2"
                              onClick={() => handleHienThiModalXoa(diaChi)}
                              className="btn btn-sm btn-danger"
                            >
                              <i className="fas fa-trash"></i>
                            </Button>


                            {diaChi.status !== 'đang sử dụng' && (
                              <Button
                                variant="success"
                                onClick={() => suDungDiaChi(diaChi.id)}
                                className="btn btn-sm btn-success"
                              >
                                <i className="fas fa-check"></i> Sử dụng
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Phân trang */}
              <div className="card-footer clearfix">
                <ul className="pagination pagination-sm m-0 float-right">
                  <li className={`page-item ${trangHienTai === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => phanTrang(trangHienTai > 1 ? trangHienTai - 1 : 1)}
                    >
                      <i className="fas fa-angle-left"></i>
                    </button>
                  </li>
                  {[...Array(tongSoTrang)].map((_, i) => (
                    <li key={i + 1} className={`page-item ${trangHienTai === i + 1 ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => phanTrang(i + 1)}>
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${trangHienTai === tongSoTrang ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => phanTrang(trangHienTai < tongSoTrang ? trangHienTai + 1 : tongSoTrang)}
                    >
                      <i className="fas fa-angle-right"></i>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>

      {/* Modal Thêm/Sửa Địa Chỉ */}
      <ModalDiaChiChiTiet
        show={hienThiModal}
        handleClose={() => setHienThiModal(false)}
        isEdit={chinhSua}
        detail={diaChiHienTai}
        fetchDetails={layDanhSachDiaChi}
      />


      <Modal
        show={showModalXoa}
        onHide={handleDongModalXoa}
        centered
        backdrop="static" // Không cho phép đóng khi click ra ngoài
      >
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>
            <i className="fas fa-exclamation-triangle me-2"></i> Xác nhận xóa
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <i className="fas fa-trash-alt fa-4x text-danger mb-3"></i>
            <h5 className="mb-3">Bạn có chắc chắn muốn xóa địa chỉ?</h5>
            <p className="text-muted">
              <strong>{diaChiXoa?.diachi}</strong>
            </p>
            <p className="text-muted">Hành động này không thể hoàn tác.</p>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="secondary" onClick={handleDongModalXoa}>
            <i className="fas fa-times me-2"></i> Hủy
          </Button>
          <Button variant="danger" onClick={handleXacNhanXoa}>
            <i className="fas fa-check me-2"></i> Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </div>

  );
};

export default DiaChiChiTiet;
