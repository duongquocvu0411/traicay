// import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';

// const ProtectedRoute = ({ children, congkhai = false }) => {
//   // Kiểm tra trạng thái đăng nhập bằng cách kiểm tra sự tồn tại của token
//   const daDangNhap = localStorage.getItem('adminToken') !== null;
//   const location = useLocation(); // Lấy tuyến đường hiện tại

//   // Chuyển hướng người dùng đã đăng nhập khỏi trang đăng nhập
//   if (daDangNhap && location.pathname === '/admin/login') {
//     return <Navigate to="/admin/trangchu" />;
//   }

//   // Cho phép truy cập nếu đó là trang công khai hoặc người dùng đã đăng nhập
//   if (congkhai || daDangNhap) {
//     return children;
//   }

//   // Chuyển hướng người dùng chưa đăng nhập đến trang đăng nhập
//   return <Navigate to="/admin/login" />;
// };

// export default ProtectedRoute;


import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, congkhai = false }) => {
  // Kiểm tra xem dữ liệu lưu trong localStorage hay sessionStorage
  const daDangNhap = sessionStorage.getItem('isAdminLoggedIn') === 'true' || localStorage.getItem('isAdminLoggedIn') === 'true';
  const loginTime = sessionStorage.getItem('loginTime') || localStorage.getItem('loginTime');
  const location = useLocation();

  // Kiểm tra thời gian hết hạn: 1 giờ nếu sessionStorage, 1 tuần nếu localStorage
  const sessionTimeout = localStorage.getItem('isAdminLoggedIn') === 'true' ? 7 * 24 * 60 * 60 * 1000 : 1 * 60 * 60 * 1000; // 7 ngày nếu lưu thông tin

  if (loginTime && new Date().getTime() - loginTime > sessionTimeout) {
    // Nếu quá thời gian hết hạn, xóa token và sessionStorage/localStorage và điều hướng đến trang đăng nhập
    localStorage.removeItem('adminToken');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('loginhoten');


    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('loginTime');
    sessionStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('loginhoten');
    return <Navigate to="/admin/login" />;
  }

  // Chuyển hướng người dùng đã đăng nhập khỏi trang đăng nhập
  if (daDangNhap && location.pathname === '/admin/login') {
    return <Navigate to="/admin/trangchu" />;
  }

  // Cho phép truy cập nếu đó là trang công khai hoặc người dùng đã đăng nhập
  if (congkhai || (daDangNhap && (sessionStorage.getItem('adminToken') || localStorage.getItem('adminToken')))) {
    return children;
  }

  // Chuyển hướng người dùng chưa đăng nhập đến trang đăng nhập
  return <Navigate to="/admin/login" />;
};

export default ProtectedRoute;
