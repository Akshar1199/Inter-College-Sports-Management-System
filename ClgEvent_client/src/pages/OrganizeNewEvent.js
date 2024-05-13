import React, { useState, useEffect } from "react";

import AdminNavbar from "./AdminNavbar";
import "../styles/OrganizeNewEvent.css"; // Import the CSS file

const OrganizeNewEvent = () => {
  const currentYear = new Date().getFullYear();
  const [loading, setLoading] = useState(true);
  const [checkClgDone, setCheckClgDone] = useState(false);
  const [colleges, setAllColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(""); // Initialize to an empty string
  const [organizingCollege, setOrganizingCollege] = useState(null);

  const [orgcollege, setOrgCollege] = useState({});

  const handleCollegeSelect = (collegeId) => {
    setSelectedCollege(collegeId);
  };

  useEffect(() => {
    const checkOrganizingCollege = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/admin/getOrganizingCollege/${currentYear}`,
          {
            method: "POST",
          }
        );
        const data = await response.json();
         
          if (data.organizingclg) {
            setOrganizingCollege(data.organizingclg);
          } 
          else if(response.status === 404){
            setOrganizingCollege({});
          }else {
            setOrganizingCollege({});
          }
         

        setCheckClgDone(true);
        setLoading(false);
      } catch (error) {
        console.error("Error checking organizing college:", error);
      }
    };

    const fetchColleges = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/clg/getAllColleges",
          {
            method: "POST",
          }
        );
        const data = await response.json();
        setAllColleges(data);
      } catch (error) {
        console.error("Error fetching colleges:", error);
      }
    };

    checkOrganizingCollege();
    fetchColleges();
  }, [currentYear]);

  const handleOrganize = async () => {
    if (!selectedCollege) {
      window.alert("Please select a college to organize the event.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/admin/organizeEvent/${selectedCollege}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date: new Date().getFullYear(),
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        window.alert(`Event organized by ${data.clgName}`);
        window.location.reload();
      } else {
        window.alert(
          `Error organizing event: ${data.error || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error organizing event:", error);
      window.alert("An unexpected error occurred while organizing the event.");
    }
  };

  const handleDeleteOrganize = async () => {
    const fetchColleges = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/clg/getOrganizeCollege",
          {
            method: "POST",
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        if (data.clg) {
          setOrgCollege(data.clg);
          localStorage.setItem("orgClgId", data.clg._id);
        } else {
          console.error("No college data found in the response:", data);
        }
      } catch (error) {
        console.error("Error fetching colleges:", error.message);
      }
    };

    await fetchColleges();

    try {
      const response = await fetch(
        `http://localhost:5000/admin/changeOrganizingCollege/${currentYear}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newCollegeId: null,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        window.alert(`Please Select the new College`);
        window.location.reload();
      } else {
        window.alert(
          `Error changing organizing college: ${data.error || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error changing organizing college:", error);
      window.alert(
        "An unexpected error occurred while changing the organizing college."
      );
    }
  };

  return (
    <div>
      <AdminNavbar />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {organizingCollege.clg ? (
            <div>
              <h1>{`Event organized by ${organizingCollege.clg.clg_name} in year ${currentYear}`} </h1>
              <button
                className="change-btn"
                onClick={handleDeleteOrganize}
              >
                Change the Event Organizing
              </button>
            </div>
          ) : (
            <div className="organize-event-container">
              <h1>{`Choose College to Organize Event for ${currentYear}`}</h1>
              {/* Improved select dropdown for better styling */}
              <select
                className="college-select"
                value={selectedCollege}
                onChange={(e) => handleCollegeSelect(e.target.value)}
              >
                <option value="" disabled>
                  Select a College
                </option>
                {colleges.map((college) => (
                  <option key={college._id} value={college._id}>
                    {college.clg_name}
                  </option>
                ))}
              </select>
              <button
                className="organize-btn"
                onClick={handleOrganize}
              >
                Organize Event
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrganizeNewEvent;
