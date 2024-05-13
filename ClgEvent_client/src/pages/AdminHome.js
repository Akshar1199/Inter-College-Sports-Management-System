import React from 'react'
import AdminNavbar from './AdminNavbar';
import { Link } from 'react-router-dom';


export default function AdminHome() {
  let adminToken = localStorage.getItem('adminToken')
  return (

    <div>
      {!adminToken ? (
        <div className='container mx-10 text-center '>
          <h2>You Have to Login First to use this Admin Services</h2>
          <Link to='/login'>Login Here</Link>
        </div>
      )
        :
        (
          <div>
            <AdminNavbar></AdminNavbar>

            <h1>Welcome to Admin Home</h1>
          </div >
        )
      }


    </div >
  );
}
