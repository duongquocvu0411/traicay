// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';

// const SiderbarAdmin = () => {
//   const vitriRoute = useLocation();

//   return (
//     // Sử dụng class `collapse` để sidebar có thể bật/tắt
//     <aside className="main-sidebar sidebar-dark-primary elevation-4 collapse d-md-block" id="sidebar">
//       <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion">
//         {/* Sidebar - Brand */}
//         <Link to="/admin/Trangchu" className="sidebar-brand d-flex align-items-center justify-content-center">
//           <div className="sidebar-brand-icon rotate-n-15">
//             <i className="fas fa-laugh-wink"></i>
//           </div>
//           <div className="sidebar-brand-text mx-3">Admin<sup></sup></div>
//         </Link>

//         {/* Divider */}
//         <hr className="sidebar-divider my-0" />

//         {/* Dashboard */}
//         <li className={`nav-item ${vitriRoute.pathname === '/admin/Trangchu' ? 'active' : ''}`}>
//           <Link className="nav-link" to="/admin/Trangchu">
//             <i className="fas fa-fw fa-tachometer-alt"></i>
//             <span>Dashboard</span>
//           </Link>
//         </li>
//         <li className={`nav-item ${vitriRoute.pathname === '/admin/menu' ? 'active' : ''}`}>
//           <Link className="nav-link" to="/admin/menu">
//           <i className="fas fa-store"></i>
//             <span>Quản lý Menu</span>
//           </Link>
//         </li>
//         <li className={`nav-item ${vitriRoute.pathname === '/admin/tencuahang' ? 'active' : ''}`}>
//           <Link className="nav-link" to="/admin/tencuahang">
//           <i className="fas fa-store-alt"></i> 

//             <span>Quản lý Tên cửa hàng</span>
//           </Link>
//         </li>
//         <li className={`nav-item ${vitriRoute.pathname === '/admin/dactrung' ? 'active' : ''}`}>
//           <Link className="nav-link" to="/admin/dactrung">
//           <i className="fas fa-truck"></i> 

//             <span>Quản lý Đặc trưng </span>
//           </Link>
//         </li>
//         <li className={`nav-item ${vitriRoute.pathname === '/admin/Banners' ? 'active' : ''}`}>
//           <Link className="nav-link" to="/admin/Banners">
//           <i className="fas fa-bullhorn"></i>
//             <span>Quản lý Banners</span>
//           </Link>
//         </li>
//         <li className={`nav-item ${vitriRoute.pathname === '/admin/tenfooter' ? 'active' : ''}`}>
//           <Link className="nav-link" to="/admin/tenfooter">
//           <i className="fas fa-store"></i>
//             <span>Quản lý Tên Footer</span>
//           </Link>
//         </li>
       
//         {/* Divider */}
//         <hr className="sidebar-divider" />

//         {/* Sản Phẩm */}
//         <li className={`nav-item ${vitriRoute.pathname === '/admin/sanpham' ? 'active' : ''}`}>
//           <Link className="nav-link" to="/admin/sanpham">
//             <i className="fas fa-fw fa-box"></i>
//             <span>Quản lý Sản Phẩm</span>
//           </Link>
//         </li>

//         {/* Danh Mục */}
//         <li className={`nav-item ${vitriRoute.pathname === '/admin/danhmucsanpham' ? 'active' : ''}`}>
//           <Link className="nav-link" to="/admin/danhmucsanpham">
//             <i className="fas fa-fw fa-list"></i>
//             <span>Quản lý Danh mục</span>
//           </Link>
//         </li>

//         {/* Địa Chỉ Admin */}
//         <li className={`nav-item ${vitriRoute.pathname === '/admin/diachichitiet' ? 'active' : ''}`}>
//           <Link className="nav-link" to="/admin/diachichitiet">
//             <i className="fas fa-fw fa-map-marker-alt"></i>
//             <span>Quản lý Địa Chỉ Admin</span>
//           </Link>
//         </li>

//         {/* Liên Hệ */}
//         <li className={`nav-item ${vitriRoute.pathname === '/admin/lienhe' ? 'active' : ''}`}>
//           <Link className="nav-link" to="/admin/lienhe">
//             <i className="fas fa-fw fa-envelope"></i>
//             <span>Quản lý Liên Hệ</span>
//           </Link>
//         </li>

//         {/* Khách hàng */}
//         <li className={`nav-item ${vitriRoute.pathname === '/admin/khachhang' ? 'active' : ''}`}>
//           <Link className="nav-link" to="/admin/khachhang">
//           <i className="bi bi-person-vcard-fill"></i>
//             <span>Quản lý Đơn hàng</span>
//           </Link>
//         </li>

