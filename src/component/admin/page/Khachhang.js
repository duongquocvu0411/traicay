import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { nanoid } from 'nanoid';

import Footer from '../Footer';
import { toast, ToastContainer } from 'react-toastify';
import ModalChiTietKhachHang from '../modla/ModaChiTietKhachHang';
import HeaderAdmin from '../HeaderAdmin';
import SiderbarAdmin from '../SidebarAdmin';
import { Link } from 'react-router-dom';

const Khachhangs = () => {
  const [danhSachKhachHang, setDanhSachKhachHang] = useState([]);
  const [trangHienTai, setTrangHienTai] = useState(1);
  const soPhanTuMotTrang = 10;
  const [hienThiModal, setHienThiModal] = useState(false);
  const [chiTietKhachHang, setChiTietKhachHang] = useState(null);
  const [timKiem, setTimKiem] = useState('');
  const [timKiemTrangThai, setTimKiemTrangThai] = useState('');
  const [khachHangHienThi, setKhachHangHienThi] = useState([]);
  const [dangtai, setDangtai] = useState(false);
  const [showModalXoa, setShowModalXoa] = useState(false); // Hiển thị modal xóa
  const [khachHangXoa, setKhachHangXoa] = useState(null); // Thông tin khách hàng cần xóa


  const chiSoPhanTuCuoi = trangHienTai * soPhanTuMotTrang;
  const chiSoPhanTuDau = chiSoPhanTuCuoi - soPhanTuMotTrang;
  const cacPhanTuHienTai = khachHangHienThi.slice(chiSoPhanTuDau, chiSoPhanTuCuoi);
  const tongSoTrang = Math.ceil(khachHangHienThi.length / soPhanTuMotTrang);

  const thayDoiTrang = (soTrang) => setTrangHienTai(soTrang);

  const layDanhSachKhachHang = async () => {
    setDangtai(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASEURL}/api/khachhang`);
      setDanhSachKhachHang(response.data);
      setKhachHangHienThi(response.data);
      setDangtai(false);
    } catch (error) {
      console.log('có lỗi khi lấy danh sách khách hàng', error);
      toast.error('có lỗi khi lấy danh sách', {
        position: 'top-right',
        autoClose: 3000
      });
    }
  };

  useEffect(() => {
    layDanhSachKhachHang();
  }, []);

  const xuLyTimKiem = (e) => {
    const giaTriTimKiem = e.target.value.toLowerCase();
    setTimKiem(giaTriTimKiem);
    if (giaTriTimKiem) {
      const ketQuaLoc = danhSachKhachHang.filter(khachHang =>
        (khachHang.ho + ' ' + khachHang.ten).toLowerCase().includes(giaTriTimKiem)
      );
      setKhachHangHienThi(ketQuaLoc);
    } else {
      setKhachHangHienThi(danhSachKhachHang);
    }
  };


  const xuLyLocTrangThai = (e) => {
    const giaTriLocTrangThai = e.target.value;
    setTimKiemTrangThai(giaTriLocTrangThai);

    // Lọc theo trạng thái đơn hàng
    if (giaTriLocTrangThai) {
      const ketQuaLoc = danhSachKhachHang.filter((khachHang) =>
        khachHang.hoaDons.some(
          (hoadon) => hoadon.status === giaTriLocTrangThai
        )
      );
      setKhachHangHienThi(ketQuaLoc);
    } else {
      setKhachHangHienThi(danhSachKhachHang); // Nếu không có giá trị lọc, hiển thị toàn bộ danh sách
    }
  };

  const xoaKhachHang = async (id, ten) => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true'; // Kiểm tra trạng thái lưu đăng nhập
    const token = isLoggedIn ? localStorage.getItem('adminToken') : sessionStorage.getItem('adminToken'); // Lấy token từ localStorage nếu đã lưu, nếu không lấy từ sessionStorage

    try {
      // Gửi yêu cầu DELETE với Authorization header
      const response = await axios.delete(
        `${process.env.REACT_APP_BASEURL}/api/khachhang/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}` // Thêm token vào header
          }
        }
      );

      toast.success(`Xóa khách hàng "${ten}" thành công`, {
        position: 'top-right',
        autoClose: 3000
      });

      // Cập nhật danh sách khách hàng sau khi xóa
      layDanhSachKhachHang();

      // Đóng modal sau khi xóa thành công
      setHienThiModal(false);
    } catch (error) {
      console.log('Có lỗi khi xóa khách hàng:', error);
      toast.error(`Có lỗi khi xóa khách hàng "${ten}"`, {
        position: 'top-right',
        autoClose: 3000
      });
    }
  };

  const hienThiChiTiet = async (id) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASEURL}/api/khachhang/${id}`);
      setChiTietKhachHang(response.data);
      setHienThiModal(true);
    } catch (error) {
      console.log('có lỗi khi lấy chi tiết khách hàng', error);
      toast.error(' có lỗi khi lấy chi tiết khách hàng', {
        position: 'top-right',
        autoClose: 300
      });
    }
  };
  const capNhatTrangThai = async (billId, trangthaimoi) => {
    try {
      const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true'; // Kiểm tra trạng thái lưu đăng nhập
      const token = isLoggedIn ? localStorage.getItem('adminToken') : sessionStorage.getItem('adminToken'); // Lấy token từ localStorage nếu đã lưu, nếu không lấy từ sessionStorage
      // Gửi trạng thái cập nhật lên backend
      await axios.put(
        `${process.env.REACT_APP_BASEURL}/api/HoaDon/UpdateStatus/${billId}`,
        { status: trangthaimoi },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
        }
      );

      toast.success('Đã cập nhật trạng thái đơn hàng thành công!', {
        position: 'top-right',
        autoClose: 3000,
      });

      // Cập nhật trạng thái của đơn hàng trong danh sách khách hàng
      setDanhSachKhachHang((prevList) =>
        prevList.map((khachHang) => {
          if (khachHang.hoaDons) {
            khachHang.hoaDons = khachHang.hoaDons.map((hoadon) =>
              hoadon.id === billId ? { ...hoadon, status: trangthaimoi } : hoadon
            );
          }
          return khachHang;
        })
      );

      setKhachHangHienThi((prevList) =>
        prevList.map((khachHang) => {
          if (khachHang.hoaDons) {
            khachHang.hoaDons = khachHang.hoaDons.map((hoadon) =>
              hoadon.id === billId ? { ...hoadon, status: trangthaimoi } : hoadon
            );
          }
          return khachHang;
        })
      );

      // Đóng modal sau khi cập nhật thành công
      setHienThiModal(false);
    } catch (error) {
      console.error('Có lỗi khi cập nhật trạng thái đơn hàng:', error);
      toast.error('Có lỗi khi cập nhật trạng thái đơn hàng!', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };


  const kiemTraTrangThaiHoaDon = (hoadons) => {
    return hoadons?.some(hoadon => hoadon.status === 'Hủy đơn');
  };

  const layTrangThaiDonHang = (hoaDons) => {
    if (!hoaDons || hoaDons.length === 0) {
      return {
        text: 'Chưa có đơn hàng',
        bgColor: 'badge bg-light text-muted border',
        textColor: ''
      };
    }

    // Trạng thái "Đang giao"
    const hoadonDangGiao = hoaDons.find(h => h.status === 'Đang giao');
    if (hoadonDangGiao) {
      return {
        text: 'Đang giao',
        bgColor: 'badge bg-warning text-dark border border-warning',
        textColor: ''
      };
    }

    // Trạng thái "Đã giao thành công"
    const hoadonGiaoThanhCong = hoaDons.find(h => h.status === 'Đã giao thành công');
    if (hoadonGiaoThanhCong) {
      return {
        text: 'Thành công',
        bgColor: 'badge bg-success text-white border border-success shadow',
        textColor: ''
      };
    }

    // Trạng thái "Hủy đơn"
    const hoadonHuy = hoaDons.find(h => h.status === 'Hủy đơn');
    if (hoadonHuy) {
      return {
        text: 'Hủy đơn',
        bgColor: 'badge bg-danger text-white border border-danger shadow',
        textColor: ''
      };
    }

    // Trạng thái "Giao không thành công"
    const hoadonKhongGiaoThanhCong = hoaDons.find(h => h.status === 'Giao không thành công');
    if (hoadonKhongGiaoThanhCong) {
      return {
        text: 'Không thành công',
        bgColor: 'badge bg-dark text-light border border-secondary',
        textColor: ''
      };
    }

    // Trạng thái "Chờ xử lý"
    const hoadonChoXuLy = hoaDons.find(h => h.status === 'Chờ xử lý');
    if (hoadonChoXuLy) {
      return {
        text: 'Chờ xử lý',
        bgColor: 'badge bg-primary text-white border border-primary shadow',
        textColor: ''
      };
    }

    return {
      text: 'Chưa có đơn hàng',
      bgColor: 'badge bg-light text-muted border',
      textColor: ''
    };
  };
  const handleHienThiModalXoa = (khachHang) => {
    setKhachHangXoa(khachHang); // Lưu thông tin khách hàng cần xóa
    setShowModalXoa(true); // Hiển thị modal
  };

  const handleDongModalXoa = () => {
    setKhachHangXoa(null); // Reset thông tin khách hàng
    setShowModalXoa(false); // Đóng modal
  };

  const handleXacNhanXoa = async () => {
    if (khachHangXoa) {
      await xoaKhachHang(khachHangXoa.id, `${khachHangXoa.ho} ${khachHangXoa.ten}`); // Gọi hàm xóa
      setKhachHangXoa(null); // Reset thông tin khách hàng
      setShowModalXoa(false); // Đóng modal
    }
  };


  return (
    <div id="wrapper">
      <SiderbarAdmin />

      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <HeaderAdmin />

          <div id="content">
            <div className="content-header">
              <div className="container-fluid">
                <div className="row mb-2">
                  <div className="col-sm-6">
                    <h1 className="h3 mb-0 text-gray-800">Danh Sách Khách Hàng</h1>
                  </div>
                  <div className="col-sm-6">
                    <ol className="breadcrumb float-sm-right">
                      <li className="breadcrumb-item"><Link to="/admin/trangchu">Home</Link></li>
                      <li className="breadcrumb-item active">Danh Sách Khách Hàng</li>
                    </ol>
                  </div>

                  <div className="col-sm-6">
                    {/* Tìm kiếm nâng cao */}
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Tìm kiếm theo tên khách hàng, email..."
                      value={timKiem}
                      onChange={xuLyTimKiem}
                      style={{ maxWidth: '300px', marginRight: '10px' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="container-fluid">
              <div className="card shadow mb-4">
                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                  <h3 className="m-0 font-weight-bold text-primary">Danh Sách Khách Hàng</h3>

                  {/* Bộ lọc theo trạng thái */}
                  <select
                    className="form-control"
                    value={timKiemTrangThai}
                    onChange={xuLyLocTrangThai}
                    style={{ maxWidth: '200px' }}
                  >
                    <option value="">Lọc theo trạng thái</option>
                    <option value="Đang giao">Đang giao</option>
                    <option value="Đã giao thành công">Đã giao thành công</option>
                    <option value="Hủy đơn">Hủy đơn</option>
                    <option value="Giao không thành công">Giao không thành công</option>
                    <option value="Chờ xử lý">Chờ xử lý</option>
                  </select>
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
                          <th scope="col">Ngày tạo</th>
                          <th scope="col">Họ Tên</th>
                          <th scope="col">Email</th>
                          <th scope="col">Số Điện Thoại</th>
                          <th scope="col">Địa chỉ chi tiết</th>
                          <th scope="col">Thành phố/Tỉnh thành/Xã</th>
                          <th scope="col">Ghi chú</th>
                          <th scope="col">Trạng thái</th>
                          <th scope="col">Chức Năng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {danhSachKhachHang.length === 0 ? (
                          <tr>
                            <td colSpan="10" className="text-center">Hiện tại chưa có khách hàng</td>
                          </tr>
                        ) : cacPhanTuHienTai.length > 0 ? (
                          cacPhanTuHienTai.map((item, index) => {
                            const trangThaiDonHang = layTrangThaiDonHang(item.hoaDons); // Lấy trạng thái từ danh sách hoaDons
                            return (
                              <tr key={nanoid()}>
                                <td>{chiSoPhanTuDau + index + 1}</td>
                                <td>{item.created_at ? new Date(item.created_at).toLocaleDateString("vi-VN") : 'Không có thông tin'}</td>
                                <td>{item.ho} {item.ten}</td>
                                <td>{item.emailDiaChi}</td>
                                <td>{item.sdt}</td>
                                <td>{item.diaChiCuThe}</td>
                                <td>{item.xaphuong}, {item.tinhthanhquanhuyen}, {item.thanhPho}</td>
                                <td>{item.ghiChu}</td>
                                <td className={`${trangThaiDonHang.bgColor} ${trangThaiDonHang.textColor}`}>
                                  {trangThaiDonHang.text}
                                </td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    {/* Icon xem chi tiết */}
                                    <button
                                      className="btn btn-info btn-sm me-2"
                                      title="Xem chi tiết"
                                      onClick={() => hienThiChiTiet(item.id)}
                                    >
                                      <i className="bi bi-eye"></i>
                                    </button>
                                    {/* Icon xóa */}
                                    {kiemTraTrangThaiHoaDon(item.hoaDons) && (
                                      <button
                                        className="btn btn-danger btn-sm"
                                        title="Xóa khách hàng"
                                        onClick={() => handleHienThiModalXoa(item)}
                                      >
                                        <i className="bi bi-trash"></i>
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="10" className="text-center">Không tìm thấy khách hàng</td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                  )}
                </div>

                <div className="card-footer clearfix">
                  {/* Phân trang */}
                  <ul className="pagination pagination-sm m-0 float-right">
                    <li className={`page-item ${trangHienTai === 1 ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => thayDoiTrang(trangHienTai > 1 ? trangHienTai - 1 : 1)}>«</button>
                    </li>
                    {[...Array(tongSoTrang)].map((_, i) => (
                      <li key={i + 1} className={`page-item ${trangHienTai === i + 1 ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => thayDoiTrang(i + 1)}>{i + 1}</button>
                      </li>
                    ))}
                    <li className={`page-item ${trangHienTai === tongSoTrang ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => thayDoiTrang(trangHienTai < tongSoTrang ? trangHienTai + 1 : tongSoTrang)}>»</button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal chi tiết khách hàng */}
        <ModalChiTietKhachHang
          show={hienThiModal}
          handleClose={() => setHienThiModal(false)}
          chiTietKhachHang={chiTietKhachHang}
          capNhatTrangThai={capNhatTrangThai}
          xoaKhachHang={xoaKhachHang}
          layTrangThaiDonHang={layTrangThaiDonHang}
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
              <h5 className="mb-3">Bạn có chắc chắn muốn xóa khách hàng này?</h5>
              <p className="text-muted">
                <strong>Họ Tên:</strong> {khachHangXoa?.ho} {khachHangXoa?.ten} <br />
                <strong>Email:</strong> {khachHangXoa?.emailDiaChi} <br />
                <strong>Số điện thoại:</strong> {khachHangXoa?.sdt}
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
        <ToastContainer />
      </div>
    </div>

  );
};

export default Khachhangs;
