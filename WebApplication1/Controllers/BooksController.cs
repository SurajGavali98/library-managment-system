using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
                message = "fdg"; ;
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

        //[HttpDelete("deleteBook/{id}")]
        //public async Task<IActionResult> DeleteBook(int id)
        //{ 
        //}

        //[HttpGet("listBooks")]
        //public async Task<IActionResult> ListBooks() { /* Logic */ }

        [HttpPost("issueBook")]
        public async Task<IActionResult> IssueBook(Issue issue)
        {
            if (issue == null || issue.BookId <= 0 || issue.Id <= 0)
                return BadRequest("Invalid issue details.");

            var book = await _dbContext.books.FindAsync(issue.BookId);

            if (book == null)
                return NotFound("Book not found.");

            if (book.AvailableCopies <= 0)
                return BadRequest("No available copies for this book.");

            // Update the available copies
            book.AvailableCopies -= 1;

            // Add the issue record
            _dbContext.issues.Add(issue);

            await _dbContext.SaveChangesAsync();

            return Ok(new { Message = "Book issued successfully", Issue = issue });
        }

        [HttpPost("returnBook")]
        public async Task<IActionResult> ReturnBook(int issueId)
        {
            var issue = await _dbContext.issues.FindAsync(issueId);

            if (issue == null)
                return NotFound("Issue not found.");

            var book = await _dbContext.books.FindAsync(issue.BookId);

            if (book == null)
                return NotFound("Book not found for this issue.");

            // Update the available copies
            book.AvailableCopies += 1;

            // Optionally, mark the issue as resolved or remove it
            _dbContext.issues.Remove(issue);

            await _dbContext.SaveChangesAsync();

            return Ok(new { Message = "Book returned successfully", IssueId = issueId });
        }


    }
}
