import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Register.css";

export default function Register() {
  const [user, setUser] = useState({
    username: "",
    password: "",
    clgName: "",
    city: "",
    email: "",
    mobileNo: "",
    rpass: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [askforotp, setaskforotp] = useState(false);
  const [sentotp, setotp] = useState("");
  const [userotp, setuserotp] = useState("");
  const [verified, setverify] = useState(false);
  const [loading, setLoading] = useState(false); // Added loading state
  const [errorMessage, setErrorMessage] = useState("");
  const [iserror, seterror] = useState(true);
  const navigate = useNavigate();

  const handleInputs = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setaskforotp(false);
    if(name === "email"){
    setErrorMessage("");
    }
    setUser({ ...user, [name]: value });
  };

  const handleAgreeCheckbox = () => {
    setAgreed(!agreed);
  };

  const handelSubmit = async (e) => {
    console.log(verified);
    if(!verified){
      window.alert("Please Verify your email First");
    }
    e.preventDefault();

    const { username, email, clgName, password, rpass, city, mobileNo } = user;

    if (!agreed) {
      setErrorMessage("Please agree to the terms of service");
      return;
    }

    if (!verified) {
      setErrorMessage("Please verify your email before registering.");
      return;
    }

    if (
      !email ||
      !username ||
      !password ||
      !rpass ||
      !clgName ||
      !city ||
      !mobileNo
    ) {
      seterror(true);
      setErrorMessage("Fill all the fields properly");
    } else {
      if (password !== rpass) {
        setErrorMessage("Password and Repeat password must match");
      } else {
        try {
          const res = await fetch("http://localhost:5000/clg/register", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
              username,
              email,
              clgName,
              password,
              city,
              mobileNo,
            }),
          });

          const data = await res.json();
          console.log(data);
          localStorage.setItem("username", username);

          if (res.status === 400) {
            setErrorMessage("Try with a different username and email");
          } else if (res.status === 401) {
            setErrorMessage("Found error");
          } else if (res.status === 402) {
            setErrorMessage("This College is already Registered...");
          } else {
            setErrorMessage(""); // Clear any previous error message
            window.alert("Registration Successful");
            navigate("/login", { state: { registrationSuccess: true } });
          }
        } catch (error) {
          console.error("Registration error:", error);
          setErrorMessage("Registration failed. Please try again.");
        }
      }
    }
  };

  const handelSend = async () => {
    setuserotp("");
    setErrorMessage("");
    const new_email = user.email;
    setaskforotp(false);
    if (!askforotp) {
      try {
        setLoading(true); // Start loading spinner
        const res = await fetch("http://localhost:5000/clg/sendOtp", {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            new_email,
          }),
        });

        if (res.status === 200) {
          const data = await res.json();
          setotp(data.otp);
          setaskforotp(true);
          setErrorMessage(""); // Clear any previous error message
        }
      } catch (err) {
        console.log(err);
        setErrorMessage("Error sending OTP. Please try again.");
      } finally {
        setLoading(false); // Stop loading spinner
      }
    }
  };
  const handelVerify = async () => {
    if (sentotp === userotp) {
      setverify(true);
      seterror(false);
      setErrorMessage("Successfully Verified"); // Clear any previous error message
    } else {
      seterror(true);
      setErrorMessage("OTP verification failed. Please enter the correct OTP.");
    }
  };

  const handelotp = (e) => {
    const val = e.target.value;
    setuserotp(val);
  };

  return (
    <div className="container-fluid" style={{ minHeight: "100vh" }}>
      <div className="container-fluid registration-container mt-25">
        <div className="row justify-content-center">
          <div className="col-md-6 mt-25">
            <div className="registration-form mt-25">
              <h2 className="text-center mb-4">Create an account</h2>
              <div className="row justify-content-center">
                <div className="col-md-6">
                  <form>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="College Name"
                        name="clgName"
                        value={user.clgName}
                        onChange={handleInputs}
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="User Name"
                        name="username"
                        value={user.username}
                        onChange={handleInputs}
                      />
                    </div>
                    <div className="mb-3 input-group">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Email Address"
                        name="email"
                        value={user.email}
                        onChange={handleInputs}
                      />
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={handelSend}
                        disabled={loading} // Disable button when loading
                      >
                        {loading ? (
                          <div
                            className="spinner-border spinner-border-sm"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        ) : (
                            askforotp ? "Resend Otp?" : "Send Otp"
                        )}
                      </button>
                    </div>

                    {askforotp && (
                      <div className="mb-3 input-group">
                        <input
                          type="text"
                          placeholder="Enter OTP"
                          className="form-control"
                          name="otp"
                          value={userotp}
                          onChange={handelotp}
                        />
                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={handelVerify}
                        >
                          Verify
                        </button>
                      </div>
                    )}

                    

                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="City"
                        name="city"
                        value={user.city}
                        onChange={handleInputs}
                      />
                    </div>
                  </form>
                </div>
                <div className="col-md-6">
                  <form>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Mobile No."
                        name="mobileNo"
                        value={user.mobileNo}
                        onChange={handleInputs}
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        name="password"
                        value={user.password}
                        onChange={handleInputs}
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Repeat your password"
                        name="rpass"
                        value={user.rpass}
                        onChange={handleInputs}
                      />
                    </div>
                    <div className="form-check mb-4">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value={agreed}
                        id="agreeCheckbox"
                        onChange={handleAgreeCheckbox}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="agreeCheckbox"
                      >
                        I agree all statements in{" "}
                        <a href="#!" className="text-body">
                          <u>Terms of service</u>
                        </a>
                      </label>
                    </div>
                  </form>
                </div>
              </div>
              {errorMessage && (
                      <div>
                        {iserror && (
                          <div className="alert alert-danger" role="alert">
                            {errorMessage}
                          </div>
                        )}
                        {!iserror && (
                          <div className="alert alert-success" role="alert">
                            {" "}
                            {/* Fixed the typo here */}
                            {errorMessage}
                          </div>
                        )}
                      </div>
                    )}
              <div className="text-center mb-3">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handelSubmit}
                  disabled={!agreed || loading}
                >
                  Register
                </button>
              </div>
              <p className="text-center text-muted mt-3 mb-0">
                Have already an account?{" "}
                <a href="/login" className="fw-bold text-body">
                  <u>Login here</u>
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
