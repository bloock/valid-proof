import React from 'react';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';

const JSONValidation = () => {
    return(
        <div>
            <Form>
                <Form.Group className="mb-3 ">
                    <Form.Control as="textarea" placeholder="Paste your JSON here" rows={10} />
                </Form.Group>
            </Form>
        </div>
    )
}

export default JSONValidation;