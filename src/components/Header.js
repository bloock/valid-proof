import React, { Fragment } from 'react';
import { Divider } from 'primereact/divider';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../customstyles.css';

const Header = () => {
    return(
        <Fragment>
            <div className='main-margin my-4 py-2'>
                <span className='pt-1 bold-text header-title'>VALIDPROOF</span>
                <span className='float-right'>
                <span className='header-text bold-text mx-5'>Blockchain</span>
                <span className='header-text bold-text'>Resources</span>
                </span>
            </div>
            <Divider />
        </Fragment>
    )
}

export default Header;