import React, { useState } from "react";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";

const JSONValidation = () => {
  const [formData, setFormData] = useState("");
  const validateData = (str) => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setFormData(e.target.value);
  };

  const handleSubmit = () => {
    //prepare to integrate with SDK
    validateData(formData) === true
      ? console.log(formData, "JSON validated to be sent")
      : console.log("No JSON data ready");
  };

  return (
    <div>
      <div className="mb-3 d-flex flex-column align-items-center">
        <Form.Control
          as="textarea"
          placeholder="Paste your JSON here"
          rows={10}
          onChange={handleChange}
        />
        <button
          className="button mt-3"
          style={{ width: "30%", border: "none" }}
          onClick={handleSubmit}
        >
          Validate JSON
        </button>
      </div>
    </div>
  );
};
export default JSONValidation;
