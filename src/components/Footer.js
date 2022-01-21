import React from 'react';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => {
    return(
        <footer>
            <div className='container-lg my-4 py-5 header-text'>
                <span>Powered by Ethereum</span>
                <span className='float-right'>This website uses cookies to improve your experience and has and updated Privacy Policy</span>
            </div>
            <div className="little-top-margin"></div>
        </footer>
    )
}

export default Footer;