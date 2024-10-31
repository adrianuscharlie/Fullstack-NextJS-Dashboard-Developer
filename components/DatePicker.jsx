import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const MyDatePicker = () => {
  // Initialize state to store the selected date
  const [startDate, setStartDate] = useState(null);

  // Function to handle date change
  const handleDateChange = (date) => {
    setStartDate(date); // Update the state with the selected date
  };

  return (
    <div>
      <h2>Select a Date</h2>
      {/* Render DatePicker component */}
      <DatePicker
        selected={startDate}        
        onChange={handleDateChange} 
        dateFormat="yyyy/MM/dd"     
        placeholderText="Click to select a date" 
      />
      {/* Display the selected date */}
      {startDate && <p>Selected Date: {startDate.toLocaleDateString()}</p>}
    </div>
  );
};

export default MyDatePicker;
