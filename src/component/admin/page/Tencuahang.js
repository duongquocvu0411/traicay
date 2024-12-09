import React, { useEffect, useState } from 'react';
import Footer from '../Footer';
import axios from 'axios';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { nanoid } from 'nanoid';
import { toast, ToastContainer } from 'react-toastify';
import HeaderAdmin from '../HeaderAdmin';
import SiderbarAdmin from '../SidebarAdmin';
import { Link } from 'react-router-dom';
import ModalTencuahang from './../modla/ModalTencuahang';

const Tencuahang = () => {
  const [danhSachTencuahang, setDanhSachTencuahang] = useState([]);
  const [hienThiModal, setHienThiModal] = useState(false);
  const [chinhSua, setChinhSua] = useState(false);
  const [tencuahangHienTai, setTencuahangHienTai] = useState(null);
  const [dangtai, setDangtai] = useState(false);
  const [timKiem, setTimKiem] = useState('');
  const [showModalXoa, setShowModalXoa] = useState(false); // Hiển thị modal xác nhận xóa
  const [tencuahangXoa, setTencuahangXoa] = useState(null);


  const [trangHienTai, setTrangHienTai] = useState(1);
  const soHangMoiTrang = 5; // Số hàng trên mỗi trang

  // Lọc danh sách theo từ khóa tìm kiếm
  const danhSachLoc = danhSachTencuahang.filter((item) =>
    item.name.toLowerCase().includes(timKiem.toLowerCase())
  );

  // Lấy danh sách theo trang
  const viTriHangCuoi = trangHienTai * soHangMoiTrang;
  const viTriHangDau = viTriHangCuoi - soHangMoiTrang;
  const danhSachHienThi = danhSachLoc.slice(viTriHangDau, viTriHangCuoi);
  const tongSoTrang = Math.ceil(danhSachLoc.length / soHangMoiTrang);

  const phanTrang = (soTrang) => setTrangHienTai(soTrang);

  useEffect(() => {
    layDanhSachTencuahang();
  }, []);

  const layDanhSachTencuahang = async () => {
    setDangtai(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASEURL}/api/Tencuahang`);
      setDanhSachTencuahang(response.data);
      setDangtai(false);
    } catch (error) {
      console.log('Có lỗi khi lấy danh sách tên cửa hàng', error);
      toast.error('Có lỗi khi lấy danh sách tên cửa hàng, vui lòng thử lại sau', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const chinhSuaTencuahang = (tencuahang) => {
    setChinhSua(true);
    setTencuahangHienTai(tencuahang);
    setHienThiModal(true);
  };

  const xoaTencuahang = async (id) => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    const token = isLoggedIn ? localStorage.getItem('adminToken') : sessionStorage.getItem('adminToken');

    try {
      await axios.delete(`${process.env.REACT_APP_BASEURL}/api/Tencuahang/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Xóa tên cửa hàng thành công', {
        position: 'top-right',
        autoClose: 3000,
      });
      layDanhSachTencuahang();
    } catch (error) {
      console.log('Có lỗi khi xóa', error);
    }
  };

  const themTencuahang = () => {
    setChinhSua(false);
    setTencuahangHienTai(null);
    setHienThiModal(true);
  };

  const suDungTencuahang = async (id) => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    const token = isLoggedIn ? localStorage.getItem('adminToken') : sessionStorage.getItem('adminToken');

    try {
      await axios.post(
        `${process.env.REACT_APP_BASEURL}/api/Tencuahang/setTencuahang/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Cửa hàng đã được đánh dấu là đang sử dụng', {
        position: 'top-right',
        autoClose: 3000,
      });

      layDanhSachTencuahang();
    } catch (error) {
      console.error('Có lỗi khi sử dụng tên cửa hàng', error);

      toast.error('Có lỗi khi sử dụng tên cửa hàng', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handleHienThiModalXoa = (tencuahang) => {
    setTencuahangXoa(tencuahang);
    setShowModalXoa(true);
  };

  const handleDongModalXoa = () => {
    setShowModalXoa(false);
    setTencuahangXoa(null);
  };
  const handleXacNhanXoa = async () => {
    if (tencuahangXoa) {
      await xoaTencuahang(tencuahangXoa.id);
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
                  <h1 className="h3 mb-0 text-gray-800">Danh Sách Tên Cửa Hàng</h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <Link to="/admin/trangchu">Home</Link>
                    </li>
                    <li className="breadcrumb-item active">Danh Sách Tên Cửa Hàng</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Tìm kiếm */}
            <div className="container-fluid mb-3">
              <div className="row">
                <div className="col-12 col-md-6 col-lg-4 mb-3">
                  <label htmlFor="searchFeature" className="form-label">Tìm kiếm tên cửa hàng:</label>
                  <input
                    id="searchFeature"
                    type="text"
                    className="form-control"
                    placeholder="Nhập tên cửa hàng..."
                    value={timKiem}
                    onChange={(e) => setTimKiem(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Danh sách Tên Cửa hàng */}
            <div className="container-fluid">
              <div className="card shadow mb-4">
                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                  <h3 className="m-0 font-weight-bold text-primary">Danh Sách Tên Cửa Hàng</h3>
                  <Button className="btn btn-primary" onClick={themTencuahang}>
                    <i className="fas fa-plus-circle"></i> Thêm Tên Cửa Hàng
                  </Button>
                </div>
                <div className="card-body table-responsive" style={{ maxHeight: '400px' }}>
                  {dangtai ? (
                    <div className="text-center">
                      <Spinner animation="border" variant="primary" />
                      <p>Đang tải dữ liệu...</p>
                    </div>
                  ) : (
                    <table className="table table-hover table-bordered table-striped">
                      <thead className="thead-dark">
                        <tr>
                          <th scope="col">STT</th>
                          <th scope="col">Tên Cửa Hàng</th>
                          <th scope="col">Chức Năng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {danhSachHienThi.map((tencuahang, index) => (
                          <tr key={nanoid()}>
                            <td>{viTriHangDau + index + 1}</td>
                            <td>{tencuahang.name}</td>
                            <td>
                              <Button
                                variant="primary me-2"
                                onClick={() => chinhSuaTencuahang(tencuahang)}
                                className="btn btn-sm btn-primary"
                              >
                                <i className="fas fa-edit"></i>
                              </Button>
                              <Button
                                variant="danger me-2"
                                onClick={() => handleHienThiModalXoa(tencuahang)}
                                className="btn btn-sm btn-danger"
                              >
                                <i className="fas fa-trash"></i>
                              </Button>
                              {tencuahang.trangthai !== 'đang sử dụng' && (
                                <Button
                                  variant="success"
                                  onClick={() => suDungTencuahang(tencuahang.id)}
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
                        «
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
                        onClick={() =>
                          phanTrang(trangHienTai < tongSoTrang ? trangHienTai + 1 : tongSoTrang)
                        }
                      >
                        »
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ModalTencuahang
          show={hienThiModal}
          handleClose={() => setHienThiModal(false)}
          isEdit={chinhSua}
          detail={tencuahangHienTai}
          fetchDetails={layDanhSachTencuahang}
        />
        <Modal
          show={showModalXoa}
          onHide={handleDongModalXoa}
          centered
          // backdrop="static" // Không cho phép đóng khi click ra ngoài
        >
          <Modal.Header closeButton className="bg-danger text-white">
            <Modal.Title>
              <i className="fas fa-exclamation-triangle me-2"></i> Xác nhận xóa
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="text-center">
              <i className="fas fa-trash-alt fa-4x text-danger mb-3"></i>
              <h5 className="mb-3">Bạn có chắc chắn muốn xóa cửa hàng?</h5>
              <p className="text-muted mb-0">
                <strong>{tencuahangXoa?.name}</strong>
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

        <Footer />
      </div>

      <ToastContainer />
    </div>
  );
};

export default Tencuahang;
