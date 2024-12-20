using Microsoft.EntityFrameworkCore;

namespace WebApplication1.Model
{
    public class dbContext:DbContext
    {
        public dbContext(DbContextOptions<dbContext>options):base(options) { }
        public DbSet<Book>books { get; set; }
        public DbSet<Issue> issues { get; set; }
    }

}
