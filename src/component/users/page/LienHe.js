import React, { useState } from 'react';
import axios from 'axios';
import HeaderUsers from '../HeaderUsers';
import { toast, ToastContainer } from 'react-toastify';
import Footerusers from './../Footerusers';


const LienHe = () => {
  const [duLieuForm, setDuLieuForm] = useState({
    ten: '',
    email: '',
    sdt: '',
    ghichu: ''
  });

 

  // Cập nhật dữ liệu khi người dùng nhập vào form
  const thayDoiDuLieu = (e) => {
    const { name, value } = e.target;

    if (name === 'sdt') {
      if (/^\d*$/.test(value) && value.length <= 11) { 
    //kiểm tra xem chuỗi nhập vào có phải là số hay không: ^: Bắt đầu chuỗi. \d: Đại diện cho một chữ số (0-9).*: Cho phép lặp lại ký tự trước nó (các chữ số) 0 hoặc nhiều lần.$: Kết thúc chuỗi.
        setDuLieuForm({
          ...duLieuForm,
          [name]: value,
        });
      }
    } else {
      //Nếu không phải là trường sdt (nghĩa là các trường khác như ten, email, hoặc ghichu), thì sẽ không kiểm tra điều kiện về số.
      setDuLieuForm({
        ...duLieuForm,
        [name]: value,
      });
    }
  };

  // Xử lý khi người dùng nhấn nút gửi
  const xuLyGuiForm = (e) => {
    e.preventDefault();

  // Kiểm tra các trường bắt buộc
  if (!duLieuForm.ten) {
    toast.error('Họ tên không được bỏ trống.');
    return;
  }
  if (!duLieuForm.email) {
    toast.error('Email không được bỏ trống.');
    return;
  }
  if (!duLieuForm.sdt) {
    toast.error('Số điện thoại không được bỏ trống.');
    return;
  }
  if (duLieuForm.sdt.length < 10) {
    toast.error('Số điện thoại phải có ít nhất 10 số.');
    return;
  }
  if (!duLieuForm.ghichu) {
    toast.error('Nội dung liên hệ không được bỏ trống.');
    return;
  }
    axios.post(`${process.env.REACT_APP_BASEURL}/api/lienhe`, duLieuForm, {
      headers: {
        'Content-Type': 'application/json'  
      }
    })
      .then(response => {
       
        toast.success('Đã gửi  liên hệ thành công!',{
          position: 'top-right',
          autoClose: 3000 
        }); // Thông báo thành công

        // Reset form về trạng thái ban đầu
        setDuLieuForm({
          ten: '',
          email: '',
          sdt: '',
          ghichu: ''
        });
      })
      .catch(error => {
        if (error.response && error.response.data) {
          console.error('Chi tiết lỗi từ server:', error.response.data);
        
          toast.error('Lỗi khi gửi form liên hệ!');
        } else {
          console.error('Lỗi khi gửi form liên hệ:', error);
        
          toast.error('Lỗi khi gửi form liên hệ!');
        }
      });
  };

  return (
    <>
    <HeaderUsers />
    <div className="container-fluid py-5 page-header text-white">
      <div className="text-center py-5">
      <h1 className="display-4 fw-bold text-animation">
      <span className="animated-letter">L</span>
      <span className="animated-letter">i</span>
      <span className="animated-letter">ê</span>
      <span className="animated-letter">n</span>
      &nbsp;
      <span className="animated-letter">H</span>
      <span className="animated-letter">ệ</span>
 
    </h1>
       
      </div>
      </div>
  
    {/* Container chính cho form */}
    <div className="container mt-5" >
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8">
          <div className="card shadow border-0">
            {/* Tiêu đề form */}
            <div className="card-header bg-primary text-white text-center py-4">
              <h2 className="mb-0 text-uppercase">Liên Hệ Với Chúng Tôi</h2>
            </div>
  
            {/* Nội dung form */}
            <div className="card-body p-4">
              <p className="text-center text-muted mb-4">
                Vui lòng điền thông tin bên dưới để gửi liên hệ. Chúng tôi sẽ phản hồi trong thời gian sớm nhất!
              </p>
              <form onSubmit={xuLyGuiForm}>
                {/* Họ Tên */}
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    name="ten"
                    id="formHoTen"
                    className="form-control shadow-sm"
                    placeholder="Họ tên"
                    value={duLieuForm.ten}
                    onChange={thayDoiDuLieu}
                    required
                  />
                  <label htmlFor="formHoTen">Họ Tên *</label>
                </div>
  
                {/* Email */}
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    name="email"
                    id="formEmail"
                    className="form-control shadow-sm"
                    placeholder="Email"
                    value={duLieuForm.email}
                    onChange={thayDoiDuLieu}
                    required
                  />
                  <label htmlFor="formEmail">Email *</label>
                </div>
  
                {/* Số Điện Thoại */}
                <div className="form-floating mb-3">
                  <input
                    type="tel"
                    name="sdt"
                    id="formSoDienThoai"
                    className="form-control shadow-sm"
                    placeholder="Số điện thoại"
                    value={duLieuForm.sdt}
                    onChange={thayDoiDuLieu}
                    required
                  />
                  <label htmlFor="formSoDienThoai">Số Điện Thoại *</label>
                </div>
  
                {/* Nội Dung */}
                <div className="form-floating mb-3">
                  <textarea
                    name="ghichu"
                    id="formGhiChu"
                    className="form-control shadow-sm"
                    placeholder="Nội dung liên hệ"
                    value={duLieuForm.ghichu}
                    onChange={thayDoiDuLieu}
                    style={{ height: '150px' }}
                    required
                  ></textarea>
                  <label htmlFor="formGhiChu">Nội Dung *</label>
                </div>
  
                {/* Nút gửi */}
                <button type="submit" className="btn btn-primary btn-lg w-100 shadow">
                  Gửi Liên Hệ
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  <Footerusers/>
    <ToastContainer />
  </>
  
  );
};

export default LienHe;
