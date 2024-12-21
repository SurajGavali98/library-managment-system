import React, { useState } from 'react';

const AddBookForm = ({ onClose, onAdd }) => {
  const [formValues, setFormValues] = useState({
    title: '',
    author: '',
    totalCopies: '',
    availableCopies: '',
  });

  const handleFormChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const [errorMessage, setErrorMessage] = useState('');
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:44307/api/Books/addBook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        throw new Error('Failed to add the book');
      }
 console.log(response);
      
      window.location.reload();
    } catch (error) {
      setErrorMessage('Error: Unable to add book. Please try again.');
    }
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <h2>Add New Book</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleFormSubmit}>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formValues.title}
            onChange={handleFormChange}
            required
          />
          <label>Author</label>
          <input
            type="text"
            name="author"
            value={formValues.author}
            onChange={handleFormChange}
            required
          />
          <label>Total Copies</label>
          <input
            type="number"
            name="totalCopies"
            value={formValues.totalCopies}
            onChange={handleFormChange}
            required
          />
          <label>Available Copies</label>
          <input
            type="number"
            name="availableCopies"
            value={formValues.availableCopies}
            onChange={handleFormChange}
            required
          />
          <div className="popup-buttons">
            <button type="submit">Add</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookForm;
