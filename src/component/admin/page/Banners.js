import React, { useEffect, useState } from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import Footer from '../Footer';
import HeaderAdmin from '../HeaderAdmin';
import SiderbarAdmin from '../SidebarAdmin';
import { nanoid } from 'nanoid';
import ModalBanner from './../modla/ModalBanner';

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [dangtai, setDangtai] = useState(false);
  const [trangHienTai, setTrangHienTai] = useState(1);
  const [showModalXoa, setShowModalXoa] = useState(false); // Hiển thị modal xác nhận xóa
  const [bannerXoa, setBannerXoa] = useState(null); // Lưu thông tin banner cần xóa

  const bannersMoiTrang = 4;

  // Logic tìm kiếm banners
  const [timKiem, setTimKiem] = useState('');
  const bannersDaLoc = banners.filter((banner) =>
    banner.tieude.toLowerCase().includes(timKiem.toLowerCase())
  );

  // Logic phân trang
  const viTriBannerCuoi = trangHienTai * bannersMoiTrang;
  const viTriBannerDau = viTriBannerCuoi - bannersMoiTrang;
  const bannersTheoTrang = bannersDaLoc.slice(viTriBannerDau, viTriBannerCuoi);
  const tongSoTrang = Math.ceil(bannersDaLoc.length / bannersMoiTrang);

  const phanTrang = (soTrang) => setTrangHienTai(soTrang);

  const [hienThiModal, setHienThiModal] = useState(false);
  const [chinhSua, setChinhSua] = useState(false);
  const [bannerHienTai, setBannerHienTai] = useState(null);

  useEffect(() => {
    layDanhSachBanners();
  }, []);

  const layDanhSachBanners = async () => {
    setDangtai(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASEURL}/api/banners`);
      setBanners(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách banners:', error);
      toast.error('Có lỗi khi lấy danh sách banners!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setDangtai(false);
    }
  };

  const moModalThemBanner = () => {
    setChinhSua(false);
    setBannerHienTai(null);
    setHienThiModal(true);
  };

  const moModalSuaBanner = (banner) => {
    setChinhSua(true);
    setBannerHienTai(banner);
    setHienThiModal(true);
  };

  const xoaBanner = async (id, tieude) => {
    // Kiểm tra xem người dùng có chọn "Lưu thông tin đăng nhập" hay không
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true'; // Kiểm tra trạng thái lưu đăng nhập
    const token = isLoggedIn ? localStorage.getItem('adminToken') : sessionStorage.getItem('adminToken'); // Lấy token từ localStorage nếu đã lưu, nếu không lấy từ sessionStorage
    try {
      await axios.delete(`${process.env.REACT_APP_BASEURL}/api/banners/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
        });
      toast.success(`Xóa banner "${tieude}" thành công!`, {
        position: 'top-right',
        autoClose: 3000,
      });
      layDanhSachBanners();
      setTrangHienTai(1);
    } catch (error) {
      console.error('Lỗi khi xóa banner:', error);
      toast.error('Không thể xóa banner!', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };
  const suDungBanners = async (id) => {
    // Kiểm tra xem người dùng có chọn "Lưu thông tin đăng nhập" hay không
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true'; // Kiểm tra trạng thái lưu đăng nhập
    const token = isLoggedIn ? localStorage.getItem('adminToken') : sessionStorage.getItem('adminToken'); // Lấy token từ localStorage nếu đã lưu, nếu không lấy từ sessionStorage
    try {
      // Gọi API với token trong headers
      await axios.post(
        `${process.env.REACT_APP_BASEURL}/api/Banners/setTrangthai/${id}`,
        {}, // Body rỗng vì không có dữ liệu gửi đi
        {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
        }
      );

      // Hiển thị thông báo thành công
      toast.success("Cửa hàng đã được đánh dấu là đang sử dụng", {
        position: "top-right",
        autoClose: 3000,
      });

      // Lấy lại danh sách cửa hàng sau khi cập nhật
      layDanhSachBanners();
    } catch (error) {
      console.error("Có lỗi khi sử dụng tên cửa hàng", error);

      // Hiển thị thông báo lỗi
      toast.error("Có lỗi khi sử dụng tên cửa hàng", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };


  const handleHienThiModalXoa = (banner) => {
    setBannerXoa(banner); // Lưu banner cần xóa
    setShowModalXoa(true); // Hiển thị modal xác nhận
  };
  const handleDongModalXoa = () => {
    setShowModalXoa(false);
    setBannerXoa(null); // Reset thông tin banner
  };
  const handleXacNhanXoa = async () => {
    if (bannerXoa) {
      await xoaBanner(bannerXoa.id, bannerXoa.tieude); // Gọi hàm xóa banner
    }
    setShowModalXoa(false);
  };

  return (
    <div id="wrapper">
      <SiderbarAdmin />

      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <HeaderAdmin />

          {/* Content Header */}
          <div className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1 className="h3 mb-0 text-gray-800">Danh sách banners</h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <Link to="/admin/trangchu">Home</Link>
                    </li>
                    <li className="breadcrumb-item active">Danh sách banners</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* Content Row */}
          <div className="container-fluid mb-3">
            <div className="row">
              <div className="col-12 col-md-6 col-lg-4 mb-3">
                <label htmlFor="searchBanner" className="form-label">Tìm kiếm banners:</label>
                <div className="input-group">
                  <input
                    id="searchBanner"
                    type="text"
                    className="form-control"
                    placeholder="Nhập tiêu đề banner..."
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

          {/* Table */}
          <div className="container-fluid">
            <div className="card shadow mb-4">
              <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <h6 className="m-0 font-weight-bold text-primary">Danh sách banners</h6>
                <Button variant="primary" onClick={moModalThemBanner} className="btn-lg">
                  <i className="fas fa-plus-circle"></i> Thêm banner
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
                        <th>Hình ảnh</th>
                        <th>Chức năng</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bannersTheoTrang.map((banner, index) => (
                        <tr key={nanoid()} className="hover-effect">
                          <td>{viTriBannerDau + index + 1}</td>
                          <td>{banner.tieude}</td>
                          <td>{banner.phude}</td>
                          <td>
                            {banner.bannerImages?.length > 0 ? (
                              <img
                                src={`${process.env.REACT_APP_BASEURL}/${banner.bannerImages[0].imagePath}`}
                                alt="Banner"
                                style={{ width: '100px', height: '50px', objectFit: 'cover' }}
                              />
                            ) : (
                              'Không có hình ảnh'
                            )}
                          </td>
                          <td>
                            <Button
                              variant="primary me-2"
                              onClick={() => moModalSuaBanner(banner)}
                              title="Chỉnh sửa banner"
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() => handleHienThiModalXoa(banner)}
                              title="Xóa banner"
                            >
                              <i className="fas fa-trash"></i>
                            </Button>
                            {banner.trangthai !== 'đang sử dụng' && (
                              <Button
                                variant="success"
                                onClick={() => suDungBanners(banner.id)}
                                className="btn btn-sm btn-success"
                                title="Sử dụng banner"
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

              {/* Pagination */}
              <div className="card-footer clearfix">
                <ul className="pagination pagination-sm m-0 float-right">
                  <li className={`page-item ${trangHienTai === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => phanTrang(trangHienTai - 1)}>«</button>
                  </li>
                  {[...Array(tongSoTrang)].map((_, i) => (
                    <li key={i + 1} className={`page-item ${trangHienTai === i + 1 ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => phanTrang(i + 1)}>{i + 1}</button>
                    </li>
                  ))}
                  <li className={`page-item ${trangHienTai === tongSoTrang ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => phanTrang(trangHienTai + 1)}>»</button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>

      <ModalBanner
        show={hienThiModal}
        handleClose={() => setHienThiModal(false)}
        isEdit={chinhSua}
        banner={bannerHienTai}
        fetchBanners={layDanhSachBanners}
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
            <h5 className="mb-3">Bạn có chắc chắn muốn xóa banner?</h5>
            <p className="text-muted">
              <strong>{bannerXoa?.tieude}</strong>
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

export default Banners;
