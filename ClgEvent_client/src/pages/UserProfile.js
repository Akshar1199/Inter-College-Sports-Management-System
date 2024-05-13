import React, { useEffect, useState } from 'react';
import Layout from './Layout';
import { jwtDecode } from 'jwt-decode';
import '../styles/userProfile.css'; 

const UserProfile = () => {
    const [user, setUser] = useState({ id: "", username: "", password: "", email: "", mobile_no: "", city: "" });
    const [sentOTP, setSentOTP] = useState(false);
    const [otp, setOTP] = useState("");
    const [userOTP, setUserOTP] = useState("");
    const [userID, setUserID] = useState('');

    useEffect(() => {
        const authToken = localStorage.getItem("authToken");
        if (authToken) {
            try {
                const decodedToken = jwtDecode(authToken);
                setUserID(decodedToken.user.id);
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, []);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const res = await fetch(`http://localhost:5000/clg/getClgDetails/${userID}`, {
                    method: 'POST'
                });
                const data = await res.json();
                const userDetails = {
                    id: data.clg._id,
                    username: data.clg.username,
                    password: "**********",
                    email: data.clg.email,
                    mobile_no: data.clg.mobile_no,
                    city: data.clg.city
                }
                setUser(userDetails);
            } catch (error) {
                console.error('Error While Fetching:', error.message);
            }
        };

        if (userID) {
            fetchUserDetails();
        }
    }, [userID]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleChange2 = (e) => {
        window.alert("You cannot change the email ID");
    }

    const handleOTPChange = (e) => {
        setUserOTP(e.target.value);
    };

    const handleVerifyOTP = async () => {
        if (otp === userOTP) {
            try {
                const response = await fetch('http://localhost:5000/clg/userUpdate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user: user,
                        isVerified: true,
                        passChanged: true // Assuming password change is verified with OTP
                    }),
                });
                const data = await response.json();
                if (data.success) {
                    alert("Successfully Updated Your Information");
                    setSentOTP(false);
                } else {
                    alert("Some Error has occurred while Updating...");
                }
            } catch (error) {
                console.error('Error updating user details:', error.message);
            }
        } else {
            alert("OTP verification failed. Please enter the correct OTP.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSentOTP(true);
        try {
            const response = await fetch('http://localhost:5000/clg/userUpdate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: user,
                    isVerified: false
                }),
            });
            const data = await response.json();
            if (data.success) {
                setOTP(data.otp);
                alert(`OTP is Sent to Your Email id: ${data.email}`);
            } else {
                alert("OTP is not generated or Sent. Your Email is not proper. Try Again Later.");
            }
        } catch (error) {
            console.error('Error submitting user details:', error.message);
        }
    };

    return (
        <Layout>
            <div className="user-profile-container">
                <div className="card user-profile-card">
                    <div className="card-body">
                        <h4 className="card-title text-center mb-4">Update User Details</h4>
                        <hr className='mb-4' />
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="username">User Name</label>
                                <input type="text" className="form-control" id="username" name="username" value={user.username} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input type="password" className="form-control" id="password" name="password" value={user.password} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input type="email" className="form-control" id="email" name="email" value={user.email} onChange={handleChange2} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="mobile">Mobile Number</label>
                                <input type="text" className="form-control" id="mobile" name="mobile_no" value={user.mobile_no} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="city">City</label>
                                <input type="text" className="form-control" id="city" name="city" value={user.city} onChange={handleChange} />
                            </div>
                            <button type="submit" className="btn btn-primary btn-block">Update</button>
                            {sentOTP && (
                                <div className="otp-verification">
                                    <input type="text" placeholder="Enter OTP" className="form-control mt-3" value={userOTP} onChange={handleOTPChange} />
                                    <br></br>
                                    <button type="button" className="btn btn-success mt-3" onClick={handleVerifyOTP}>Verify</button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default UserProfile;
