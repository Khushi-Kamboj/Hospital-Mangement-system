import React, { useEffect, useState } from "react";
import axios from "axios";
import "tailwindcss/tailwind.css"; // Make sure Tailwind CSS is imported
import './App.css'; // Import your custom CSS file

const App = () => {
  // State variables
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ name: "", age: "", condition: "" }); // For adding patients
  const [appointments, setAppointments] = useState([]);
  const [appointmentForm, setAppointmentForm] = useState({ patientId: "", doctorId: "", date: "" }); // For booking appointments
  const [auth, setAuth] = useState({ username: "", password: "" }); // For login
  const [loggedIn, setLoggedIn] = useState(false);
  const [view, setView] = useState("dashboard"); // Controls which section is shown

  // Effect hook to fetch initial data when logged in
  useEffect(() => {
    if (loggedIn) {
      fetchPatients();
      fetchDoctors();
      fetchAppointments();
    }
    // NOTE: Add dependencies carefully if using external state for fetches.
    // Here, fetches depend only on loggedIn status.
  }, [loggedIn]);

  // --- Data Fetching Functions ---
  const fetchPatients = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/patients");
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
       // Optionally, show a user-friendly error message
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/doctors");
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
       // Optionally, show a user-friendly error message
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/appointments");
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
       // Optionally, show a user-friendly error message
    }
  };

  // --- Form Change Handlers ---
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAppointmentChange = (e) => {
    setAppointmentForm({ ...appointmentForm, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setAuth({ ...auth, [e.target.name]: e.target.value });
  };

  // --- Form Submission Handlers ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/patients", form);
      fetchPatients(); // Refresh list after adding
      setForm({ name: "", age: "", condition: "" }); // Clear form
      setView("patients"); // Optionally navigate to patients list after adding
    } catch (error) {
      console.error("Error adding patient:", error);
      alert("Failed to add patient. Check console for details."); // Provide user feedback
    }
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/appointments", appointmentForm);
      fetchAppointments(); // Refresh list after booking
      setAppointmentForm({ patientId: "", doctorId: "", date: "" }); // Clear form
       setView("appointments"); // Optionally navigate to appointments list after booking
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment. Check console for details."); // Provide user feedback
    }
  };

  // --- Login Handler ---
  const handleLogin = (e) => {
    e.preventDefault();
    // Simple hardcoded login for demonstration
    if (auth.username === "admin" && auth.password === "admin") {
      setLoggedIn(true);
      // Optionally set initial view after login
      setView("dashboard");
    } else {
      alert("Invalid credentials");
      setAuth({ username: "", password: "" }); // Clear form on failure
    }
  };

  // --- Render Function based on View State ---
  const renderView = () => {
    switch (view) {
      case "add-patient":
        return (
          <section className="section mb-12">
            <h2 className="text-2xl font-semibold mb-4">Add New Patient</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input name="name" value={form.name} onChange={handleChange} placeholder="Patient Name" required className="form-input" /> {/* Using custom form-input class */}
              <input name="age" value={form.age} onChange={handleChange} placeholder="Age" type="number" required className="form-input" /> {/* Using custom form-input class */}
              <input name="condition" value={form.condition} onChange={handleChange} placeholder="Condition" required className="form-input" /> {/* Using custom form-input class */}
              <button type="submit" className="md:col-span-3 bg-green-500 text-white py-2 rounded hover:bg-green-600 transition duration-300 ease-in-out">Add Patient</button>
            </form>
          </section>
        );
      case "book-appointment":
        return (
          <section className="section mb-12">
            <h2 className="text-2xl font-semibold mb-4">Book Appointment</h2>
            <form onSubmit={handleAppointmentSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select name="patientId" value={appointmentForm.patientId} onChange={handleAppointmentChange} required className="form-select"> {/* Using custom form-select class */}
                <option value="">Select Patient</option>
                {/* Ensure patients array is not empty before mapping */}
                {patients && patients.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <select name="doctorId" value={appointmentForm.doctorId} onChange={handleAppointmentChange} required className="form-select"> {/* Using custom form-select class */}
                <option value="">Select Doctor</option>
                 {/* Ensure doctors array is not empty before mapping */}
                {doctors && doctors.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              <input name="date" type="date" value={appointmentForm.date} onChange={handleAppointmentChange} required className="form-input" /> {/* Using custom form-input class */}
              <button type="submit" className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300 ease-in-out">Book</button>
            </form>
          </section>
        );
      case "patients":
        return (
          <section className="section mb-12">
            <h2 className="text-2xl font-semibold mb-4">Patients List</h2>
            {patients.length === 0 ? (
              <p className="text-gray-600 italic">No patients found. Add one using the "Add Patient" button.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {patients.map((patient) => (
                  <div key={patient.id} className="card"> {/* Using custom card class */}
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{patient.name}</h3>
                    <p className="text-gray-600">Age: {patient.age}</p>
                    <p className="text-gray-600">Condition: {patient.condition}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      case "doctors":
        return (
          <section className="section mb-12">
            <h2 className="text-2xl font-semibold mb-4">Doctors List</h2>
             {doctors.length === 0 ? (
              <p className="text-gray-600 italic">No doctors found. Add doctors via API or database.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {doctors.map((doctor) => (
                  <div key={doctor.id} className="card"> {/* Using custom card class */}
                    <h3 className="text-lg font-bold text-gray-800 mb-1">Dr. {doctor.name}</h3>
                    <p className="text-gray-600">Specialization: {doctor.specialization}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      case "appointments":
        return (
          <section className="section mb-12">
            <h2 className="text-2xl font-semibold mb-4">Appointments</h2>
             {appointments.length === 0 ? (
              <p className="text-gray-600 italic">No appointments booked yet.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {appointments.map((appt) => (
                  // Find patient and doctor names if possible for better display
                   // Note: This requires fetching patients/doctors data and looking them up,
                   // or having the backend return the names directly in the appointment list.
                   // For simplicity, displaying IDs here based on current data structure.
                  <div key={appt.id} className="card"> {/* Using custom card class */}
                    <p className="text-gray-700 mb-1"><strong>Patient ID:</strong> {appt.patientId}</p>
                    <p className="text-gray-700 mb-1"><strong>Doctor ID:</strong> {appt.doctorId}</p>
                    <p className="text-gray-700"><strong>Date:</strong> {appt.date}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      default: // Dashboard View
        return (
          <section className="section mb-12">
            <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
            <div className="p-6 bg-blue-50 border border-blue-200 rounded text-center text-blue-700">
              <p className="text-xl mb-2 font-medium">Welcome to the Hospital Management System!</p>
              <p className="text-gray-700">Navigate using the buttons above to manage patients, doctors, and appointments.</p>
              <p className="mt-4 text-gray-500 italic">[Placeholder for charts and analytics]</p>
            </div>
          </section>
        );
    }
  };

  // --- Main App Render ---
  // Render login screen if not logged in
  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4"> {/* Use a soft blue/gray gradient */}
        <div className="login-card w-full max-w-md"> {/* Custom login card class */}
          <div className="p-8">
            <h2 className="text-3xl font-bold text-center text-slate-800 mb-2 tracking-tight">Welcome back</h2>
            <p className="text-center text-slate-600 mb-8 text-md">Sign in to continue</p> {/* Soft text for subtitle */}
            <form onSubmit={handleLogin} className="space-y-6">
              <input
                name="username"
                type="text"
                placeholder="Username"
                value={auth.username}
                onChange={handleLoginChange}
                required
                className="login-input" // Custom class for inputs
                aria-label="Username"
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={auth.password}
                onChange={handleLoginChange}
                required
                className="login-input" // Custom class for inputs
                aria-label="Password"
              />
              <button type="submit" className="login-btn">Sign In</button> {/* Custom class for button */}
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Render main application if logged in
  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 rounded-lg shadow-xl mt-8 mb-8"> {/* Wider container, more prominent shadow */}
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">Hospital Management System</h1> {/* Darker, bolder title */}
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        {/* Navigation Buttons - Clean styling */}
        <button onClick={() => setView("dashboard")} className={`nav-button ${view === "dashboard" ? 'nav-button-active' : ''}`}>Dashboard</button>
        <button onClick={() => setView("add-patient")} className={`nav-button ${view === "add-patient" ? 'nav-button-active' : ''}`}>Add Patient</button>
        <button onClick={() => setView("book-appointment")} className={`nav-button ${view === "book-appointment" ? 'nav-button-active' : ''}`}>Book Appointment</button>
        <button onClick={() => setView("patients")} className={`nav-button ${view === "patients" ? 'nav-button-active' : ''}`}>Patients</button>
        <button onClick={() => setView("doctors")} className={`nav-button ${view === "doctors" ? 'nav-button-active' : ''}`}>Doctors</button>
        <button onClick={() => setView("appointments")} className={`nav-button ${view === "appointments" ? 'nav-button-active' : ''}`}>Appointments</button>
      </div>
      {/* Render the current view */}
      {renderView()}
    </div>
  );
};

export default App;