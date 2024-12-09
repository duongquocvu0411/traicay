import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { Line, Bar } from 'react-chartjs-2';
import axios from 'axios';
import HeaderAdmin from '../HeaderAdmin';
import SiderbarAdmin from '../SidebarAdmin';
import Footer from '../Footer';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const TrangChuAdmin = () => {
  const [dsDoanhThuThang, setDsDoanhThuThang] = useState([]);
  const [loading, setLoading] = useState(true);
  const [soLuongKhachHangMoi, setSoLuongKhachHangMoi] = useState(0);
  const [doanhThuHomNay, setDoanhThuHomNay] = useState(0);
  const [sanPhamBanChay, setSanPhamBanChay] = useState([]);
  const [tongSanPhamTonKho, setTongSanPhamTonKho] = useState(0);
  const [dangtai, setDangtai] = useState(false);

const layDoanhThuThang = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BASEURL}/api/HoaDon/DoanhThuTheoTungThang`);
    console.log("Data from API:", response.data); // Thêm dòng này
    const duLieuDaSapXep = response.data.sort((a, b) => 
      a.year === b.month ? a.month - b.month : a.year - b.year
    );
    setDsDoanhThuThang(duLieuDaSapXep);
    setLoading(false);
  } catch (error) {
    console.error("Error fetching monthly revenue data:", error);
    toast.error("Lỗi khi lấy dữ liệu doanh thu tháng!");
  }
};

  const laySoLuongKhachHangMoi = async () => {
    setDangtai(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASEURL}/api/khachhang/khachhangthangmoi`);
      setSoLuongKhachHangMoi(response.data.tongSoKachhangmoi);
      setDangtai(false);
    } catch (error) {
      console.error("Lỗi khi lấy số lượng khách hàng mới:", error);
      toast.error("Lỗi khi lấy số lượng khách hàng mới!");
    }
  };

  const layDoanhThuHomNay = async () => {
    setDangtai(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASEURL}/api/hoadon/DoanhThuHomNay`);
      setDoanhThuHomNay(response.data.tongDoanhThu);
      setDangtai(false);
    } catch (error) {
      console.error("Lỗi khi lấy doanh thu hôm nay:", error);
      toast.error("Lỗi khi lấy doanh thu hôm nay!");
    }
  };

  const laySanPhamBanChay = async () => {
    setDangtai(true);
    try {
      // Cập nhật URL API theo API mới đã tạo
      const response = await axios.get(`${process.env.REACT_APP_BASEURL}/api/HoaDon/SanPhamBanChayHienTai`);
      setSanPhamBanChay(response.data); // Lưu dữ liệu sản phẩm bán chạy vào state
      setDangtai(false);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu sản phẩm bán chạy:", error);
      toast.error("Lỗi khi lấy dữ liệu sản phẩm bán chạy!");
    }
  };
  

  const layTongSanPhamTonKho = async () => {
    setDangtai(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASEURL}/api/sanpham/TongSanPham`);
      setTongSanPhamTonKho(response.data.tongSanPham);
      setDangtai(false);
    } catch (error) {
      console.error("Lỗi khi lấy tổng sản phẩm tồn kho:", error);
      toast.error("Lỗi khi lấy tổng sản phẩm tồn kho!");
    }
  };

  useEffect(() => {
    layDoanhThuThang();
    laySoLuongKhachHangMoi();
    layDoanhThuHomNay();
    laySanPhamBanChay();
    layTongSanPhamTonKho();
  }, []);

  const dataLine = {
    labels: dsDoanhThuThang.map((muc) => `${muc.month}/${muc.year}`),
    datasets: [
      {
        label: 'Doanh thu (VND)',
        data: dsDoanhThuThang.map((muc) => muc.totalRevenue),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const dataBar = {
    labels: sanPhamBanChay.map((sp) => sp.sanPhamNames),
    datasets: [
      {
        label: 'Số lượng bán',
        data: sanPhamBanChay.map((sp) => sp.totalQuantity),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
        ],
        borderColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.raw.toLocaleString('vi-VN',{ minimumFractionDigits: 3})} VND`,
        },
      },
    },
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const value = tooltipItem.raw; // Lấy giá trị thô (số lượng bán)
            const index = tooltipItem.dataIndex; // Lấy chỉ mục của item trong tooltip
    
            // Lấy tên sản phẩm và đơn vị tính từ mảng sản phẩm bán chạy
            const sanPham = sanPhamBanChay[index];
            const dvt = sanPham ? sanPham.sanPhamDonViTinh : ''; // Lấy đơn vị tính
  
            // Kiểm tra xem có sản phẩm và đơn vị tính không
            if (sanPham && dvt) {
              return `${value.toLocaleString("vi-VN")} ${dvt}`; // Hiển thị số lượng bán + đơn vị tính
            }
  
            return value.toLocaleString("vi-VN"); // Nếu không có đơn vị tính thì chỉ hiển thị số lượng bán
          },
        },
      },
    },
  };
  
  

  return (
    <div id="wrapper">
    <SiderbarAdmin />
    <div id="content-wrapper" className="d-flex flex-column">
      <div id="content">
        <HeaderAdmin />

        <div className="container-fluid mt-3">
          <Row>
            {/* Doanh thu tháng */}
            <Col md={6}>
              <Card className="shadow-sm mb-4 hover-card">
                <Card.Body>
                  <Card.Title>
                    <i className="bi bi-graph-up-arrow text-primary me-2"></i> Doanh thu tháng
                  </Card.Title>
                  {loading ? (
                    <div className="text-center">
                      <Spinner animation="border" variant="primary" />
                      <p>Đang tải dữ liệu...</p>
                    </div>
                  ) : (
                    <Line data={dataLine} options={chartOptions} />
                  )}
                </Card.Body>
              </Card>
            </Col>

            {/* Top sản phẩm bán chạy */}
            <Col md={6}>
              <Card className="shadow-sm mb-4 hover-card">
                <Card.Body>
                  <Card.Title>
                    <i className="bi bi-bar-chart-fill text-success me-2"></i> Top sản phẩm bán chạy
                  </Card.Title>
                  {loading ? (
                    <div className="text-center">
                      <Spinner animation="border" variant="success" />
                      <p>Đang tải dữ liệu...</p>
                    </div>
                  ) : (
                    <Bar data={dataBar} options={options} />
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            {/* Khách hàng mới */}
            <Col md={4}>
              <Card className="bg-primary text-white shadow-sm mb-4 hover-card">
                <Card.Body>
                  <Card.Title>
                    <i className="bi bi-people-fill me-2"></i> Khách hàng mới
                  </Card.Title>
                  <Card.Text>{`Tháng này có ${soLuongKhachHangMoi} khách hàng mới.`}</Card.Text>
                  <Link to="/admin/khachhang" className="btn btn-light">
                    Chi tiết
                  </Link>
                </Card.Body>
              </Card>
            </Col>

            {/* Doanh thu hôm nay */}
            <Col md={4}>
              <Card className="bg-success text-white shadow-sm mb-4 hover-card">
                <Card.Body>
                  <Card.Title>
                    <i className="bi bi-currency-exchange me-2"></i> Doanh thu hôm nay
                  </Card.Title>
                  <Card.Text>{`Hôm nay đạt ${doanhThuHomNay.toLocaleString('vi-VN',{ minimumFractionDigits: 3})} VND.`}</Card.Text>
                  <Link to="/admin/hoadon" className="btn btn-light">
                    Chi tiết
                  </Link>
                </Card.Body>
              </Card>
            </Col>

            {/* Sản phẩm tồn kho */}
            <Col md={4}>
              <Card className="bg-warning text-dark shadow-sm mb-4 hover-card">
                <Card.Body>
                  <Card.Title>
                    <i className="bi bi-box-seam me-2"></i> Sản phẩm tồn kho
                  </Card.Title>
                  <Card.Text>{`Có ${tongSanPhamTonKho} sản phẩm tồn kho.`}</Card.Text>
                  <Link to="/admin/sanpham" className="btn btn-dark">
                    Chi tiết
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
      <Footer />
    </div>
  </div>
  );
};

export default TrangChuAdmin;
