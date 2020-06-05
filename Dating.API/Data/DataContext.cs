using Dating.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Dating.API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options): base(options){   
        }
        public DbSet<User>   Users{get; set;} // Table name must be plural 
        public DbSet<Photo>  Photos{ get; set; }
        public DbSet<Like>  Likes{ get; set; }
        public DbSet<Message>  Messages{ get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder){
            modelBuilder.Entity<Like>()
                        .HasKey(k => new {k.LikeeId, k.LikerId});
            
            modelBuilder.Entity<Like>()
                        .HasOne(k => k.Likee)
                        .WithMany(k => k.Likers)
                        .HasForeignKey(u => u.LikeeId)
                        .OnDelete(DeleteBehavior.Restrict);
            
            modelBuilder.Entity<Like>()
                        .HasOne(k => k.Liker)
                        .WithMany(k => k.Likees)
                        .HasForeignKey(u => u.LikerId)
                        .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Message>()
                        .HasOne(u => u.Sender)
                        .WithMany(k => k.MessageSent)
                        .OnDelete(DeleteBehavior.Restrict);
            
            modelBuilder.Entity<Message>()
                        .HasOne(u => u.Recipient)
                        .WithMany(k => k.MessageReceived)
                        .OnDelete(DeleteBehavior.Restrict);

        }
    }
}