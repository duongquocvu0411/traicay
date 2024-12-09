import React from 'react';
import { Modal, Button, Container, Row, Col } from 'react-bootstrap';

const ModalLienhe = ({ show, handleClose, noiDungChiTiet }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title className="fw-bold">
          <i className="bi bi-info-circle"></i> Chi Tiết Nội Dung
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        className="p-4"
        style={{
          maxHeight: "400px",
          overflowY: "auto",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
        }}
      >
        <Container fluid>
          <Row>
            <Col>
              <div
                className="p-3"
                style={{
                  wordWrap: "break-word",
                  whiteSpace: "pre-wrap",
                  fontSize: "1rem",
                  lineHeight: "1.5",
                  color: "#333",
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                }}
              >
                {noiDungChiTiet || "Không có nội dung để hiển thị."}
              </div>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleClose}
          className="shadow-sm"
          style={{ borderRadius: "8px" }}
        >
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalLienhe;
