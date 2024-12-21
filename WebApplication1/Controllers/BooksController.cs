using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Model;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly dbContext _dbContext;
        private readonly ILogger<WeatherForecastController> _logger;
        public BooksController(ILogger<WeatherForecastController> logger, dbContext dbContext)
        {
            _logger = logger;
            _dbContext = dbContext;
        }
        [HttpPost("addBook")]
        public async Task<Book> AddBook(Book book)
        {
            Book book1 = new Book();
            string message = string.Empty;
            try { 
          
            book1.Title = book.Title;
            book1.Author = book.Author;
            book1.TotalCopies = book.TotalCopies;
            book1.AvailableCopies = book.AvailableCopies;
            _dbContext.Add(book1);
           await  _dbContext.SaveChangesAsync();
                message = "Book added Succssfully"; ;
            }
            catch(Exception ex)
            {
                 message = ex.ToString();
            }
            return book1;
        }

        [HttpPut("editBook/{id}")]
        public async Task<Book> EditBook(int id, Book book)
        { 
           Book book1=_dbContext.books.Where(x=>x.Id==id).FirstOrDefault();
            book1.Author=book.Author;
            book1.Title=book.Title;
            book1.TotalCopies=book.TotalCopies;
            book1.AvailableCopies=book.AvailableCopies;
            _dbContext.Update(book1);
            await _dbContext.SaveChangesAsync();

            return book1; ;
        }

        [HttpDelete("deleteBook/{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            try
            {
                Book book = _dbContext.books.Where(x => x.Id == id).FirstOrDefault();
                _dbContext.Remove(book);
				await _dbContext.SaveChangesAsync();
			}
            catch (Exception ex) 
            { 
            
            }
            return Ok(new { Message = "Book Deleted successfully" });

		}

		[HttpGet("booklist")]
		public async Task<IActionResult> GetBookListWithIssuedCount()
		{
			var booksWithIssuedCount = await _dbContext.books
				.Select(book => new
				{
					book.Id,
					book.Title,
					book.Author,
					book.TotalCopies,
					book.AvailableCopies,
					IssuedCount = book.TotalCopies - book.AvailableCopies
				})
				.ToListAsync();

			return Ok(booksWithIssuedCount);
		}

		[HttpGet("issuedBooks")]
		public async Task<IActionResult> GetIssuedBooks()
		{
			var issuedBooks = await _dbContext.issues
				.Where(issue => issue.Is_active)
				.Select(issue => new
				{
					issue.Id,
					BookTitle = _dbContext.books.Where(book => book.Id == issue.BookId).Select(book => book.Title).FirstOrDefault(),
					issue.IssuedTo,
					issue.IssueDate
				})
				.ToListAsync();

			return Ok(issuedBooks);
		}

		[HttpPost("issueBook")]
        public async Task<IActionResult> IssueBook(Issue issue)
        {
            if (issue == null || issue.BookId <= 0)
                return BadRequest("Invalid issue details.");
            var book = await _dbContext.books.FindAsync(issue.BookId);
            if (book == null)
                return NotFound("Book not found.");
            if (book.AvailableCopies <= 0)
                return BadRequest("No available copies for this book.");
            book.AvailableCopies -= 1;
			issue.Is_active = true;
			_dbContext.issues.Add(issue);
            await _dbContext.SaveChangesAsync();
            return Ok(new { Message = "Book issued successfully", Issue = issue });
        }

		[HttpPost("returnBook")]
		public async Task<IActionResult> ReturnBook(int issueId, [FromBody] DateTime returnDate)
		{
			var issue = await _dbContext.issues.FindAsync(issueId);
			if (issue == null)
				return NotFound("Issue not found.");
			var book = await _dbContext.books.FindAsync(issue.BookId);
			if (book == null)
				return NotFound("Book not found for this issue.");
			issue.Is_active = false;
			issue.ReturnDate = returnDate;
			book.AvailableCopies += 1;
			await _dbContext.SaveChangesAsync();
			return Ok(new { Message = "Book returned successfully", Issue = issue });
		}



	}
}
