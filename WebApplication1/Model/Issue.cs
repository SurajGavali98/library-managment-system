using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Model
{

    public class Issue
    {
        [Key]
        public int Id { get; set; }
        public int BookId { get; set; }
        public string IssuedTo { get; set; }
        public DateTime IssueDate { get; set; }
        public DateTime? ReturnDate { get; set; }
    }
}
