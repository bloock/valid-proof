import React from "react";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";


const JSONValidation = () => {



    const handleChange = (e) =>{
        console.log(e.target.value)
    }
    const handleSubmission = (e) =>{
        function isJsonString(str) {
            try {
                JSON.parse();
            } catch (e) {
                return false;
            }
            return true;
        }
        console.log(isJsonString({"first_name":"Tony","last_name":"Hawk","age":31}))
    }

  return (
    <div>
      <Form>
        <Form.Group className="mb-3 d-flex flex-column align-items-center">
          <Form.Control
            as="textarea"
            placeholder="Paste your JSON here"
            rows={10}
            onChange={handleChange}
          />
          <button
            className="button mt-3"
            style={{ width: "30%" }}
            onClick={handleSubmission}
          >
            Validate JSON
          </button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default JSONValidation;
