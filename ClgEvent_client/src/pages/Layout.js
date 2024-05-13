import React from 'react';
import OrganizerNavbar from './ClgNavbar';
import { useLocation } from 'react-router-dom';

function Layout({ children , fnSetEnable }) {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const orgClgId = localStorage.getItem('orgClgId');
    
    return (
        <div>
            <OrganizerNavbar orgClgId={orgClgId} setEnable={fnSetEnable}/>
            {children}
        </div>
    );
}

export default Layout;
