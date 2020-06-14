using Dating.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Dating.API.Data
{
    public class DataContext : IdentityDbContext<User, Role, int, 
        IdentityUserClaim<int>, UserRole, IdentityUserLogin<int>, IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        public DataContext(DbContextOptions<DataContext> options): base(options){   
        }
        public DbSet<Photo>  Photos{ get; set; } // Table name must be plural 
        public DbSet<Like>  Likes{ get; set; }
        public DbSet<Message>  Messages{ get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder){

            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserRole>(userRole =>
            {
                userRole.HasKey(ur => new {ur.RoleId, ur.UserId});

                userRole.HasOne(ur => ur.Role)
                    .WithMany(ur => ur.UserRoles)
                    .HasForeignKey(ur => ur.RoleId)
                    .IsRequired();

                userRole.HasOne(ur => ur.User)
                    .WithMany(ur => ur.UserRoles)
                    .HasForeignKey(ur => ur.UserId)
                    .IsRequired();
            });
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
            
            modelBuilder.Entity<Photo>().HasQueryFilter(p => p.IsApproved);

        }
    }
}