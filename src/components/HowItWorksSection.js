import React from 'react';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card } from 'primereact/card';
import demoimage from '../images/demoimage.jpg';
import '../customstyles.css';

const HowItWorksSection = () => {
    return(
        <div className="grey-background">
            <div className="main-margin">
                <div className="little-top-margin"></div>
                <div className='bold-text title'>H<span className="underline underline-more-right">ow it works</span></div>
                <div className="little-top-margin"></div>
                <Row>              
                    <Col>
                        <div className="grey-title">Lorem Ipsum</div>
                        <div className="mb-4">Lorem ipsum lorem ipsum lor</div>
                        <Card>
                            <img alt="Card" src={demoimage}/>
                        </Card>
                    </Col>
                    <Col>
                        <div className="grey-title">Lorem Ipsum</div>
                        <div className="mb-4">Lorem ipsum lorem ipsum lor</div>
                        <Card>
                            <img alt="Card" src={demoimage}/>
                        </Card>
                    </Col>
                    <Col>
                        <div className="grey-title">Lorem Ipsum</div>
                        <div className="mb-4">Lorem ipsum lorem ipsum lor</div>
                        <Card>
                            <img alt="Card" src={demoimage}/>
                        </Card>
                    </Col>
                </Row>
                <Row className="little-top-margin"></Row>
            </div>
        </div>
    )
}

export default HowItWorksSection;