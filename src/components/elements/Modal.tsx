import React from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";

type ModalProps = {
  title: string;
  body: string;
  firstInput: string;
  firstInputType: string;
  uiError: string;
  onShow: boolean;
  onChange?: (e: any) => void;
  onClick?: () => void;
  onHide: () => void;
};

const Popup: React.FC<ModalProps> = ({
  title,
  body,
  firstInput,
  firstInputType,
  uiError,
  onChange = () => {},
  onClick = () => {},
  onShow = false,
  onHide = () => {},
}) => {
  return (
    <Modal show={onShow} onHide={onHide}>
      <Modal.Body>
        <Modal.Title className="py-3">{title}</Modal.Title>
        {body}
        <Form>
          <Form.Group className="my-3" controlId="exampleForm.ControlInput1">
            <Form.Label className="text-sm">{firstInput}</Form.Label>
            <Form.Control onChange={onChange} type={firstInputType} />
          </Form.Group>
        </Form>
        {uiError && <Alert variant="warning">{uiError}</Alert>}
      </Modal.Body>
      <Modal.Footer>
        <Button
          style={{
            backgroundColor: "var(--primary-bg-color",
            border: "none",
          }}
          onClick={onClick}
        >
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Popup;
