import React, { useEffect, useState } from 'react';
import AddBookForm from './AddBookForm';
import IssueBookForm from './IssueBook';
import ReturnBookForm from './ReturnBook';
import './Book.css';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [isIssuePopupOpen, setIsIssuePopupOpen] = useState(false);
  const [isReturnPopupOpen, setIsReturnPopupOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [formValues, setFormValues] = useState({
    title: '',
    author: '',
    totalCopies: '',
    availableCopies: '',
  });
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('https://localhost:44307/api/Books/booklist');
        const data = await response.json();
        setBooks(data);
        setFilteredBooks(data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);
  const handleEdit = (book) => {
    setSelectedBook(book);
    setFormValues({
      title: book.title,
      author: book.author,
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies,
    });
    setIsPopupOpen(true);
  };

  const handleDelete = (book) => {
    setSelectedBook(book);
    setIsDeletePopupOpen(true);
  };
  const handleFormSubmit = async () => {
    try {
      const response = await fetch(
        `https://localhost:44307/api/Books/editBook/${selectedBook.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formValues),
        }
      );
  
      if (response.ok) {
        const updatedBook = await response.json();
        setBooks((prevBooks) =>
          prevBooks.map((book) => (book.id === updatedBook.id ? updatedBook : book))
        );
        setFilteredBooks((prevBooks) =>
          prevBooks.map((book) => (book.id === updatedBook.id ? updatedBook : book))
        );
        setIsPopupOpen(false);
      } else {
        console.error('Failed to update book');
      }
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };
  
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  
  const handleDeleteConfirm = () => {
    // Logic to delete the book
    console.log('Deleted book:', selectedBook);
    setIsDeletePopupOpen(false);
  };
  const handleAddNewBook = (newBook) => {
    setBooks((prevBooks) => [newBook, ...prevBooks]);
    setFilteredBooks((prevBooks) => [newBook, ...prevBooks]);
    setIsAddPopupOpen(false);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = books.filter((book) =>
      book.title.toLowerCase().includes(query)
    );

    setFilteredBooks(filtered);
    setCurrentPage(1);
  };

  const bookRows = currentBooks.map((el, index) => (
    <tr key={el.id}>
      <td>{indexOfFirstBook + index + 1}</td>
      <td>{el.title}</td>
      <td>{el.author}</td>
      <td>{el.availableCopies}</td>
      <td>{el.issuedCount}</td>
      <td>
        <button className="edit-button" onClick={() => handleEdit(el)}>
          Edit
        </button>
        <button className="delete-button" onClick={() => handleDelete(el)}>
          Delete
        </button>
      </td>
    </tr>
  ));

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredBooks.length / booksPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div id="books">
      <span id="heading">AVAILABLE BOOKS</span>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by Title"
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />
      </div>
      <button className="add-new-button" onClick={() => setIsAddPopupOpen(true)}>
        Add New
      </button>
      <table id="results" className="table text-center table-hover">
        <thead id="header">
          <tr>
            <th>Sr No.</th>
            <th>Title</th>
            <th>Author</th>
            <th>Available Copies</th>
            <th>Total Issued</th>
          </tr>
        </thead>
        <tbody>
          {bookRows.length > 0 ? (
            bookRows
          ) : (
            <tr>
              <td colSpan="5">No books found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`page-button ${number === currentPage ? 'active' : ''}`}
          >
            {number}
          </button>
        ))}
      </div>

      <div className="book-actions">
        <button
          className="action-button"
          onClick={() => setIsIssuePopupOpen(true)}
        >
          Issue a Book
        </button>
        <button
          className="action-button"
          onClick={() => setIsReturnPopupOpen(true)}
        >
          Return a Book
        </button>
      </div>

      {isAddPopupOpen && <AddBookForm onClose={() => setIsAddPopupOpen(false)} />}
      {isIssuePopupOpen && (
        <IssueBookForm
          books={books}
          onClose={() => setIsIssuePopupOpen(false)}
        />
      )}
      {isReturnPopupOpen && (
        <ReturnBookForm
          books={books}
          onClose={() => setIsReturnPopupOpen(false)}
        />
      )}
        {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <h2>Edit Book</h2>
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formValues.title}
              onChange={handleFormChange}
            />
            <label>Author</label>
            <input
              type="text"
              name="author"
              value={formValues.author}
              onChange={handleFormChange}
            />
            <label>Total Copies</label>
            <input
              type="number"
              name="totalCopies"
              value={formValues.totalCopies}
              onChange={handleFormChange}
            />
            <label>Available Copies</label>
            <input
              type="number"
              name="availableCopies"
              value={formValues.availableCopies}
              onChange={handleFormChange}
            />
            <div className="popup-buttons">
              <button onClick={handleFormSubmit}>Save</button>
              <button onClick={() => setIsPopupOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
        {isDeletePopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <h2>Are you sure you want to delete this book?</h2>
            <div className="popup-buttons">
              <button onClick={handleDeleteConfirm}>Delete</button>
              <button onClick={() => setIsDeletePopupOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Books;
