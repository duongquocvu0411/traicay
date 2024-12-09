import React, { useEffect, useState } from 'react';
import Footer from '../Footer';
import HeaderAdmin from '../HeaderAdmin';
import axios from 'axios';
import { Button, Modal, Spinner } from 'react-bootstrap';
import ModalDactrung from '../modla/ModalDactrung';
import { nanoid } from 'nanoid';
import { toast, ToastContainer } from 'react-toastify';
import SiderbarAdmin from '../SidebarAdmin';
import { Link } from 'react-router-dom';

const Dactrung = () => {
  const [danhSachDactrung, setDanhSachDactrung] = useState([]);
  const [dangtai, setDangtai] = useState(false);
  const [trangHienTai, setTrangHienTai] = useState(1);
  const [showModalXoa, setShowModalXoa] = useState(false);
  const [dactrungXoa, setDactrungXoa] = useState(null); // Lưu thông tin đặc trưng cần xóa
  const dactrungMoiTrang = 4;

  const [timKiem, setTimKiem] = useState('');
  const dactrungDaLoc = danhSachDactrung.filter((item) =>
    item.tieude.toLowerCase().includes(timKiem.toLowerCase())
  );

  const viTriDactrungCuoi = trangHienTai * dactrungMoiTrang;
  const viTriDactrungDau = viTriDactrungCuoi - dactrungMoiTrang;
  const dactrungTheoTrang = dactrungDaLoc.slice(viTriDactrungDau, viTriDactrungCuoi);
  const tongSoTrang = Math.ceil(dactrungDaLoc.length / dactrungMoiTrang);

  const phanTrang = (soTrang) => setTrangHienTai(soTrang);

  const [hienThiModal, setHienThiModal] = useState(false);
  const [chinhSua, setChinhSua] = useState(false);
  const [dactrungHienTai, setDactrungHienTai] = useState(null);

  useEffect(() => {
    layDanhSachDactrung();
  }, []);

  const layDanhSachDactrung = async () => {
    setDangtai(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASEURL}/api/dactrung`);
      setDanhSachDactrung(response.data);
    } catch (error) {
      console.error('Có lỗi khi lấy danh sách đặc trưng:', error);
      toast.error('Có lỗi khi lấy danh sách đặc trưng!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setDangtai(false);
    }
  };

  const moModalThemDactrung = () => {
    setChinhSua(false);
    setDactrungHienTai(null);
    setHienThiModal(true);
  };

  const moModalSuaDactrung = (dactrung) => {
    setChinhSua(true);
    setDactrungHienTai(dactrung);
    setHienThiModal(true);
  };

  const handleHienThiModalXoa = (dactrung) => {
    setDactrungXoa(dactrung); // Lưu đặc trưng cần xóa
    setShowModalXoa(true); // Hiển thị modal xác nhận
  };

  const handleDongModalXoa = () => {
    setShowModalXoa(false);
    setDactrungXoa(null); // Reset thông tin đặc trưng
  };

  const handleXacNhanXoa = async () => {
    if (dactrungXoa) {
      try {
        // Kiểm tra xem người dùng có lưu thông tin đăng nhập hay không
        const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
        const token = isLoggedIn ? localStorage.getItem('adminToken') : sessionStorage.getItem('adminToken');

        // Xóa đặc trưng
        await axios.delete(`${process.env.REACT_APP_BASEURL}/api/dactrung/${dactrungXoa.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success(`Đã xóa đặc trưng "${dactrungXoa.tieude}" thành công!`, {
          position: 'top-right',
          autoClose: 3000,
        });
        layDanhSachDactrung(); // Làm mới danh sách
      } catch (error) {
        console.error('Có lỗi khi xóa đặc trưng:', error);
        toast.error('Có lỗi khi xóa đặc trưng!', { position: 'top-right', autoClose: 3000 });
      }
    }
    setShowModalXoa(false);
  };

  return (
    <div id="wrapper">
      <SiderbarAdmin />
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <HeaderAdmin />

          <div className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1 className="h3 mb-0 text-gray-800">Danh sách đặc trưng</h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <Link to="/admin/trangchu">Home</Link>
                    </li>
                    <li className="breadcrumb-item active">Đặc trưng</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <div className="container-fluid mb-3">
            <div className="row">
              <div className="col-12 col-md-6 col-lg-4 mb-3">
                <label htmlFor="searchFeature" className="form-label">Tìm kiếm đặc trưng:</label>
                <div className="input-group">
                  <input
                    id="searchFeature"
                    type="text"
                    className="form-control"
                    placeholder="Nhập tiêu đề đặc trưng..."
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

          <div className="container-fluid">
            <div className="card shadow mb-4">
              <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <h6 className="m-0 font-weight-bold text-primary">Danh sách đặc trưng</h6>
                <Button variant="primary" onClick={moModalThemDactrung}>
                  <i className="fas fa-plus-circle"></i> Thêm đặc trưng
                </Button>
              </div>

              <div className="card-body table-responsive p-0" style={{ maxHeight: '400px' }}>
                {dangtai ? (
                  <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                    <p>Đang tải dữ liệu...</p>
                  </div>
                ) : (
                  <table className="table table-bordered table-hover table-striped">
                    <thead className="thead-dark">
                      <tr>
                        <th>STT</th>
                        <th>Tiêu đề</th>
                        <th>Phụ đề</th>
                        <th>Chức năng</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dactrungTheoTrang.map((dactrung, index) => (
                        <tr key={nanoid()} className="table-row-hover">
                          <td>{viTriDactrungDau + index + 1}</td>
                          <td>{dactrung.tieude}</td>
                          <td>{dactrung.phude}</td>
                          <td>
                            <Button
                              variant="primary me-2"
                              onClick={() => moModalSuaDactrung(dactrung)}
                              title="Chỉnh sửa"
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() => handleHienThiModalXoa(dactrung)}
                              title="Xóa"
                            >
                              <i className="fas fa-trash"></i>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="card-footer clearfix">
                <ul className="pagination pagination-sm m-0 float-right">
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
            </div>
          </div>
        </div>

        <Footer />
      </div>

      <ModalDactrung
        show={hienThiModal}
        handleClose={() => setHienThiModal(false)}
        isEdit={chinhSua}
        dactrung={dactrungHienTai}
        fetchDactrungs={layDanhSachDactrung}
      />

      <Modal
        show={showModalXoa}
        onHide={handleDongModalXoa}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>
            <i className="fas fa-exclamation-triangle me-2"></i> Xác nhận xóa
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <i className="fas fa-trash-alt fa-4x text-danger mb-3"></i>
            <h5 className="mb-3"> {dactrungXoa?.tieude}</h5>
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

export default Dactrung;
