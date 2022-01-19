import React from 'react';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import JSONValidation from './JSONValidation';
import TextValidation from './TextValidation';
import '../customstyles.css';

const FileSection = () => {
    return(
        <div className='main-margin'>
            <Row>
                <Col>
                    <div className='bold-text title'>M<span className="underline">aking docume</span>nt</div>
                    <div className='bold-text title'>v<span className="underline underline-right">erification </span></div>
                    <div className='bold-text title'>e<span className="underline underline-more-right">asier.</span></div>
                    <div className='text-main-page mt-5'>Lorem ipsum lorem ipsum Lorem ipsum</div>
                    <div className='text-main-page'>Lorem ipsum lorem ipsum Lorem</div>
                </Col>
                <Col>
                    <Tabs justify defaultActiveKey="text" className="mb-3">
                        <Tab eventKey="text" title="Text format">
                            <TextValidation />
                        </Tab>
                        <Tab eventKey="json" title="JSON format">
                            <JSONValidation />
                        </Tab>
                    </Tabs>
                </Col>
            </Row>
        </div>
    )
}

export default FileSection;