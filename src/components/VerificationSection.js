import React from 'react';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Timeline } from 'primereact/timeline';
import '../customstyles.css';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';

const VerificationSection = () => {

    const events = [
        { status: 'Validate hash', description: 'Lorem ipsum lorem ipsum lorem ipsum', icon: 'pi pi-check px-2 py-2 click-icon', color: '#555555' },
        { status: 'Validate integrity proof', description: 'Lorem ipsum lorem ipsum lorem ipsum', icon: 'pi pi-check px-2 py-2 click-icon', color: '#555555' },
        { status: 'Validate on blockchain', description: 'Lorem ipsum lorem ipsum lorem ipsum', icon: 'pi pi-check px-2 py-2 click-icon', color: '#555555' },
        { status: 'Validate issuer', description: 'Lorem ipsum lorem ipsum lorem ipsum', icon: 'pi pi-check px-2 py-2 click-icon', color: '#555555' }
    ];

    const customizedMarker = (item) => {
        return (
            <span className="custom-marker p-shadow-2 circle" style={{ backgroundColor: item.color }}>
                <i className={item.icon}></i>
            </span>
        );
    };

    const customizedContent = (item) => {
        if (item.status === 'Validate issuer') {
            return (
                <div className="horizontal-center half-right double-width">
                    <div className="bold-text">{item.status}</div>
                    <div className='px-4'><span>{item.description}</span></div>
                </div>
            );
        } else {
            return (
                <div className="horizontal-center half-right">
                    <div className="bold-text">{item.status}</div>
                    <div className='px-4'><span>{item.description}</span></div>
                </div>
            );
        }
    };

    return(
        <div className='main-margin'>
            <div className="horizontal-center mx-5 px-5">
                <div className='bold-text header-title mb-4'>Your verification</div>
                <Timeline value={events} layout="horizontal" content={customizedContent} marker={customizedMarker}/>
            </div>
            <div className='little-top-margin'></div>
            <div className="horizontal-center">
                <div className="success-color">
                    <span>
                        <i className='circle check-success pi pi-check px-1 py-1 click-icon icon-small'></i>
                    </span>
                    <span className="mx-2">Your document has been verified</span>
                </div>
            </div>
            <div className="horizontal-center">
                <div className='failure-color'>
                    <span>
                        <i className='circle check-failure pi pi-check px-1 py-1 click-icon icon-small'></i>
                    </span>
                    <span className="mx-2">Your document can't be verified</span>
                </div>
            </div>
            <div className="mt-5">
                <Card className="card-files-width px-4 py-2">
                    <div>
                        <span>
                            <i className='pi pi-file'></i>
                        </span>
                        <span className="mx-2 bold-text">Prova.pdf</span>
                    </div>
                    <div className="bold-text mt-4">Issute time</div>
                    <div>June 19, 2021, 09:29:59 AM</div>
                    <Divider className="my-4" />
                    <div className="bold-text">Document hash</div>
                    <div>0x29d9eabaf4387459664aa23bbf1a81c20c8e71517642508445d70f9ec768ca3a</div>
                    <Divider className="my-4" />
                    <div className="bold-text">Smart Contract Adress</div>
                    <div>0x5EE4Ec3Cbee909050E68c7FF7a8b422cfbd72244</div>
                    <Divider className="my-4" />
                    <div className="bold-text">Registration Txs</div>
                    <div>0x478122c80d0c3948e03b265f79c8a01c10674a63265f4aaaa10942a5c9e2baef</div>
                    <Divider className="my-4" />
                    <div>
                        <span>
                            <i className='pi pi-arrow-circle-down'></i>
                        </span>
                        <span className="mx-2 bold-text">Integrity proof</span>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default VerificationSection;