import React, { useState } from 'react';

const IssueBookForm = ({ books, onClose }) => {
  const [selectedBookId, setSelectedBookId] = useState('');
  const [issuedTo, setIssuedTo] = useState('');
  const [issueDate, setIssueDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const issueDetails = {
      bookId: selectedBookId,
      issuedTo,
      issueDate,
    };

    try {
      const response = await fetch('https://localhost:44307/api/Books/issueBook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(issueDetails),
      });

      if (response.ok) {
        alert('Book issued successfully!');
        onClose();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to issue book.');
      }
    } catch (error) {
      console.error('Error issuing book:', error);
      alert('An error occurred while issuing the book.');
    }
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <h2>Issue a Book</h2>
        <form onSubmit={handleSubmit}>
          <label>Select Book</label>
          <select
            value={selectedBookId}
            onChange={(e) => setSelectedBookId(e.target.value)}
            required
          >
            <option value="" disabled>Select a book</option>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title}
              </option>
            ))}
          </select>

          <label>Issued To</label>
          <input
            type="text"
            value={issuedTo}
            onChange={(e) => setIssuedTo(e.target.value)}
            required
          />

          <label>Issue Date</label>
          <input
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            required
          />

          <div className="popup-buttons">
            <button type="submit">Issue</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssueBookForm;