//         {/* Divider */}
//         <hr className="sidebar-divider" />
//       </ul>
//     </aside>
//   );
// };

// export default SiderbarAdmin;
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SiderbarAdmin = () => {
  const vitriRoute = useLocation();

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4 collapse d-md-block" id="sidebar">
      <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion">
        {/* Sidebar - Brand */}
        <Link to="/admin/Trangchu" className="sidebar-brand d-flex align-items-center justify-content-center">
          <div className="sidebar-brand-icon rotate-n-15">
            <i className="fas fa-laugh-wink"></i>
          </div>
          <div className="sidebar-brand-text mx-3">Admin</div>
        </Link>

        {/* Divider */}
        <hr className="sidebar-divider my-0" />

        {/* Dashboard */}
        <li className={`nav-item ${vitriRoute.pathname === '/admin/Trangchu' ? 'active' : ''}`}>
          <Link className="nav-link" to="/admin/Trangchu">
            <i className="fas fa-fw fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </Link>
        </li>

        {/* Quản lý cửa hàng - Dropdown */}
        <li className="nav-item">
          <a
            className="nav-link collapsed"
            href="#"
            data-bs-toggle="collapse"
            data-bs-target="#collapseStoreManagement"
            aria-expanded="false"
            aria-controls="collapseStoreManagement"
          >
            <i className="fas fa-store"></i>
            <span>Quản lý cửa hàng</span>
          </a>
          <div
            id="collapseStoreManagement"
            className="collapse"
            data-bs-parent="#sidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              <Link
                className={`collapse-item ${vitriRoute.pathname === '/admin/menu' ? 'active' : ''}`}
                to="/admin/menu"
              >
                Quản lý Menu
              </Link>
              <Link
                className={`collapse-item ${vitriRoute.pathname === '/admin/tencuahang' ? 'active' : ''}`}
                to="/admin/tencuahang"
              >
                Quản lý Tên cửa hàng
              </Link>
              <Link
                className={`collapse-item ${vitriRoute.pathname === '/admin/dactrung' ? 'active' : ''}`}
                to="/admin/dactrung"
              >
                Quản lý Đặc trưng
              </Link>
              <Link
                className={`collapse-item ${vitriRoute.pathname === '/admin/Banners' ? 'active' : ''}`}
                to="/admin/Banners"
              >
                Quản lý Banners
              </Link>
              <Link
                className={`collapse-item ${vitriRoute.pathname === '/admin/tenfooter' ? 'active' : ''}`}
                to="/admin/tenfooter"
              >
                Quản lý Tên Footer
              </Link>
            </div>
          </div>
        </li>

        {/* Divider */}
        <hr className="sidebar-divider" />

        {/* Quản lý Sản phẩm */}
        <li className={`nav-item ${vitriRoute.pathname === '/admin/sanpham' ? 'active' : ''}`}>
          <Link className="nav-link" to="/admin/sanpham">
            <i className="fas fa-fw fa-box"></i>
            <span>Quản lý Sản Phẩm</span>
          </Link>
        </li>

        {/* Quản lý Danh mục */}
        <li className={`nav-item ${vitriRoute.pathname === '/admin/danhmucsanpham' ? 'active' : ''}`}>
          <Link className="nav-link" to="/admin/danhmucsanpham">
            <i className="fas fa-fw fa-list"></i>
            <span>Quản lý Danh mục</span>
          </Link>
        </li>

        {/* Quản lý Địa chỉ */}
        <li className={`nav-item ${vitriRoute.pathname === '/admin/diachichitiet' ? 'active' : ''}`}>
          <Link className="nav-link" to="/admin/diachichitiet">
            <i className="fas fa-fw fa-map-marker-alt"></i>
            <span>Quản lý Địa Chỉ Admin</span>
          </Link>
        </li>

        {/* Quản lý Liên hệ */}
        <li className={`nav-item ${vitriRoute.pathname === '/admin/lienhe' ? 'active' : ''}`}>
          <Link className="nav-link" to="/admin/lienhe">
            <i className="fas fa-fw fa-envelope"></i>
            <span>Quản lý Liên Hệ</span>
          </Link>
        </li>

        {/* Quản lý Đơn hàng */}
        <li className={`nav-item ${vitriRoute.pathname === '/admin/khachhang' ? 'active' : ''}`}>
          <Link className="nav-link" to="/admin/khachhang">
            <i className="bi bi-person-vcard-fill"></i>
            <span>Quản lý Đơn hàng</span>
          </Link>
        </li>

        {/* Divider */}
        <hr className="sidebar-divider" />
      </ul>
    </aside>
  );
};

export default SiderbarAdmin;
