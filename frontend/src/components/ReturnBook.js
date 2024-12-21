import React, { useEffect, useState } from 'react';

const ReturnBookForm = ({ onClose }) => {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [selectedIssueId, setSelectedIssueId] = useState('');
  const [returnDate, setReturnDate] = useState('');

  useEffect(() => {
    const fetchIssuedBooks = async () => {
      try {
        const response = await fetch('https://localhost:44307/api/Books/issuedBooks');
        const data = await response.json();
        setIssuedBooks(data);
      } catch (error) {
        console.error('Error fetching issued books:', error);
      }
    };

    fetchIssuedBooks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `https://localhost:44307/api/Books/returnBook?issueId=${selectedIssueId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(returnDate),
        }
      );

      if (response.ok) {
        alert('Book returned successfully!');
        onClose();
      } else {
        const error = await response.json();
        console.log(error);
        alert(error.message || 'Failed to return book.');
      }
    } catch (error) {
      console.error('Error returning book:', error);
      alert('An error occurred while returning the book.');
    }
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <h2>Return a Book</h2>
        <form onSubmit={handleSubmit}>
          <label>Select Issued Book</label>
          <select
            value={selectedIssueId}
            onChange={(e) => setSelectedIssueId(e.target.value)}
            required
          >
            <option value="" disabled>Select an issued book</option>
            {issuedBooks.map((issue) => (
              <option key={issue.id} value={issue.id}>
                {issue.bookTitle} (Issued to: {issue.issuedTo} on {new Date(issue.issueDate).toLocaleDateString()})
              </option>
            ))}
          </select>

          <label>Return Date</label>
          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            required
          />

          <div className="popup-buttons">
            <button type="submit">Return</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReturnBookForm;
