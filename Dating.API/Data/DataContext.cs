using Dating.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Dating.API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options): base(options){   
        }

        public DbSet<Value>  Values{ get; set; } // Table name must be plural 
        public DbSet<User>   Users{get; set;}
        public DbSet<Photo>  Photo{ get; set; }
    }
}