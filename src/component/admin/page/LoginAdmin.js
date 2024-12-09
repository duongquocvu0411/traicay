import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [tenDangNhap, setTenDangNhap] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [dangXuLy, setDangXuLy] = useState(false);
  const [luuDangNhap, setLuuDangNhap] = useState(false); // Trạng thái của checkbox lưu thông tin đăng nhập
  const dieuHuong = useNavigate();

  const xuLyDangNhap = async (e) => {
    e.preventDefault();
    setDangXuLy(true);

    try {
      const phanHoi = await axios.post(`${process.env.REACT_APP_BASEURL}/api/admin/login`, {
        username: tenDangNhap,
        password: matKhau,
      });

      if (phanHoi.data.status === 'Đăng nhập thành công') {
        const loginTime = new Date().getTime();

        // Kiểm tra nếu người dùng chọn lưu đăng nhập
        if (luuDangNhap) {
          // Lưu vào localStorage nếu người dùng chọn lưu
          localStorage.setItem('adminToken', phanHoi.data.token);
          localStorage.setItem('loginTime', loginTime);
          localStorage.setItem('loginhoten',phanHoi.data.hoten)
          localStorage.setItem('isAdminLoggedIn', 'true');
        } else {
          // Lưu vào sessionStorage nếu không chọn lưu
          sessionStorage.setItem('adminToken', phanHoi.data.token);
          sessionStorage.setItem('loginTime', loginTime);
          localStorage.setItem('loginhoten',phanHoi.data.hoten)
          sessionStorage.setItem('isAdminLoggedIn', 'true');
        }

        dieuHuong('/admin/trangchu');
      } else {
        toast.warning('Thông tin đăng nhập không đúng. Vui lòng kiểm tra lại.', {
          position: 'top-center',
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      toast.error('Đăng nhập thất bại. Vui lòng thử lại.', {
        position: 'top-center',
        autoClose: 3000,
      });
    } finally {
      setDangXuLy(false);
    }
  };

  return (
    <div className="container d-flex vh-100">
       <ul className="bubbles">
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
      <div className="row justify-content-center align-self-center w-100 ">
        <div className="col-md-4">
          <div className="card shadow-lg">
            <div className="card-header text-bg-primary text-center">
            <h4 className="card-title mb-0 text-center">
            <i className="bi-shop-window" /> Welcome To Login Admin
          </h4>
            </div>
            <div className="card-body">
              <form onSubmit={xuLyDangNhap}>
                <div className="mb-3">
                  <label htmlFor="tenDangNhap" className="form-label">Tên đăng nhập</label>
                  <input
                    type="text"
                    className="form-control"
                    id="tenDangNhap"
                    placeholder="Nhập tên đăng nhập"
                    value={tenDangNhap}
                    onChange={(e) => setTenDangNhap(e.target.value)}
                    required
                    autoComplete="username"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="matKhau" className="form-label">Mật khẩu</label>
                  <input
                    type="password"
                    className="form-control"
                    id="matKhau"
                    placeholder="Nhập mật khẩu"
                    value={matKhau}
                    onChange={(e) => setMatKhau(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>

                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="luuDangNhap"
                    checked={luuDangNhap}
                    onChange={(e) => setLuuDangNhap(e.target.checked)} // Thay đổi trạng thái checkbox
                  />
                  <label className="form-check-label" htmlFor="luuDangNhap">
                    Lưu thông tin đăng nhập 
                  </label>
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary btn-block" disabled={dangXuLy}>
                    {dangXuLy ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Đang xử lý...
                      </>
                    ) : (
                      'Đăng nhập'
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className="card-footer text-center py-3">
              <small className="text-muted">
                © 2024 Shop Bán Trái Cây Tươi
              </small>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;