using DomainModel;
using Microsoft.EntityFrameworkCore;

namespace DBLayer
{
    public class MSSQLDB : DbContext
    {
        public DbSet<Ticket> tickets { get; set; }
        public DbSet<Project> projects { get; set; }

        public MSSQLDB() { }
        public MSSQLDB(DbContextOptions<MSSQLDB> options) : base(options) { }
    }
}
