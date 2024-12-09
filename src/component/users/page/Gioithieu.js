import React, { useEffect } from "react";
import Tieude from "../HeaderUsers";
import Footerusers from "../Footerusers";

const Gioithieu = () => {


  return (
    <>
    <Tieude />
    <div className="container-fluid py-5 page-header text-white">
      <div className="text-center py-5">
      <h1 className="display-4 fw-bold text-animation">
      <span className="animated-letter">G</span>
      <span className="animated-letter">i</span>
      <span className="animated-letter">ớ</span>
      <span className="animated-letter">i</span>
      &nbsp;
      <span className="animated-letter">T</span>
      <span className="animated-letter">h</span>
      <span className="animated-letter">i</span>
     
      <span className="animated-letter">ệ</span>
      <span className="animated-letter">u</span>
 
    </h1>
       
      </div>
      </div>
    
      {/* Giới thiệu Section Start */}
      <div className="container-fluid py-5 bg-light">
        <div className="container py-5">
          <h1 className="text-center text-primary fw-bold mb-4">Câu chuyện thương hiệu</h1>
          <p className="lead text-center text-muted">
            Morning Fruit là đơn vị chuyên cung cấp trái cây tươi chất lượng cao, từ các nhà vườn trong nước và nhập khẩu.
            Sứ mệnh của chúng tôi là...
          </p>
          <div className="row mt-5">
            <div className="col-lg-6 mb-4">
              <div className="card border-0 shadow-sm">
                <img
                  src={`${process.env.PUBLIC_URL}/img/best-product-1.jpg`}
                  className="card-img-top rounded-top"
                  alt="Trái cây"
                />
                <div className="card-body text-center">
                  <h4 className="card-title text-primary">Từ nông trại đến bàn ăn</h4>
                  <p className="card-text text-muted">
                    Hành trình của chúng tôi là mang đến sản phẩm tươi ngon và an toàn, đảm bảo nguồn gốc và quy trình sản xuất chuẩn.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-6 mb-4">
              <div className="card border-0 shadow-sm">
                <img
                  src={`${process.env.PUBLIC_URL}/img/best-product-2.jpg`}
                  className="card-img-top rounded-top"
                  alt="Trái cây tươi"
                />
                <div className="card-body text-center">
                  <h4 className="card-title text-primary">Cam kết của chúng tôi</h4>
                  <p className="card-text text-muted">
                    Chúng tôi luôn cam kết chất lượng, nguồn gốc rõ ràng và quy trình chăm sóc kỹ lưỡng để mang đến những sản phẩm tươi ngon nhất.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Giới thiệu Section End */}
  
      {/* Testimonial Section Start */}
      <div className="container-fluid bg-primary text-white py-5">
        <div className="container py-5">
          <div className="testimonial-header text-center">
            <h1 className="fw-bold mb-4">Mang đến những rau củ và trái cây tươi cho bạn!</h1>
          </div>
          <div className="row">
            <div className="col-lg-4 mb-4">
              <div className="card bg-light text-dark border-0 shadow-sm h-100">
                <div className="card-body">
                  <p className="card-text">
                    "Tôi rất ấn tượng với chất lượng trái cây của Morning Fruit. Trái cây tươi ngon, dịch vụ khách hàng tận tâm!"
                  </p>
                </div>
                <div className="card-footer border-0 bg-transparent text-center">
                  <img
                    src={`${process.env.PUBLIC_URL}/img/testimonial-1.jpg`}
                    alt="Client 1"
                    className="rounded-circle mb-3"
                    style={{ width: 80, height: 80 }}
                  />
                  <h5 className="mb-0">Nguyễn Văn A</h5>
                  <p className="text-muted">Khách hàng thân thiết</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 mb-4">
              <div className="card bg-light text-dark border-0 shadow-sm h-100">
                <div className="card-body">
                  <p className="card-text">
                    "Trái cây rất tươi và sạch, giá cả hợp lý. Tôi sẽ tiếp tục ủng hộ Morning Fruit lâu dài."
                  </p>
                </div>
                <div className="card-footer border-0 bg-transparent text-center">
                  <img
                    src={`${process.env.PUBLIC_URL}/img/testimonial-1.jpg`}
                    alt="Client 2"
                    className="rounded-circle mb-3"
                    style={{ width: 80, height: 80 }}
                  />
                  <h5 className="mb-0">Trần Thị B</h5>
                  <p className="text-muted">Người yêu trái cây</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 mb-4">
              <div className="card bg-light text-dark border-0 shadow-sm h-100">
                <div className="card-body">
                  <p className="card-text">
                    "Morning Fruit luôn là sự lựa chọn hàng đầu của tôi khi cần trái cây tươi ngon và đảm bảo chất lượng."
                  </p>
                </div>
                <div className="card-footer border-0 bg-transparent text-center">
                  <img
                    src={`${process.env.PUBLIC_URL}/img/testimonial-1.jpg`}
                    alt="Client 3"
                    className="rounded-circle mb-3"
                    style={{ width: 80, height: 80 }}
                  />
                  <h5 className="mb-0">Lê Văn C</h5>
                  <p className="text-muted">Người nội trợ</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Testimonial Section End */}
   
    <Footerusers />
  </>
  
  );
};
export default Gioithieu;